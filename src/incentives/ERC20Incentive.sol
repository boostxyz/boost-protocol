// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "lib/solady/src/utils/LibPRNG.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {Budget} from "src/budgets/Budget.sol";
import {Incentive} from "./Incentive.sol";

/// @title ERC20 Incentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
contract ERC20Incentive is Incentive {
    using LibPRNG for LibPRNG.PRNG;
    using SafeTransferLib for address;

    /// @notice Emitted when an entry is added to the raffle
    event Entry(address indexed entry);

    /// @notice The strategy for the incentive
    /// @dev The strategy determines how the incentive is disbursed:
    ///     - POOL: Users claim from a pool of rewards until the limit is reached, with each claim receiving an equal share of the total;
    ///     - MINT: New tokens are minted and distributed to the recipient, with each claim receiving an equal amount of newly issued tokens;
    ///     - RAFFLE: Users claim a slot in a raffle, and a single winner is randomly drawn to receive the entire reward amount;
    enum Strategy {
        POOL,
        MINT,
        RAFFLE
    }

    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        Strategy strategy;
        uint256 reward;
        uint256 limit;
    }

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The strategy for the incentive (MINT or POOL)
    Strategy public strategy;

    /// @notice The reward amount issued for each claim
    uint256 public reward;

    /// @notice The limit (max claims, or max entries for raffles)
    uint256 public limit;

    /// @notice The set of addresses that have claimed a slot in the incentive raffle
    address[] public entries;

    /// @notice Construct a new ERC20Incentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address asset, Strategy strategy, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        // Ensure the strategy is valid (MINT is not yet supported)
        if (init_.strategy == Strategy.MINT) revert BoostError.NotImplemented();
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
        } else if (strategy == Strategy.RAFFLE) {
            claims++;
            claimed[claim_.target] = true;
            entries.push(claim_.target);

            emit Entry(claim_.target);
            return true;
        }

        return false;
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
}
