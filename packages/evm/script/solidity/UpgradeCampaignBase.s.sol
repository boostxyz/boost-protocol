// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/**
 * @title UpgradeCampaignBase
 * @notice Deploy the new TimeBasedIncentiveCampaign base contract (CREATE2) and point the
 *         Manager at it via setCampaignImplementation.
 * @dev Two paths, chosen by who owns the Manager:
 *        - EOA owner (== msg.sender): setCampaignImplementation is broadcast directly.
 *        - TBIManagerTimelock owner: nothing else is broadcast. The script prints the
 *          schedule/execute calldata the Safe routes through the timelock
 *          (schedule -> wait minDelay -> execute), and reports in-flight/done ops.
 *
 *      Campaigns are EIP-1167 clones of the base — only campaigns created AFTER
 *      setCampaignImplementation takes effect pick up the new code. Existing campaigns keep
 *      the old base. That is expected.
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

        // ---- Snapshot current state ----
        address currentOwner = manager.owner();
        address currentCampaignImpl = manager.campaignImplementation();
        uint256 currentCampaignCount = manager.campaignCount();

        console.log("\n--- Current State ---");
        console.log("Owner:            ", currentOwner);
        console.log("Campaign Base:    ", currentCampaignImpl);
        console.log("Campaign Count:   ", currentCampaignCount);

        // ---- Step 1: Deploy new Campaign base contract (clone template) ----
        console.log("\n--- Step 1: Deploy Campaign Base Contract ---");
        bytes memory initCode = type(TimeBasedIncentiveCampaign).creationCode;
        address newCampaignImpl = _getCreate2Address(initCode, "");
        console.log("New Campaign Base:", newCampaignImpl);

        if (_deploy2(initCode, "")) {
            console.log("  -> Deployed new base contract");
        }
        require(newCampaignImpl.code.length > 0, "Deploy failed - no code at predicted address");

        // ---- Write to deploys JSON (broadcast runs only, not dry-run simulations) ----
        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(newCampaignImpl), _buildJsonDeployPath(), ".TimeBasedIncentiveCampaign");
        }

        if (newCampaignImpl == currentCampaignImpl) {
            console.log("\nManager already points at this base. Nothing to do.");
            return;
        }

        // ---- Step 2: point Manager at the new base ----
        console.log("\n--- Step 2: Set Campaign Implementation ---");
        if (msg.sender == currentOwner) {
            _setDirectly(manager, newCampaignImpl, currentOwner, currentCampaignCount);
        } else {
            require(currentOwner.code.length > 0, "Sender is not the owner and owner is not a timelock");
            _printTimelockPayloads(currentOwner, MANAGER_PROXY, newCampaignImpl);
        }

        // ---- Summary ----
        console.log("\n========================================");
        console.log("Old Campaign Base:", currentCampaignImpl);
        console.log("New Campaign Base:", newCampaignImpl);
        console.log("Manager Proxy (unchanged impl):", MANAGER_PROXY);
    }

    /// @dev EOA-owned Manager: broadcast setCampaignImplementation and verify state is intact.
    function _setDirectly(
        TimeBasedIncentiveManager manager,
        address newCampaignImpl,
        address currentOwner,
        uint256 currentCampaignCount
    ) internal {
        vm.broadcast();
        manager.setCampaignImplementation(newCampaignImpl);

        require(manager.campaignImplementation() == newCampaignImpl, "Campaign impl not set");
        console.log("[OK] Campaign base contract updated");

        require(manager.owner() == currentOwner, "Owner changed!");
        require(manager.campaignCount() == currentCampaignCount, "Campaign count changed!");
        for (uint256 i = 1; i <= currentCampaignCount; i++) {
            require(manager.getCampaign(i) != address(0), "Campaign mapping broken");
        }
        if (currentCampaignCount > 0) {
            console.log("[OK] All", currentCampaignCount, "campaigns still accessible");
        }
    }

    /// @dev Timelock-owned Manager: print paste-ready payloads for
    ///      `setCampaignImplementation(newCampaignImpl)`. An already executed op reports done;
    ///      an in-flight one prints only its remaining execute step.
    function _printTimelockPayloads(address owner, address proxy, address newCampaignImpl) internal view {
        TimelockController tl = TimelockController(payable(owner));
        uint256 minDelay = tl.getMinDelay();

        bytes memory data = abi.encodeWithSignature("setCampaignImplementation(address)", newCampaignImpl);
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256(abi.encodePacked("tbi-campaign-base-upgrade", proxy, newCampaignImpl));
        bytes32 opId = tl.hashOperation(proxy, 0, data, predecessor, salt);

        console.log("\n--- Timelock Upgrade (route via Safe -> timelock) ---");
        console.log("Timelock:         ", owner);
        console.log("minDelay (s):     ", minDelay);
        console.log("operation id:     ", vm.toString(opId));

        if (tl.isOperationDone(opId)) {
            console.log("\nsetCampaignImplementation for this base already executed. Nothing to do.");
            return;
        }

        if (tl.isOperationPending(opId)) {
            console.log("\nAlready queued. executable at (unix):", tl.getTimestamp(opId));
            console.log("execute(...) calldata:");
            console.logBytes(abi.encodeWithSelector(tl.execute.selector, proxy, 0, data, predecessor, salt));
            return;
        }

        console.log("\n1) Safe queues on the timelock - schedule(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.schedule.selector, proxy, 0, data, predecessor, salt, minDelay));
        console.log("\n2) after minDelay, anyone executes - execute(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.execute.selector, proxy, 0, data, predecessor, salt));
        console.log("\n3) verify: cast call", proxy, "'campaignImplementation()(address)' ==", newCampaignImpl);
    }
}
