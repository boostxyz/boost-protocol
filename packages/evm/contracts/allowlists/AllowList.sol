// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";

/// @title Boost AllowList
/// @notice Abstract contract for a generic Allow List within the Boost protocol
/// @dev Allow List classes are expected to implement the authorization of users based on implementation-specific criteria, which may involve validation of a data payload. If no data is required, calldata should be empty.
abstract contract AllowList is Ownable, Cloneable {
    /// @notice Constructor to initialize the owner
    constructor() {
        _initializeOwner(msg.sender);
    }
    
    /// @notice Check if a user is authorized
    /// @param user_ The address of the user
    /// @param data_ The data payload for the authorization check, if applicable
    /// @return True if the user is authorized
    function isAllowed(address user_, bytes calldata data_) external view virtual returns (bool);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(AllowList).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @notice Set the allowed status of a user
    /// @param users_ The list of users to update
    /// @param allowed_ The allowed status of each user
    /// @dev The length of the `users_` and `allowed_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setAllowed(address[] calldata users_, bool[] calldata allowed_) external virtual;


    /// @notice Set the denied status of a user
    /// @param users_ The list of users to update
    /// @param denied_ The denied status of each user
    /// @dev The length of the `users_` and `denied_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setDenied(address[] calldata users_, bool[] calldata denied_) external virtual;

    function getComponentInterface() public pure virtual returns (bytes4) {
        return type(AllowList).interfaceId;
    } 
}
