// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

contract ScriptUtils is Script {
    using stdJson for string;

    function _getCreate2Address(bytes memory creationCode, bytes memory args) internal view returns (address) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        bytes32 codeHash = hashInitCode(creationCode, args);
        return vm.computeCreate2Address(salt, codeHash);
    }

    function _deploy2(bytes memory deployCode, bytes memory args) internal returns (bool) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        bytes32 bytecodeHash = keccak256(abi.encodePacked(deployCode, args));
        address computedAddress = address(uint160(uint256(keccak256(abi.encodePacked(
            bytes1(0xff),
            CREATE2_FACTORY,
            salt,
            bytecodeHash
        )))));

        // Check if the address already has code deployed
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(computedAddress)
        }

        if (codeSize == 0) {
            bytes memory payload = abi.encodePacked(salt, deployCode, args);
            // deploy using address configured at the CLI level
            vm.broadcast();
            (bool success,) = CREATE2_FACTORY.call(payload);
            if (!success) revert("create2 failed");
            return true;
        } else {
            console.log("Address already deployed at: ", computedAddress);
            return false;
        }
    }

    function _clone2(ACloneable base) internal returns (bool) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        address computedAddress = LibClone.predictDeterministicAddress(address(base), salt, CREATE2_FACTORY);

        // Check if the address already has code deployed
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(computedAddress)
        }

        if (codeSize == 0) {
            bytes memory deployCode = LibClone.initCode(address(base));
            bytes memory payload = abi.encodePacked(salt, deployCode);
            // deploy using address configured at the CLI level
            vm.broadcast();
            (bool success,) = CREATE2_FACTORY.call(payload);
            if (!success) revert("create2 failed");
            return true;
        } else {
            console.log("Address already deployed at: ", computedAddress);
            return false;
        }
    }

    function _getDeterministicCloneAddress(ACloneable base) internal view returns(address) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        return LibClone.predictDeterministicAddress(address(base), salt, CREATE2_FACTORY);

    }

    function _buildJsonDeployPath() internal view virtual returns (string memory) {
        return string(abi.encodePacked(vm.projectRoot(), "/deploys/", vm.toString(block.chainid), ".json"));
    }

    function _registerIfNew(bool isNew, string memory contractName, address deployedAddress, BoostRegistry registry, BoostRegistry.RegistryType registryType) internal {
        if(isNew) {
            vm.broadcast();
            registry.register(registryType, contractName, deployedAddress);
        }
    }
}
