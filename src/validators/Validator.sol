// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "lib/solady/src/auth/Ownable.sol";

import {Cloneable} from "src/shared/Cloneable.sol";

/// @title Boost Validator
/// @notice Abstract contract for a generic Validator within the Boost protocol
/// @dev Validator classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Validator is Ownable, Cloneable {
    /// @notice Initialize the contract and set the owner
    /// @dev The owner is set to the contract deployer
    constructor() {
        _initializeOwner(msg.sender);
    }

    /// @notice Validate that the action has been completed successfully
    /// @param data_ The compressed data payload for the validation check
    /// @return True if the action has been validated based on the data payload
    /// @dev Conventionally, the first 20 bytes of the decompressed `data_` payload are expected to be the address of the user being validated, while the remaining bytes are entirely implementation-specific
    /// @dev For example, to validate a tuple of `(bytes32 r, bytes32 s, uint8 v)` on behalf of `address holder`, the payload should be `abi.encode(holder, abi.encode(r, s, v))`
    function validate(bytes calldata data_) external virtual returns (bool);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(Validator).interfaceId || super.supportsInterface(interfaceId);
    }
}
