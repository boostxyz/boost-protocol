// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {AllowList} from "contracts/allowlists/AllowList.sol";

/// @title SimpleDenyList
/// @notice A simple implementation of an AllowList that implicitly allows all addresses except those explicitly added to the deny list
abstract contract ASimpleDenyList is AllowList {
    /// @dev An internal mapping of denied statuses
    mapping(address => bool) internal _denied;

    /// @notice Check if a user is authorized (i.e. not denied)
    /// @param user_ The address of the user
    /// @param - The data payload for the authorization check, not used in this implementation
    /// @return True if the user is authorized
    function isAllowed(address user_, bytes calldata /* data_ - unused */ ) external view override returns (bool) {
        return !_denied[user_];
    }

    /// @notice Set the denied status of a user
    /// @param users_ The list of users to update
    /// @param denied_ The denied status of each user
    /// @dev The length of the `users_` and `denied_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setDenied(address[] calldata users_, bool[] calldata denied_) external onlyOwner {
        if (users_.length != denied_.length) revert BoostError.LengthMismatch();

        for (uint256 i = 0; i < users_.length; i++) {
            _denied[users_[i]] = denied_[i];
        }
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(AllowList) returns (bytes4) {
        return type(ASimpleDenyList).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AllowList) returns (bool) {
        return interfaceId == type(ASimpleDenyList).interfaceId || super.supportsInterface(interfaceId);
    }
}
