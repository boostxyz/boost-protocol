// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {UUPSUpgradeable} from "@solady/utils/UUPSUpgradeable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {StreamingCampaign} from "contracts/streaming/StreamingCampaign.sol";

/// @title StreamingManager
/// @notice Factory and orchestration contract for streaming incentive campaigns
/// @dev Deploys StreamingCampaign clones and manages protocol fees. UUPS upgradeable.
contract StreamingManager is Initializable, UUPSUpgradeable, Ownable {
    using SafeTransferLib for address;

    /// @notice The implementation contract used for cloning campaigns
    address public campaignImplementation;

    /// @notice Mapping of campaign ID to campaign contract address
    mapping(uint256 => address) public campaigns;

    /// @notice Total number of campaigns created
    uint256 public campaignCount;

    /// @notice Protocol fee in basis points (1000 = 10%)
    uint64 public protocolFee;

    /// @notice Address that receives protocol fees
    address public protocolFeeReceiver;

    /// @notice Address authorized to publish merkle roots
    address public operator;

    /// @notice Allocated padding for storage packing
    uint32 private __padding;

    /// @notice Allocated gap space for future variables
    uint256[50] private __gap;

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
    event ProtocolFeeReceiverUpdated(address indexed oldReceiver, address indexed newReceiver);

    /// @notice Emitted when the campaign implementation is updated
    event CampaignImplementationUpdated(address indexed oldImplementation, address indexed newImplementation);

    /// @notice Emitted when the operator is updated
    event OperatorUpdated(address indexed oldOperator, address indexed newOperator);

    /// @notice Emitted when a campaign's merkle root is updated
    event RootUpdated(uint256 indexed campaignId, bytes32 oldRoot, bytes32 newRoot, uint256 totalCommitted);

    /// @notice Emitted when a user claims rewards from a campaign
    event Claimed(uint256 indexed campaignId, address indexed user, uint256 amount, uint256 cumulativeAmount);

    /// @notice Emitted when a campaign is cancelled by protocol admin
    event CampaignCancelled(uint256 indexed campaignId, uint64 oldEndTime, uint64 newEndTime);

    /// @notice Emitted when undistributed funds are withdrawn to budget
    event WithdrawnToBudget(uint256 indexed campaignId, uint256 amount, address indexed budget);

    /// @notice Error when caller is not authorized on the budget
    error NotAuthorizedOnBudget();

    /// @notice Error when caller is not the campaign creator
    error NotCampaignCreator();

    /// @notice Error when campaign is not budget-funded
    error NotBudgetFunded();

    /// @notice Error when campaign has not ended
    error CampaignNotEnded();

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

    /// @notice Error when caller is not owner or operator
    error NotAuthorized();

    /// @notice Error when campaign does not exist
    error InvalidCampaign();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the StreamingManager
    /// @param owner_ The owner of the contract
    /// @param campaignImpl_ The StreamingCampaign implementation for cloning
    /// @param protocolFee_ Initial protocol fee in basis points
    /// @param protocolFeeReceiver_ Address to receive protocol fees
    function initialize(address owner_, address campaignImpl_, uint64 protocolFee_, address protocolFeeReceiver_)
        external
        initializer
    {
        if (campaignImpl_ == address(0)) revert InvalidImplementation();
        if (protocolFeeReceiver_ == address(0)) revert ZeroFeeReceiver();
        if (protocolFee_ > 10000) revert ProtocolFeeTooHigh();

        _initializeOwner(owner_);
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

        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

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
            address(this), address(budget), msg.sender, configHash, rewardToken, netAmount, startTime, endTime
        );

        emit CampaignCreated(campaignId, configHash, campaign, msg.sender, rewardToken, netAmount, startTime, endTime);
    }

    /// @notice Create a new streaming campaign with direct token transfer
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @return campaignId The ID of the created campaign
    /// @dev Caller must approve this contract to transfer tokens before calling
    function createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        // Validate parameters
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();

        // Calculate protocol fee
        uint256 feeAmount = (totalAmount * protocolFee) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        // Pull tokens from caller
        rewardToken.safeTransferFrom(msg.sender, address(this), totalAmount);

        // Clone the campaign
        address campaign = LibClone.clone(campaignImplementation);

        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        // Transfer fee to protocol fee receiver (if fee > 0)
        if (feeAmount > 0) {
            rewardToken.safeTransfer(protocolFeeReceiver, feeAmount);
        }

        // Transfer net rewards to campaign (skip if 0, e.g., 100% fee)
        if (netAmount > 0) {
            rewardToken.safeTransfer(campaign, netAmount);
        }

        // Initialize the campaign with budget = address(0) for direct-funded campaigns
        StreamingCampaign(campaign).initialize(
            address(this), address(0), msg.sender, configHash, rewardToken, netAmount, startTime, endTime
        );

        emit CampaignCreated(campaignId, configHash, campaign, msg.sender, rewardToken, netAmount, startTime, endTime);
    }

    /// @notice Get a campaign contract by ID
    /// @param campaignId The campaign ID
    /// @return The campaign contract address
    function getCampaign(uint256 campaignId) external view returns (address) {
        return campaigns[campaignId];
    }

    /// @notice Set the protocol fee
    /// @param fee_ New protocol fee in basis points (max 10000 = 100%)
    function setProtocolFee(uint64 fee_) external onlyOwner {
        if (fee_ > 10000) revert ProtocolFeeTooHigh();
        uint64 oldFee = protocolFee;
        protocolFee = fee_;
        emit ProtocolFeeUpdated(oldFee, fee_);
    }

    /// @notice Set the protocol fee receiver address
    /// @param receiver_ New address to receive protocol fees
    function setProtocolFeeReceiver(address receiver_) external onlyOwner {
        if (receiver_ == address(0)) revert ZeroFeeReceiver();
        address oldReceiver = protocolFeeReceiver;
        protocolFeeReceiver = receiver_;
        emit ProtocolFeeReceiverUpdated(oldReceiver, receiver_);
    }

    /// @notice Set the operator address (engine hot wallet for merkle root publishing)
    /// @param operator_ New operator address (can be zero to disable)
    function setOperator(address operator_) external onlyOwner {
        address oldOperator = operator;
        operator = operator_;
        emit OperatorUpdated(oldOperator, operator_);
    }

    /// @notice Update the merkle root for a campaign
    /// @param campaignId The campaign ID
    /// @param root The new merkle root
    function updateRoot(uint256 campaignId, bytes32 root) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();

        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        bytes32 oldRoot = StreamingCampaign(campaign).setMerkleRoot(root);

        emit RootUpdated(campaignId, oldRoot, root);
    }

    /// @notice Set the campaign implementation address (for upgrades)
    /// @param campaignImpl_ New campaign implementation for cloning
    function setCampaignImplementation(address campaignImpl_) external onlyOwner {
        if (campaignImpl_ == address(0)) revert InvalidImplementation();
        address oldImplementation = campaignImplementation;
        campaignImplementation = campaignImpl_;
        emit CampaignImplementationUpdated(oldImplementation, campaignImpl_);
    }

    /// @notice Claim rewards from a campaign using a merkle proof
    /// @param campaignId The campaign ID to claim from
    /// @param user The user to claim rewards for
    /// @param cumulativeAmount The cumulative amount the user is entitled to
    /// @param proof The merkle proof validating the claim
    function claim(uint256 campaignId, address user, uint256 cumulativeAmount, bytes32[] calldata proof) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        uint256 amount = StreamingCampaign(campaign).processClaim(user, cumulativeAmount, proof);

        emit Claimed(campaignId, user, amount, cumulativeAmount);
    }

    /// @notice Authorize an upgrade to a new implementation
    /// @param newImplementation The address of the new implementation
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
