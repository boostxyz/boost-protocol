// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";
import {Budget} from "contracts/budgets/Budget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";

/// @title ERC20 Incentive with Variable Rewards
/// @notice A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit
contract ERC20VariableIncentive is AERC20VariableIncentive {
    using SafeTransferLib for address;

    /// @notice The reward multiplier; if 0, the signed amount from the claim payload is used directly
    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        uint256 reward;
        uint256 limit;
    }

    /// @notice Construct a new ERC20VariableIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address asset, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        address asset_ = init_.asset;
        uint256 reward_ = init_.reward;
        uint256 limit_ = init_.limit;

        if (limit_ == 0) revert BoostError.InvalidInitialization();

        uint256 available = asset_.balanceOf(address(this));
        if (available < limit_) {
            revert BoostError.InsufficientFunds(init_.asset, available, limit_);
        }

        asset = asset_;
        reward = reward_;
        limit = limit_;
        totalClaimed = 0;

        _initializeOwner(msg.sender);
    }

    /// @inheritdoc Incentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The data payload for the incentive `(address asset, uint256 reward, uint256 limit)`
    /// @return budgetData The {Transfer} payload to be passed to the {Budget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        // TODO: remove unused reward param
        (address asset_, uint256 reward_, uint256 limit_) = abi.decode(data_, (address, uint256, uint256));

        return abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC20,
                asset: asset_,
                target: address(this),
                data: abi.encode(Budget.FungiblePayload({amount: limit_}))
            })
        );
    }
}
