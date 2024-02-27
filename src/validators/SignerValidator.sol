// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SignatureCheckerLib} from "lib/solady/src/utils/SignatureCheckerLib.sol";
import {IERC1271} from "lib/openzeppelin-contracts/contracts/interfaces/IERC1271.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {Validator} from "src/validators/Validator.sol";

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
contract SignerValidator is Validator {
    using LibZip for bytes;
    using SignatureCheckerLib for address;
    using SignatureCheckerLib for bytes32;

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
    function initialize(bytes calldata data_) external virtual override initializer {
        (address[] memory signers_) = abi.decode(data_.cdDecompress(), (address[]));
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
        (address signer_, bytes32 hash_, bytes memory signature_) =
            abi.decode(data_.cdDecompress(), (address, bytes32, bytes));

        if (!signers[signer_]) revert BoostError.Unauthorized();
        if (_used[hash_]) revert BoostError.Replayed(signer_, hash_, signature_);

        // Mark the hash as used to prevent replays
        _used[hash_] = true;

        // Return the result of the signature check
        return signer_.isValidSignatureNow(hash_.toEthSignedMessageHash(), signature_);
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
