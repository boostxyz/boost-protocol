// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";

contract Deployer is Script {

  address BOOST_FEE_RECIPIENT;

  function setUp() external {
    BOOST_FEE_RECIPIENT = vm.envAddress("BOOST_FEE_RECIPIENT");
  }

  function run() public {
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
    bytes memory initCode = type(BoostCore).creationCode;
    bytes memory constructorArgs = abi.encode(registry, BOOST_FEE_RECIPIENT);
    core = _getCreate2Address(initCode, constructorArgs);
    console.log("BoostCore: ", core);
    _deploy2(initCode, constructorArgs);
  }

	function _getCreate2Address(
		bytes memory creationCode,
		bytes memory args
	) internal view returns (address) {
		bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
		bytes32 codeHash = hashInitCode(creationCode, args);
		return vm.computeCreate2Address(salt, codeHash);
	}

	function _deploy2(
		bytes memory deployCode,
		bytes memory args
	) internal {
		bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
		bytes memory payload = abi.encodePacked(salt, deployCode, args);
    // deploy using address configured at the CLI level
		vm.broadcast();
		(bool success, ) = CREATE2_FACTORY.call(payload);
		if (!success) revert("create2 failed");
	}

  function _saveDeployments(address registry, address core) internal {
    string memory deployKey = "deployments";
    
    vm.serializeAddress(deployKey, "BoostRegistry", registry);
    string memory finalJson = vm.serializeAddress(deployKey, "BoostCore", core);
		vm.writeJson(
			finalJson,
			string(
				abi.encodePacked(
					vm.projectRoot(),
					"/deploys/",
					vm.toString(block.chainid),
					".json"
				)
			)
		);
  }

}

