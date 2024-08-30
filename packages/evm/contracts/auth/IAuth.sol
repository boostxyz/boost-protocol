// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

/// @title IAuth Interface
/// @dev Interface for authorization contracts.
interface IAuth {
    /// @notice Checks if an address is authorized
    /// @param addr The address to check for authorization
    /// @return bool Returns true if the address is authorized, false otherwise
    function isAuthorized(address addr) external view returns (bool);
}
