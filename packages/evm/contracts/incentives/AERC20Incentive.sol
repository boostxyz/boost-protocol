// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {Incentive} from "./Incentive.sol";

/// @title ERC20 Incentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
abstract contract AERC20Incentive is Incentive {
    using LibPRNG for LibPRNG.PRNG;
    using SafeTransferLib for address;

    /// @notice Emitted when an entry is added to the raffle
    event Entry(address indexed entry);

    /// @notice The strategy for the incentive
    /// @dev The strategy determines how the incentive is disbursed:
    ///     - POOL: Users claim from a pool of rewards until the limit is reached, with each claim receiving an equal share of the total;
    ///     - RAFFLE: Users claim a slot in a raffle, and a single winner is randomly drawn to receive the entire reward amount;
    enum Strategy {
        POOL,
        RAFFLE
    }

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The strategy for the incentive (RAFFLE or POOL)
    Strategy public strategy;

    /// @notice The limit (max claims, or max entries for raffles)
    uint256 public limit;

    /// @notice The set of addresses that have claimed a slot in the incentive raffle
    address[] public entries;

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        if (!_isClaimable(claim_.target)) revert NotClaimable();

        if (strategy == Strategy.POOL) {
            claims++;
            claimed[claim_.target] = true;

            asset.safeTransfer(claim_.target, reward);

            emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, reward));
            return true;
        } else {
            claims++;
            claimed[claim_.target] = true;
            entries.push(claim_.target);

            emit Entry(claim_.target);
            return true;
        }
    }

    /// @inheritdoc Incentive
    function reclaim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
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
    /// @param data_ The data payload for the claim check `(address recipient, bytes data)`
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(bytes calldata data_) public view override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        return _isClaimable(claim_.target);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < limit;
    }

    /// @notice Draw a winner from the raffle
    /// @dev Only valid when the strategy is set to `Strategy.RAFFLE`
    function drawRaffle() external onlyOwner {
        if (strategy != Strategy.RAFFLE) revert BoostError.Unauthorized();

        LibPRNG.PRNG memory _prng = LibPRNG.PRNG({state: block.prevrandao + block.timestamp});

        address winnerAddress = entries[_prng.next() % entries.length];

        asset.safeTransfer(winnerAddress, reward);
        emit Claimed(winnerAddress, abi.encodePacked(asset, winnerAddress, reward));
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Cloneable) returns (bytes4) {
        return type(AERC20Incentive).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Incentive) returns (bool) {
        return interfaceId == type(AERC20Incentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
