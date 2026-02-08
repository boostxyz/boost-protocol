// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import "./Util.s.sol";

import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

/// @notice Script to deploy TimeBasedIncentiveManager and TimeBasedIncentiveCampaign contracts
/// @dev Deploys:
///   1. TimeBasedIncentiveCampaign implementation (for cloning)
///   2. TimeBasedIncentiveManager as UUPS proxy
///   3. Initializes TimeBasedIncentiveManager with configuration
///   4. Sets operator for merkle root publishing
contract DeployTimeBased is ScriptUtils {
    function run() external {
        console.log("deploying address: ", vm.addr(vm.envUint("DEPLOYER_PRIVATE_KEY")));

        // Load configuration from environment
        address owner = vm.envAddress("TIMEBASED_OWNER");
        uint256 protocolFeeRaw = vm.envUint("TIMEBASED_PROTOCOL_FEE");
        require(protocolFeeRaw <= 10000, "Protocol fee exceeds 100% (10000 bps)");
        uint64 protocolFee = uint64(protocolFeeRaw); // basis points (1000 = 10%)
        address protocolFeeReceiver = vm.envAddress("TIMEBASED_FEE_RECEIVER");
        address operator = vm.envOr("TIMEBASED_OPERATOR", address(0));

        console.log("Owner: ", owner);
        console.log("Protocol fee: ", protocolFee, " bps");
        console.log("Fee receiver: ", protocolFeeReceiver);
        console.log("Operator: ", operator);

        // Ensure deployments JSON file exists
        _ensureDeploymentsFileExists();

        // Deploy TimeBasedIncentiveCampaign implementation
        address campaignImpl = _deployCampaignImplementation();

        // Deploy TimeBasedIncentiveManager proxy, initialize, and configure
        address managerProxy =
            _deployManagerProxy(campaignImpl, owner, protocolFee, protocolFeeReceiver, operator);

        console.log("");
        console.log("=== Deployment Summary ===");
        console.log("TimeBasedIncentiveCampaign Implementation: ", campaignImpl);
        console.log("TimeBasedIncentiveManager Proxy: ", managerProxy);
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
        bytes memory initCode = type(TimeBasedIncentiveCampaign).creationCode;
        campaignImpl = _getCreate2Address(initCode, "");
        console.log("TimeBasedIncentiveCampaign Implementation: ", campaignImpl);

        bool isNew = _deploy2(initCode, "");
        if (isNew) {
            console.log("  -> Deployed new implementation");
        }

        // Write to deploys JSON (merges with existing)
        vm.writeJson(vm.toString(campaignImpl), _buildJsonDeployPath(), ".TimeBasedIncentiveCampaign");
    }

    function _deployManagerProxy(
        address campaignImpl,
        address owner,
        uint64 protocolFee,
        address protocolFeeReceiver,
        address operator
    ) internal returns (address managerProxy) {
        bytes32 salt = keccak256(bytes(vm.envString("BOOST_DEPLOYMENT_SALT")));

        // Deploy TimeBasedIncentiveManager implementation
        bytes memory implInitCode = type(TimeBasedIncentiveManager).creationCode;
        address managerImpl = _getCreate2Address(implInitCode, "");
        console.log("TimeBasedIncentiveManager Implementation: ", managerImpl);

        if (_deploy2(implInitCode, "")) {
            console.log("  -> Deployed new implementation");
        }

        // Deploy ERC1967 proxy via CREATE2_FACTORY
        managerProxy = LibClone.predictDeterministicAddressERC1967(managerImpl, salt, CREATE2_FACTORY);
        console.log("TimeBasedIncentiveManager Proxy: ", managerProxy);

        uint256 codeSize;
        assembly {
            codeSize := extcodesize(managerProxy)
        }

        if (codeSize == 0) {
            bytes memory payload = abi.encodePacked(salt, LibClone.initCodeERC1967(managerImpl));
            vm.broadcast();
            (bool success,) = CREATE2_FACTORY.call(payload);
            require(success, "ERC1967 proxy CREATE2 deploy failed");
            console.log("  -> Deployed new proxy");

            _configureManager(managerProxy, campaignImpl, owner, protocolFee, protocolFeeReceiver, operator);
        } else {
            console.log("  -> Proxy already deployed");
        }

        vm.writeJson(vm.toString(managerProxy), _buildJsonDeployPath(), ".TimeBasedIncentiveManager");
    }

    function _configureManager(
        address managerProxy,
        address campaignImpl,
        address owner,
        uint64 protocolFee,
        address protocolFeeReceiver,
        address operator
    ) internal {
        address deployer = vm.addr(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        // Initialize with deployer as temporary owner so we can configure before transferring
        vm.broadcast();
        TimeBasedIncentiveManager(managerProxy).initialize(
            deployer, campaignImpl, protocolFee, protocolFeeReceiver
        );
        console.log("  -> Initialized");

        // Set operator while deployer is still owner
        if (operator != address(0)) {
            vm.broadcast();
            TimeBasedIncentiveManager(managerProxy).setOperator(operator);
            console.log("  -> Operator set to: ", operator);
        }

        // Transfer ownership to the intended owner
        if (owner != deployer) {
            vm.broadcast();
            TimeBasedIncentiveManager(managerProxy).transferOwnership(owner);
            console.log("  -> Ownership transferred to: ", owner);
        }
    }

}
