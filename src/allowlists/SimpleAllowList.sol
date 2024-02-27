// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {AllowList} from "./AllowList.sol";

/// @title Simple AllowList
/// @notice A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
contract SimpleAllowList is AllowList {
    error LengthMismatch();

    mapping(address => bool) private _allowed;

    /// @notice Check if a user is authorized
    /// @param user_ The address of the user
    /// @param - The data payload for the authorization check, not used in this implementation
    /// @return True if the user is authorized
    function isAllowed(address user_, bytes calldata /* data_ - unused */ ) external view override returns (bool) {
        return _allowed[user_];
    }

    /// @notice Set the allowed status of a user
    /// @param users_ The list of users to update
    /// @param allowed_ The allowed status of each user
    function setAllowed(address[] calldata users_, bool[] calldata allowed_) external onlyOwner {
        if (users_.length != allowed_.length) {
            revert LengthMismatch();
        }

        for (uint256 i = 0; i < users_.length; i++) {
            _allowed[users_[i]] = allowed_[i];
        }
    }
}
