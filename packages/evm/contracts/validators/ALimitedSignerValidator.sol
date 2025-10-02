// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SignatureCheckerLib} from "@solady/utils/SignatureCheckerLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {IBoostClaim} from "contracts/shared/IBoostClaim.sol";

import {AValidator} from "contracts/validators/AValidator.sol";
import {ASignerValidator} from "contracts/validators/ASignerValidator.sol";

/// @title Limited Signer Validator
/// @notice A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers
abstract contract ALimitedSignerValidator is ASignerValidator {
    /// @dev track claimants and the amount of times they've claimed an incentive
    mapping(bytes32 => uint256) public quantityClaimed;

    /// @dev the maximum quantity of claims an address can submit
    uint256 public maxClaimCount;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ALimitedSignerValidator).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ASignerValidator) returns (bool) {
        return interfaceId == type(ALimitedSignerValidator).interfaceId || super.supportsInterface(interfaceId);
    }
}
