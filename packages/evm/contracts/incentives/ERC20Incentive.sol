// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable as AOwnable} from "@solady/auth/Ownable.sol";
import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";

/// @title ERC20 AIncentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
contract ERC20Incentive is AOwnable, AERC20Incentive {
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

    /// @inheritdoc AIncentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The {InitPayload} for the incentive
    /// @return budgetData The {Transfer} payload to be passed to the {ABudget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        uint256 amount = init_.strategy != Strategy.RAFFLE ? init_.reward * init_.limit : init_.reward;

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
    /// @param claimTarget the address receiving the claim
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata) external override onlyOwner returns (bool) {
        if (!_isClaimable(claimTarget)) revert NotClaimable();

        if (strategy == Strategy.POOL) {
            claims++;
            claimed[claimTarget] = true;

            asset.safeTransfer(claimTarget, reward);

            emit Claimed(claimTarget, abi.encodePacked(asset, claimTarget, reward));
            return true;
        } else {
            claims++;
            claimed[claimTarget] = true;
            entries.push(claimTarget);

            emit Entry(claimTarget);
            return true;
        }
    }

    /// @inheritdoc AIncentive
    function clawback(bytes calldata data_) external override onlyOwner returns (bool) {
        ClawbackPayload memory claim_ = abi.decode(data_, (ClawbackPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        if (strategy == Strategy.RAFFLE) {
            // Ensure the amount is the full reward and there are no raffle entries, then reset the limit
            if (amount != reward || claims > 0) revert BoostError.ClaimFailed(msg.sender, abi.encode(claim_));
            limit = 0;
        } else {
            // Ensure the amount is a multiple of the reward and reduce the max claims accordingly
            if (amount % reward != 0) revert BoostError.ClaimFailed(msg.sender, abi.encode(claim_));
            limit -= amount / reward;
        }

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return true;
    }

    /// @notice Check if an incentive is claimable
    /// @param claimTarget the address that could receive the claim
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(address claimTarget, bytes calldata) public view override returns (bool) {
        return _isClaimable(claimTarget);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < limit;
    }

    /// @notice Draw a winner from the raffle
    /// @dev Only valid when the strategy is set to `Strategy.RAFFLE`
    function drawRaffle() external override onlyOwner {
        if (strategy != Strategy.RAFFLE) revert BoostError.Unauthorized();

        LibPRNG.PRNG memory _prng = LibPRNG.PRNG({state: block.prevrandao + block.timestamp});

        address winnerAddress = entries[_prng.next() % entries.length];

        asset.safeTransfer(winnerAddress, reward);
        emit Claimed(winnerAddress, abi.encodePacked(asset, winnerAddress, reward));
    }
}
