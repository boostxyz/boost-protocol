// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IIntentValidator {
    /// @notice Latch the validation process
    function latchValidation() external;
}
