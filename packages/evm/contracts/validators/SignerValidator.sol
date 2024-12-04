// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {ASignerValidator} from "contracts/validators/ASignerValidator.sol";

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
contract SignerValidator is ASignerValidator, Ownable, EIP712 {
    using SignatureCheckerLib for address;
    using IncentiveBits for IncentiveBits.IncentiveMap;

    event SignerValidatorInitialized(address validatorCaller);

    /// @dev track claimed incentives using this bitmap
    IncentiveBits.IncentiveMap _used;

    /// @dev address allowed to call validate
    address internal _validatorCaller;

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
        emit SignerValidatorInitialized(validatorCaller_);
    }

    /// Validate that the action has been completed successfully by constructing a payload and checking the signature against it
    /// @inheritdoc AValidator
    function validate(uint256 boostId, uint256 incentiveId, address claimant, bytes calldata claimData)
        public
        payable
        virtual
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

    function _domainNameAndVersion()
        internal
        pure
        virtual
        override
        returns (string memory name, string memory version)
    {
        name = "SignerValidator";
        version = "1";
    }

    function _domainNameAndVersionMayChange() internal pure override returns (bool result) {
        result = true;
    }
}
