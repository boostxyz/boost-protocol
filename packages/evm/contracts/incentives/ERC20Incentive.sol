// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {RBAC} from "contracts/shared/RBAC.sol";
import {IToppable} from "contracts/shared/IToppable.sol";

/// @title ERC20 AIncentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
contract ERC20Incentive is RBAC, AERC20Incentive, IToppable {
    using LibPRNG for LibPRNG.PRNG;
    using SafeTransferLib for address;

    event ERC20IncentiveInitialized(
        address indexed asset, Strategy strategy, uint256 reward, uint256 limit, address manager
    );

    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        Strategy strategy;
        uint256 reward;
        uint256 limit;
        address manager;
    }

    /// @inheritdoc AIncentive
    address public override asset;

    /// @inheritdoc AIncentive
    uint256 public override claims;

    /// @inheritdoc AERC20Incentive
    uint256 public override limit;

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
        _setRoles(init_.manager, MANAGER_ROLE);
        emit ERC20IncentiveInitialized(init_.asset, init_.strategy, init_.reward, init_.limit, init_.manager);
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
    function clawback(bytes calldata data_)
        external
        override
        onlyOwnerOrRoles(MANAGER_ROLE)
        returns (uint256, address)
    {
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

        // For RAFFLE strategy, decide whether or not to allow multiple prizes
        // For simplicity, revert here:
        if (strategy == Strategy.RAFFLE) {
            revert BoostError.Unauthorized();
        }

        // For POOL strategy, each claim uses `reward` tokens, so require multiples
        if (amount % reward != 0) {
            revert BoostError.InvalidInitialization();
        }

        // Increase how many times this incentive can be claimed
        uint256 additionalClaims = amount / reward;
        limit += additionalClaims;

        emit ToppedUp(msg.sender, amount);
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
    function drawRaffle() external override onlyRoles(MANAGER_ROLE) {
        if (strategy != Strategy.RAFFLE) revert BoostError.Unauthorized();

        LibPRNG.PRNG memory _prng = LibPRNG.PRNG({state: block.prevrandao + block.timestamp});

        address winnerAddress = entries[_prng.next() % entries.length];

        asset.safeTransfer(winnerAddress, reward);
        emit Claimed(winnerAddress, abi.encodePacked(asset, winnerAddress, reward));
    }
}
