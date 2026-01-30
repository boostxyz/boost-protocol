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

    /// @notice Maximum campaign duration (default 365 days)
    /// @dev Helps catch mistakes like using milliseconds instead of seconds
    uint64 public maxCampaignDuration;

    /// @notice Minimum campaign duration (default 1 day)
    /// @dev Ensures engine has time to compute and publish at least one merkle root
    uint64 public minCampaignDuration;

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

    /// @notice Emitted when max campaign duration is updated
    event MaxCampaignDurationUpdated(uint64 oldDuration, uint64 newDuration);

    /// @notice Emitted when min campaign duration is updated
    event MinCampaignDurationUpdated(uint64 oldDuration, uint64 newDuration);

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

    /// @notice Error when campaign duration exceeds maximum (365 days)
    error DurationTooLong();

    /// @notice Error when campaign duration is less than minimum (1 day)
    error DurationTooShort();

    /// @notice Error when min duration exceeds max duration
    error InvalidDurationRange();

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
        maxCampaignDuration = 365 days;
        minCampaignDuration = 1 days;
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
        uint64 duration = endTime - startTime;
        if (duration > maxCampaignDuration) revert DurationTooLong();
        if (duration < minCampaignDuration) revert DurationTooShort();

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
        uint64 duration = endTime - startTime;
        if (duration > maxCampaignDuration) revert DurationTooLong();
        if (duration < minCampaignDuration) revert DurationTooShort();

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

    /// @notice Set the maximum campaign duration
    /// @param duration_ New max duration in seconds
    function setMaxCampaignDuration(uint64 duration_) external onlyOwner {
        if (duration_ < minCampaignDuration) revert InvalidDurationRange();
        uint64 oldDuration = maxCampaignDuration;
        maxCampaignDuration = duration_;
        emit MaxCampaignDurationUpdated(oldDuration, duration_);
    }

    /// @notice Set the minimum campaign duration
    /// @param duration_ New min duration in seconds
    function setMinCampaignDuration(uint64 duration_) external onlyOwner {
        if (duration_ > maxCampaignDuration) revert InvalidDurationRange();
        uint64 oldDuration = minCampaignDuration;
        minCampaignDuration = duration_;
        emit MinCampaignDurationUpdated(oldDuration, duration_);
    }

    /// @notice Update the merkle root for a campaign
    /// @param campaignId The campaign ID
    /// @param root The new merkle root
    /// @param totalCommitted Total amount committed to users in the merkle tree
    function updateRoot(uint256 campaignId, bytes32 root, uint256 totalCommitted) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();

        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        bytes32 oldRoot = StreamingCampaign(campaign).setMerkleRoot(root, totalCommitted);

        emit RootUpdated(campaignId, oldRoot, root, totalCommitted);
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

    /// @notice Cancel a campaign (emergency use - sets endTime to now)
    /// @param campaignId The campaign ID to cancel
    /// @dev Only callable by owner
    function cancelCampaign(uint256 campaignId) external onlyOwner {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        uint64 oldEndTime = StreamingCampaign(campaign).setEndTime(uint64(block.timestamp));

        emit CampaignCancelled(campaignId, oldEndTime, uint64(block.timestamp));
    }

    /// @notice Withdraw undistributed funds back to budget (budget-funded campaigns only)
    /// @param campaignId The campaign ID to withdraw from
    /// @dev Only callable by the campaign creator after the campaign has ended
    /// @dev Routes through budget.clawbackFromTarget() to maintain budget accounting
    function withdrawToBudget(uint256 campaignId) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        StreamingCampaign c = StreamingCampaign(campaign);

        if (msg.sender != c.creator()) revert NotCampaignCreator();

        address payable budgetAddr = payable(c.budget());
        if (budgetAddr == address(0)) revert NotBudgetFunded();

        if (block.timestamp <= c.endTime()) revert CampaignNotEnded();

        uint256 withdrawable = c.getWithdrawable();
        if (withdrawable == 0) revert ZeroAmount();

        // Route through budget.clawbackFromTarget() to maintain _distributedFungible accounting
        bytes memory clawbackData = abi.encode(withdrawable);
        ABudget(budgetAddr).clawbackFromTarget(campaign, clawbackData, 0, 0);

        emit WithdrawnToBudget(campaignId, withdrawable, budgetAddr);
    }

    /// @notice Authorize an upgrade to a new implementation
    /// @param newImplementation The address of the new implementation
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
