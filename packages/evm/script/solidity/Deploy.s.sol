// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

contract CoreDeployer is ScriptUtils {
    address BOOST_FEE_RECIPIENT;

    function setUp() external {
        BOOST_FEE_RECIPIENT = vm.envAddress("BOOST_FEE_RECIPIENT");
    }

    function run() public {
        console.log(
            "deploying address: ",
            vm.addr(vm.envUint("SIGNER_PRIVATE_KEY"))
        );
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
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));
        bytes memory initCode = type(BoostCore).creationCode;
        address impl = _getCreate2Address(initCode, "");
        core = LibClone.deployDeterministicERC1967(impl, salt);
        BoostCore(core).initialize(
            BoostRegistry(registry),
            BOOST_FEE_RECIPIENT,
            owner
        );
        console.log("BoostCore Proxy: ", core);
        console.log("BoostCore Implementation: ", impl);
    }

    function _saveDeployments(address registry, address core) internal {
        string memory deployKey = "deployments";

        vm.serializeAddress(deployKey, "BoostRegistry", registry);
        string memory finalJson = vm.serializeAddress(
            deployKey,
            "BoostCore",
            core
        );
        vm.writeJson(finalJson, _buildJsonDeployPath());
    }
}
