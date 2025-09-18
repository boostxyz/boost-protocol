// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Options} from "openzeppelin-foundry-upgrades/Options.sol";
import {BoostCore} from "contracts/BoostCore.sol";

contract UpgradeBoostCore is Script {
    function run() public {
        address BOOST_CORE_PROXY = vm.envAddress("BOOST_CORE_PROXY");

        console.log("========================================");
        console.log("Starting BoostCore Upgrade");
        console.log("========================================");
        console.log("Upgrader address: ", msg.sender);
        console.log("BoostCore Proxy: ", BOOST_CORE_PROXY);

        // Get current implementation before upgrade
        address currentImpl = Upgrades.getImplementationAddress(BOOST_CORE_PROXY);
        console.log("Current Implementation: ", currentImpl);

        // Get current version
        string memory currentVersion = BoostCore(BOOST_CORE_PROXY).version();
        console.log("Current version: ", currentVersion);

        vm.startBroadcast();

        // Configure upgrade options
        Options memory opts;

        // Skip known safe warnings from Solady contracts
        // These are false positives - Solady's patterns are secure but different from OZ
        opts.unsafeAllow = "constructor,state-variable-immutable";

        // Skip storage checks if you're confident the upgrade is safe
        // Uncomment the line below to skip checks (use with caution!)
        // opts.unsafeSkipStorageCheck = true;

        // If you want to specify a reference contract for validation (optional)
        // This would be the path to the previous version if you have it
        // opts.referenceContract = "contracts/BoostCoreV1.sol:BoostCore";

        Upgrades.upgradeProxy(BOOST_CORE_PROXY, "BoostCore.sol:BoostCore", "", opts);

        vm.stopBroadcast();

        // Verify the upgrade
        address newImpl = Upgrades.getImplementationAddress(BOOST_CORE_PROXY);
        console.log("New Implementation: ", newImpl);
        require(newImpl != currentImpl, "Implementation did not change");

        // Verify contract still works
        string memory newVersion = BoostCore(BOOST_CORE_PROXY).version();
        console.log("New version: ", newVersion);

        BoostCore boostCore = BoostCore(BOOST_CORE_PROXY);
        console.log("Protocol Fee Receiver: ", boostCore.protocolFeeReceiver());
        console.log("Protocol Fee: ", boostCore.protocolFee());
        console.log("Boost Count: ", boostCore.getBoostCount());

        console.log("========================================");
        console.log("Upgrade Completed Successfully!");
        console.log("========================================");
    }
}
