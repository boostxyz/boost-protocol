// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";
import {Budget} from "contracts/budgets/Budget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
/// @title ERC20 Incentive with Variable Rewards
/// @notice A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit

contract ERC20VariableIncentive is Incentive {
    using SafeTransferLib for address;

    /// @notice The reward multiplier; if 0, the signed amount from the claim payload is used directly
    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        uint256 reward;
        uint256 limit;
    }

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The spending limit (max total claimable amount)
    uint256 public limit;

    /// @notice The total amount claimed so far
    uint256 public totalClaimed;

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

    /// @notice Claim the incentive with variable rewards
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        uint256 signedAmount = abi.decode(claim_.data, (uint256));
        uint256 claimAmount;
        if (!_isClaimable(claim_.target)) revert NotClaimable();

        if (reward == 0) {
            claimAmount = signedAmount;
        } else {
            // NOTE: this is assuming that the signed scalar is in ETH decimal format
            claimAmount = reward * signedAmount / 1e18;
        }

        if (totalClaimed + claimAmount > limit) revert ClaimFailed();

        totalClaimed += claimAmount;
        asset.safeTransfer(claim_.target, claimAmount);

        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, claimAmount));
        return true;
    }

    /// @notice Check if an incentive is claimable
    /// @param data_ The data payload for the claim check `(address recipient, bytes data)`
    /// @return True if the incentive is claimable based on the data payload
    function isClaimable(bytes calldata data_) public view override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        return _isClaimable(claim_.target);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return totalClaimed < limit;
    }

    /// @inheritdoc Incentive
    function reclaim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        limit -= amount;

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return true;
    }

    /// @inheritdoc Incentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The data payload for the incentive `(address asset, uint256 reward, uint256 limit)`
    /// @return budgetData The {Transfer} payload to be passed to the {Budget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
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

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Cloneable) returns (bytes4) {
        return type(Incentive).interfaceId;
    }

    /// @inheritdoc Incentive
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(Incentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
