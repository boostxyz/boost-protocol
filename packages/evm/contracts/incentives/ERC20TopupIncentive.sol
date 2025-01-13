// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {RBAC} from "contracts/shared/RBAC.sol";

/// @title ERC20TopupIncentive (Pool-Only)
/// @notice A simple ERC20 incentive that allows claiming of tokens (no raffle logic).
contract ERC20TopupIncentive is RBAC, AERC20Incentive {
    using SafeTransferLib for address;

    /// @notice Emitted upon initialization
    event ERC20IncentiveInitialized( // Pool-Only
    address indexed asset, Strategy strategy, uint256 reward, uint256 limit, address manager);

    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        uint256 reward;
        uint256 limit; // Used only to verify preflight / initial funding
        address manager;
    }

    /// @inheritdoc AIncentive
    address public override asset;

    /// @inheritdoc AIncentive
    uint256 public override claims;

    /// @notice Construct a new ERC20Incentive
    /// @dev This contract is a base implementation and should be cloned, then initialized.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with incentive parameters
    /// @param data_ Encoded `(address asset, uint256 reward, uint256 limit, address manager)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        if (init_.reward == 0 || init_.limit == 0) {
            revert BoostError.InvalidInitialization();
        }

        // Calculate how many tokens must have been sent to fund the initial "limit"
        // (No raffle mode, so total needed is simply reward * limit)
        uint256 maxTotalReward = init_.reward * init_.limit;

        uint256 available = init_.asset.balanceOf(address(this));
        if (available < maxTotalReward) {
            revert BoostError.InsufficientFunds(init_.asset, available, maxTotalReward);
        }

        asset = init_.asset;
        reward = init_.reward;

        _initializeOwner(msg.sender);
        _setRoles(init_.manager, MANAGER_ROLE);

        emit ERC20IncentiveInitialized(init_.asset, Strategy.POOL, init_.reward, init_.limit, init_.manager);
    }

    /// @inheritdoc AIncentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The {InitPayload} for the incentive
    /// @return budgetData The {Transfer} payload to be passed to the {ABudget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        // Pool-only logic: total reward needed = reward * limit
        uint256 amount = init_.reward * init_.limit;

        return abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: init_.asset,
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: amount}))
            })
        );
    }

    /// @notice Claim the incentive
    /// @param claimTarget The address receiving the claim
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata) external override onlyOwner returns (bool) {
        if (!_isClaimable(claimTarget)) revert NotClaimable();

        // Increase total claims and mark user as claimed
        claims++;
        claimed[claimTarget] = true;

        // Transfer the reward to the claimer
        asset.safeTransfer(claimTarget, reward);

        emit Claimed(claimTarget, abi.encodePacked(asset, claimTarget, reward));
        return true;
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

        // In a pool-only scenario, simply allow transferring tokens back
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return (amount, asset);
    }

    /// @notice Check if an incentive is claimable
    /// @dev Ignores extra data for pool-only logic
    function isClaimable(address claimTarget, bytes calldata) public view override returns (bool) {
        return _isClaimable(claimTarget);
    }

    /// @notice The limit (max claims, or max entries for raffles)
    function limit() external virtual override returns (uint256) {
        return _currentLimit();
    }

    function drawRaffle() external override {
        revert BoostError.NotImplemented();
    }

    /// @notice Checks how many claims can be paid out at the current contract balance
    function _currentLimit() internal view returns (uint256) {
        uint256 bal = asset.balanceOf(address(this));
        // We add the claim count so that the limit is the limit of TOTAL claims possible
        // If we didn't add this it would be _remaining_ claims
        return ((reward == 0) ? 0 : bal / reward) + claims;
    }

    /// @notice Checks if a user can claim
    function _isClaimable(address recipient_) internal view returns (bool) {
        // Must not have claimed before
        if (claimed[recipient_]) {
            return false;
        }
        // Must not exceed dynamic limit
        return (claims < _currentLimit());
    }
}
