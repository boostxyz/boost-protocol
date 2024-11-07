// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AERC20VariableCriteriaIncentive} from "contracts/incentives/AERC20VariableCriteriaIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

enum SignatureType {
    FUNC,
    EVENT
}

/// @title ERC20 Incentive with Variable Criteria-Based Rewards
/// @notice Extends the ERC20VariableIncentive to include incentive variability criteria on-chain
contract ERC20VariableCriteriaIncentive is AERC20VariableCriteriaIncentive {
    using SafeTransferLib for address;

    /// @notice Initialize the ERC20VariableCriteriaIncentive with IncentiveCriteria
    /// @param data_ The encoded initialization data `(address asset, uint256 reward, uint256 limit, IncentiveCriteria criteria)`
    function initialize(bytes calldata data_) public override initializer {
        _initializeOwner(msg.sender);
        InitPayloadExtended memory init_ = abi.decode(data_, (InitPayloadExtended));

        address asset_ = init_.asset;
        uint256 reward_ = init_.reward;
        uint256 limit_ = init_.limit;
        uint256 maxReward_ = init_.maxReward;
        IncentiveCriteria memory criteria_ = init_.criteria;

        if (limit_ == 0) revert BoostError.InvalidInitialization();

        uint256 available = asset_.balanceOf(address(this));
        if (available < limit_) {
            revert BoostError.InsufficientFunds(init_.asset, available, limit_);
        }

        asset = asset_;
        reward = reward_;
        limit = limit_;
        maxReward = maxReward_;
        totalClaimed = 0;
        incentiveCriteria = criteria_;

        _initializeOwner(msg.sender);
    }

    /// @notice Returns the incentive criteria
    /// @return The stored IncentiveCriteria struct
    function getIncentiveCriteria() external view override returns (IncentiveCriteria memory) {
        return incentiveCriteria;
    }

    /// @notice Claim the incentive with variable rewards
    /// @param data_ The data payload for the incentive claim `(uint256signedAmount)`
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata data_) external override onlyOwner returns (bool) {
        BoostClaimData memory boostClaimData = abi.decode(data_, (BoostClaimData));
        uint256 signedAmount = abi.decode(boostClaimData.incentiveData, (uint256));
        uint256 claimAmount;
        if (!_isClaimable(claimTarget)) revert NotClaimable();

        if (reward == 0) {
            claimAmount = signedAmount;
        } else {
            // NOTE: this is assuming that the signed scalar is in ETH decimal format
            claimAmount = reward * signedAmount / 1e18;
        }
        if (maxReward != 0 && claimAmount > maxReward) {
            claimAmount = maxReward;
        }

        if (totalClaimed + claimAmount > limit) revert ClaimFailed();

        totalClaimed += claimAmount;
        claims += 1;
        asset.safeTransfer(claimTarget, claimAmount);

        emit Claimed(claimTarget, abi.encodePacked(asset, claimTarget, claimAmount));
        return true;
    }
}
