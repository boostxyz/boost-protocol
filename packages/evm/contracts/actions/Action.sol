// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {AValidator} from "contracts/validators/AValidator.sol";

/// @title Boost Action
/// @notice Abstract contract for a generic Action within the Boost protocol
/// @dev Action classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Action is Cloneable {
    /// @notice Emitted when the action is executed by a proxy.
    /// @dev The `data` field should contain the return data from the action, if any.
    event ActionExecuted(address indexed executor, address caller, bool success, bytes data);

    /// @notice Emitted when the action is validated
    /// @dev The `data` field should contain implementation-specific context, if applicable.
    event ActionValidated(address indexed user, bool isValidated, bytes data);

    /// @notice The validator for the action (which may be the action itself where appropriate)
    AValidator public immutable VALIDATOR;

    /// @notice Execute the action
    /// @param data_ The data payload for the action
    /// @return (success, data) A tuple of the success status and the returned data
    function execute(bytes calldata data_) external payable virtual returns (bool, bytes memory);

    /// @notice Prepare the action for execution and return the expected payload
    /// @param data_ The data payload for the action
    /// @return The prepared payload
    function prepare(bytes calldata data_) external virtual returns (bytes memory);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(Action).interfaceId || super.supportsInterface(interfaceId);
    }
}
