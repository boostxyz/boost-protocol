// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

contract ScriptUtils is Script {
    using stdJson for string;

    function _getCreate2Address(bytes memory creationCode, bytes memory args) internal view returns (address) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        bytes32 codeHash = hashInitCode(creationCode, args);
        return vm.computeCreate2Address(salt, codeHash);
    }

    function _deploy2(bytes memory deployCode, bytes memory args) internal {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        bytes memory payload = abi.encodePacked(salt, deployCode, args);
        // deploy using address configured at the CLI level
        vm.broadcast();
        (bool success,) = CREATE2_FACTORY.call(payload);
        if (!success) revert("create2 failed");
    }

    function _buildJsonDeployPath() internal view returns (string memory) {
        return string(abi.encodePacked(vm.projectRoot(), "/deploys/", vm.toString(block.chainid), ".json"));
    }
}
