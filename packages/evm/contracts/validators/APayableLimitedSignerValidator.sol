// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {ALimitedSignerValidator} from "contracts/validators/ALimitedSignerValidator.sol";

/// @title Payable Limited Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers.
/// @dev The claim fee is stored on the base implementation and read by all clones. Fee is forwarded to the protocol fee receiver from BoostCore.
abstract contract APayableLimitedSignerValidator is ALimitedSignerValidator {
    /// @notice The claim fee required to validate a claim (only meaningful on base implementation)
    uint256 public claimFee;

    /// @notice Emitted when the claim fee is updated
    event ClaimFeeUpdated(uint256 newFee);

    /// @notice Thrown when the provided fee does not match the required claim fee
    error InvalidClaimFee();

    /// @notice Thrown when fee transfer fails
    error FeeTransferFailed();

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(APayableLimitedSignerValidator).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ALimitedSignerValidator)
        returns (bool)
    {
        return interfaceId == type(APayableLimitedSignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
