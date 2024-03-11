// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {Budget} from "src/budgets/Budget.sol";
import {Incentive} from "./Incentive.sol";

/// @title ERC20 Incentive
/// @notice A simple ERC20 incentive implementation that allows claiming of tokens
contract ERC20Incentive is Incentive {
    using LibZip for bytes;
    using SafeTransferLib for address;

    /// @notice The strategy for the incentive
    /// @dev The strategy determines how the incentive is disbursed:
    ///     - POOL: Transfer tokens from the budget to the recipient
    ///     - MINT: Mint tokens to the recipient directly (not yet implemented)
    enum Strategy {
        POOL,
        MINT
    }

    /// @notice The payload for initializing an ERC20Incentive
    struct InitPayload {
        address asset;
        Strategy strategy;
        uint256 reward;
        uint256 maxClaims;
    }

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The strategy for the incentive (MINT or POOL)
    Strategy public strategy;

    /// @notice The reward amount issued for each claim
    uint256 public reward;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public maxClaims;

    /// @notice The number of claims that have been made
    uint256 public claims;

    /// @notice A mapping of address to claim status
    mapping(address => bool) public claimed;

    /// @notice Construct a new ERC20Incentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address asset, Strategy strategy, uint256 reward, uint256 maxClaims)`
    function initialize(bytes calldata data_) external override initializer {
        InitPayload memory init_ = abi.decode(data_.cdDecompress(), (InitPayload));

        // Ensure the strategy is valid (MINT is not yet supported)
        if (init_.strategy == Strategy.MINT) revert BoostError.NotImplemented();
        if (init_.reward == 0 || init_.maxClaims == 0) revert BoostError.InvalidInitialization();

        // Ensure the maximum reward amount has been allocated
        uint256 maxTotalReward = init_.reward * init_.maxClaims;
        uint256 available = init_.asset.balanceOf(address(this));
        if (available < maxTotalReward) {
            revert BoostError.InsufficientFunds(init_.asset, available, maxTotalReward);
        }

        asset = init_.asset;
        strategy = init_.strategy;
        reward = init_.reward;
        maxClaims = init_.maxClaims;
        _initializeOwner(msg.sender);
    }

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external override onlyOwner returns (bool) {
        // Disburse the incentive based on the strategy (POOL only for now)
        if (strategy == Strategy.POOL) {
            ClaimPayload memory claim_ = abi.decode(data_.cdDecompress(), (ClaimPayload));
            if (!_isClaimable(claim_.target)) revert NotClaimable();

            claims++;
            claimed[claim_.target] = true;

            asset.safeTransfer(claim_.target, reward);
            emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, reward));

            return true;
        }

        return false;
    }

    /// @inheritdoc Incentive
    function reclaim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_.cdDecompress(), (ClaimPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        // Ensure the amount is a multiple of the reward and reduce the max claims accordingly
        if (amount % reward != 0) revert BoostError.ClaimFailed(msg.sender, abi.encodePacked(claim_.target, amount));
        maxClaims -= amount / reward;

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
        InitPayload memory init_ = abi.decode(data_.cdDecompress(), (InitPayload));
        return LibZip.cdCompress(
            abi.encode(
                Budget.Transfer({
                    assetType: Budget.AssetType.ERC20,
                    asset: init_.asset,
                    target: address(this),
                    data: abi.encode(Budget.FungiblePayload({amount: init_.reward * init_.maxClaims}))
                })
            )
        );
    }

    /// @notice Check if an incentive is claimable
    /// @param data_ The data payload for the claim check `(address recipient, bytes data)`
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(bytes calldata data_) public view override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_.cdDecompress(), (ClaimPayload));
        return _isClaimable(claim_.target);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < maxClaims;
    }
}
