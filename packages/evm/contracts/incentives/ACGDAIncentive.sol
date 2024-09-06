// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";

import {AIncentive} from "./AIncentive.sol";

/// @title Continuous Gradual Dutch Auction AIncentive
/// @notice An ERC20 incentive implementation with reward amounts adjusting dynamically based on claim volume.
abstract contract ACGDAIncentive is AIncentive {
    /// @notice The configuration parameters for the CGDAIncentive
    /// @param rewardDecay The amount to subtract from the current reward after each claim
    /// @param rewardBoost The amount by which the reward increases for each hour without a claim (continuous linear increase)
    /// @param lastClaimTime The timestamp of the last claim
    /// @param currentReward The current reward amount
    struct CGDAParameters {
        uint256 rewardDecay;
        uint256 rewardBoost;
        uint256 lastClaimTime;
        uint256 currentReward;
    }

    /// @notice The ERC20-like token used for the incentive
    address public asset;

    CGDAParameters public cgdaParams;
    uint256 public totalBudget;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(ACGDAIncentive).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AIncentive) returns (bool) {
        return interfaceId == type(ACGDAIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
