// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {StreamingCampaign} from "contracts/streaming/StreamingCampaign.sol";

/// @title StreamingManager
/// @notice Factory and orchestration contract for streaming incentive campaigns
/// @dev Deploys StreamingCampaign clones and manages protocol fees
contract StreamingManager is Ownable {
    using SafeTransferLib for address;

    /// @notice The implementation contract used for cloning campaigns
    address public immutable campaignImplementation;

    /// @notice Mapping of campaign ID to campaign contract address
    mapping(uint256 => address) public campaigns;

    /// @notice Total number of campaigns created
    uint256 public campaignCount;

    /// @notice Protocol fee in basis points (1000 = 10%)
    uint64 public protocolFee;

    /// @notice Address that receives protocol fees
    address public protocolFeeReceiver;

    /// @notice Emitted when a new campaign is created
    event CampaignCreated(
        uint256 indexed campaignId,
        bytes32 indexed configHash,
        address campaign,
        address indexed creator,
        address rewardToken,
        uint256 totalRewards,
        uint64 startTime,
        uint64 endTime
    );

    /// @notice Emitted when the protocol fee is updated
    event ProtocolFeeUpdated(uint64 oldFee, uint64 newFee);

    /// @notice Emitted when the protocol fee receiver is updated
    event ProtocolFeeReceiverUpdated(address oldReceiver, address newReceiver);

    /// @notice Error when caller is not authorized on the budget
    error NotAuthorizedOnBudget();

    /// @notice Error when start time is in the past
    error StartTimeInPast();

    /// @notice Error when end time is not after start time
    error EndTimeBeforeStart();

    /// @notice Error when total amount is zero
    error ZeroAmount();

    /// @notice Error when fee receiver is zero address
    error ZeroFeeReceiver();

    /// @notice Error when reward token is zero address
    error InvalidRewardToken();

    /// @notice Error when protocol fee exceeds 100%
    error ProtocolFeeTooHigh();

    /// @notice Error when campaign implementation is zero address
    error InvalidImplementation();

    /// @notice Error when budget disburse fails
    error DisburseFailed();

    /// @notice Deploy a new StreamingManager
    /// @param campaignImpl_ The StreamingCampaign implementation for cloning
    /// @param protocolFee_ Initial protocol fee in basis points
    /// @param protocolFeeReceiver_ Address to receive protocol fees
    constructor(address campaignImpl_, uint64 protocolFee_, address protocolFeeReceiver_) {
        if (campaignImpl_ == address(0)) revert InvalidImplementation();
        if (protocolFeeReceiver_ == address(0)) revert ZeroFeeReceiver();
        if (protocolFee_ > 10000) revert ProtocolFeeTooHigh();

        _initializeOwner(msg.sender);
        campaignImplementation = campaignImpl_;
        protocolFee = protocolFee_;
        protocolFeeReceiver = protocolFeeReceiver_;
    }

    /// @notice Create a new streaming campaign funded by a budget
    /// @param budget The budget to fund the campaign from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @return campaignId The ID of the created campaign
    function createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        // Validate caller is authorized on budget
        if (!budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();

        // Validate parameters
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();

        // Calculate protocol fee
        uint256 feeAmount = (totalAmount * protocolFee) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        // Clone the campaign
        address campaign = LibClone.clone(campaignImplementation);

        // Disburse fee to protocol fee receiver (if fee > 0)
        if (feeAmount > 0) {
            bytes memory feeTransfer = abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: rewardToken,
                    target: protocolFeeReceiver,
                    data: abi.encode(ABudget.FungiblePayload({amount: feeAmount}))
                })
            );
            if (!budget.disburse(feeTransfer)) revert DisburseFailed();
        }

        // Disburse net rewards to campaign (skip if 0, e.g., 100% fee)
        if (netAmount > 0) {
            bytes memory rewardTransfer = abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: rewardToken,
                    target: campaign,
                    data: abi.encode(ABudget.FungiblePayload({amount: netAmount}))
                })
            );
            if (!budget.disburse(rewardTransfer)) revert DisburseFailed();
        }

        // Initialize the campaign
        StreamingCampaign(campaign).initialize(
            address(this),
            address(budget),
            msg.sender,
            configHash,
            rewardToken,
            netAmount,
            startTime,
            endTime
        );

        // Store campaign and increment counter
        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        emit CampaignCreated(
            campaignId,
            configHash,
            campaign,
            msg.sender,
            rewardToken,
            netAmount,
            startTime,
            endTime
        );
    }

    /// @notice Get a campaign contract by ID
    /// @param campaignId The campaign ID
    /// @return The campaign contract address
    function getCampaign(uint256 campaignId) external view returns (address) {
        return campaigns[campaignId];
    }
}
