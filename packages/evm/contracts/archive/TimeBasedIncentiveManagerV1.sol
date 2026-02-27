// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {UUPSUpgradeable} from "@solady/utils/UUPSUpgradeable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/// @title TimeBasedIncentiveManager V1
/// @notice Factory and orchestration contract for time-based incentive campaigns (Version 1)
/// @dev Archived for upgrade safety validation. See TimeBasedIncentiveManager.sol for current version.
contract TimeBasedIncentiveManagerV1 is Initializable, UUPSUpgradeable, Ownable {
    using SafeTransferLib for address;

    /// @notice Parameters for a single root update in a batch
    struct RootUpdate {
        uint256 campaignId;
        bytes32 root;
        uint256 totalCommitted;
    }

    /// @notice Maximum number of root updates in a single batch
    uint256 public constant MAX_BATCH_SIZE = 50;

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
    uint64 public maxCampaignDuration;

    /// @notice Minimum campaign duration (default 1 day)
    uint64 public minCampaignDuration;

    /// @notice Duration after campaign endTime during which claims are valid (default 60 days)
    uint64 public claimExpiryDuration;

    /// @notice Allocated padding for storage packing
    uint32 private __padding;

    /// @notice Allocated gap space for future variables
    uint256[50] private __gap;

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

    event ProtocolFeeUpdated(uint64 oldFee, uint64 newFee);
    event ProtocolFeeReceiverUpdated(address indexed oldReceiver, address indexed newReceiver);
    event CampaignImplementationUpdated(address indexed oldImplementation, address indexed newImplementation);
    event OperatorUpdated(address indexed oldOperator, address indexed newOperator);
    event RootUpdated(uint256 indexed campaignId, bytes32 oldRoot, bytes32 newRoot, uint256 totalCommitted);
    event Claimed(uint256 indexed campaignId, address indexed user, uint256 amount, uint256 cumulativeAmount);
    event CampaignCancelled(uint256 indexed campaignId, uint64 oldEndTime, uint64 newEndTime);
    event WithdrawnToBudget(uint256 indexed campaignId, uint256 amount, address indexed budget);
    event MaxCampaignDurationUpdated(uint64 oldDuration, uint64 newDuration);
    event MinCampaignDurationUpdated(uint64 oldDuration, uint64 newDuration);
    event ClaimExpiryDurationUpdated(uint64 oldDuration, uint64 newDuration);

    error NotAuthorizedOnBudget();
    error NotCampaignCreator();
    error NotBudgetFunded();
    error CampaignNotEnded();
    error StartTimeInPast();
    error EndTimeBeforeStart();
    error DurationTooLong();
    error DurationTooShort();
    error InvalidDurationRange();
    error ZeroAmount();
    error ZeroFeeReceiver();
    error InvalidRewardToken();
    error ProtocolFeeTooHigh();
    error InvalidImplementation();
    error DisburseFailed();
    error NotAuthorized();
    error InvalidCampaign();
    error ClaimExpiryDurationTooShort();
    error BatchTooLarge();
    error EmptyBatch();
    error FeeOnTransferNotSupported();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

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
        claimExpiryDuration = 60 days;
    }

    function createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        if (!budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        uint64 duration = endTime - startTime;
        if (duration > maxCampaignDuration) revert DurationTooLong();
        if (duration < minCampaignDuration) revert DurationTooShort();

        uint256 feeAmount = (totalAmount * protocolFee) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        address campaign = LibClone.clone(campaignImplementation);
        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        if (feeAmount > 0) {
            uint256 feeReceiverBefore = SafeTransferLib.balanceOf(rewardToken, protocolFeeReceiver);
            bytes memory feeTransfer = abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: rewardToken,
                    target: protocolFeeReceiver,
                    data: abi.encode(ABudget.FungiblePayload({amount: feeAmount}))
                })
            );
            if (!budget.disburse(feeTransfer)) revert DisburseFailed();
            if (SafeTransferLib.balanceOf(rewardToken, protocolFeeReceiver) - feeReceiverBefore != feeAmount) {
                revert FeeOnTransferNotSupported();
            }
        }

        if (netAmount > 0) {
            uint256 campaignBefore = SafeTransferLib.balanceOf(rewardToken, campaign);
            bytes memory rewardTransfer = abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: rewardToken,
                    target: campaign,
                    data: abi.encode(ABudget.FungiblePayload({amount: netAmount}))
                })
            );
            if (!budget.disburse(rewardTransfer)) revert DisburseFailed();
            if (SafeTransferLib.balanceOf(rewardToken, campaign) - campaignBefore != netAmount) {
                revert FeeOnTransferNotSupported();
            }
        }

        TimeBasedIncentiveCampaign(campaign).initialize(
            address(this),
            address(budget),
            msg.sender,
            configHash,
            rewardToken,
            netAmount,
            startTime,
            endTime,
            claimExpiryDuration
        );

        emit CampaignCreated(campaignId, configHash, campaign, msg.sender, rewardToken, netAmount, startTime, endTime);
    }

    function createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        uint64 duration = endTime - startTime;
        if (duration > maxCampaignDuration) revert DurationTooLong();
        if (duration < minCampaignDuration) revert DurationTooShort();

        uint256 feeAmount = (totalAmount * protocolFee) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        uint256 balanceBefore = SafeTransferLib.balanceOf(rewardToken, address(this));
        rewardToken.safeTransferFrom(msg.sender, address(this), totalAmount);
        if (SafeTransferLib.balanceOf(rewardToken, address(this)) - balanceBefore != totalAmount) {
            revert FeeOnTransferNotSupported();
        }

        address campaign = LibClone.clone(campaignImplementation);
        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        if (feeAmount > 0) {
            uint256 feeReceiverBefore = SafeTransferLib.balanceOf(rewardToken, protocolFeeReceiver);
            rewardToken.safeTransfer(protocolFeeReceiver, feeAmount);
            if (SafeTransferLib.balanceOf(rewardToken, protocolFeeReceiver) - feeReceiverBefore != feeAmount) {
                revert FeeOnTransferNotSupported();
            }
        }

        if (netAmount > 0) {
            uint256 campaignBefore = SafeTransferLib.balanceOf(rewardToken, campaign);
            rewardToken.safeTransfer(campaign, netAmount);
            if (SafeTransferLib.balanceOf(rewardToken, campaign) - campaignBefore != netAmount) {
                revert FeeOnTransferNotSupported();
            }
        }

        TimeBasedIncentiveCampaign(campaign).initialize(
            address(this),
            address(0),
            msg.sender,
            configHash,
            rewardToken,
            netAmount,
            startTime,
            endTime,
            claimExpiryDuration
        );

        emit CampaignCreated(campaignId, configHash, campaign, msg.sender, rewardToken, netAmount, startTime, endTime);
    }

    function getCampaign(uint256 campaignId) external view returns (address) {
        return campaigns[campaignId];
    }

    function setProtocolFee(uint64 fee_) external onlyOwner {
        if (fee_ > 10000) revert ProtocolFeeTooHigh();
        uint64 oldFee = protocolFee;
        protocolFee = fee_;
        emit ProtocolFeeUpdated(oldFee, fee_);
    }

    function setProtocolFeeReceiver(address receiver_) external onlyOwner {
        if (receiver_ == address(0)) revert ZeroFeeReceiver();
        address oldReceiver = protocolFeeReceiver;
        protocolFeeReceiver = receiver_;
        emit ProtocolFeeReceiverUpdated(oldReceiver, receiver_);
    }

    function setOperator(address operator_) external onlyOwner {
        address oldOperator = operator;
        operator = operator_;
        emit OperatorUpdated(oldOperator, operator_);
    }

    function setMaxCampaignDuration(uint64 duration_) external onlyOwner {
        if (duration_ < minCampaignDuration) revert InvalidDurationRange();
        uint64 oldDuration = maxCampaignDuration;
        maxCampaignDuration = duration_;
        emit MaxCampaignDurationUpdated(oldDuration, duration_);
    }

    function setMinCampaignDuration(uint64 duration_) external onlyOwner {
        if (duration_ > maxCampaignDuration) revert InvalidDurationRange();
        uint64 oldDuration = minCampaignDuration;
        minCampaignDuration = duration_;
        emit MinCampaignDurationUpdated(oldDuration, duration_);
    }

    function setClaimExpiryDuration(uint64 duration_) external onlyOwner {
        if (duration_ < 1 days) revert ClaimExpiryDurationTooShort();
        uint64 oldDuration = claimExpiryDuration;
        claimExpiryDuration = duration_;
        emit ClaimExpiryDurationUpdated(oldDuration, duration_);
    }

    function updateRoot(uint256 campaignId, bytes32 root, uint256 totalCommitted) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();
        bytes32 oldRoot = TimeBasedIncentiveCampaign(campaign).setMerkleRoot(root, totalCommitted);
        emit RootUpdated(campaignId, oldRoot, root, totalCommitted);
    }

    function updateRootsBatch(RootUpdate[] calldata updates) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();
        if (updates.length == 0) revert EmptyBatch();
        if (updates.length > MAX_BATCH_SIZE) revert BatchTooLarge();

        for (uint256 i; i < updates.length; ++i) {
            address campaign = campaigns[updates[i].campaignId];
            if (campaign == address(0)) revert InvalidCampaign();
            bytes32 oldRoot =
                TimeBasedIncentiveCampaign(campaign).setMerkleRoot(updates[i].root, updates[i].totalCommitted);
            emit RootUpdated(updates[i].campaignId, oldRoot, updates[i].root, updates[i].totalCommitted);
        }
    }

    function setCampaignImplementation(address campaignImpl_) external onlyOwner {
        if (campaignImpl_ == address(0)) revert InvalidImplementation();
        address oldImplementation = campaignImplementation;
        campaignImplementation = campaignImpl_;
        emit CampaignImplementationUpdated(oldImplementation, campaignImpl_);
    }

    function claim(uint256 campaignId, address user, uint256 cumulativeAmount, bytes32[] calldata proof) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();
        uint256 amount = TimeBasedIncentiveCampaign(campaign).processClaim(user, cumulativeAmount, proof);
        emit Claimed(campaignId, user, amount, cumulativeAmount);
    }

    function cancelCampaign(uint256 campaignId) external onlyOwner {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();
        uint64 oldEndTime = TimeBasedIncentiveCampaign(campaign).setEndTime(uint64(block.timestamp));
        emit CampaignCancelled(campaignId, oldEndTime, uint64(block.timestamp));
    }

    function withdrawToBudget(uint256 campaignId) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        TimeBasedIncentiveCampaign c = TimeBasedIncentiveCampaign(campaign);
        if (msg.sender != c.creator()) revert NotCampaignCreator();

        address payable budgetAddr = payable(c.budget());
        if (budgetAddr == address(0)) revert NotBudgetFunded();
        if (block.timestamp <= c.endTime()) revert CampaignNotEnded();

        uint256 withdrawable = c.getWithdrawable();
        if (withdrawable == 0) revert ZeroAmount();

        bytes memory clawbackData = abi.encode(withdrawable);
        ABudget(budgetAddr).clawbackFromTarget(campaign, clawbackData, 0, 0);

        emit WithdrawnToBudget(campaignId, withdrawable, budgetAddr);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function version() public pure virtual returns (string memory) {
        return "1.0.0";
    }
}
