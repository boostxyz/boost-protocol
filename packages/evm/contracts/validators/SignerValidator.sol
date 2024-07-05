// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {Validator} from "contracts/validators/Validator.sol";

abstract contract ASignerValidator is Validator {
    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Validator) returns (bytes4) {
        return type(ASignerValidator).interfaceId;
    }
    
    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Validator) returns (bool) {
        return interfaceId == type(ASignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
contract SignerValidator is ASignerValidator {
    using SignatureCheckerLib for address;

    /// @dev The set of authorized signers
    mapping(address => bool) public signers;

    /// @dev The set of used hashes (for replay protection)
    mapping(bytes32 => bool) private _used;

    /// @notice Construct a new SignerValidator
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of authorized signers
    /// @param data_ The compressed list of authorized signers
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override initializer {
        (address[] memory signers_) = abi.decode(data_, (address[]));
        _initializeOwner(signers_[0]);
        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = true;
        }
    }

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
}
