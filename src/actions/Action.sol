// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Validator} from "../validators/Validator.sol";

/// @title Boost Action
/// @notice Abstract contract for a generic Action within the Boost protocol
/// @dev Action classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Action {
    /// @notice Emitted when the action is executed by a proxy.
    /// @dev The `data` field should contain the return data from the action, if any.
    event ActionExecuted(
        address indexed executor,
        address caller,
        bool success,
        bytes data
    );

    /// @notice Thrown when the `execute` function is not implemented
    error ExecuteNotImplemented();

    /// @notice Emitted when the action is validated
    /// @dev The `data` field should contain implementation-specific context, if applicable.
    event ActionValidated(address indexed user, bool isValidated, bytes data);

    Validator public immutable VALIDATOR;

    /// @notice Execute the action
    /// @param data_ The data payload for the action
    /// @return (success, data) A tuple of the success status and the returned data
    function execute(
        bytes calldata data_
    ) external payable virtual returns (bool, bytes memory);

    /// @notice Prepare the action for execution and return the expected payload
    /// @param data_ The data payload for the action
    /// @return The prepared payload
    function prepare(
        bytes calldata data_
    ) external virtual returns (bytes memory);

    /// @notice Validate that the action has been completed successfully
    /// @param data_ The data payload for the action
    /// @return True if the action has been validated for the user
    /// @dev It is the responsibility of the validator to unpack the data and perform the validation
    function validate(bytes calldata data_) external virtual returns (bool);
}
