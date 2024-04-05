// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";

/// @title Boost Validator
/// @notice Abstract contract for a generic Validator within the Boost protocol
/// @dev Validator classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Validator is Ownable, Cloneable {
    struct ValidatePayload {
        address target;
        bytes data;
    }

    /// @notice Initialize the contract and set the owner
    /// @dev The owner is set to the contract deployer
    constructor() {
        _initializeOwner(msg.sender);
    }

    /// @notice Validate that a given user has completed an acction successfully
    /// @param data_ The compressed {ValidatePayload} to be validated
    /// @return True if the action has been validated based on the data payload
    /// @dev The decompressed payload contains the address of the user being validated along with freeform bytes that are entirely implementation-specific
    /// @dev For example, to validate a tuple of `(bytes32 messageHash, bytes signature)` on behalf of `address holder`, the payload should be `ValidatePayload({target: holder, data: abi.encode(messageHash, signature)})`, ABI-encoded and compressed with {LibZip-cdCompress}
    function validate(bytes calldata data_) external virtual returns (bool);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(Validator).interfaceId || super.supportsInterface(interfaceId);
    }
}
