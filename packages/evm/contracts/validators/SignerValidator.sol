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
    using IncentiveBits for IncentiveBits.IncentiveMap;

    /// @dev track claimed incentives using this bitmap
    IncentiveBits.IncentiveMap _used;

    /// @dev address allowed to call validate
    address private _validatorCaller;

    bytes32 internal constant _SIGNER_VALIDATOR_TYPEHASH =
        keccak256("SignerValidatorData(uint256 boostId,uint8 incentiveQuantity,address claimant,bytes incentiveData)");

    /// @notice Construct a new SignerValidator
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of authorized signers
    /// @param data_ The compressed list of authorized signers
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override initializer {
        (address[] memory signers_, address validatorCaller_) = abi.decode(data_, (address[], address));
        _initializeOwner(signers_[0]);
        _validatorCaller = validatorCaller_;
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
        if (msg.sender != _validatorCaller) revert BoostError.Unauthorized();

        (BoostClaimData memory claim) = abi.decode(claimData, (BoostClaimData));
        (SignerValidatorInputParams memory validatorData) =
            abi.decode(claim.validatorData, (SignerValidatorInputParams));

        bytes32 hash = hashSignerData(boostId, validatorData.incentiveQuantity, claimant, claim.incentiveData);

        if (uint256(validatorData.incentiveQuantity) <= incentiveId) {
            revert BoostError.InvalidIncentive(validatorData.incentiveQuantity, incentiveId);
        }
        if (!signers[validatorData.signer]) revert BoostError.Unauthorized();

        // Mark the incentive as claimed to prevent replays
        // checks internally if the incentive has already been claimed
        _used.setOrThrow(hash, incentiveId);

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

    /// @inheritdoc ASignerValidator
    function setValidatorCaller(address newCaller) external override onlyOwner {
        _validatorCaller = newCaller;
    }

    function hashSignerData(uint256 boostId, uint8 incentiveQuantity, address claimant, bytes memory incentiveData)
        public
        view
        returns (bytes32 hashedSignerData)
    {
        return _hashTypedData(
            keccak256(
                abi.encode(_SIGNER_VALIDATOR_TYPEHASH, boostId, incentiveQuantity, claimant, keccak256(incentiveData))
            )
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

library IncentiveBits {
    /// @dev The set of used claimed incentives for a given hash (for replay protection)
    struct IncentiveMap {
        mapping(bytes32 => uint8) map;
    }

    /// @notice an internal helper that manages the incentive bitmask
    /// @dev this supports a maximum of 8 incentives for a given boost
    /// @param bitmap the bitmap struct to operate on
    /// @param hash the claim hash used to key on the incentive bitmap
    /// @param incentive the incentive id to set in the bitmap
    function setOrThrow(IncentiveMap storage bitmap, bytes32 hash, uint256 incentive) internal {
        bytes4 invalidSelector = BoostError.IncentiveToBig.selector;
        bytes4 claimedSelector = BoostError.IncentiveClaimed.selector;
        /// @solidity memory-safe-assembly
        assembly {
            if gt(incentive, 7) {
                // if the incentive is larger the 7 (the highest bit index)
                // we revert
                mstore(0, invalidSelector)
                mstore(4, incentive)
                revert(0x00, 0x24)
            }
            mstore(0x20, bitmap.slot)
            mstore(0x00, hash)
            let storageSlot := keccak256(0x00, 0x40)
            // toggle the value that was stored inline on stack with xor
            let updatedStorageValue := xor(sload(storageSlot), shl(incentive, 1))
            // isolate the toggled bit and see if it's been unset back to zero
            let alreadySet := xor(1, shr(incentive, updatedStorageValue))
            if alreadySet {
                // revert if the stored value was unset
                mstore(0, claimedSelector)
                mstore(4, incentive)
                revert(0x00, 0x24)
            }
            // otherwise store the newly set value
            sstore(storageSlot, updatedStorageValue)
        }
    }
}
