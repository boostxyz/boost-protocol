// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostRegistry} from "contracts/BoostRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

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

        // Deploy BoostCore implementation with CREATE2
        address implementation = _deployBoostCoreImplementation();

        // Deploy ERC1967Proxy with CREATE2
        core = _deployBoostCoreProxy(implementation, registry, owner);
    }

    function _deployBoostCoreImplementation()
        internal
        returns (address implementation)
    {
        // BoostCore constructor is empty due to upgradeable pattern
        bytes memory implCreationCode = type(BoostCore).creationCode;
        bytes memory implConstructorArgs = "";

        implementation = _getCreate2Address(
            implCreationCode,
            implConstructorArgs
        );
        console.log("BoostCore Implementation: ", implementation);
        _deploy2(implCreationCode, implConstructorArgs);

        return implementation;
    }

    function _deployBoostCoreProxy(
        address implementation,
        address registry,
        address owner
    ) internal returns (address proxy) {
        // Prepare initialization data for the proxy
        bytes memory initData = abi.encodeWithSignature(
            "initialize(address,address,address)",
            registry,
            BOOST_FEE_RECIPIENT,
            owner
        );

        // Deploy proxy with CREATE2 using "proxy" salt
        bytes memory proxyCreationCode = type(ERC1967Proxy).creationCode;
        bytes memory proxyConstructorArgs = abi.encode(
            implementation,
            initData
        );

        proxy = _getCreate2Address(proxyCreationCode, proxyConstructorArgs);
        console.log("BoostCore Proxy: ", proxy);
        _deploy2(proxyCreationCode, proxyConstructorArgs);

        return proxy;
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
