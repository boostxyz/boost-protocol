// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";

import {AValidator} from "contracts/validators/AValidator.sol";

/// @title Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
abstract contract ASignerValidator is IBoostClaim, AValidator {
    struct SignerValidatorInputParams {
        address signer;
        bytes signature;
        uint8 incentiveQuantity;
    }

    struct SignerValidatorData {
        uint8 incentiveQuantity;
        address claimant;
        uint256 boostId;
        bytes incentiveData;
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

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ASignerValidator).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AValidator) returns (bool) {
        return interfaceId == type(ASignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
