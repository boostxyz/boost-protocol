// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TBIProtocolFeeModule} from "contracts/timebased/TBIProtocolFeeModule.sol";

/// @title DeployImpl_TBIFeeModule
/// @notice Deploy the dynamic protocol fee rollout and wire the module into the Manager proxy.
/// @dev Deploys the new TimeBasedIncentiveManager implementation and the
///      TBIProtocolFeeModule (both CREATE2, idempotent), then applies the owner calls the
///      proxy still needs, in order:
///        1. upgradeToAndCall(newManagerImpl, "")
///        2. setProtocolFeeModule(module)
///      Already-satisfied steps are skipped, so the script can be re-run to pick up where
///      a previous rollout left off.
///
///      The module is owned by TBI_FEE_MODULE_OWNER (the team Safe), which sets per-account
///      fees with no timelock delay. The Manager proxy's owner is also honored as module
///      owner, so the timelock can transfer module ownership if the Safe key leaks. The
///      Manager caps the module at the standard fee, so the module can only ever discount.
///
///      On Base Sepolia the proxy is owned by an EOA, so the owner calls are broadcast
///      from TBI_PROXY_OWNER_PRIVATE_KEY. On all other chains the proxy is owned by a
///      TimelockController, so the script instead prints scheduleBatch/executeBatch
///      calldata the Safe routes through the timelock (schedule -> wait minDelay ->
///      execute). Step 2 only exists on the proxy after step 1 executes; a timelock batch
///      runs its calls sequentially in one transaction, so a single batch handles the
///      ordering. Once the delay passes, `--sig "execute()"` broadcasts executeBatch from
///      DEPLOYER_PRIVATE_KEY (the timelock's execution is open to any caller).
///
///      Environment variables:
///        BOOST_DEPLOYMENT_SALT        — CREATE2 salt (same as initial deploy)
///        TIMEBASED_MANAGER_PROXY      — Manager proxy address
///        TBI_FEE_MODULE_OWNER         — module owner (team Safe)
///        DEPLOYER_PRIVATE_KEY         — EOA that broadcasts the deploys and executeBatch
///        TBI_PROXY_OWNER_PRIVATE_KEY  — (Base Sepolia only) proxy owner, broadcasts the
///                                       upgradeToAndCall + setProtocolFeeModule calls
contract DeployImpl_TBIFeeModule is ScriptUtils {
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;

    function run() public {
        address MANAGER_PROXY = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        address moduleOwner = vm.envAddress("TBI_FEE_MODULE_OWNER");
        uint256 deployerPk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        TimeBasedIncentiveManager manager = TimeBasedIncentiveManager(MANAGER_PROXY);

        console.log("========================================");
        console.log("TBI Dynamic Protocol Fee Rollout");
        console.log("========================================");
        console.log("Manager Proxy:    ", MANAGER_PROXY);
        console.log("Module Owner:     ", moduleOwner);
        console.log("Deployer:         ", vm.addr(deployerPk));

        require(moduleOwner != address(0), "TBI_FEE_MODULE_OWNER not set");

        // ---- Snapshot current state ----
        address currentImpl = Upgrades.getImplementationAddress(MANAGER_PROXY);
        address owner = manager.owner();

        console.log("\n--- Current State ---");
        console.log("Implementation:   ", currentImpl);
        console.log("Owner:            ", owner);

        // ---- Deploy (CREATE2, idempotent) ----
        console.log("\n--- Deploy ---");
        address newManagerImpl =
            _deployCreate2(deployerPk, type(TimeBasedIncentiveManager).creationCode, "", "Manager Impl:     ");
        address module = _deployCreate2(
            deployerPk,
            type(TBIProtocolFeeModule).creationCode,
            abi.encode(MANAGER_PROXY, moduleOwner),
            "Fee Module:       "
        );
        require(TBIProtocolFeeModule(module).MANAGER() == MANAGER_PROXY, "module manager mismatch");
        require(TBIProtocolFeeModule(module).owner() == moduleOwner, "module owner mismatch");

        // ---- Record the module (broadcast runs only) ----
        if (vm.isContext(VmSafe.ForgeContext.ScriptBroadcast)) {
            vm.writeJson(vm.toString(module), _buildJsonDeployPath(), ".TBIProtocolFeeModule");
        }

        // ---- Apply the owner calls still needed on the proxy ----
        if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            uint256 ownerPk = vm.envUint("TBI_PROXY_OWNER_PRIVATE_KEY");
            require(vm.addr(ownerPk) == owner, "TBI_PROXY_OWNER_PRIVATE_KEY does not match the proxy owner");
            _upgradeDirect(manager, ownerPk, currentImpl, newManagerImpl, module);
            return;
        }

        bytes[] memory payloads = _stagePayloads(MANAGER_PROXY, currentImpl, newManagerImpl, module);
        if (payloads.length == 0) {
            console.log("\nProxy already upgraded and configured. Nothing to schedule.");
            return;
        }

        require(owner.code.length > 0, "proxy owner has no code - not a timelock?");
        _printBatchPayloads(owner, MANAGER_PROXY, payloads);
    }

    /// @notice Execute the queued timelock batch once its delay has passed.
    /// @dev Never deploys. Both contracts must already sit at their CREATE2 addresses: a
    ///      different address means the build drifted from the rollout run, so the payloads
    ///      would no longer hash to the queued operation.
    function execute() public {
        address managerProxy = vm.envAddress("TIMEBASED_MANAGER_PROXY");
        address moduleOwner = vm.envAddress("TBI_FEE_MODULE_OWNER");
        uint256 executorPk = vm.envUint("DEPLOYER_PRIVATE_KEY");

        console.log("========================================");
        console.log("TBI Dynamic Protocol Fee - Execute Batch");
        console.log("========================================");
        console.log("Manager Proxy:    ", managerProxy);
        console.log("Executor:         ", vm.addr(executorPk));

        address newManagerImpl = _getCreate2Address(type(TimeBasedIncentiveManager).creationCode, "");
        address module =
            _getCreate2Address(type(TBIProtocolFeeModule).creationCode, abi.encode(managerProxy, moduleOwner));
        console.log("Manager Impl:     ", newManagerImpl);
        console.log("Fee Module:       ", module);
        require(newManagerImpl.code.length > 0, "Manager impl not at expected address - build drifted since rollout");
        require(module.code.length > 0, "Fee module not at expected address - build drifted since rollout");

        address currentImpl = Upgrades.getImplementationAddress(managerProxy);
        bytes[] memory payloads = _stagePayloads(managerProxy, currentImpl, newManagerImpl, module);
        if (payloads.length == 0) {
            console.log("\nProxy already upgraded and configured. Nothing to execute.");
            return;
        }

        address owner = TimeBasedIncentiveManager(managerProxy).owner();
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

        require(Upgrades.getImplementationAddress(managerProxy) == newManagerImpl, "implementation mismatch");
        require(_currentModule(managerProxy) == module, "fee module not configured");
        console.log("\n[OK] Batch executed: proxy upgraded and fee module configured");
    }

    /// @dev Base Sepolia only: the proxy owner is an EOA, so the calls broadcast from the
    ///      owner key instead of routing through a timelock.
    function _upgradeDirect(
        TimeBasedIncentiveManager manager,
        uint256 ownerPk,
        address currentImpl,
        address newManagerImpl,
        address module
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

        if (_currentModule(address(manager)) == module) {
            console.log("Fee module already configured");
        } else {
            vm.broadcast(ownerPk);
            manager.setProtocolFeeModule(module);
            console.log("setProtocolFeeModule:", module);
        }

        // ---- Verify ----
        require(Upgrades.getImplementationAddress(address(manager)) == newManagerImpl, "implementation mismatch");
        require(_currentModule(address(manager)) == module, "fee module not configured");
        console.log("\n[OK] Proxy upgraded and fee module configured");
    }

    /// @dev CREATE2 deploy broadcast from the deployer key rather than the CLI-configured
    ///      sender `_deploy2` uses.
    function _deployCreate2(uint256 deployerPk, bytes memory initCode, bytes memory args, string memory label)
        internal
        returns (address deployed)
    {
        deployed = _getCreate2Address(initCode, args);
        console.log(label, deployed);
        if (deployed.code.length > 0) {
            console.log("  Already deployed");
            return deployed;
        }

        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        vm.broadcast(deployerPk);
        (bool success,) = CREATE2_FACTORY.call(abi.encodePacked(salt, initCode, args));
        require(success, "create2 deploy failed");
        console.log("  -> Deployed");
    }

    /// @dev Builds the batch of owner calls the proxy still needs, in execution order.
    ///      The module getter reverts on the pre-upgrade implementation, which reads as
    ///      unconfigured.
    function _stagePayloads(address proxy, address currentImpl, address newManagerImpl, address module)
        internal
        view
        returns (bytes[] memory payloads)
    {
        bytes[] memory staged = new bytes[](2);
        uint256 n;
        if (newManagerImpl != currentImpl) {
            staged[n++] = abi.encodeWithSignature("upgradeToAndCall(address,bytes)", newManagerImpl, "");
            console.log("\nStaged: upgradeToAndCall ->", newManagerImpl);
        }
        if (_currentModule(proxy) != module) {
            staged[n++] = abi.encodeWithSignature("setProtocolFeeModule(address)", module);
            console.log("Staged: setProtocolFeeModule ->", module);
        }

        payloads = new bytes[](n);
        for (uint256 i; i < n; i++) {
            payloads[i] = staged[i];
        }
    }

    function _currentModule(address proxy) internal view returns (address module) {
        try TimeBasedIncentiveManager(proxy).protocolFeeModule() returns (address v) {
            module = v;
        } catch {}
    }

    /// @dev Every call targets the proxy with no value. The salt is derived from the payloads,
    ///      so schedule and execute rebuild the same operation id.
    function _batchParams(address proxy, bytes[] memory payloads)
        internal
        pure
        returns (address[] memory targets, uint256[] memory values, bytes32 salt)
    {
        targets = new address[](payloads.length);
        values = new uint256[](payloads.length);
        for (uint256 i; i < payloads.length; i++) {
            targets[i] = proxy;
        }
        salt = keccak256(abi.encode("tbi-fee-module-rollout", proxy, payloads));
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
        console.log("\n3) verify: re-run this script - it should report nothing left to schedule");
    }
}
