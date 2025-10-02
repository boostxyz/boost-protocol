// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";

import {AValidator} from "contracts/validators/AValidator.sol";

/// @title Signer Validator V2 Base
/// @notice Base implementation for a Validator that verifies signatures including referrer data
abstract contract ASignerValidatorV2 is IBoostClaim, AValidator {
    struct SignerValidatorInputParams {
        address signer;
        bytes signature;
        uint8 incentiveQuantity;
    }

    struct SignerValidatorDataV2 {
        uint8 incentiveQuantity;
        address claimant;
        uint256 boostId;
        bytes incentiveData;
        address referrer;
    }

    /// @dev The set of authorized signers
    mapping(address => bool) public signers;

    /// @notice Set the authorized status of a signer
    /// @param signers_ The list of signers to update
    /// @param authorized_ The authorized status of each signer
    function setAuthorized(address[] calldata signers_, bool[] calldata authorized_) external virtual;

    /// @notice update the authorized caller of the validator function
    /// @param newCaller the new authorized caller of the validator function
    function setValidatorCaller(address newCaller) external virtual;

    /// @notice Returns the version of this validator. Prevent generating the same interface as ASignerValidator
    /// @return The version string
    function validatorName() external pure virtual returns (string memory) {
        return "ASignerValidatorV2";
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ASignerValidatorV2).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AValidator) returns (bool) {
        return interfaceId == type(ASignerValidatorV2).interfaceId || super.supportsInterface(interfaceId);
    }
}
