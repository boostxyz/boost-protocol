// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {OpenEndedIncentiveCampaign} from "contracts/timebased/OpenEndedIncentiveCampaign.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TBIProtocolFeeModule} from "contracts/timebased/TBIProtocolFeeModule.sol";

/**
 * @title UpgradeTimeBased
 * @notice Bring an EOA-owned TimeBasedIncentiveManager proxy up to this tree's code with every
 *         feature switched on. This is the new-chain path: run it after Deploy_TimeBased.s.sol
 *         (which deploys the V1 proxy at the shared address).
 * @dev Please run `forge script script/solidity/ValidateTimeBasedUpgrade.s.sol` before upgrading
 *
 * Steps (each one is skipped when already satisfied, so a partial run can be re-run):
 *   1. Deploy via CREATE2: the Manager implementation, the TimeBasedIncentiveCampaign and
 *      OpenEndedIncentiveCampaign bases, the ReferralDistributor template, and the
 *      TBIProtocolFeeModule
 *   2. Upgrade the Manager proxy to the new implementation
 *   3. Point the Manager at both campaign bases, the distributor template and the fee module
 *   4. Set the referral claim window to 60 days if it is unset (proxies initialized before
 *      referrals existed have 0, which makes every referral pool revert ReferralsNotConfigured)
 *   5. Verify the pre-upgrade state is preserved and the Manager is fully configured
 *
 * DEPLOYER_PRIVATE_KEY must be the Manager owner's key: owner calls are broadcast directly.
 * Timelock-owned chains roll out through the DeployImpl_TBI* scripts instead.
 *
 * On chains with Glamsterdam gas pricing (e.g. Sepolia), forge simulates with the Cancun costs
 * pinned in foundry.toml and sets gas limits far too low; broadcast with `--slow -g 1000`.
 *
 * Environment variables:
 *   BOOST_DEPLOYMENT_SALT    — CREATE2 salt (same as initial deploy)
 *   TIMEBASED_MANAGER_PROXY  — Manager proxy address
 *   TBI_FEE_MODULE_OWNER     — fee module owner (part of the module's CREATE2 address)
 *   DEPLOYER_PRIVATE_KEY     — Manager owner key; broadcasts the owner calls (pass it as
 *                              --private-key too, which broadcasts the CREATE2 deploys)
 */
contract UpgradeTimeBased is ScriptUtils {
    uint64 internal constant REFERRAL_CLAIM_WINDOW = 60 days;

    struct Snapshot {
        address implementation;
        address owner;
        address operator;
        uint64 protocolFee;
        address protocolFeeReceiver;
        uint256 campaignCount;
    }

    struct Targets {
        address managerImpl;
        address campaignBase;
        address openEndedBase;
        address referralDistributor;
        address feeModule;
    }

    function run() public {
        address managerProxy = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        address feeModuleOwner = vm.envAddress("TBI_FEE_MODULE_OWNER");
        require(feeModuleOwner != address(0), "TBI_FEE_MODULE_OWNER not set");
        uint256 ownerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(managerProxy);

        console.log("========================================");
        console.log("Starting TimeBased Upgrade");
        console.log("========================================");
        console.log("Upgrader address: ", vm.addr(ownerKey));
        console.log("Manager Proxy:    ", managerProxy);

        Snapshot memory before = _snapshot(manager);
        require(
            vm.addr(ownerKey) == before.owner,
            "DEPLOYER_PRIVATE_KEY is not the Manager owner; timelock-owned chains use the DeployImpl_TBI* scripts"
        );

        console.log("\n--- Step 1: Deploy Implementations ---");
        Targets memory targets = _deployAll(managerProxy, feeModuleOwner);

        console.log("\n--- Step 2: Upgrade Manager Proxy ---");
        _upgrade(manager, ownerKey, before.implementation, targets.managerImpl);

        console.log("\n--- Step 3: Configure Manager ---");
        _configure(manager, ownerKey, targets);

        console.log("\n--- Step 4: Verify ---");
        _verify(manager, before, targets);

        console.log("\n========================================");
        console.log("Upgrade Completed Successfully!");
        console.log("========================================");
        console.log("Manager Proxy:        ", managerProxy);
        console.log("Old Manager Impl:     ", before.implementation);
        console.log("New Manager Impl:     ", targets.managerImpl);
        console.log("Version:              ", manager.version());
    }

    /// @notice Read the state an upgrade must preserve; every getter here exists on V1
    function _snapshot(TimeBasedIncentiveManager manager) internal view returns (Snapshot memory s) {
        s.implementation = Upgrades.getImplementationAddress(address(manager));
        s.owner = manager.owner();
        s.operator = manager.operator();
        s.protocolFee = manager.protocolFee();
        s.protocolFeeReceiver = manager.protocolFeeReceiver();
        s.campaignCount = manager.campaignCount();

        console.log("\n--- Current State ---");
        console.log("Implementation:       ", s.implementation);
        console.log("Owner:                ", s.owner);
        console.log("Operator:             ", s.operator);
        console.log("Protocol Fee:         ", uint256(s.protocolFee), " bps");
        console.log("Fee Receiver:         ", s.protocolFeeReceiver);
        console.log("Campaign Count:       ", s.campaignCount);
    }

    function _deployAll(address managerProxy, address feeModuleOwner) internal returns (Targets memory t) {
        t.managerImpl = _deploy(type(TimeBasedIncentiveManager).creationCode, "", "TimeBasedIncentiveManager impl", "");
        t.campaignBase = _deploy(
            type(TimeBasedIncentiveCampaign).creationCode,
            "",
            "TimeBasedIncentiveCampaign",
            "TimeBasedIncentiveCampaign"
        );
        t.openEndedBase = _deploy(
            type(OpenEndedIncentiveCampaign).creationCode,
            "",
            "OpenEndedIncentiveCampaign",
            "OpenEndedIncentiveCampaign"
        );
        t.referralDistributor =
            _deploy(type(ReferralDistributor).creationCode, "", "ReferralDistributor", "ReferralDistributor");
        t.feeModule = _deploy(
            type(TBIProtocolFeeModule).creationCode,
            abi.encode(managerProxy, feeModuleOwner),
            "TBIProtocolFeeModule",
            "TBIProtocolFeeModule"
        );
    }

    /// @notice Deploy via CREATE2 if missing; on broadcast, record it under `jsonKey` in the
    ///         deploys JSON (empty key = not recorded)
    function _deploy(bytes memory creationCode, bytes memory args, string memory name, string memory jsonKey)
        internal
        returns (address deployed)
    {
        deployed = _getCreate2Address(creationCode, args);
        console.log(string.concat(name, ":"), deployed);
        if (_deploy2(creationCode, args)) {
            console.log("  -> deployed");
        }
        require(deployed.code.length > 0, string.concat(name, ": no code at predicted address"));

        if (bytes(jsonKey).length > 0 && vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(deployed), _buildJsonDeployPath(), string.concat(".", jsonKey));
        }
    }

    function _upgrade(TimeBasedIncentiveManager manager, uint256 ownerKey, address currentImpl, address newImpl)
        internal
    {
        if (currentImpl == newImpl) {
            console.log("Already on", newImpl);
            return;
        }
        vm.broadcast(ownerKey);
        manager.upgradeToAndCall(newImpl, "");
        require(Upgrades.getImplementationAddress(address(manager)) == newImpl, "Proxy implementation mismatch");
        console.log("Upgraded to", newImpl);
    }

    function _configure(TimeBasedIncentiveManager manager, uint256 ownerKey, Targets memory t) internal {
        if (manager.campaignImplementation() != t.campaignBase) {
            vm.broadcast(ownerKey);
            manager.setCampaignImplementation(t.campaignBase);
            console.log("  -> setCampaignImplementation", t.campaignBase);
        }
        if (manager.openEndedCampaignImplementation() != t.openEndedBase) {
            vm.broadcast(ownerKey);
            manager.setOpenEndedCampaignImplementation(t.openEndedBase);
            console.log("  -> setOpenEndedCampaignImplementation", t.openEndedBase);
        }
        if (manager.referralDistributorImplementation() != t.referralDistributor) {
            vm.broadcast(ownerKey);
            manager.setReferralDistributorImplementation(t.referralDistributor);
            console.log("  -> setReferralDistributorImplementation", t.referralDistributor);
        }
        if (manager.referralClaimWindowDuration() == 0) {
            vm.broadcast(ownerKey);
            manager.setReferralClaimWindowDuration(REFERRAL_CLAIM_WINDOW);
            console.log("  -> setReferralClaimWindowDuration", uint256(REFERRAL_CLAIM_WINDOW));
        }
        if (manager.protocolFeeModule() != t.feeModule) {
            vm.broadcast(ownerKey);
            manager.setProtocolFeeModule(t.feeModule);
            console.log("  -> setProtocolFeeModule", t.feeModule);
        }
    }

    function _verify(TimeBasedIncentiveManager manager, Snapshot memory before, Targets memory t) internal view {
        require(Upgrades.getImplementationAddress(address(manager)) == t.managerImpl, "Proxy implementation mismatch");
        require(manager.owner() == before.owner, "Owner changed!");
        require(manager.operator() == before.operator, "Operator changed!");
        require(manager.protocolFee() == before.protocolFee, "Protocol fee changed!");
        require(manager.protocolFeeReceiver() == before.protocolFeeReceiver, "Fee receiver changed!");
        require(manager.campaignCount() == before.campaignCount, "Campaign count changed!");
        for (uint256 i = 1; i <= before.campaignCount; i++) {
            require(manager.getCampaign(i) != address(0), "Campaign mapping broken");
        }
        console.log("[OK] Pre-upgrade state preserved");

        require(manager.campaignImplementation() == t.campaignBase, "Campaign base not set");
        require(manager.openEndedCampaignImplementation() == t.openEndedBase, "Open-ended base not set");
        require(manager.referralDistributorImplementation() == t.referralDistributor, "Distributor not set");
        require(manager.referralClaimWindowDuration() > 0, "Referral claim window not set");
        require(manager.protocolFeeModule() == t.feeModule, "Fee module not set");
        console.log("[OK] Campaign bases, referral distributor, claim window and fee module configured");
    }
}
