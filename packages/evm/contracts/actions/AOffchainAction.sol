// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AAction} from "contracts/actions/AAction.sol";
import {AValidator} from "contracts/validators/AValidator.sol";

/// @title Abstract Offchain Action
/// @notice Base contract for actions that validate offchain activities
/// @dev This action type is designed for validating actions that occur outside the blockchain
abstract contract AOffchainAction is AAction {
    /// @notice Configuration for offchain action validation
    struct OffchainConfig {
        string actionType; // Type identifier for the offchain action (e.g., "twitter_follow", "github_star")
        string[] requiredFields; // List of required fields for validation
        string validationSchema; // JSON schema or validation rules
    }

    /// @notice The configuration for this offchain action
    OffchainConfig public config;

    /// @notice Get the offchain action configuration
    /// @return The current configuration
    function getConfig() external view returns (OffchainConfig memory) {
        return config;
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AOffchainAction).interfaceId;
    }

    /// @inheritdoc AAction
    function supportsInterface(bytes4 interfaceId) public view virtual override(AAction) returns (bool) {
        return interfaceId == type(AOffchainAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
