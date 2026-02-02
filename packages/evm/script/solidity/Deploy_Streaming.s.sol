// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {StreamingManager} from "contracts/streaming/StreamingManager.sol";
import {StreamingCampaign} from "contracts/streaming/StreamingCampaign.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

/// @notice Script to deploy StreamingManager and StreamingCampaign contracts
/// @dev Deploys:
///   1. StreamingCampaign implementation (for cloning)
///   2. StreamingManager as UUPS proxy
///   3. Initializes StreamingManager with configuration
///   4. Sets operator for merkle root publishing
contract DeployStreaming is ScriptUtils {
    function run() external {
        console.log("deploying address: ", vm.addr(vm.envUint("DEPLOYER_PRIVATE_KEY")));

        // Load configuration from environment
        address owner = vm.envAddress("STREAMING_OWNER");
        uint256 protocolFeeRaw = vm.envUint("STREAMING_PROTOCOL_FEE");
        require(protocolFeeRaw <= 10000, "Protocol fee exceeds 100% (10000 bps)");
        uint64 protocolFee = uint64(protocolFeeRaw); // basis points (1000 = 10%)
        address protocolFeeReceiver = vm.envAddress("STREAMING_FEE_RECEIVER");
        address operator = vm.envOr("STREAMING_OPERATOR", address(0));

        console.log("Owner: ", owner);
        console.log("Protocol fee: ", protocolFee, " bps");
        console.log("Fee receiver: ", protocolFeeReceiver);
        console.log("Operator: ", operator);

        // Ensure deployments JSON file exists
        _ensureDeploymentsFileExists();

        // Deploy StreamingCampaign implementation
        address campaignImpl = _deployCampaignImplementation();

        // Deploy StreamingManager proxy and initialize
        address managerProxy = _deployManagerProxy(campaignImpl, owner, protocolFee, protocolFeeReceiver);

        // Set operator if provided
        if (operator != address(0)) {
            _setOperator(managerProxy, operator);
        }

        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("StreamingCampaign Implementation: ", campaignImpl);
        console.log("StreamingManager Proxy: ", managerProxy);
        if (operator != address(0)) {
            console.log("Operator set to: ", operator);
        }
    }

    function _ensureDeploymentsFileExists() internal {
        string memory path = _buildJsonDeployPath();
        try vm.readFile(path) returns (string memory) {
            // File exists, nothing to do
        } catch {
            // File doesn't exist, create empty JSON object
            vm.writeJson("{}", path);
        }
    }

    function _deployCampaignImplementation() internal returns (address campaignImpl) {
        bytes memory initCode = type(StreamingCampaign).creationCode;
        campaignImpl = _getCreate2Address(initCode, "");
        console.log("StreamingCampaign Implementation: ", campaignImpl);

        bool isNew = _deploy2(initCode, "");
        if (isNew) {
            console.log("  -> Deployed new implementation");
        }

        // Write to deploys JSON (merges with existing)
        vm.writeJson(vm.toString(campaignImpl), _buildJsonDeployPath(), ".StreamingCampaign");
    }

    function _deployManagerProxy(
        address campaignImpl,
        address owner,
        uint64 protocolFee,
        address protocolFeeReceiver
    ) internal returns (address managerProxy) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));

        // Deploy StreamingManager implementation
        bytes memory implInitCode = type(StreamingManager).creationCode;
        address managerImpl = _getCreate2Address(implInitCode, "");
        console.log("StreamingManager Implementation: ", managerImpl);

        bool isNewImpl = _deploy2(implInitCode, "");
        if (isNewImpl) {
            console.log("  -> Deployed new implementation");
        }

        // Implementation address logged but not saved - only the proxy matters

        // Deploy ERC1967 proxy pointing to implementation
        managerProxy = LibClone.predictDeterministicAddressERC1967(managerImpl, salt, CREATE2_FACTORY);
        console.log("StreamingManager Proxy: ", managerProxy);

        // Check if proxy already deployed
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(managerProxy)
        }

        if (codeSize == 0) {
            // Deploy proxy
            vm.broadcast();
            managerProxy = LibClone.deployDeterministicERC1967(managerImpl, salt);
            console.log("  -> Deployed new proxy");

            // Initialize
            vm.broadcast();
            StreamingManager(managerProxy).initialize(owner, campaignImpl, protocolFee, protocolFeeReceiver);
            console.log("  -> Initialized with owner: ", owner);
        } else {
            console.log("  -> Proxy already deployed");
        }

        // Write to deploys JSON (merges with existing)
        vm.writeJson(vm.toString(managerProxy), _buildJsonDeployPath(), ".StreamingManager");
    }

    function _setOperator(address managerProxy, address operator) internal {
        StreamingManager manager = StreamingManager(managerProxy);

        // Only set if different from current
        if (manager.operator() != operator) {
            vm.broadcast();
            manager.setOperator(operator);
            console.log("Operator set to: ", operator);
        } else {
            console.log("Operator already set to: ", operator);
        }
    }

}
