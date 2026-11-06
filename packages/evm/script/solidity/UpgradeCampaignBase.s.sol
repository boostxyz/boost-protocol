// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {OpenEndedIncentiveCampaign} from "contracts/timebased/OpenEndedIncentiveCampaign.sol";

/**
 * @title UpgradeCampaignBase
 * @notice Deploy the TimeBasedIncentiveCampaign and OpenEndedIncentiveCampaign base contracts
 *         (CREATE2) and point the Manager at every base whose bytecode changed.
 * @dev A base is switched only when its CREATE2 address differs from the Manager's current
 *      implementation. The switches go out together, on one of two paths chosen by who owns
 *      the Manager:
 *        - EOA owner (== msg.sender): the setters are broadcast directly.
 *        - TBIManagerTimelock owner: nothing else is broadcast. The script prints one
 *          scheduleBatch/executeBatch the Safe routes through the timelock
 *          (schedule -> wait minDelay -> execute), and reports an in-flight op.
 *
 *      Campaigns are EIP-1167 clones of a base, so only campaigns created after the switch
 *      takes effect pick up the new code. Existing campaigns keep their base.
 *
 * Environment variables:
 *   BOOST_DEPLOYMENT_SALT    — CREATE2 salt (same as initial deploy)
 *   TIMEBASED_MANAGER_PROXY  — Manager proxy address
 *   DEPLOYER_PRIVATE_KEY     — passed at CLI; must be the Manager owner on EOA-owned chains,
 *                              any funded key on timelock-owned chains
 */
contract UpgradeCampaignBase is ScriptUtils {
    function run() public {
        address MANAGER_PROXY = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(MANAGER_PROXY);

        console.log("========================================");
        console.log("Campaign Base Upgrade");
        console.log("========================================");
        console.log("Sender:           ", msg.sender);
        console.log("Manager Proxy:    ", MANAGER_PROXY);

        address currentOwner = manager.owner();
        address currentCampaignImpl = manager.campaignImplementation();
        address currentOpenEndedImpl = manager.openEndedCampaignImplementation();
        uint256 currentCampaignCount = manager.campaignCount();

        console.log("\n--- Current State ---");
        console.log("Owner:              ", currentOwner);
        console.log("Campaign Base:      ", currentCampaignImpl);
        console.log("Open-Ended Base:    ", currentOpenEndedImpl);
        console.log("Campaign Count:     ", currentCampaignCount);

        console.log("\n--- Step 1: Deploy Base Contracts ---");
        address newCampaignImpl =
            _deployBase(type(TimeBasedIncentiveCampaign).creationCode, "TimeBasedIncentiveCampaign");
        address newOpenEndedImpl =
            _deployBase(type(OpenEndedIncentiveCampaign).creationCode, "OpenEndedIncentiveCampaign");

        bool campaignChanged = newCampaignImpl != currentCampaignImpl;
        bool openEndedChanged = newOpenEndedImpl != currentOpenEndedImpl;
        if (!campaignChanged && !openEndedChanged) {
            console.log("\nManager already points at both bases. Nothing to do.");
            return;
        }

        console.log("\n--- Step 2: Set Implementations ---");
        if (msg.sender == currentOwner) {
            if (campaignChanged) {
                vm.broadcast();
                manager.setCampaignImplementation(newCampaignImpl);
            }
            if (openEndedChanged) {
                vm.broadcast();
                manager.setOpenEndedCampaignImplementation(newOpenEndedImpl);
            }
            _verify(manager, newCampaignImpl, newOpenEndedImpl, currentOwner, currentCampaignCount);
        } else {
            require(currentOwner.code.length > 0, "Sender is not the owner and owner is not a timelock");
            bytes[] memory payloads = new bytes[]((campaignChanged ? 1 : 0) + (openEndedChanged ? 1 : 0));
            uint256 i;
            if (campaignChanged) {
                payloads[i++] = abi.encodeCall(manager.setCampaignImplementation, (newCampaignImpl));
            }
            if (openEndedChanged) {
                payloads[i++] = abi.encodeCall(manager.setOpenEndedCampaignImplementation, (newOpenEndedImpl));
            }
            _printTimelockPayloads(currentOwner, MANAGER_PROXY, payloads);
        }

        console.log("\n========================================");
        console.log("Campaign Base:    ", currentCampaignImpl, "->", newCampaignImpl);
        console.log("Open-Ended Base:  ", currentOpenEndedImpl, "->", newOpenEndedImpl);
    }

    /// @notice Deploy a base via CREATE2 if missing, and record it in the deploys JSON on broadcast
    function _deployBase(bytes memory initCode, string memory name) internal returns (address base) {
        base = _getCreate2Address(initCode, "");
        console.log(string.concat(name, ":"), base);
        if (_deploy2(initCode, "")) {
            console.log("  -> deployed");
        }
        require(base.code.length > 0, string.concat(name, ": no code at predicted address"));

        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(base), _buildJsonDeployPath(), string.concat(".", name));
        }
    }

    /// @notice Check the EOA path set both bases and left the Manager's other state intact
    function _verify(
        TimeBasedIncentiveManager manager,
        address newCampaignImpl,
        address newOpenEndedImpl,
        address currentOwner,
        uint256 currentCampaignCount
    ) internal view {
        require(manager.campaignImplementation() == newCampaignImpl, "Campaign impl not set");
        require(manager.openEndedCampaignImplementation() == newOpenEndedImpl, "Open-ended impl not set");
        console.log("[OK] Base contracts updated");

        require(manager.owner() == currentOwner, "Owner changed!");
        require(manager.campaignCount() == currentCampaignCount, "Campaign count changed!");
        for (uint256 i = 1; i <= currentCampaignCount; i++) {
            require(manager.getCampaign(i) != address(0), "Campaign mapping broken");
        }
        if (currentCampaignCount > 0) {
            console.log("[OK] All", currentCampaignCount, "campaigns still accessible");
        }
    }

    /// @notice Print the scheduleBatch/executeBatch calldata for the setters; an in-flight op
    ///         prints only its remaining execute step
    function _printTimelockPayloads(address owner, address proxy, bytes[] memory payloads) internal view {
        TimelockController tl = TimelockController(payable(owner));
        uint256 minDelay = tl.getMinDelay();

        address[] memory targets = new address[](payloads.length);
        uint256[] memory values = new uint256[](payloads.length);
        for (uint256 i; i < payloads.length; i++) {
            targets[i] = proxy;
        }
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256(abi.encode("tbi-campaign-base-upgrade", proxy, payloads));
        bytes32 opId = tl.hashOperationBatch(targets, values, payloads, predecessor, salt);

        console.log("\n--- Timelock Upgrade (route via Safe -> timelock) ---");
        console.log("Timelock:         ", owner);
        console.log("minDelay (s):     ", minDelay);
        console.log("operation id:     ", vm.toString(opId));

        bytes memory executeData = abi.encodeCall(tl.executeBatch, (targets, values, payloads, predecessor, salt));
        if (tl.isOperationPending(opId)) {
            console.log("\nAlready queued. executable at (unix):", tl.getTimestamp(opId));
            console.log("executeBatch(...) calldata:");
            console.logBytes(executeData);
            return;
        }

        console.log("\n1) Safe queues on the timelock - scheduleBatch(...) calldata:");
        console.logBytes(abi.encodeCall(tl.scheduleBatch, (targets, values, payloads, predecessor, salt, minDelay)));
        console.log("\n2) after minDelay, anyone executes - executeBatch(...) calldata:");
        console.logBytes(executeData);
    }
}
