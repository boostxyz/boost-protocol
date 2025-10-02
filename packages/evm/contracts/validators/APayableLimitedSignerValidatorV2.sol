// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {ASignerValidatorV2} from "contracts/validators/ASignerValidatorV2.sol";
import {ALimitedSignerValidatorV2} from "contracts/validators/ALimitedSignerValidatorV2.sol";

/// @title Payable Limited Signer Validator V2
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers.
/// @dev The claim fee is stored on the base implementation and read by all clones. Fee is forwarded to the protocol fee receiver from BoostCore.
abstract contract APayableLimitedSignerValidatorV2 is ALimitedSignerValidatorV2 {
    /// @notice The claim fee required to validate a claim (only meaningful on base implementation)
    uint256 public claimFee;

    /// @notice Emitted when the claim fee is updated
    event ClaimFeeUpdated(uint256 newFee);

    /// @notice Emitted when a claim fee is paid
    event ClaimFeePaid(
        address indexed claimant, uint256 indexed boostId, uint256 indexed incentiveId, uint256 fee, address feeReceiver
    );

    /// @notice Thrown when the provided fee does not match the required claim fee
    error InvalidClaimFee();

    /// @notice Thrown when fee transfer fails
    error FeeTransferFailed();

    /// @notice Returns the version of this validator. Prevent generating the same interface as APayableLimitedSignerValidator
    /// @return The version string
    function validatorName() external pure virtual override returns (string memory) {
        return "APayableLimitedSignerValidatorV2";
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(APayableLimitedSignerValidatorV2).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ALimitedSignerValidatorV2)
        returns (bool)
    {
        return interfaceId == type(APayableLimitedSignerValidatorV2).interfaceId || super.supportsInterface(interfaceId);
    }
}
