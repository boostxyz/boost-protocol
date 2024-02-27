// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

library BoostError {
    /// @notice Thrown when there are insufficient funds for an operation
    error InsufficientFunds(address asset, uint256 available, uint256 required);

    /// @notice Thrown when the length of two arrays are not equal
    error LengthMismatch();

    /// @notice Thrown when a previously used signature is replayed
    error Replayed(address signer, bytes32 hash, bytes signature);

    /// @notice Thrown when a transfer fails for an unknown reason
    error TransferFailed(address asset, address to, uint256 amount);

    /// @notice Thrown when the requested action is unauthorized
    error Unauthorized();
}
