// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

/// @title Boost Validator
/// @notice Abstract contract for a generic Validator within the Boost protocol
/// @dev Validator classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Validator {
    /// @notice Validate that the action has been completed successfully
    /// @param data_ The data payload for the validation check
    /// @return True if the action has been validated based on the data payload
    function validate(
        bytes calldata data_
    ) external view virtual returns (bool);
}
