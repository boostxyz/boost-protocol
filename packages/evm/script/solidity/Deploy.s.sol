// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";

contract CoreDeployer is ScriptUtils {
    address BOOST_FEE_RECIPIENT;

    function setUp() external {
        BOOST_FEE_RECIPIENT = vm.envAddress("BOOST_FEE_RECIPIENT");
    }

    function run() public {
        console.log("deploying address: ", vm.addr(vm.envUint("SIGNER_PRIVATE_KEY")));
        // 1. Deploy Boost registry
        address registry = _deployRegistry();
        address core = _deployCore(registry);
        _saveDeployments(registry, core);
    }

    function _deployRegistry() internal returns (address registry) {
        bytes memory initCode = type(BoostRegistry).creationCode;
        registry = _getCreate2Address(initCode, "");
        console.log("BoostRegistry: ", registry);
        _deploy2(initCode, "");
    }

    function _deployCore(address registry) internal returns (address core) {
        address owner = vm.envAddress("BOOST_CORE_OWNER_ADDRESS");
        bytes memory initCode = type(BoostCore).creationCode;
        bytes memory constructorArgs = abi.encode(registry, BOOST_FEE_RECIPIENT, owner);
        core = _getCreate2Address(initCode, constructorArgs);
        console.log("BoostCore: ", core);
        _deploy2(initCode, constructorArgs);
    }

    function _saveDeployments(address registry, address core) internal {
        string memory deployKey = "deployments";

        vm.serializeAddress(deployKey, "BoostRegistry", registry);
        string memory finalJson = vm.serializeAddress(deployKey, "BoostCore", core);
        vm.writeJson(finalJson, _buildJsonDeployPath());
    }
}
