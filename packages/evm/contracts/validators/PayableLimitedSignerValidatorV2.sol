// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {LimitedSignerValidatorV2, ALimitedSignerValidatorV2} from "contracts/validators/LimitedSignerValidatorV2.sol";
import {APayableLimitedSignerValidatorV2} from "contracts/validators/APayableLimitedSignerValidatorV2.sol";
import {IBoostCore} from "contracts/validators/PayableLimitedSignerValidator.sol";

/// @title Payable Limited Signer Validator V2
/// @notice A validator that verifies signatures, limits claims per address, and requires a claim fee
/// @dev The claim fee is stored on the base implementation and all clones read from it. This allows
///      updating the fee globally by only changing it on the base. Fee is forwarded to the protocol fee receiver.
contract PayableLimitedSignerValidatorV2 is APayableLimitedSignerValidatorV2, LimitedSignerValidatorV2 {
    using SignatureCheckerLib for address;
    using IncentiveBits for IncentiveBits.IncentiveMap;

    /// @notice The address of the base implementation (set in clones during initialization)
    address private _baseImplementation;

    /// @notice Construct a new PayableLimitedSignerValidator
    /// @dev The base implementation needs an owner to manage the global claim fee
    /// @param owner_ The address that will be the owner of the base implementation
    /// @param initialClaimFee_ The initial claim fee amount
    constructor(address owner_, uint256 initialClaimFee_) {
        if (owner_ == address(0)) revert BoostError.Unauthorized();
        _initializeOwner(owner_);
        claimFee = initialClaimFee_;
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of authorized signers
    /// @param data_ The encoded initialization data containing signers, validatorCaller, maxClaims, and baseImplementation
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_)
        public
        virtual
        override(ACloneable, LimitedSignerValidatorV2)
        initializer
    {
        (address[] memory signers_, address validatorCaller_, uint256 maxClaims_, address baseImplementation_) =
            abi.decode(data_, (address[], address, uint256, address));

        _initializeOwner(signers_[0]);
        maxClaimCount = maxClaims_;
        _baseImplementation = baseImplementation_;

        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = true;
        }

        _validatorCaller = validatorCaller_;
    }

    /// @notice Validate that the action has been completed successfully
    /// @dev Requires exact payment of the claim fee to prevent funds from getting stuck
    /// @inheritdoc AValidator
    function validate(uint256 boostId, uint256 incentiveId, address claimant, bytes calldata claimData)
        public
        payable
        override(AValidator, LimitedSignerValidatorV2)
        returns (bool)
    {
        uint256 currentClaimFee = _getClaimFee();
        if (msg.value != currentClaimFee) {
            revert InvalidClaimFee();
        }

        bool isValid = super.validate(boostId, incentiveId, claimant, claimData);

        if (!isValid) {
            // Avoid retaining ETH on failed validations.
            revert BoostError.Unauthorized();
        }

        if (currentClaimFee > 0) {
            address protocolFeeReceiver = IBoostCore(_validatorCaller).protocolFeeReceiver();
            (bool success,) = protocolFeeReceiver.call{value: currentClaimFee}("");
            if (!success) revert FeeTransferFailed();
            emit ClaimFeePaid(claimant, boostId, incentiveId, currentClaimFee, protocolFeeReceiver);
        }

        return true;
    }

    /// @notice Set the claim fee (only callable on the base implementation)
    /// @param newFee The new claim fee amount
    /// @dev Only callable by the owner of the base implementation
    function setClaimFee(uint256 newFee) external onlyOwner {
        if (_baseImplementation != address(0)) {
            revert BoostError.Unauthorized();
        }
        claimFee = newFee;
        emit ClaimFeeUpdated(newFee);
    }

    /// @notice Get the current claim fee
    /// @return The current claim fee amount from the base implementation
    function getClaimFee() external view returns (uint256) {
        return _getClaimFee();
    }

    /// @notice Internal function to get the claim fee from the appropriate source
    /// @return The current claim fee amount
    function _getClaimFee() internal view returns (uint256) {
        if (_baseImplementation != address(0)) {
            return PayableLimitedSignerValidatorV2(_baseImplementation).claimFee();
        }
        return claimFee;
    }

    function _domainNameAndVersion() internal pure override returns (string memory name, string memory version) {
        name = "PayableLimitedSignerValidatorV2";
        version = "1";
    }

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(APayableLimitedSignerValidatorV2, LimitedSignerValidatorV2)
        returns (bytes4)
    {
        return type(APayableLimitedSignerValidatorV2).interfaceId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(APayableLimitedSignerValidatorV2, LimitedSignerValidatorV2)
        returns (bool)
    {
        return interfaceId == type(APayableLimitedSignerValidatorV2).interfaceId || super.supportsInterface(interfaceId);
    }
}
