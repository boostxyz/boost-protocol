// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";
import {EIP712} from "@solady/utils/EIP712.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {IncentiveBits} from "contracts/shared/IncentiveBits.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {SignerValidator} from "contracts/validators/SignerValidator.sol";

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
contract IntentValidator is SignerValidator {
    using SignatureCheckerLib for address;
    using IncentiveBits for IncentiveBits.IncentiveMap;

    /// @dev address allowed to call latchValidation
    address internal _settlerCaller;

    bool internal _latchValidation = false;

    /// @notice Construct a new SignerValidator
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of authorized signers
    /// @param data_ The compressed list of authorized signers
    /// @dev The first address in the list will be the initial owner of the contract
    function initialize(bytes calldata data_) public virtual override initializer {
        (address[] memory signers_, address validatorCaller_, address settlerCaller_) =
            abi.decode(data_, (address[], address, address));
        _initializeOwner(signers_[0]);
        _validatorCaller = validatorCaller_;
        _settlerCaller = settlerCaller_;
        for (uint256 i = 0; i < signers_.length; i++) {
            signers[signers_[i]] = true;
        }
        emit SignerValidatorInitialized(validatorCaller_);
    }

    function latchValidation() external {
        if (msg.sender != _settlerCaller) revert BoostError.Unauthorized();
        _latchValidation = true;
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
        // Since it should always call into this ideally if they call into the claim in their call sequence this should trip
        // but we should also check here to be safe
        if (!_latchValidation) revert BoostError.Unauthorized();

        _latchValidation = false;
        (BoostClaimData memory claim) = abi.decode(claimData, (BoostClaimData));
        (SignerValidatorInputParams memory validatorData) =
            abi.decode(claim.validatorData, (SignerValidatorInputParams));

        if (uint256(validatorData.incentiveQuantity) <= incentiveId) {
            revert BoostError.InvalidIncentive(validatorData.incentiveQuantity, incentiveId);
        }
        bytes32 hash = keccak256(abi.encode(claimant));
        // Mark the incentive as claimed to prevent replays
        // checks internally if the incentive has already been claimed
        _used.setOrThrow(hash, incentiveId);

        // Return the result of the signature check
        // no need for a sig prefix since it's encoded by the EIP712 lib
        return true;
    }

    function setValidatorCaller(address newCaller) external override onlyOwner {
        _validatorCaller = newCaller;
    }

    function setSettlerCaller(address newCaller) external onlyOwner {
        _settlerCaller = newCaller;
    }
}