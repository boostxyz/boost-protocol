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
abstract contract AERC20Incentive is AIncentive {
    using LibPRNG for LibPRNG.PRNG;
    using SafeTransferLib for address;

    /// @notice Emitted when an entry is added to the raffle
    event Entry(address indexed entry);

    /// @notice The strategy for the incentive
    /// @dev The strategy determines how the incentive is disbursed:
    ///     - POOL: Users claim from a pool of rewards until the limit is reached, with each claim receiving an equal share of the total;
    ///     - RAFFLE: Users claim a slot in a raffle, and a single winner is randomly drawn to receive the entire reward amount;
    enum Strategy {
        POOL,
        RAFFLE
    }

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The strategy for the incentive (RAFFLE or POOL)
    Strategy public strategy;

    /// @notice The limit (max claims, or max entries for raffles)
    uint256 public limit;

    /// @notice The set of addresses that have claimed a slot in the incentive raffle
    address[] public entries;
    /// @notice Draw a winner from the raffle
    /// @dev Only valid when the strategy is set to `Strategy.RAFFLE`

    function drawRaffle() external virtual;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(AERC20Incentive).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AIncentive) returns (bool) {
        return interfaceId == type(AERC20Incentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
