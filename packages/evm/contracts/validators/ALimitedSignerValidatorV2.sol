// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {ASignerValidatorV2} from "contracts/validators/ASignerValidatorV2.sol";

/// @title Limited Signer Validator V2
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
abstract contract ALimitedSignerValidatorV2 is ASignerValidatorV2 {
    /// @dev track claimants and the amount of times they've claimed an incentive
    mapping(bytes32 => uint256) public quantityClaimed;

    /// @dev the maximum quantity of claims an address can submit
    uint256 public maxClaimCount;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ALimitedSignerValidatorV2).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ASignerValidatorV2) returns (bool) {
        return interfaceId == type(ALimitedSignerValidatorV2).interfaceId || super.supportsInterface(interfaceId);
    }
}
