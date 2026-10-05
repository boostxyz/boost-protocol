// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {OpenEndedIncentiveCampaign} from "contracts/timebased/OpenEndedIncentiveCampaign.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";

/// @title DeployImpl_TBIOpenEnded
/// @notice Deploy the open-ended campaign rollout (Manager 2.4.0) and activate open-ended
///         campaigns on the Manager proxy.
/// @dev Deploys, CREATE2 and idempotent:
///        - OpenEndedIncentiveCampaign   (clone template for open-ended campaigns)
///        - ReferralDistributor          (new template with addToPool / supportsTopUps)
///        - TimeBasedIncentiveManager    (2.4.0 implementation)
///      The fixed-end TimeBasedIncentiveCampaign implementation is NOT redeployed or re-set.
///      Then applies the owner calls the proxy still needs, in order:
///        1. upgradeToAndCall(newManagerImpl, "")
///        2. setReferralDistributorImplementation(newDistributorImpl)
///        3. setOpenEndedCampaignImplementation(openEndedImpl)
///      Step 2 precedes step 3 so open-ended campaigns never see the legacy distributor
///      template (the 2.4.0 Manager also refuses it: ReferralDistributorNotTopUpCompatible).
///      Already-satisfied steps are skipped, so the script can be re-run to pick up where a
///      previous rollout left off. Only upgrades from 2.3.0 (or re-runs at 2.4.0) are allowed.
///
///      On Base Sepolia the proxy is owned by an EOA, so the owner calls are broadcast from
///      TBI_PROXY_OWNER_PRIVATE_KEY and the result is verified in the same run: version
///      2.4.0, every pre-existing setting and campaign unchanged, the new templates wired. On
///      all other chains the proxy is owned by a TimelockController, so the script instead
///      prints scheduleBatch/executeBatch calldata the Safe routes through the timelock
///      (schedule -> wait minDelay -> execute). Steps 2-3 only exist on the proxy after step 1
///      executes; a timelock batch runs its calls sequentially in one transaction, so a single
///      batch handles the ordering. Once the delay passes, `--sig "execute()"` broadcasts
///      executeBatch from DEPLOYER_PRIVATE_KEY and runs the same verification.
///
///      Environment variables:
///        BOOST_DEPLOYMENT_SALT        — CREATE2 salt (same as initial deploy)
///        TIMEBASED_MANAGER_PROXY      — Manager proxy address
///        DEPLOYER_PRIVATE_KEY         — EOA that broadcasts the implementation deploys
///                                       (and executeBatch on timelocked chains)
///        TBI_PROXY_OWNER_PRIVATE_KEY  — (Base Sepolia only) proxy owner, broadcasts the
///                                       upgradeToAndCall + implementation setter calls
///        TBI_ROLLOUT_SALT_LABEL       — (optional) timelock salt label, default
///                                       "tbi-open-ended-rollout"; set a new one to re-upgrade
///                                       after a rollback
///
///      Base Sepolia (run from the branch carrying these contracts, from packages/evm):
///        forge script script/solidity/DeployImpl_TBIOpenEnded.s.sol:DeployImpl_TBIOpenEnded \
///          --rpc-url "$BASE_SEPOLIA_RPC_URL" --broadcast [--verify]
///      Drop --broadcast for a simulation-only run. --verify needs the Basescan API key the
///      other TBI deploys use. The dry run against live Base Sepolia state is
///      test/timebased/DeployImpl_TBIOpenEndedFork.t.sol.
contract DeployImpl_TBIOpenEnded is ScriptUtils {
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;

    /// @notice The CREATE2 addresses of the rollout's contracts
    struct Deployment {
        address openEndedImpl;
        address distributorImpl;
        address managerImpl;
    }

    /// @notice Pre-existing Manager state that the upgrade must preserve
    struct ManagerSnapshot {
        address owner;
        address operator;
        uint64 protocolFee;
        address protocolFeeReceiver;
        address protocolFeeModule;
        uint64 minCampaignDuration;
        uint64 maxCampaignDuration;
        uint64 claimExpiryDuration;
        uint64 referralClaimWindowDuration;
        address campaignImplementation;
        uint256 campaignCount;
        address[] campaigns;
        address[] referralDistributors;
    }

    /// @dev Keys for the broadcast hooks, set by run() and execute()
    uint256 internal deployerPk;
    uint256 internal ownerPk;

    function run() public {
        address managerProxy = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        deployerPk = vm.envUint("DEPLOYER_PRIVATE_KEY");

        console.log("========================================");
        console.log("TBI Open-Ended Campaigns Rollout");
        console.log("========================================");
        console.log("Manager Proxy:    ", managerProxy);
        console.log("Deployer:         ", vm.addr(deployerPk));

        if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            ownerPk = vm.envUint("TBI_PROXY_OWNER_PRIVATE_KEY");
            require(
                vm.addr(ownerPk) == TimeBasedIncentiveManager(managerProxy).owner(),
                "TBI_PROXY_OWNER_PRIVATE_KEY does not match the proxy owner"
            );
        }

        rollout(managerProxy);
    }

    /// @notice Deploy the rollout's contracts and apply (Base Sepolia) or print (timelocked
    ///         chains) the owner calls
    /// @dev Public so the fork dry run can drive it with the broadcast hooks overridden
    function rollout(address managerProxy) public returns (Deployment memory d) {
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(managerProxy);

        // ---- Snapshot current state ----
        address currentImpl = Upgrades.getImplementationAddress(managerProxy);
        string memory currentVersion = manager.version();
        _requireSupportedVersion(currentVersion);
        ManagerSnapshot memory before = _snapshot(managerProxy);

        console.log("\n--- Current State ---");
        console.log("Implementation:   ", currentImpl);
        console.log("Version:          ", currentVersion);
        _logSnapshot(before);
        console.log("Open-ended impl:  ", _currentOpenEndedImpl(managerProxy));

        // ---- Deploy (CREATE2, idempotent) ----
        console.log("\n--- Deploy ---");
        d = predictDeployment();
        _deployCreate2(type(OpenEndedIncentiveCampaign).creationCode, d.openEndedImpl, "Open-Ended Impl:  ");
        _deployCreate2(type(ReferralDistributor).creationCode, d.distributorImpl, "Distributor Impl: ");
        _deployCreate2(type(TimeBasedIncentiveManager).creationCode, d.managerImpl, "Manager Impl:     ");

        // ---- Record the templates (broadcast runs only) ----
        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(d.distributorImpl), _buildJsonDeployPath(), ".ReferralDistributor");
            vm.writeJson(vm.toString(d.openEndedImpl), _buildJsonDeployPath(), ".OpenEndedIncentiveCampaign");
        }

        // ---- Apply the owner calls still needed on the proxy ----
        if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            _upgradeDirect(manager, currentImpl, d);
            _verify(managerProxy, before, d, _isVersion(currentVersion, "2.3.0"));
            return d;
        }

        bytes[] memory payloads = _stagePayloads(managerProxy, currentImpl, d);
        if (payloads.length == 0) {
            console.log("\nProxy already upgraded and configured. Nothing to schedule.");
            return d;
        }

        address owner = manager.owner();
        require(owner.code.length > 0, "proxy owner has no code - not a timelock?");
        _printBatchPayloads(owner, managerProxy, payloads);
    }

    /// @notice Execute the queued timelock batch once its delay has passed.
    /// @dev Never deploys. All three contracts must already sit at their CREATE2 addresses: a
    ///      different address means the build drifted from the rollout run, so the payloads
    ///      would no longer hash to the queued operation.
    function execute() public {
        address managerProxy = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        uint256 executorPk = vm.envUint("DEPLOYER_PRIVATE_KEY");

        console.log("========================================");
        console.log("TBI Open-Ended Campaigns - Execute Batch");
        console.log("========================================");
        console.log("Manager Proxy:    ", managerProxy);
        console.log("Executor:         ", vm.addr(executorPk));

        Deployment memory d = predictDeployment();
        console.log("Open-Ended Impl:  ", d.openEndedImpl);
        console.log("Distributor Impl: ", d.distributorImpl);
        console.log("Manager Impl:     ", d.managerImpl);
        require(d.openEndedImpl.code.length > 0, "Open-ended impl not at expected address - build drifted");
        require(d.distributorImpl.code.length > 0, "Distributor impl not at expected address - build drifted");
        require(d.managerImpl.code.length > 0, "Manager impl not at expected address - build drifted");

        address currentImpl = Upgrades.getImplementationAddress(managerProxy);
        string memory currentVersion = TimeBasedIncentiveManager(managerProxy).version();
        _requireSupportedVersion(currentVersion);
        bytes[] memory payloads = _stagePayloads(managerProxy, currentImpl, d);
        if (payloads.length == 0) {
            console.log("\nProxy already upgraded and configured. Nothing to execute.");
            return;
        }
        ManagerSnapshot memory before = _snapshot(managerProxy);

        address owner = before.owner;
        require(owner.code.length > 0, "proxy owner has no code - not a timelock?");
        TimelockController tl = TimelockController(payable(owner));
        (address[] memory targets, uint256[] memory values, bytes32 salt) = _batchParams(managerProxy, payloads);
        bytes32 opId = tl.hashOperationBatch(targets, values, payloads, bytes32(0), salt);

        console.log("Timelock:         ", owner);
        console.log("operation id:     ", vm.toString(opId));
        if (!tl.isOperationReady(opId)) {
            if (tl.isOperationPending(opId)) {
                console.log("Batch queued but not ready. executable at (unix):", tl.getTimestamp(opId));
                revert("batch not ready yet");
            }
            revert("batch not scheduled - run run() for the scheduleBatch calldata");
        }

        vm.broadcast(executorPk);
        tl.executeBatch(targets, values, payloads, bytes32(0), salt);

        _verify(managerProxy, before, d, _isVersion(currentVersion, "2.3.0"));
    }

    /// @notice The CREATE2 addresses the rollout deploys to for the current salt and build
    function predictDeployment() public view returns (Deployment memory d) {
        d.openEndedImpl = _create2Address(type(OpenEndedIncentiveCampaign).creationCode);
        d.distributorImpl = _create2Address(type(ReferralDistributor).creationCode);
        d.managerImpl = _create2Address(type(TimeBasedIncentiveManager).creationCode);
    }

    ////////////////////////////////
    // Broadcast hooks (the fork dry run overrides these to impersonate instead)
    ////////////////////////////////

    /// @dev Called immediately before each CREATE2 factory call
    function _asDeployer() internal virtual {
        vm.broadcast(deployerPk);
    }

    /// @dev Called immediately before each owner call on the proxy (Base Sepolia only)
    function _asOwner() internal virtual {
        vm.broadcast(ownerPk);
    }

    /// @dev The CREATE2 salt (keccak of BOOST_DEPLOYMENT_SALT, as in ScriptUtils)
    function _salt() internal view virtual returns (bytes32) {
        return keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
    }

    ////////////////////////////////
    // Internals
    ////////////////////////////////

    /// @dev Base Sepolia only: the proxy owner is an EOA, so the calls broadcast from the
    ///      owner key instead of routing through a timelock. The new getters revert on the
    ///      pre-upgrade implementation and are re-read after the upgrade.
    function _upgradeDirect(TimeBasedIncentiveManager manager, address currentImpl, Deployment memory d) internal {
        console.log("\n--- Direct Upgrade (non-timelock) ---");

        if (d.managerImpl == currentImpl) {
            console.log("Implementation unchanged, skipping upgrade");
        } else {
            _asOwner();
            manager.upgradeToAndCall(d.managerImpl, "");
            console.log("Upgraded proxy to:", d.managerImpl);
        }

        if (manager.referralDistributorImplementation() == d.distributorImpl) {
            console.log("Distributor implementation already configured");
        } else {
            _asOwner();
            manager.setReferralDistributorImplementation(d.distributorImpl);
            console.log("setReferralDistributorImplementation:", d.distributorImpl);
        }

        if (manager.openEndedCampaignImplementation() == d.openEndedImpl) {
            console.log("Open-ended implementation already configured");
        } else {
            _asOwner();
            manager.setOpenEndedCampaignImplementation(d.openEndedImpl);
            console.log("setOpenEndedCampaignImplementation:", d.openEndedImpl);
        }
    }

    /// @dev Checks the upgraded proxy: new version and templates wired, and every
    ///      pre-existing setting and campaign exactly as before
    function _verify(address managerProxy, ManagerSnapshot memory before, Deployment memory d, bool fromV2_3)
        internal
        view
    {
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(managerProxy);

        require(Upgrades.getImplementationAddress(managerProxy) == d.managerImpl, "implementation mismatch");
        require(keccak256(bytes(manager.version())) == keccak256("2.4.0"), "version is not 2.4.0");

        ManagerSnapshot memory post = _snapshot(managerProxy);
        require(post.owner == before.owner, "owner changed");
        require(post.operator == before.operator, "operator changed");
        require(post.protocolFee == before.protocolFee, "protocol fee changed");
        require(post.protocolFeeReceiver == before.protocolFeeReceiver, "protocol fee receiver changed");
        require(post.protocolFeeModule == before.protocolFeeModule, "protocol fee module changed");
        require(post.minCampaignDuration == before.minCampaignDuration, "min duration changed");
        require(post.maxCampaignDuration == before.maxCampaignDuration, "max duration changed");
        require(post.claimExpiryDuration == before.claimExpiryDuration, "claim expiry changed");
        require(post.referralClaimWindowDuration == before.referralClaimWindowDuration, "referral claim window changed");
        require(post.campaignImplementation == before.campaignImplementation, "campaign implementation changed");
        require(post.campaignCount == before.campaignCount, "campaign count changed");
        for (uint256 i; i < before.campaignCount; i++) {
            require(post.campaigns[i] == before.campaigns[i], "campaign address changed");
            require(post.referralDistributors[i] == before.referralDistributors[i], "referral distributor changed");
        }

        address distributorImpl = manager.referralDistributorImplementation();
        require(distributorImpl == d.distributorImpl, "distributor implementation not configured");
        require(ReferralDistributor(distributorImpl).supportsTopUps(), "distributor template cannot take top-ups");
        require(manager.openEndedCampaignImplementation() == d.openEndedImpl, "open-ended implementation not set");
        require(
            OpenEndedIncentiveCampaign(d.openEndedImpl).EMISSION_PRECISION() == 1e12, "open-ended template mismatch"
        );
        // Only meaningful on the upgrade itself: a re-run at 2.4.0 can see real open-ended campaigns.
        if (fromV2_3 && before.campaignCount > 0) {
            require(!manager.isOpenEnded(1), "campaign 1 reads as open-ended");
            require(!manager.isOpenEnded(before.campaignCount), "latest campaign reads as open-ended");
        }

        console.log("\n[OK] Proxy at 2.4.0, state preserved, open-ended campaigns enabled");
        console.log("Campaigns checked:", before.campaignCount);
    }

    /// @dev Reads every setting the upgrade must preserve. All getters exist on 2.3.0
    function _snapshot(address managerProxy) internal view returns (ManagerSnapshot memory s) {
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(managerProxy);
        s.owner = manager.owner();
        s.operator = manager.operator();
        s.protocolFee = manager.protocolFee();
        s.protocolFeeReceiver = manager.protocolFeeReceiver();
        s.protocolFeeModule = manager.protocolFeeModule();
        s.minCampaignDuration = manager.minCampaignDuration();
        s.maxCampaignDuration = manager.maxCampaignDuration();
        s.claimExpiryDuration = manager.claimExpiryDuration();
        s.referralClaimWindowDuration = manager.referralClaimWindowDuration();
        s.campaignImplementation = manager.campaignImplementation();
        s.campaignCount = manager.campaignCount();
        s.campaigns = new address[](s.campaignCount);
        s.referralDistributors = new address[](s.campaignCount);
        for (uint256 i; i < s.campaignCount; i++) {
            s.campaigns[i] = manager.campaigns(i + 1);
            s.referralDistributors[i] = manager.referralDistributors(i + 1);
            require(s.campaigns[i] != address(0), "campaign missing");
        }
    }

    function _logSnapshot(ManagerSnapshot memory s) internal pure {
        console.log("Owner:            ", s.owner);
        console.log("Operator:         ", s.operator);
        console.log("Protocol fee bps: ", uint256(s.protocolFee));
        console.log("Fee receiver:     ", s.protocolFeeReceiver);
        console.log("Fee module:       ", s.protocolFeeModule);
        console.log("Min duration (s): ", uint256(s.minCampaignDuration));
        console.log("Max duration (s): ", uint256(s.maxCampaignDuration));
        console.log("Claim expiry (s): ", uint256(s.claimExpiryDuration));
        console.log("Referral window:  ", uint256(s.referralClaimWindowDuration));
        console.log("Campaign impl:    ", s.campaignImplementation);
        console.log("Campaign count:   ", s.campaignCount);
    }

    /// @dev The rollout is validated as an upgrade from 2.3.0; 2.4.0 means a re-run
    function _isVersion(string memory v, string memory expected) internal pure returns (bool) {
        return keccak256(bytes(v)) == keccak256(bytes(expected));
    }

    function _requireSupportedVersion(string memory v) internal pure {
        bytes32 h = keccak256(bytes(v));
        require(h == keccak256("2.3.0") || h == keccak256("2.4.0"), "unexpected Manager version (need 2.3.0)");
    }

    function _create2Address(bytes memory initCode) internal view returns (address) {
        return vm.computeCreate2Address(_salt(), keccak256(initCode));
    }

    /// @dev CREATE2 deploy through the deterministic deployer; skips if already deployed
    function _deployCreate2(bytes memory initCode, address expected, string memory label) internal {
        console.log(label, expected);
        if (expected.code.length > 0) {
            console.log("  Already deployed");
            return;
        }

        bytes32 salt = _salt();
        _asDeployer();
        (bool success,) = CREATE2_FACTORY.call(abi.encodePacked(salt, initCode));
        require(success, "create2 deploy failed");
        require(expected.code.length > 0, "create2 landed at an unexpected address");
        console.log("  -> Deployed");
    }

    /// @dev Builds the batch of owner calls the proxy still needs, in execution order. The
    ///      open-ended getter reverts on the pre-upgrade implementation, which reads as unset.
    function _stagePayloads(address proxy, address currentImpl, Deployment memory d)
        internal
        view
        returns (bytes[] memory payloads)
    {
        bytes[] memory staged = new bytes[](3);
        uint256 n;
        if (d.managerImpl != currentImpl) {
            staged[n++] = abi.encodeWithSignature("upgradeToAndCall(address,bytes)", d.managerImpl, "");
            console.log("\nStaged: upgradeToAndCall ->", d.managerImpl);
        }
        if (TimeBasedIncentiveManager(proxy).referralDistributorImplementation() != d.distributorImpl) {
            staged[n++] = abi.encodeWithSignature("setReferralDistributorImplementation(address)", d.distributorImpl);
            console.log("Staged: setReferralDistributorImplementation ->", d.distributorImpl);
        }
        if (_currentOpenEndedImpl(proxy) != d.openEndedImpl) {
            staged[n++] = abi.encodeWithSignature("setOpenEndedCampaignImplementation(address)", d.openEndedImpl);
            console.log("Staged: setOpenEndedCampaignImplementation ->", d.openEndedImpl);
        }

        payloads = new bytes[](n);
        for (uint256 i; i < n; i++) {
            payloads[i] = staged[i];
        }
    }

    function _currentOpenEndedImpl(address proxy) internal view returns (address impl) {
        try TimeBasedIncentiveManager(proxy).openEndedCampaignImplementation() returns (address v) {
            impl = v;
        } catch {}
    }

    /// @dev Every call targets the proxy with no value. The salt is derived from the payloads,
    ///      so schedule and execute rebuild the same operation id. Re-upgrading after a
    ///      rollback rebuilds identical payloads, so it needs a fresh TBI_ROLLOUT_SALT_LABEL.
    function _batchParams(address proxy, bytes[] memory payloads)
        internal
        view
        returns (address[] memory targets, uint256[] memory values, bytes32 salt)
    {
        targets = new address[](payloads.length);
        values = new uint256[](payloads.length);
        for (uint256 i; i < payloads.length; i++) {
            targets[i] = proxy;
        }
        string memory label = vm.envOr("TBI_ROLLOUT_SALT_LABEL", string("tbi-open-ended-rollout"));
        salt = keccak256(abi.encode(label, proxy, payloads));
    }

    /// @dev Prints paste-ready timelock batch payloads. An already executed op reports done;
    ///      an in-flight one prints only its remaining execute step.
    function _printBatchPayloads(address owner, address proxy, bytes[] memory payloads) internal view {
        TimelockController tl = TimelockController(payable(owner));
        uint256 minDelay = tl.getMinDelay();

        (address[] memory targets, uint256[] memory values, bytes32 salt) = _batchParams(proxy, payloads);
        bytes32 predecessor = bytes32(0);
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
        console.log("\n3) verify: run `--sig \"execute()\"` (broadcasts executeBatch and verifies), then re-run");
    }
}
