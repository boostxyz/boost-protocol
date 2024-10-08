// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

/// @title RBAC Functionality
/// @notice A minimal )
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
contract RBAC is OwnableRoles {
    /// @notice The role for managing allocations to Incentives.
    uint256 public constant MANAGER_ROLE = _ROLE_0;
    /// @notice The role for depositing, withdrawal, and manager management
    uint256 public constant ADMIN_ROLE = _ROLE_1;

    /// @notice A modifier that allows only authorized addresses to call the function
    modifier onlyAuthorized() {
        if (!isAuthorized(msg.sender)) revert BoostError.Unauthorized();
        _;
    }

    /// @notice Check if the given account has any level of access to modify permissions on the resource
    /// @param account_ The account to check
    /// @return True if the account is authorized
    /// @dev The mechanism for checking authorization is left to the implementing contract
    function isAuthorized(address account_) public view virtual returns (bool) {
        return owner() == account_ || hasAnyRole(account_, MANAGER_ROLE | ADMIN_ROLE);
    }

    /// @notice Set roles for accounts authoried to use the resource as managers
    /// @param accounts_ The accounts to grant or revoke the MANAGER_ROLE by index
    /// @param authorized_ Whether to grant or revoke the MANAGER_ROLE
    function setAuthorized(address[] calldata accounts_, bool[] calldata authorized_)
        external
        virtual
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (accounts_.length != authorized_.length) {
            revert BoostError.LengthMismatch();
        }
        for (uint256 i = 0; i < accounts_.length; i++) {
            bool authorization = authorized_[i];
            if (authorization == true) {
                _grantRoles(accounts_[i], MANAGER_ROLE);
            } else {
                _removeRoles(accounts_[i], MANAGER_ROLE);
            }
        }
    }

    /// @notice Set roles for accounts authorized to use the resource
    /// @param accounts_ The accounts to assign the corresponding role by index
    /// @param roles_ The roles to assign
    function grantRoles(address[] calldata accounts_, uint256[] calldata roles_)
        external
        virtual
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (accounts_.length != roles_.length) {
            revert BoostError.LengthMismatch();
        }
        for (uint256 i = 0; i < accounts_.length; i++) {
            _grantRoles(accounts_[i], roles_[i]);
        }
    }

    /// @notice Revoke roles for accounts authorized to use the resource
    /// @param accounts_ The accounts to assign the corresponding role by index
    /// @param roles_ The roles to remove
    function revokeRoles(address[] calldata accounts_, uint256[] calldata roles_)
        external
        virtual
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (accounts_.length != roles_.length) {
            revert BoostError.LengthMismatch();
        }
        for (uint256 i = 0; i < accounts_.length; i++) {
            _removeRoles(accounts_[i], roles_[i]);
        }
    }
}
