// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";
import {Budget} from "contracts/budgets/Budget.sol";

/// @title ERC20 Incentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
contract ERC20Incentive is AERC20Incentive {
    using LibPRNG for LibPRNG.PRNG;
    using SafeTransferLib for address;

    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        Strategy strategy;
        uint256 reward;
        uint256 limit;
    }

    /// @notice Construct a new ERC20Incentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address asset, Strategy strategy, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        if (init_.reward == 0 || init_.limit == 0) revert BoostError.InvalidInitialization();

        // Ensure the maximum reward amount has been allocated
        uint256 maxTotalReward = init_.strategy != Strategy.RAFFLE ? init_.reward * init_.limit : init_.reward;
        uint256 available = init_.asset.balanceOf(address(this));
        if (available < maxTotalReward) {
            revert BoostError.InsufficientFunds(init_.asset, available, maxTotalReward);
        }

        asset = init_.asset;
        strategy = init_.strategy;
        reward = init_.reward;
        limit = init_.limit;
        _initializeOwner(msg.sender);
    }

    /// @inheritdoc Incentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The {InitPayload} for the incentive
    /// @return budgetData The {Transfer} payload to be passed to the {Budget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        uint256 amount = init_.strategy != Strategy.RAFFLE ? init_.reward * init_.limit : init_.reward;

        return abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC20,
                asset: init_.asset,
                target: address(this),
                data: abi.encode(Budget.FungiblePayload({amount: amount}))
            })
        );
    }
}
