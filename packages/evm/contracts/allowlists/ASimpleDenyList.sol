// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAllowList} from "contracts/allowlists/AAllowList.sol";

/// @title ASimpleDenyList
/// @notice A simple implementation of an AllowList that implicitly allows all addresses except those explicitly added to the deny list
abstract contract ASimpleDenyList is AAllowList {
    /// @notice Set the denied status of a user
    /// @param users_ The list of users to update
    /// @param denied_ The denied status of each user
    /// @dev The length of the `users_` and `denied_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setDenied(address[] calldata users_, bool[] calldata denied_) external virtual;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(ASimpleDenyList).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AAllowList) returns (bool) {
        return interfaceId == type(ASimpleDenyList).interfaceId || super.supportsInterface(interfaceId);
    }
}
