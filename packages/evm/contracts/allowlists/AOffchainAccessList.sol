// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAllowList} from "contracts/allowlists/AAllowList.sol";

/// @title AOffchainAccessList
/// @notice Abstract contract for linking on-chain boosts to off-chain access lists
/// @dev This contract defines the interface for storing references to off-chain allowlists and denylists
abstract contract AOffchainAccessList is AAllowList {
    /// @notice Get all allowlist IDs
    /// @return The array of allowlist IDs
    function getAllowListIds() external view virtual returns (string[] memory);

    /// @notice Get all denylist IDs
    /// @return The array of denylist IDs
    function getDenyListIds() external view virtual returns (string[] memory);

    /// @notice Set new allowlist IDs. This will replace the existing allowlist IDs.
    /// @param ids_ The new array of allowlist IDs
    function setAllowListIds(string[] calldata ids_) external virtual;

    /// @notice Set new denylist IDs. This will replace the existing denylist IDs.
    /// @param ids_ The new array of denylist IDs
    function setDenyListIds(string[] calldata ids_) external virtual;

    /// @notice Add a new allowlist ID to the end of the allowlist IDs array.
    /// @param id_ The allowlist ID to add
    function addAllowListId(string calldata id_) external virtual;

    /// @notice Add a new denylist ID to the end of the denylist IDs array.
    /// @param id_ The denylist ID to add
    function addDenyListId(string calldata id_) external virtual;

    /// @notice Remove an allowlist ID from the allowlist IDs array.
    /// @param id_ The allowlist ID to remove
    function removeAllowListId(string calldata id_) external virtual;

    /// @notice Remove a denylist ID from the denylist IDs array.
    /// @param id_ The denylist ID to remove
    function removeDenyListId(string calldata id_) external virtual;

    /// @notice Check if an allowlist ID exists in the array
    /// @param id_ The allowlist ID to check
    /// @return True if the ID exists
    function hasAllowListId(string calldata id_) external view virtual returns (bool);

    /// @notice Check if a denylist ID exists in the array
    /// @param id_ The denylist ID to check
    /// @return True if the ID exists
    function hasDenyListId(string calldata id_) external view virtual returns (bool);

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AOffchainAccessList).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(AOffchainAccessList).interfaceId || super.supportsInterface(interfaceId);
    }
}
