// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {AOffchainAccessList} from "contracts/allowlists/AOffchainAccessList.sol";

/// @title OffchainAccessList
/// @notice A module for linking on-chain boosts to off-chain access lists stored in a database
/// @dev This contract does not perform actual access control - it only stores references to off-chain lists
contract OffchainAccessList is AOffchainAccessList {
    /// @notice Array of off-chain allowlist IDs
    string[] public allowlistIds;

    /// @notice Array of off-chain denylist IDs
    string[] public denylistIds;

    /// @notice Thrown when an offchain access list ID is not found
    error AccessListIdNotFound(string id);

    /// @notice Construct a new OffchainAccessList
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with off-chain list IDs
    /// @param data_ The compressed initialization data `(address owner, string[] allowlistIds, string[] denylistIds)`
    function initialize(bytes calldata data_) public override initializer {
        (address owner_, string[] memory allowlistIds_, string[] memory denylistIds_) =
            abi.decode(data_, (address, string[], string[]));

        // Initialize owner
        _initializeOwner(owner_);

        // Store the off-chain list IDs
        allowlistIds = allowlistIds_;
        denylistIds = denylistIds_;
    }

    /// @notice Always returns true as access control is handled off-chain
    /// @dev This maintains compatibility with BoostCore's claimIncentiveFor function
    /// @return Always returns true
    function isAllowed(address, bytes calldata) external pure override returns (bool) {
        return true;
    }

    /// @notice Get all allowlist IDs
    /// @return The array of allowlist IDs
    function getAllowListIds() external view override returns (string[] memory) {
        return allowlistIds;
    }

    /// @notice Get all denylist IDs
    /// @return The array of denylist IDs
    function getDenyListIds() external view override returns (string[] memory) {
        return denylistIds;
    }

    /// @notice Set new allowlist IDs. This will replace the existing allowlist IDs.
    /// @param ids_ The new array of allowlist IDs
    /// @dev Can only be called by owner or admin
    function setAllowListIds(string[] calldata ids_) external override onlyAuthorized {
        delete allowlistIds;
        for (uint256 i = 0; i < ids_.length; i++) {
            allowlistIds.push(ids_[i]);
        }
    }

    /// @notice Set new denylist IDs. This will replace the existing denylist IDs.
    /// @param ids_ The new array of denylist IDs
    /// @dev Can only be called by owner or admin
    function setDenyListIds(string[] calldata ids_) external override onlyAuthorized {
        delete denylistIds;
        for (uint256 i = 0; i < ids_.length; i++) {
            denylistIds.push(ids_[i]);
        }
    }

    /// @notice Add a new allowlist ID to the end of the allowlist IDs array.
    /// @param id_ The allowlist ID to add
    /// @dev Can only be called by owner or admin. Reverts if ID already exists.
    function addAllowListId(string calldata id_) external override onlyAuthorized {
        if (hasAllowListId(id_)) {
            revert("Allowlist ID already exists");
        }
        allowlistIds.push(id_);
    }

    /// @notice Add a new denylist ID to the end of the denylist IDs array.
    /// @param id_ The denylist ID to add
    /// @dev Can only be called by owner or admin. Reverts if ID already exists.
    function addDenyListId(string calldata id_) external override onlyAuthorized {
        if (hasDenyListId(id_)) {
            revert("Denylist ID already exists");
        }
        denylistIds.push(id_);
    }

    /// @notice Remove an allowlist ID from the allowlist IDs array.
    /// @param id_ The allowlist ID to remove
    /// @dev Can only be called by owner or admin. Removes first occurrence if duplicates exist.
    function removeAllowListId(string calldata id_) external override onlyAuthorized {
        for (uint256 i = 0; i < allowlistIds.length; i++) {
            if (keccak256(bytes(allowlistIds[i])) == keccak256(bytes(id_))) {
                allowlistIds[i] = allowlistIds[allowlistIds.length - 1];
                allowlistIds.pop();
                return;
            }
        }
        revert AccessListIdNotFound(id_);
    }

    /// @notice Remove a denylist ID
    /// @param id_ The denylist ID to remove
    /// @dev Can only be called by owner or admin. Removes first occurrence if duplicates exist.
    function removeDenyListId(string calldata id_) external override onlyAuthorized {
        for (uint256 i = 0; i < denylistIds.length; i++) {
            if (keccak256(bytes(denylistIds[i])) == keccak256(bytes(id_))) {
                denylistIds[i] = denylistIds[denylistIds.length - 1];
                denylistIds.pop();
                return;
            }
        }
        revert AccessListIdNotFound(id_);
    }

    /// @notice Check if an allowlist ID exists in the array
    /// @param id_ The allowlist ID to check
    /// @return True if the ID exists
    function hasAllowListId(string calldata id_) public view override returns (bool) {
        for (uint256 i = 0; i < allowlistIds.length; i++) {
            if (keccak256(bytes(allowlistIds[i])) == keccak256(bytes(id_))) {
                return true;
            }
        }
        return false;
    }

    /// @notice Check if a denylist ID exists in the array
    /// @param id_ The denylist ID to check
    /// @return True if the ID exists
    function hasDenyListId(string calldata id_) public view override returns (bool) {
        for (uint256 i = 0; i < denylistIds.length; i++) {
            if (keccak256(bytes(denylistIds[i])) == keccak256(bytes(id_))) {
                return true;
            }
        }
        return false;
    }
}
