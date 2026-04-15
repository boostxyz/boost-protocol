// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {TBIForwarder} from "contracts/timebased/TBIForwarder.sol";

/// @title Upgrade_TBIForwarder
/// @notice Deploy a new TBIForwarder implementation and upgrade the proxy
/// @dev Environment variables:
///   DEPLOYER_PRIVATE_KEY    — owner private key
///   BOOST_DEPLOYMENT_SALT   — CREATE2 salt (same as initial deploy)
///   FORWARDER_PROXY         — TBIForwarder proxy address
contract Upgrade_TBIForwarder is ScriptUtils {
    function run() public {
        address FORWARDER_PROXY = vm.envAddress("FORWARDER_PROXY");
        TBIForwarder forwarder = TBIForwarder(FORWARDER_PROXY);

        console.log("========================================");
        console.log("Starting TBIForwarder Upgrade");
        console.log("========================================");
        console.log("Upgrader address: ", msg.sender);
        console.log("Forwarder Proxy:  ", FORWARDER_PROXY);

        // ---- Snapshot current state ----
        address currentImpl = Upgrades.getImplementationAddress(FORWARDER_PROXY);
        address currentOwner = forwarder.owner();

        console.log("\n--- Current State ---");
        console.log("Implementation:   ", currentImpl);
        console.log("Owner:            ", currentOwner);

        // ---- Deploy new implementation ----
        console.log("\n--- Deploy New Implementation ---");
        bytes memory initCode = type(TBIForwarder).creationCode;
        address newImpl = _getCreate2Address(initCode, "");
        console.log("New Impl:         ", newImpl);

        if (_deploy2(initCode, "")) {
            console.log("  -> Deployed new implementation");
        }

        // ---- Upgrade proxy ----
        console.log("\n--- Upgrade Proxy ---");
        if (newImpl == currentImpl) {
            console.log("  -> Implementation unchanged, skipping upgrade");
        } else {
            vm.broadcast();
            forwarder.upgradeToAndCall(newImpl, "");
            console.log("  -> Upgraded to new implementation");
        }

        // ---- Verify ----
        address implAfter = Upgrades.getImplementationAddress(FORWARDER_PROXY);
        require(implAfter == newImpl, "Proxy implementation mismatch");
        console.log("New Implementation:   ", implAfter);

        require(forwarder.owner() == currentOwner, "Owner changed!");
        console.log("[OK] Owner preserved");

        // ---- Summary ----
        console.log("\n========================================");
        console.log("Upgrade Completed Successfully!");
        console.log("========================================");
        console.log("Forwarder Proxy:  ", FORWARDER_PROXY);
        console.log("Old Impl:         ", currentImpl);
        console.log("New Impl:         ", newImpl);
    }
}
