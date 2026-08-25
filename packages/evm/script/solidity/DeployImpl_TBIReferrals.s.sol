// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";

/// @title DeployImpl_TBIReferrals
/// @notice Deploy the referral rollout implementations and activate referrals on the
///         Manager proxy.
/// @dev Deploys the new TimeBasedIncentiveManager implementation and the
///      ReferralDistributor implementation (both CREATE2, idempotent), then applies the
///      owner calls the proxy still needs, in order:
///        1. upgradeToAndCall(newManagerImpl, "")
///        2. setReferralDistributorImplementation(distributorImpl)
///        3. setReferralClaimWindowDuration(60 days)
///      Already-satisfied steps are skipped, so the script can be re-run to pick up where
///      a previous rollout left off.
///
///      On Base Sepolia the proxy is owned by an EOA, so the owner calls are broadcast
///      from TBI_PROXY_OWNER_PRIVATE_KEY. On all other chains the proxy is owned by a
///      TimelockController, so the script instead prints scheduleBatch/executeBatch
///      calldata the Safe routes through the timelock (schedule -> wait minDelay ->
///      execute). Steps 2-3 only exist on the proxy after step 1 executes; a timelock
///      batch runs its calls sequentially in one transaction, so a single batch handles
///      the ordering.
///
///      Environment variables:
///        BOOST_DEPLOYMENT_SALT        — CREATE2 salt (same as initial deploy)
///        TIMEBASED_MANAGER_PROXY      — Manager proxy address
///        DEPLOYER_PRIVATE_KEY         — EOA that broadcasts the implementation deploys
///        TBI_PROXY_OWNER_PRIVATE_KEY  — (Base Sepolia only) proxy owner, broadcasts the
///                                       upgradeToAndCall + referral config calls
contract DeployImpl_TBIReferrals is ScriptUtils {
    /// @notice Matches the fresh-deploy default set in TimeBasedIncentiveManager.initialize
    uint64 constant REFERRAL_CLAIM_WINDOW = 60 days;

    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;

    function run() public {
        address MANAGER_PROXY = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        uint256 deployerPk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(MANAGER_PROXY);

        console.log("========================================");
        console.log("TBI Referrals Rollout");
        console.log("========================================");
        console.log("Manager Proxy:    ", MANAGER_PROXY);
        console.log("Deployer:         ", vm.addr(deployerPk));

        // ---- Snapshot current state ----
        address currentImpl = Upgrades.getImplementationAddress(MANAGER_PROXY);
        address owner = manager.owner();

        console.log("\n--- Current State ---");
        console.log("Implementation:   ", currentImpl);
        console.log("Owner:            ", owner);

        // ---- Deploy implementations (CREATE2, idempotent) ----
        console.log("\n--- Deploy Implementations ---");
        address newManagerImpl =
            _deployImpl(deployerPk, type(TimeBasedIncentiveManager).creationCode, "Manager Impl:     ");
        address distributorImpl = _deployImpl(deployerPk, type(ReferralDistributor).creationCode, "Distributor Impl: ");

        // ---- Record the distributor implementation (broadcast runs only) ----
        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(distributorImpl), _buildJsonDeployPath(), ".ReferralDistributor");
        }

        // ---- Apply the owner calls still needed on the proxy ----
        if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            uint256 ownerPk = vm.envUint("TBI_PROXY_OWNER_PRIVATE_KEY");
            require(vm.addr(ownerPk) == owner, "TBI_PROXY_OWNER_PRIVATE_KEY does not match the proxy owner");
            _upgradeDirect(manager, ownerPk, currentImpl, newManagerImpl, distributorImpl);
            return;
        }

        bytes[] memory payloads = _stagePayloads(MANAGER_PROXY, currentImpl, newManagerImpl, distributorImpl);
        if (payloads.length == 0) {
            console.log("\nProxy already upgraded and configured. Nothing to schedule.");
            return;
        }

        require(owner.code.length > 0, "proxy owner has no code - not a timelock?");
        _printBatchPayloads(owner, MANAGER_PROXY, payloads);
    }

    /// @dev Base Sepolia only: the proxy owner is an EOA, so the calls broadcast from the
    ///      owner key instead of routing through a timelock.
    ///      The referral config is re-read after the upgrade so the getters (which revert
    ///      on the pre-upgrade implementation) reflect the simulated upgraded state.
    function _upgradeDirect(
        TimeBasedIncentiveManager manager,
        uint256 ownerPk,
        address currentImpl,
        address newManagerImpl,
        address distributorImpl
    ) internal {
        console.log("\n--- Direct Upgrade (non-timelock) ---");
        console.log("Owner sender:     ", vm.addr(ownerPk));

        if (newManagerImpl == currentImpl) {
            console.log("Implementation unchanged, skipping upgrade");
        } else {
            vm.broadcast(ownerPk);
            manager.upgradeToAndCall(newManagerImpl, "");
            console.log("Upgraded proxy to:", newManagerImpl);
        }

        (address configuredDist, uint64 configuredWindow) = _currentReferralConfig(address(manager));
        if (configuredDist == distributorImpl) {
            console.log("Distributor implementation already configured");
        } else {
            vm.broadcast(ownerPk);
            manager.setReferralDistributorImplementation(distributorImpl);
            console.log("setReferralDistributorImplementation:", distributorImpl);
        }
        if (configuredWindow != 0) {
            console.log("Claim window already configured:", uint256(configuredWindow));
        } else {
            vm.broadcast(ownerPk);
            manager.setReferralClaimWindowDuration(REFERRAL_CLAIM_WINDOW);
            console.log("setReferralClaimWindowDuration:", uint256(REFERRAL_CLAIM_WINDOW));
        }

        // ---- Verify ----
        require(Upgrades.getImplementationAddress(address(manager)) == newManagerImpl, "implementation mismatch");
        (configuredDist, configuredWindow) = _currentReferralConfig(address(manager));
        require(configuredDist == distributorImpl, "distributor implementation not configured");
        require(configuredWindow != 0, "claim window not configured");
        console.log("\n[OK] Proxy upgraded and referrals configured");
    }

    /// @dev CREATE2 deploy broadcast from the deployer key rather than the CLI-configured
    ///      sender `_deploy2` uses.
    function _deployImpl(uint256 deployerPk, bytes memory initCode, string memory label)
        internal
        returns (address impl)
    {
        impl = _getCreate2Address(initCode, "");
        console.log(label, impl);
        if (impl.code.length > 0) {
            console.log("  Already deployed");
            return impl;
        }

        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        vm.broadcast(deployerPk);
        (bool success,) = CREATE2_FACTORY.call(abi.encodePacked(salt, initCode));
        require(success, "create2 deploy failed");
        console.log("  -> Deployed");
    }

    /// @dev Builds the batch of owner calls the proxy still needs, in execution order.
    ///      The referral getters revert on the pre-upgrade implementation, which reads as
    ///      unconfigured. The claim window is only set when zero so a value the owner has
    ///      already tuned is never overwritten.
    function _stagePayloads(address proxy, address currentImpl, address newManagerImpl, address distributorImpl)
        internal
        view
        returns (bytes[] memory payloads)
    {
        (address configuredDist, uint64 configuredWindow) = _currentReferralConfig(proxy);

        bytes[] memory staged = new bytes[](3);
        uint256 n;
        if (newManagerImpl != currentImpl) {
            staged[n++] = abi.encodeWithSignature("upgradeToAndCall(address,bytes)", newManagerImpl, "");
            console.log("\nStaged: upgradeToAndCall ->", newManagerImpl);
        }
        if (configuredDist != distributorImpl) {
            staged[n++] = abi.encodeWithSignature("setReferralDistributorImplementation(address)", distributorImpl);
            console.log("Staged: setReferralDistributorImplementation ->", distributorImpl);
        }
        if (configuredWindow == 0) {
            staged[n++] = abi.encodeWithSignature("setReferralClaimWindowDuration(uint64)", REFERRAL_CLAIM_WINDOW);
            console.log("Staged: setReferralClaimWindowDuration ->", uint256(REFERRAL_CLAIM_WINDOW));
        }

        payloads = new bytes[](n);
        for (uint256 i; i < n; i++) {
            payloads[i] = staged[i];
        }
    }

    function _currentReferralConfig(address proxy) internal view returns (address impl, uint64 window) {
        try TimeBasedIncentiveManager(proxy).referralDistributorImplementation() returns (address v) {
            impl = v;
        } catch {}
        try TimeBasedIncentiveManager(proxy).referralClaimWindowDuration() returns (uint64 v) {
            window = v;
        } catch {}
    }

    /// @dev Prints paste-ready timelock batch payloads. An already executed op reports done;
    ///      an in-flight one prints only its remaining execute step.
    function _printBatchPayloads(address owner, address proxy, bytes[] memory payloads) internal view {
        TimelockController tl = TimelockController(payable(owner));
        uint256 minDelay = tl.getMinDelay();

        address[] memory targets = new address[](payloads.length);
        uint256[] memory values = new uint256[](payloads.length);
        for (uint256 i; i < payloads.length; i++) {
            targets[i] = proxy;
        }

        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256(abi.encode("tbi-referrals-rollout", proxy, payloads));
        bytes32 opId = tl.hashOperationBatch(targets, values, payloads, predecessor, salt);

        console.log("\n--- Timelock Batch (route via Safe -> timelock) ---");
        console.log("Timelock:         ", owner);
        console.log("minDelay (s):     ", minDelay);
        console.log("batch size:       ", payloads.length);
        console.log("operation id:     ", vm.toString(opId));

        if (tl.isOperationDone(opId)) {
            console.log("\nThis batch already executed. Nothing to do.");
            return;
        }

        if (tl.isOperationPending(opId)) {
            console.log("\nBatch already queued. executable at (unix):", tl.getTimestamp(opId));
            console.log("executeBatch(...) calldata:");
            console.logBytes(
                abi.encodeWithSelector(tl.executeBatch.selector, targets, values, payloads, predecessor, salt)
            );
            return;
        }

        console.log("\n1) Safe queues on the timelock - scheduleBatch(...) calldata:");
        console.logBytes(
            abi.encodeWithSelector(tl.scheduleBatch.selector, targets, values, payloads, predecessor, salt, minDelay)
        );
        console.log("\n2) after minDelay, anyone executes - executeBatch(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.executeBatch.selector, targets, values, payloads, predecessor, salt));
        console.log("\n3) verify: re-run this script - it should report nothing left to schedule");
    }
}
