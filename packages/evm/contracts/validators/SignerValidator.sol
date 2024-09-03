// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {ASignerValidator} from "contracts/validators/ASignerValidator.sol";

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
contract SignerValidator is ASignerValidator, Ownable, EIP712 {
    using SignatureCheckerLib for address;

    /// @dev The set of used hashes (for replay protection)
    mapping(bytes32 => bool) internal _used;

    bytes32 internal constant _SIGNER_VALIDATOR_TYPEHASH =
        keccak256("SignerValidatorData(uint256 incentiveId, address claimant,uint256 boostId,bytes32 incentiveData)");

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

    /// Validate that the action has been completed successfully by constructing a payload and checking the signature against it
    /// @inheritdoc AValidator
    function validate(uint256 boostId, uint256 incentiveId, address claimant, bytes calldata claimData)
        external
        override
        returns (bool)
    {
        (BoostClaimData memory claim) = abi.decode(claimData, (BoostClaimData));
        (SignerValidatorInputParams memory validatorData) =
            abi.decode(claim.validatorData, (SignerValidatorInputParams));

        bytes32 hash = hashSignerData(boostId, incentiveId, claimant, claim.incentiveData);
        if (!signers[validatorData.signer]) revert BoostError.Unauthorized();
        if (_used[hash]) revert BoostError.Replayed(validatorData.signer, hash, validatorData.signature);
        // Mark the hash as used to prevent replays
        _used[hash] = true;

        // Return the result of the signature check
        // no need for a sig prefix since it's encoded by the EIP712 lib
        return validatorData.signer.isValidSignatureNow(hash, validatorData.signature);
    }

    /// @notice Set the authorized status of a signer
    /// @param signers_ The list of signers to update
    /// @param authorized_ The authorized status of each signer
    function setAuthorized(address[] calldata signers_, bool[] calldata authorized_) external override onlyOwner {
        if (signers_.length != authorized_.length) revert BoostError.LengthMismatch();

        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = authorized_[i];
        }
    }

    function hashSignerData(uint256 boostId, uint256 incentiveId, address claimant, bytes memory incentiveData)
        public
        view
        returns (bytes32 hashedSignerData)
    {
        return _hashTypedData(
            keccak256(abi.encode(_SIGNER_VALIDATOR_TYPEHASH, incentiveId, claimant, boostId, keccak256(incentiveData)))
        );
    }

    function _domainNameAndVersion() internal pure override returns (string memory name, string memory version) {
        name = "SignerValidator";
        version = "1";
    }

    function _domainNameAndVersionMayChange() internal pure override returns (bool result) {
        result = true;
    }
}
