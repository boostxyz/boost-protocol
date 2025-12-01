// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {ManagedBudgetWithFeesV2Factory} from "contracts/budgets/ManagedBudgetWithFeesV2Factory.sol";

/// @notice Script to deploy the ManagedBudgetWithFeesV2Factory contract
contract DeployManagedBudgetWithFeesV2Factory is ScriptUtils {
    using stdJson for string;

    string constant deployJsonKey = "deployJsonKey";
    string deployJson;

    function run() external {
        console.log(
            "deploying address: ",
            vm.addr(vm.envUint("SIGNER_PRIVATE_KEY"))
        );

        address implementation = _getImplementation();
        console.log("ManagedBudgetWithFeesV2 implementation: ", implementation);

        _deployFactory(implementation, vm.addr(vm.envUint("SIGNER_PRIVATE_KEY")));

        _saveJson();
    }

    function _saveJson() internal {
        vm.writeJson(deployJson, _buildJsonDeployPath());
    }

    function _getImplementation() internal returns (address) {
        string memory path = string(
            abi.encodePacked(
                vm.projectRoot(),
                "/deploys/",
                vm.toString(block.chainid),
                ".json"
            )
        );
        deployJson = vm.readFile(path);
        deployJson = deployJsonKey.serialize(deployJson);

        // The ManagedBudgetWithFeesV2 is registered as "ManagedBudgetWithFees" in Deploy_Modules.s.sol
        if (!vm.keyExistsJson(deployJson, ".ManagedBudgetWithFees")) {
            revert("ManagedBudgetWithFees not deployed: run `pnpm deploy:modules` first");
        }
        return deployJson.readAddress(".ManagedBudgetWithFees");
    }

    function _deployFactory(
        address implementation,
        address owner
    ) internal returns (address factory) {
        bytes memory initCode = abi.encodePacked(
            type(ManagedBudgetWithFeesV2Factory).creationCode,
            abi.encode(implementation, owner)
        );
        factory = _getCreate2Address(initCode, "");
        console.log("ManagedBudgetWithFeesV2Factory: ", factory);
        deployJson = deployJsonKey.serialize(
            "ManagedBudgetWithFeesV2Factory",
            factory
        );
        _deploy2(initCode, "");
    }
}
