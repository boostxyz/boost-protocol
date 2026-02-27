// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/**
 * @title UpgradeTimeBased
 * @notice Deploy new implementations and upgrade the TimeBasedIncentiveManager proxy
 * @dev Please run `forge script script/solidity/ValidateTimeBasedUpgrade.s.sol` before upgrading
 *
 * Steps:
 *   1. Deploy new TimeBasedIncentiveCampaign base contract (CREATE2) — clone template, not a proxy
 *   2. Deploy new TimeBasedIncentiveManager implementation (CREATE2) — UUPS impl
 *   3. Upgrade Manager proxy via upgradeToAndCall
 *   4. Point Manager to new campaign base contract via setCampaignImplementation
 *   5. Verify all state preserved
 *
 * Environment variables:
 *   DEPLOYER_PRIVATE_KEY     — owner/deployer private key
 *   BOOST_DEPLOYMENT_SALT    — CREATE2 salt (same as initial deploy)
 *   TIMEBASED_MANAGER_PROXY  — Manager proxy address
 */
contract UpgradeTimeBased is ScriptUtils {
    function run() public {
        address MANAGER_PROXY = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(MANAGER_PROXY);

        console.log("========================================");
        console.log("Starting TimeBased Upgrade");
        console.log("========================================");
        console.log("Upgrader address: ", msg.sender);
        console.log("Manager Proxy:    ", MANAGER_PROXY);

        // ---- Snapshot current state ----
        address currentImpl = Upgrades.getImplementationAddress(MANAGER_PROXY);
        address currentOwner = manager.owner();
        address currentOperator = manager.operator();
        uint64 currentFee = manager.protocolFee();
        address currentReceiver = manager.protocolFeeReceiver();
        address currentCampaignImpl = manager.campaignImplementation();
        uint256 currentCampaignCount = manager.campaignCount();

        console.log("\n--- Current State ---");
        console.log("Implementation:       ", currentImpl);
        console.log("Owner:                ", currentOwner);
        console.log("Operator:             ", currentOperator);
        console.log("Protocol Fee:         ", uint256(currentFee), " bps");
        console.log("Fee Receiver:         ", currentReceiver);
        console.log("Campaign Base:        ", currentCampaignImpl);
        console.log("Campaign Count:       ", currentCampaignCount);

        // ---- Step 1: Deploy new Campaign base contract (clone template) ----
        console.log("\n--- Step 1: Deploy Campaign Base Contract ---");
        address newCampaignImpl = _deployCampaignBaseContract();

        // ---- Step 2: Deploy new Manager implementation ----
        console.log("\n--- Step 2: Deploy Manager Implementation ---");
        address newManagerImpl = _deployManagerImplementation();

        // ---- Step 3: Upgrade Manager proxy ----
        console.log("\n--- Step 3: Upgrade Manager Proxy ---");
        vm.broadcast();
        manager.upgradeToAndCall(newManagerImpl, "");

        // Verify implementation changed
        address implAfter = Upgrades.getImplementationAddress(MANAGER_PROXY);
        require(implAfter == newManagerImpl, "Proxy implementation mismatch");
        require(implAfter != currentImpl, "Implementation did not change");
        console.log("New Implementation:   ", implAfter);

        // Verify version available (V1 didn't have version())
        string memory newVersion = manager.version();
        console.log("Version:              ", newVersion);

        // Verify state preserved
        console.log("\n--- Verifying State ---");
        require(manager.owner() == currentOwner, "Owner changed!");
        console.log("[OK] Owner preserved");

        require(manager.operator() == currentOperator, "Operator changed!");
        console.log("[OK] Operator preserved");

        require(manager.protocolFee() == currentFee, "Protocol fee changed!");
        console.log("[OK] Protocol fee preserved");

        require(manager.protocolFeeReceiver() == currentReceiver, "Fee receiver changed!");
        console.log("[OK] Fee receiver preserved");

        require(manager.campaignCount() == currentCampaignCount, "Campaign count changed!");
        console.log("[OK] Campaign count preserved");

        // Verify existing campaigns still accessible
        for (uint256 i = 1; i <= currentCampaignCount; i++) {
            address campaign = manager.getCampaign(i);
            require(campaign != address(0), "Campaign mapping broken");
        }
        if (currentCampaignCount > 0) {
            console.log("[OK] All", currentCampaignCount, "campaigns still accessible");
        }

        // ---- Step 4: Point Manager to new campaign base contract ----
        console.log("\n--- Step 4: Set Campaign Base Contract ---");
        vm.broadcast();
        manager.setCampaignImplementation(newCampaignImpl);

        require(manager.campaignImplementation() == newCampaignImpl, "Campaign impl not set");
        console.log("Campaign Base:        ", newCampaignImpl);
        console.log("[OK] Campaign base contract updated");

        // ---- Write to deploys JSON ----
        string memory path = _buildJsonDeployPath();
        vm.writeJson(vm.toString(newCampaignImpl), path, ".TimeBasedIncentiveCampaign");

        // ---- Summary ----
        console.log("\n========================================");
        console.log("Upgrade Completed Successfully!");
        console.log("========================================");
        console.log("Manager Proxy:        ", MANAGER_PROXY);
        console.log("Old Manager Impl:     ", currentImpl);
        console.log("New Manager Impl:     ", newManagerImpl);
        console.log("Old Campaign Base:    ", currentCampaignImpl);
        console.log("New Campaign Base:    ", newCampaignImpl);
    }

    function _deployCampaignBaseContract() internal returns (address impl) {
        bytes memory initCode = type(TimeBasedIncentiveCampaign).creationCode;
        impl = _getCreate2Address(initCode, "");
        console.log("Campaign Base:        ", impl);

        if (_deploy2(initCode, "")) {
            console.log("  -> Deployed new base contract");
        }
    }

    function _deployManagerImplementation() internal returns (address impl) {
        bytes memory initCode = type(TimeBasedIncentiveManager).creationCode;
        impl = _getCreate2Address(initCode, "");
        console.log("Manager Impl:         ", impl);

        if (_deploy2(initCode, "")) {
            console.log("  -> Deployed new implementation");
        }
    }
}
