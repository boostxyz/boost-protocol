// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {BoostCore} from "contracts/BoostCore.sol";

/**
 * @title UpgradeBoostCore
 * @notice Script to deploy a new implementation contract and upgrade the BoostCore proxy
 * @dev Please run: `forge script script/solidity/ValidateBoostCoreUpgrade.s.sol` before upgrading
 */
contract UpgradeBoostCore is ScriptUtils {
    function run() public {
        address BOOST_CORE_PROXY = vm.envAddress("BOOST_CORE_PROXY");
        BoostCore boostCore = BoostCore(BOOST_CORE_PROXY);

        console.log("========================================");
        console.log("Starting BoostCore Upgrade");
        console.log("========================================");
        console.log("Upgrader address: ", msg.sender);
        console.log("BoostCore Proxy: ", BOOST_CORE_PROXY);

        // Get current implementation before upgrade
        address currentImpl = Upgrades.getImplementationAddress(
            BOOST_CORE_PROXY
        );
        console.log("Current Implementation: ", currentImpl);

        // Get current version
        string memory currentVersion = boostCore.version();
        console.log("Current version: ", currentVersion);

        address newImpl = _deployImplementation();
        vm.broadcast();
        boostCore.upgradeToAndCall(newImpl, "");

        // Verify the upgrade
        console.log("New Implementation: ", newImpl);
        require(newImpl != currentImpl, "Implementation did not change");

        // Verify contract still works
        string memory newVersion = boostCore.version();
        console.log("New version: ", newVersion);

        console.log("Protocol Fee Receiver: ", boostCore.protocolFeeReceiver());
        console.log("Protocol Fee: ", boostCore.protocolFee());
        console.log("Boost Count: ", boostCore.getBoostCount());

        console.log("========================================");
        console.log("Upgrade Completed Successfully!");
        console.log("========================================");
    }

    function _deployImplementation() internal returns (address impl) {
        bytes memory initCode = type(BoostCore).creationCode;
        impl = _getCreate2Address(initCode, "");
        _deploy2(initCode, "");
    }
}
