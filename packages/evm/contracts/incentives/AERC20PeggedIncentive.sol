// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "./AIncentive.sol";

/// @title ERC20 AIncentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
abstract contract AERC20PeggedIncentive is AIncentive {
    using LibPRNG for LibPRNG.PRNG;
    using SafeTransferLib for address;

    /// @notice A mapping of address to claim status
    mapping(address => bool) public claimed;

    uint256 public totalClaim;

    /// @notice The limit max possible reward tokens to be claimed
    function limit() external virtual returns (uint256);

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(AERC20PeggedIncentive).interfaceId;
    }

    /// @notice The asset for the peg
    /// @dev The asset is the token that the peg is based on
    /// @return The asset address
    function getPeg() external view virtual returns (address);

    /// @notice The total amount claimed so far
    function totalClaimed() external virtual returns (uint256);

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AIncentive) returns (bool) {
        return interfaceId == type(AERC20PeggedIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
