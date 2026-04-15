// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {BoostForwarder} from "contracts/timebased/BoostForwarder.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

/// @notice Script to deploy BoostForwarder as a UUPS proxy
/// @dev Deploys:
///   1. BoostForwarder implementation via CREATE2
///   2. ERC1967 proxy via CREATE2
///   3. Initializes with deployer as temporary owner
///   4. Approves initial targets
///   5. Transfers ownership to final owner
contract DeployBoostForwarder is ScriptUtils {
    function run() external {
        console.log("deploying address: ", vm.addr(vm.envUint("DEPLOYER_PRIVATE_KEY")));

        // Load configuration from environment
        address owner = vm.envAddress("FORWARDER_OWNER");
        console.log("Owner: ", owner);

        // Ensure deployments JSON file exists
        _ensureDeploymentsFileExists();

        // Deploy BoostForwarder proxy
        address forwarderProxy = _deployForwarderProxy(owner);

        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("BoostForwarder Proxy: ", forwarderProxy);
    }

    function _ensureDeploymentsFileExists() internal {
        string memory path = _buildJsonDeployPath();
        try vm.readFile(path) returns (
            string memory
        ) {
        // File exists, nothing to do
        }
        catch {
            // File doesn't exist, create empty JSON object
            vm.writeJson("{}", path);
        }
    }

    function _deployForwarderProxy(address owner) internal returns (address forwarderProxy) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));

        // Deploy BoostForwarder implementation
        bytes memory implInitCode = type(BoostForwarder).creationCode;
        address forwarderImpl = _getCreate2Address(implInitCode, "");
        console.log("BoostForwarder Implementation: ", forwarderImpl);

        if (_deploy2(implInitCode, "")) {
            console.log("  -> Deployed new implementation");
        }

        // Deploy ERC1967 proxy via CREATE2_FACTORY
        forwarderProxy = LibClone.predictDeterministicAddressERC1967(forwarderImpl, salt, CREATE2_FACTORY);
        console.log("BoostForwarder Proxy: ", forwarderProxy);

        uint256 codeSize;
        assembly {
            codeSize := extcodesize(forwarderProxy)
        }

        if (codeSize == 0) {
            bytes memory payload = abi.encodePacked(salt, LibClone.initCodeERC1967(forwarderImpl));
            vm.broadcast();
            (bool success,) = CREATE2_FACTORY.call(payload);
            require(success, "ERC1967 proxy CREATE2 deploy failed");
            console.log("  -> Deployed new proxy");

            _configureForwarder(forwarderProxy, owner);
        } else {
            console.log("  -> Proxy already deployed");

            // Sanity check: on-chain owner matches expected
            address currentOwner = BoostForwarder(forwarderProxy).owner();
            require(currentOwner == owner, "Existing forwarder owner != FORWARDER_OWNER");
        }

        vm.writeJson(vm.toString(forwarderProxy), _buildJsonDeployPath(), ".BoostForwarder");
    }

    function _configureForwarder(address forwarderProxy, address owner) internal {
        address deployer = vm.addr(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // Initialize with deployer as temporary owner so we can configure before transferring
        vm.broadcast();
        BoostForwarder(forwarderProxy).initialize(deployer);
        console.log("  -> Initialized");

        // Transfer ownership to the intended owner
        if (owner != deployer) {
            vm.broadcast();
            BoostForwarder(forwarderProxy).transferOwnership(owner);
            console.log("  -> Ownership transferred to: ", owner);
        }
    }
}
