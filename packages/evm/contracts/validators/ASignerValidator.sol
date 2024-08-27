// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {AValidator} from "contracts/validators/AValidator.sol";

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
abstract contract ASignerValidator is AValidator {
    using SignatureCheckerLib for address;

    /// @dev The set of authorized signers
    mapping(address => bool) public signers;

    /// @dev The set of used hashes (for replay protection)
    mapping(bytes32 => bool) internal _used;

    /// @notice Validate that the action has been completed successfully
    /// @param data_ The data payload for the validation check
    /// @return True if the action has been validated based on the data payload
    /// @dev The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature)
    /// @dev The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer
    function validate(bytes calldata data_) external override returns (bool) {
        (address signer_, bytes32 hash_, bytes memory signature_) = abi.decode(data_, (address, bytes32, bytes));

        if (!signers[signer_]) revert BoostError.Unauthorized();
        if (_used[hash_]) revert BoostError.Replayed(signer_, hash_, signature_);

        // Mark the hash as used to prevent replays
        _used[hash_] = true;

        // Return the result of the signature check
        return signer_.isValidSignatureNow(SignatureCheckerLib.toEthSignedMessageHash(hash_), signature_);
    }

    /// @notice Set the authorized status of a signer
    /// @param signers_ The list of signers to update
    /// @param authorized_ The authorized status of each signer
    function setAuthorized(address[] calldata signers_, bool[] calldata authorized_) external onlyOwner {
        if (signers_.length != authorized_.length) revert BoostError.LengthMismatch();

        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = authorized_[i];
        }
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(AValidator) returns (bytes4) {
        return type(ASignerValidator).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AValidator) returns (bool) {
        return interfaceId == type(ASignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
