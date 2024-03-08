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
        (address asset_, Strategy strategy_, uint256 reward_, uint256 maxClaims_) = _unpackInitializationData(data_);

        // Ensure the strategy is valid (MINT is not yet supported)
        if (strategy_ == Strategy.MINT) revert BoostError.NotImplemented();
        if (reward_ == 0 || maxClaims_ == 0) revert BoostError.InvalidInitialization();

        // Ensure the maximum reward amount has been allocated
        uint256 maxTotalReward = reward_ * maxClaims_;
        uint256 available = asset_.balanceOf(address(this));
        if (available < maxTotalReward) {
            revert BoostError.InsufficientFunds(asset_, available, maxTotalReward);
        }

        asset = asset_;
        strategy = strategy_;
        reward = reward_;
        maxClaims = maxClaims_;
        _initializeOwner(msg.sender);
    }

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external override onlyOwner returns (bool) {
        // Disburse the incentive based on the strategy (POOL only for now)
        if (strategy == Strategy.POOL) {
            (address recipient_,) = _unpackDisbursementData(data_);
            if (!_isClaimable(recipient_)) revert NotClaimable();

            claims++;
            claimed[recipient_] = true;

            asset.safeTransfer(recipient_, reward);
            emit Claimed(recipient_, abi.encodePacked(asset, recipient_, reward));

            return true;
        }

        return false;
    }

    /// @inheritdoc Incentive
    /// @notice Get the required allowance for the incentive
    /// @param data_ The initialization payload for the incentive
    /// @return budgetData The data payload to be passed to the Budget for interpretation
    function preflight(bytes calldata data_) external pure override returns (bytes memory budgetData) {
        (address asset_,, uint256 reward_, uint256 maxClaims_) = _unpackInitializationData(data_);
        return LibZip.cdCompress(abi.encode(asset_, reward_ * maxClaims_));
    }

    /// @notice Check if an incentive is claimable
    /// @param data_ The data payload for the claim check `(address recipient, bytes data)`
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(bytes calldata data_) public view override returns (bool) {
        (address recipient_,) = _unpackDisbursementData(data_);
        return _isClaimable(recipient_);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < maxClaims;
    }

    /// @notice Unpack the data payload for a disbursement operation
    /// @param data_ The compressed data needed for disbursement `(address recipient, bytes data)`
    function _unpackDisbursementData(bytes calldata data_)
        internal
        pure
        returns (address recipient, bytes memory data)
    {
        return abi.decode(data_.cdDecompress(), (address, bytes));
    }

    /// @notice Unpack the data payload for the initialization operation
    /// @param data_ The compressed data needed for initialization `(address asset, Strategy strategy, uint256 reward, uint256 maxClaims)`
    /// @return _asset The address of the ERC20-like token
    /// @return _strategy The strategy for the incentive
    /// @return _reward The reward amount issued for each claim
    /// @return _maxClaims The maximum number of claims that can be made
    function _unpackInitializationData(bytes calldata data_)
        internal
        pure
        returns (address _asset, Strategy _strategy, uint256 _reward, uint256 _maxClaims)
    {
        (_asset, _strategy, _reward, _maxClaims) =
            abi.decode(data_.cdDecompress(), (address, Strategy, uint256, uint256));
    }
}
