// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ERC20 Incentive with Variable Rewards
/// @notice A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit
abstract contract AERC20VariableIncentive is AIncentive {
    using SafeTransferLib for address;

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The spending limit (max total claimable amount)
    uint256 public limit;

    /// @notice The total amount claimed so far
    uint256 public totalClaimed;

    /// @notice Claim the incentive with variable rewards
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
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

        if (totalClaimed + claimAmount > limit) revert ClaimFailed();

        totalClaimed += claimAmount;
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
    function clawback(bytes calldata data_) external override onlyOwner returns (bool) {
        ClawbackPayload memory claim_ = abi.decode(data_, (ClawbackPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        limit -= amount;

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return true;
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AERC20VariableIncentive).interfaceId;
    }

    /// @inheritdoc AIncentive
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(AERC20VariableIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
