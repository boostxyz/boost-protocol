// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IAuth} from "contracts/auth/IAuth.sol";
/// @title Passthrough Authorization Contract
/// @dev Implements the IAuth interface, always authorizing access.

contract PassthroughAuth is IAuth {
    /// @notice Checks if an address is authorized
    /// @dev In this implementation, all addresses are authorized.
    /// @param user The address to check for authorization
    /// @return bool Always returns true, indicating any address is authorized
    function isAuthorized(address user) public view override returns (bool) {
        return true;
    }
}
