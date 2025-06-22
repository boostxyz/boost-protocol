// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {LimitedSignerValidator, ALimitedSignerValidator} from "contracts/validators/LimitedSignerValidator.sol";
import {APayableLimitedSignerValidator} from "contracts/validators/APayableLimitedSignerValidator.sol";

interface IBoostCore {
    function protocolFeeReceiver() external view returns (address);
}

/// @title Payable Limited Signer Validator
/// @notice A validator that verifies signatures, limits claims per address, and requires a claim fee
/// @dev The claim fee is forwarded to the protocol fee receiver from BoostCore
contract PayableLimitedSignerValidator is APayableLimitedSignerValidator, LimitedSignerValidator {
    using SignatureCheckerLib for address;
    using IncentiveBits for IncentiveBits.IncentiveMap;

    /// @notice Construct a new PayableLimitedSignerValidator
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of authorized signers and claim fee
    /// @param data_ The encoded initialization data containing signers, validatorCaller, maxClaims, and claimFee
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override(ACloneable, LimitedSignerValidator) initializer {
        (address[] memory signers_, address validatorCaller_, uint256 maxClaims_, uint256 claimFee_) =
            abi.decode(data_, (address[], address, uint256, uint256));

        _initializeOwner(signers_[0]);
        maxClaimCount = maxClaims_;
        claimFee = claimFee_;

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
        override(AValidator, LimitedSignerValidator)
        returns (bool)
    {
        // Require exact fee payment to prevent funds from getting stuck
        if (msg.value != claimFee) {
            revert InvalidClaimFee();
        }

        // Validate signature and check claim limit (parent class handles _incrementClaim)
        bool isValid = super.validate(boostId, incentiveId, claimant, claimData);

        // Forward fee to protocol fee receiver if fee is greater than 0 and validation passed
        if (claimFee > 0 && isValid) {
            address protocolFeeReceiver = IBoostCore(_validatorCaller).protocolFeeReceiver();
            (bool success,) = protocolFeeReceiver.call{value: claimFee}("");
            if (!success) revert FeeTransferFailed();
        }

        return isValid;
    }

    /// @notice Set the claim fee
    /// @param newFee The new claim fee amount
    /// @dev Only callable by the owner
    function setClaimFee(uint256 newFee) external onlyOwner {
        claimFee = newFee;
        emit ClaimFeeUpdated(newFee);
    }

    /// @notice Get the current claim fee
    /// @return The current claim fee amount
    function getClaimFee() external view returns (uint256) {
        return claimFee;
    }

    function _domainNameAndVersion() internal pure override returns (string memory name, string memory version) {
        name = "PayableLimitedSignerValidator";
        version = "1";
    }

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(APayableLimitedSignerValidator, LimitedSignerValidator)
        returns (bytes4)
    {
        return type(APayableLimitedSignerValidator).interfaceId;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(APayableLimitedSignerValidator, LimitedSignerValidator)
        returns (bool)
    {
        return interfaceId == type(APayableLimitedSignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
