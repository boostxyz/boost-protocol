// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

/// @title DeployImpl_TBIForwarder
/// @notice Deploy a new TBIForwarder implementation only, without upgrading the proxy.
/// @dev The proxy is now owned by a TimelockController, so the upgrade cannot be executed
///      directly. This deploys the implementation and prints the schedule/execute calldata the
///      Safe routes through the timelock (schedule -> wait minDelay -> execute).
///
///      Environment variables:
///        BOOST_DEPLOYMENT_SALT   — CREATE2 salt (same as initial deploy)
///        FORWARDER_PROXY         — TBIForwarder proxy address (owned by the timelock)
contract DeployImpl_TBIForwarder is ScriptUtils {
    function run() public {
        address FORWARDER_PROXY = vm.envAddress("FORWARDER_PROXY");
        TBIForwarder forwarder = TBIForwarder(payable(FORWARDER_PROXY));

        console.log("========================================");
        console.log("Deploy new TBIForwarder implementation");
        console.log("========================================");
        console.log("Forwarder Proxy:  ", FORWARDER_PROXY);

        // ---- Snapshot current state ----
        address currentImpl = Upgrades.getImplementationAddress(FORWARDER_PROXY);
        address owner = forwarder.owner();

        console.log("\n--- Current State ---");
        console.log("Implementation:   ", currentImpl);
        console.log("Owner:            ", owner);

        // ---- Deploy new implementation ----
        console.log("\n--- Deploy New Implementation ---");
        bytes memory initCode = type(TBIForwarder).creationCode;
        address newImpl = _getCreate2Address(initCode, "");
        console.log("New Impl:         ", newImpl);

        if (_deploy2(initCode, "")) {
            console.log("  -> Deployed new implementation");
        }

        if (newImpl == currentImpl) {
            console.log("\nImplementation unchanged - proxy already points here. Nothing to schedule.");
            return;
        }

        // ---- Print timelock upgrade payloads ----
        require(owner.code.length > 0, "proxy owner has no code - not a timelock?");
        _printUpgradePayloads(owner, FORWARDER_PROXY, newImpl);
    }

    /// @dev Prints paste-ready timelock payloads for `upgradeToAndCall(newImpl, "")`. An already
    ///      executed op reports done; an in-flight one prints only its remaining execute step.
    function _printUpgradePayloads(address owner, address proxy, address newImpl) internal view {
        TimelockController tl = TimelockController(payable(owner));
        uint256 minDelay = tl.getMinDelay();

        bytes memory data = abi.encodeWithSignature("upgradeToAndCall(address,bytes)", newImpl, "");
        bytes32 predecessor = bytes32(0);
        bytes32 salt = keccak256(abi.encodePacked("tbi-forwarder-upgrade", proxy, newImpl));
        bytes32 opId = tl.hashOperation(proxy, 0, data, predecessor, salt);

        console.log("\n--- Timelock Upgrade (route via Safe -> timelock) ---");
        console.log("Timelock:         ", owner);
        console.log("minDelay (s):     ", minDelay);
        console.log("operation id:     ", vm.toString(opId));

        if (tl.isOperationDone(opId)) {
            console.log("\nUpgrade to this implementation already executed. Nothing to do.");
            return;
        }

        if (tl.isOperationPending(opId)) {
            console.log("\nUpgrade already queued. executable at (unix):", tl.getTimestamp(opId));
            console.log("execute(...) calldata:");
            console.logBytes(abi.encodeWithSelector(tl.execute.selector, proxy, 0, data, predecessor, salt));
            return;
        }

        console.log("\n1) Safe queues on the timelock - schedule(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.schedule.selector, proxy, 0, data, predecessor, salt, minDelay));
        console.log("\n2) after minDelay, anyone executes - execute(...) calldata:");
        console.logBytes(abi.encodeWithSelector(tl.execute.selector, proxy, 0, data, predecessor, salt));
        console.log("\n3) verify: cast call", proxy, "'implementation()' now ==", newImpl);
    }
}
