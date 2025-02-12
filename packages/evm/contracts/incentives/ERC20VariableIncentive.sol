// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {RBAC} from "contracts/shared/RBAC.sol";
import {IToppable} from "contracts/shared/IToppable.sol";

/// @title ERC20 Incentive with Variable Rewards
/// @notice A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit
contract ERC20VariableIncentive is AERC20VariableIncentive, RBAC, IToppable {
    using SafeTransferLib for address;

    event ERC20VariableIncentiveInitialized(address indexed asset, uint256 reward, uint256 limit);

    /// @notice The reward multiplier; if 0, the signed amount from the claim payload is used directly
    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        uint256 reward;
        uint256 limit;
        address manager;
    }

    /// @inheritdoc AIncentive
    address public override asset;

    /// @inheritdoc AIncentive
    uint256 public override claims;

    /// @inheritdoc AERC20VariableIncentive
    uint256 public override totalClaimed;

    /// @notice Construct a new ERC20VariableIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address asset, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public virtual override initializer {
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
        address manager_ = init_.manager;
        _setRoles(manager_, MANAGER_ROLE);
        emit ERC20VariableIncentiveInitialized(asset_, reward_, limit_);
    }

    /// @notice Claim the incentive with variable rewards
    /// @param data_ The data payload for the incentive claim `(uint256signedAmount)`
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata data_) external virtual override onlyOwner returns (bool) {
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

        if (totalClaimed + claimAmount > limit) revert ClaimFailed();

        totalClaimed += claimAmount;
        claims += 1;
        asset.safeTransfer(claimTarget, claimAmount);

        emit Claimed(claimTarget, abi.encodePacked(asset, claimTarget, claimAmount));
        return true;
    }

    /// @notice Check if an incentive is claimable
    /// @param claimTarget the potential recipient of the payout
    /// @return True if the incentive is claimable based on the data payload
    function isClaimable(address claimTarget, bytes calldata) public view override returns (bool) {
        return _isClaimable(claimTarget);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address) internal view returns (bool) {
        return totalClaimed < limit;
    }

    /// @inheritdoc AIncentive
    function clawback(bytes calldata data_)
        external
        override
        onlyOwnerOrRoles(MANAGER_ROLE)
        returns (uint256, address)
    {
        ClawbackPayload memory claim_ = abi.decode(data_, (ClawbackPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        limit -= amount;

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return (amount, asset);
    }

    /// @notice Top up the incentive with more ERC20 tokens
    /// @dev Uses `msg.sender` as the token source, and uses `asset` to identify which token.
    ///      Caller must approve this contract to spend at least `amount` prior to calling.
    /// @param amount The number of tokens to top up
    function topup(uint256 amount) external virtual override onlyOwnerOrRoles(MANAGER_ROLE) {
        if (amount == 0) {
            revert BoostError.InvalidInitialization();
        }
        // Transfer tokens from the caller into this contract
        asset.safeTransferFrom(msg.sender, address(this), amount);

        // Increase the total incentive limit
        limit += amount;

        emit ToppedUp(msg.sender, amount);
    }

    /// @inheritdoc AIncentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The data payload for the incentive `(address asset, uint256 reward, uint256 limit)`
    /// @return budgetData The {Transfer} payload to be passed to the {ABudget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        // TODO: remove unused reward param
        (address asset_,, uint256 limit_) = abi.decode(data_, (address, uint256, uint256));

        return abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: asset_,
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: limit_}))
            })
        );
    }
}
