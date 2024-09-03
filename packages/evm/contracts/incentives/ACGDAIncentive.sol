// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {Budget} from "contracts/budgets/Budget.sol";

import {Incentive} from "./Incentive.sol";

/// @title Continuous Gradual Dutch Auction Incentive
/// @notice An ERC20 incentive implementation with reward amounts adjusting dynamically based on claim volume.
abstract contract ACGDAIncentive is Incentive {
    using SafeTransferLib for address;

    /// @notice The ERC20-like token used for the incentive
    address public asset;

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

    CGDAParameters public cgdaParams;
    uint256 public totalBudget;

    /// @inheritdoc Incentive
    /// @notice Claim the incentive
    function claim(bytes calldata data_) external virtual override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        if (!_isClaimable(claim_.target)) revert NotClaimable();
        claims++;

        // Calculate the current reward and update the state
        uint256 reward = currentReward();
        cgdaParams.lastClaimTime = block.timestamp;
        cgdaParams.currentReward =
            reward > cgdaParams.rewardDecay ? reward - cgdaParams.rewardDecay : cgdaParams.rewardDecay;

        // Transfer the reward to the recipient
        asset.safeTransfer(claim_.target, reward);

        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, reward));
        return true;
    }

    /// @inheritdoc Incentive
    function reclaim(bytes calldata data_) external virtual override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return true;
    }

    /// @inheritdoc Incentive
    function isClaimable(bytes calldata data_) external view virtual override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        return _isClaimable(claim_.target);
    }

    /// @notice Calculates the current reward based on the time since the last claim.
    /// @return The current reward
    /// @dev The reward is calculated based on the time since the last claim, the available budget, and the reward parameters. It increases linearly over time in the absence of claims, with each hour adding `rewardBoost` to the current reward, up to the available budget.
    /// @dev For example, if there is one claim in the first hour, then no claims for three hours, the claimable reward would be `initialReward - rewardDecay + (rewardBoost * 3)`
    function currentReward() public view override returns (uint256) {
        uint256 timeSinceLastClaim = block.timestamp - cgdaParams.lastClaimTime;
        uint256 available = asset.balanceOf(address(this));

        // Calculate the current reward based on the time elapsed since the last claim
        // on a linear scale, with `1 * rewardBoost` added for each hour without a claim
        uint256 projectedReward = cgdaParams.currentReward + (timeSinceLastClaim * cgdaParams.rewardBoost) / 3600;
        return projectedReward > available ? available : projectedReward;
    }

    function _isClaimable(address recipient_) internal view returns (bool) {
        uint256 reward = currentReward();
        return reward > 0 && asset.balanceOf(address(this)) >= reward && !claimed[recipient_];
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Cloneable) returns (bytes4) {
        return type(ACGDAIncentive).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Incentive) returns (bool) {
        return interfaceId == type(ACGDAIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
