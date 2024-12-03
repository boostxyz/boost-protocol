// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {AERC20PeggedIncentive} from "contracts/incentives/AERC20PeggedIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {RBAC} from "contracts/shared/RBAC.sol";

contract ERC20PeggedIncentive is RBAC, AERC20PeggedIncentive {
    using SafeTransferLib for address;

    event ERC20PeggedIncentiveInitialized(
        address indexed asset, address indexed peg, uint256 reward, uint256 limit, address manager
    );

    /// @notice The payload for initializing the incentive
    struct InitPayload {
        address asset;
        address peg;
        uint256 reward;
        uint256 limit;
        address manager;
    }

    /// @inheritdoc AIncentive
    address public override asset;

    /// @inheritdoc AIncentive
    uint256 public override claims;

    /// @inheritdoc AERC20PeggedIncentive
    uint256 public override limit;

    /// @inheritdoc AERC20PeggedIncentive
    uint256 public override totalClaimed;

    // Asset for the peg
    address public peg;

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
        uint256 maxTotalReward = init_.limit;
        uint256 available = init_.asset.balanceOf(address(this));
        if (available < maxTotalReward) {
            revert BoostError.InsufficientFunds(init_.asset, available, maxTotalReward);
        }

        asset = init_.asset;
        peg = init_.peg;
        reward = init_.reward;
        limit = init_.limit;
        _initializeOwner(msg.sender);
        _setRoles(init_.manager, MANAGER_ROLE);
        emit ERC20PeggedIncentiveInitialized(init_.asset, init_.peg, init_.reward, init_.limit, init_.manager);
    }

    /// @inheritdoc AIncentive
    /// @notice Preflight the incentive to determine the required budget action
    /// @param data_ The {InitPayload} for the incentive
    /// @return budgetData The {Transfer} payload to be passed to the {ABudget} for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        uint256 amount = init_.limit;

        return abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC20,
                asset: init_.asset,
                target: address(this),
                data: abi.encode(ABudget.FungiblePayload({amount: amount}))
            })
        );
    }

    /// @notice Claim the incentive with variable rewards
    /// @param data_ The data payload for the incentive claim `(uint256signedAmount)`
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata data_) external virtual override onlyOwner returns (bool) {
        BoostClaimData memory boostClaimData = abi.decode(data_, (BoostClaimData));
        uint256 signedAmount = abi.decode(boostClaimData.incentiveData, (uint256));

        if (!_isClaimable(claimTarget, signedAmount)) revert NotClaimable();

        if (totalClaimed + signedAmount > limit) revert ClaimFailed();

        totalClaimed += signedAmount;
        claims += 1;
        asset.safeTransfer(claimTarget, signedAmount);

        emit Claimed(claimTarget, abi.encodePacked(asset, claimTarget, signedAmount));
        return true;
    }

    /// @inheritdoc AIncentive
    function clawback(bytes calldata data_) external override onlyRoles(MANAGER_ROLE) returns (uint256, address) {
        ClawbackPayload memory claim_ = abi.decode(data_, (ClawbackPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        limit -= amount;

        // Transfer the tokens back to the intended recipient
        asset.safeTransfer(claim_.target, amount);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, amount));

        return (amount, asset);
    }

    /// @notice Check if an incentive is claimable
    /// @param claimTarget the address that could receive the claim
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(address claimTarget, bytes calldata data_) public view override returns (bool) {
        BoostClaimData memory boostClaimData = abi.decode(data_, (BoostClaimData));
        uint256 signedAmount = abi.decode(boostClaimData.incentiveData, (uint256));

        return _isClaimable(claimTarget, signedAmount);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_, uint256 amount) internal view returns (bool) {
        return !claimed[recipient_] && (totalClaimed + amount) <= limit;
    }

    function getPeg() external view override returns (address) {
        return peg;
    }
}
