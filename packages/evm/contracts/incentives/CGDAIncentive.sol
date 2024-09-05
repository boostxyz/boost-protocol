// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACGDAIncentive} from "contracts/incentives/ACGDAIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

/// @title Continuous Gradual Dutch Auction AIncentive
/// @notice An ERC20 incentive implementation with reward amounts adjusting dynamically based on claim volume.
contract CGDAIncentive is ACGDAIncentive {
    using SafeTransferLib for address;

    /// @notice The payload for initializing a CGDAIncentive
    /// @param asset The address of the ERC20-like token
    /// @param initialReward The initial reward amount
    /// @param rewardDecay The amount to subtract from the current reward after each claim
    /// @param rewardBoost The amount by which the reward increases for each hour without a claim (continuous linear increase)
    /// @param totalBudget The total budget for the incentive
    struct InitPayload {
        address asset;
        uint256 initialReward;
        uint256 rewardDecay;
        uint256 rewardBoost;
        uint256 totalBudget;
    }

    /// @notice Construct a new CGDAIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the CGDA AIncentive
    /// @param data_ Initialization parameters.
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        uint256 available = init_.asset.balanceOf(address(this));
        if (available < init_.totalBudget) {
            revert BoostError.InsufficientFunds(init_.asset, available, init_.totalBudget);
        }

        if (
            init_.initialReward == 0 || init_.rewardDecay == 0 || init_.rewardBoost == 0
                || init_.totalBudget < init_.initialReward
        ) revert BoostError.InvalidInitialization();

        asset = init_.asset;
        cgdaParams = CGDAParameters({
            rewardDecay: init_.rewardDecay,
            rewardBoost: init_.rewardBoost,
            lastClaimTime: block.timestamp,
            currentReward: init_.initialReward
        });

        totalBudget = init_.totalBudget;
        _initializeOwner(msg.sender);
    }

    /// @inheritdoc AIncentive
    /// @notice Preflight the incentive to determine the budget required for all potential claims, which in this case is the `totalBudget`
    /// @param data_ The compressed incentive parameters `(address asset, uint256 initialReward, uint256 rewardDecay, uint256 rewardBoost, uint256 totalBudget)`
    /// @return The amount of tokens required
    function preflight(bytes calldata data_) external view virtual override returns (bytes memory) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        return abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: init_.asset,
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: init_.totalBudget}))
            })
        );
    }
}
