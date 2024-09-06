// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAllowList} from "contracts/allowlists/AAllowList.sol";

/// @title Simple AllowList
/// @notice A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
abstract contract ASimpleAllowList is AAllowList {
    /// @notice The role for managing the allow list
    uint256 public constant LIST_MANAGER_ROLE = 1 << 1;

    /// @notice Set the allowed status of a user
    /// @param users_ The list of users to update
    /// @param allowed_ The allowed status of each user
    /// @dev The length of the `users_` and `allowed_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setAllowed(address[] calldata users_, bool[] calldata allowed_) external virtual;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(ASimpleAllowList).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AAllowList) returns (bool) {
        return interfaceId == type(ASimpleAllowList).interfaceId || super.supportsInterface(interfaceId);
    }
}
