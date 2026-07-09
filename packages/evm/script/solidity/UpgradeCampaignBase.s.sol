// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/**
 * @title UpgradeCampaignBase
 * @notice BOOST-6574: deploy the new TimeBasedIncentiveCampaign base contract (CREATE2)
 *         and point the Manager at it via setCampaignImplementation.
 * @dev Trimmed variant of UpgradeTimeBased.s.sol (steps 1 + 4 only). Deliberately skips
 *      the Manager implementation deploy and proxy upgrade: the PR #540 Manager diff is
 *      NatSpec-only, and deploying it would switch the proxy to a functionally identical
 *      implementation at a new address for no benefit.
 *
 *      Campaigns are EIP-1167 clones of the base — only campaigns created AFTER
 *      setCampaignImplementation pick up the new guards. Existing campaigns keep the
 *      old base. That is expected.
 *
 * Environment variables:
 *   DEPLOYER_PRIVATE_KEY     — owner key (passed at CLI, must be Manager owner)
 *   BOOST_DEPLOYMENT_SALT    — CREATE2 salt (same as initial deploy)
 *   TIMEBASED_MANAGER_PROXY  — Manager proxy address
 */
contract UpgradeCampaignBase is ScriptUtils {
    function run() public {
        address MANAGER_PROXY = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(MANAGER_PROXY);

        console.log("========================================");
        console.log("BOOST-6574: Campaign Base Upgrade");
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

        require(msg.sender == currentOwner, "Sender is not the Manager owner");

        // ---- Step 1: Deploy new Campaign base contract (clone template) ----
        console.log("\n--- Step 1: Deploy Campaign Base Contract ---");
        bytes memory initCode = type(TimeBasedIncentiveCampaign).creationCode;
        address newCampaignImpl = _getCreate2Address(initCode, "");
        console.log("New Campaign Base:", newCampaignImpl);

        require(newCampaignImpl != currentCampaignImpl, "New base equals current base - nothing to do");

        if (_deploy2(initCode, "")) {
            console.log("  -> Deployed new base contract");
        }

        // ---- Step 4 (of UpgradeTimeBased): point Manager at the new base ----
        console.log("\n--- Step 2: Set Campaign Implementation ---");
        vm.broadcast();
        manager.setCampaignImplementation(newCampaignImpl);

        require(manager.campaignImplementation() == newCampaignImpl, "Campaign impl not set");
        console.log("[OK] Campaign base contract updated");

        // ---- Verify Manager state untouched ----
        require(manager.owner() == currentOwner, "Owner changed!");
        require(manager.campaignCount() == currentCampaignCount, "Campaign count changed!");
        for (uint256 i = 1; i <= currentCampaignCount; i++) {
            require(manager.getCampaign(i) != address(0), "Campaign mapping broken");
        }
        if (currentCampaignCount > 0) {
            console.log("[OK] All", currentCampaignCount, "campaigns still accessible");
        }

        // ---- Write to deploys JSON (broadcast runs only, not dry-run simulations) ----
        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(newCampaignImpl), _buildJsonDeployPath(), ".TimeBasedIncentiveCampaign");
        }

        // ---- Summary ----
        console.log("\n========================================");
        console.log("Campaign Base Upgrade Complete");
        console.log("========================================");
        console.log("Old Campaign Base:", currentCampaignImpl);
        console.log("New Campaign Base:", newCampaignImpl);
        console.log("Manager Proxy (unchanged impl):", MANAGER_PROXY);
    }
}
