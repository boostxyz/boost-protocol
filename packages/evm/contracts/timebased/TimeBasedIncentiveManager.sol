// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {UUPSUpgradeable} from "@solady/utils/UUPSUpgradeable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/// @title TimeBasedIncentiveManager
/// @notice Factory and orchestration contract for time-based incentive campaigns
/// @dev Deploys TimeBasedIncentiveCampaign clones and manages protocol fees. UUPS upgradeable.
/// @custom:oz-upgrades-from contracts/archive/TimeBasedIncentives/TimeBasedIncentiveManagerV2.sol:TimeBasedIncentiveManagerV2
contract TimeBasedIncentiveManager is Initializable, UUPSUpgradeable, Ownable {
    using SafeTransferLib for address;

    /// @notice Parameters for a single root update in a batch
    struct RootUpdate {
        uint256 campaignId;
        bytes32 root;
        uint256 totalCommitted;
        bool finalize;
    }

    /// @notice Maximum number of root updates in a single batch
    uint256 public constant MAX_BATCH_SIZE = 50;

    /// @notice Maximum referral fee in basis points of the protocol fee (2500 = 25%)
    uint64 public constant MAX_REFERRAL_FEE_BPS = 2500;

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

    /// @notice Duration after campaign endTime during which claims are valid (default 60 days)
    uint64 public claimExpiryDuration;

    /// @notice Allocated padding for storage packing
    uint32 private __padding;

    /// @notice Referral fee in basis points of the protocol fee, per campaign
    mapping(uint256 => uint64) public campaignReferralFeeBps;

    /// @notice Mapping of campaign ID to referral distributor clone (address(0) if none)
    mapping(uint256 => address) public referralDistributors;

    /// @notice The implementation contract used for cloning referral distributors
    address public referralDistributorImplementation;

    /// @notice Claim window duration passed to new referral distributors (default 60 days)
    uint64 public referralClaimWindowDuration;

    /// @notice Allocated gap space for future variables
    uint256[47] private __gap;

    /// @notice Emitted when a new campaign is created
    event CampaignCreated(
        uint256 campaignId,
        bytes32 configHash,
        address campaign,
        address indexed creator,
        address indexed budget,
        address indexed rewardToken,
        uint256 totalRewards,
        uint64 startTime,
        uint64 endTime,
        uint64 claimExpiryDuration
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

    /// @notice Emitted when undistributed funds are withdrawn
    event Withdrawn(uint256 indexed campaignId, uint256 amount, address indexed destination);

    /// @notice Emitted when max campaign duration is updated
    event MaxCampaignDurationUpdated(uint64 oldDuration, uint64 newDuration);

    /// @notice Emitted when min campaign duration is updated
    event MinCampaignDurationUpdated(uint64 oldDuration, uint64 newDuration);

    /// @notice Emitted when claim expiry duration is updated
    event ClaimExpiryDurationUpdated(uint64 oldDuration, uint64 newDuration);

    /// @notice Emitted when a campaign is finalized
    event CampaignFinalized(uint256 indexed campaignId);

    /// @notice Emitted when a referral distributor is created and funded for a campaign
    event ReferralDistributorCreated(
        uint256 indexed campaignId, address indexed distributor, uint64 referralFeeBps, uint256 referralAmount
    );

    /// @notice Emitted when a campaign's referral root is published or corrected
    event ReferralRootUpdated(uint256 indexed campaignId, bytes32 oldRoot, bytes32 newRoot, uint256 committedTotal);

    /// @notice Emitted when a referrer claims from a campaign's referral pool
    event ReferralClaimed(uint256 indexed campaignId, address indexed referrer, uint256 amount);

    /// @notice Emitted when a campaign's remaining referral pool is swept
    event ReferralPoolSwept(uint256 indexed campaignId, uint256 amount, address indexed destination);

    /// @notice Emitted when the referral distributor implementation is updated
    event ReferralDistributorImplementationUpdated(
        address indexed oldImplementation, address indexed newImplementation
    );

    /// @notice Emitted when the referral claim window duration is updated
    event ReferralClaimWindowDurationUpdated(uint64 oldDuration, uint64 newDuration);

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

    /// @notice Error when claim expiry duration is below the minimum (1 day)
    error ClaimExpiryDurationTooShort();

    /// @notice Error when batch update array exceeds MAX_BATCH_SIZE
    error BatchTooLarge();

    /// @notice Error when batch update array is empty
    error EmptyBatch();

    /// @notice Error when token transfer amount doesn't match (fee-on-transfer tokens)
    error FeeOnTransferNotSupported();

    /// @notice Error when campaign has not been finalized
    error CampaignNotFinalized();

    /// @notice Error when the referral fee exceeds MAX_REFERRAL_FEE_BPS
    error ReferralFeeTooHigh();

    /// @notice Error when referral distributor implementation or claim window is not configured
    error ReferralsNotConfigured();

    /// @notice Error when a campaign has no referral distributor
    error NoReferralDistributor();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the TimeBasedIncentiveManager
    /// @param owner_ The owner of the contract
    /// @param campaignImpl_ The TimeBasedIncentiveCampaign implementation for cloning
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
        claimExpiryDuration = 60 days;
        referralClaimWindowDuration = 60 days;
    }

    /// @notice Create a new time-based incentive campaign funded by a budget
    /// @param budget The budget to fund the campaign from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralFeeBps Referral fee in basis points of the protocol fee (max 2500)
    /// @return campaignId The ID of the created campaign
    function createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint64 referralFeeBps
    ) external returns (uint256 campaignId) {
        // Validate caller is authorized on budget
        if (!budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();

        // Validate parameters
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        if (referralFeeBps > MAX_REFERRAL_FEE_BPS) revert ReferralFeeTooHigh();
        {
            uint64 duration = endTime - startTime;
            if (duration > maxCampaignDuration) revert DurationTooLong();
            if (duration < minCampaignDuration) revert DurationTooShort();
        }

        // Clone the campaign
        address campaign = LibClone.clone(campaignImplementation);

        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        // Split the protocol fee and fund the fee receiver, distributor, and campaign
        (uint256 netAmount, uint256 referralAmount, address distributor) =
            _splitAndFund(budget, rewardToken, totalAmount, referralFeeBps, campaign, campaignId);

        // Initialize the campaign
        TimeBasedIncentiveCampaign(campaign)
            .initialize(
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

        // Initialize the distributor (reads the reward token from the campaign)
        if (distributor != address(0)) {
            ReferralDistributor(distributor)
                .initialize(campaign, campaignId, referralAmount, referralClaimWindowDuration);
            emit ReferralDistributorCreated(campaignId, distributor, referralFeeBps, referralAmount);
        }

        emit CampaignCreated(
            campaignId,
            configHash,
            campaign,
            msg.sender,
            address(budget),
            rewardToken,
            netAmount,
            startTime,
            endTime,
            claimExpiryDuration
        );
    }

    /// @notice Create a new time-based incentive campaign with direct token transfer
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralFeeBps Referral fee in basis points of the protocol fee (max 2500)
    /// @return campaignId The ID of the created campaign
    /// @dev Fee-on-transfer and rebasing tokens are not supported
    /// @dev Caller must approve this contract to transfer tokens before calling
    function createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint64 referralFeeBps
    ) external returns (uint256 campaignId) {
        // Validate parameters
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        if (referralFeeBps > MAX_REFERRAL_FEE_BPS) revert ReferralFeeTooHigh();
        {
            uint64 duration = endTime - startTime;
            if (duration > maxCampaignDuration) revert DurationTooLong();
            if (duration < minCampaignDuration) revert DurationTooShort();
        }

        // Pull tokens from caller and verify full amount received
        {
            uint256 balanceBefore = SafeTransferLib.balanceOf(rewardToken, address(this));
            rewardToken.safeTransferFrom(msg.sender, address(this), totalAmount);
            if (SafeTransferLib.balanceOf(rewardToken, address(this)) - balanceBefore != totalAmount) {
                revert FeeOnTransferNotSupported();
            }
        }

        // Clone the campaign
        address campaign = LibClone.clone(campaignImplementation);

        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        // Split the protocol fee and fund the fee receiver, distributor, and campaign
        (uint256 netAmount, uint256 referralAmount, address distributor) =
            _splitAndFund(ABudget(payable(address(0))), rewardToken, totalAmount, referralFeeBps, campaign, campaignId);

        // Initialize the campaign with budget = address(0) for direct-funded campaigns
        TimeBasedIncentiveCampaign(campaign)
            .initialize(
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

        // Initialize the distributor (reads the reward token from the campaign)
        if (distributor != address(0)) {
            ReferralDistributor(distributor)
                .initialize(campaign, campaignId, referralAmount, referralClaimWindowDuration);
            emit ReferralDistributorCreated(campaignId, distributor, referralFeeBps, referralAmount);
        }

        emit CampaignCreated(
            campaignId,
            configHash,
            campaign,
            msg.sender,
            address(0),
            rewardToken,
            netAmount,
            startTime,
            endTime,
            claimExpiryDuration
        );
    }

    /// @notice Split the protocol fee and fund the fee receiver, referral distributor, and campaign
    /// @param budget The budget to disburse from (pass address(0) to transfer from this contract)
    /// @param rewardToken The ERC20 reward token
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param referralFeeBps Referral fee in basis points of the protocol fee
    /// @param campaign The campaign clone to fund
    /// @param campaignId The campaign ID
    /// @return netAmount Rewards sent to the campaign (total minus fee, unchanged by referrals)
    /// @return referralAmount Referral slice carved from the protocol fee
    /// @return distributor The funded distributor clone (address(0) if the slice is 0)
    function _splitAndFund(
        ABudget budget,
        address rewardToken,
        uint256 totalAmount,
        uint64 referralFeeBps,
        address campaign,
        uint256 campaignId
    ) internal returns (uint256 netAmount, uint256 referralAmount, address distributor) {
        // The referral slice is carved from the fee, not the total, so the net reward
        // budget is unchanged
        uint256 feeAmount = (totalAmount * protocolFee) / 10000;
        referralAmount = (feeAmount * referralFeeBps) / 10000;
        uint256 protocolAmount = feeAmount - referralAmount;
        netAmount = totalAmount - feeAmount;

        // Fee to protocol fee receiver (if fee > 0)
        if (protocolAmount > 0) {
            _fund(budget, rewardToken, protocolFeeReceiver, protocolAmount);
        }

        // Referral slice to a freshly cloned distributor (if slice > 0)
        if (referralAmount > 0) {
            distributor = _cloneReferralDistributor(campaignId, referralFeeBps);
            _fund(budget, rewardToken, distributor, referralAmount);
        }

        // Net rewards to campaign (skip if 0, e.g., 100% fee)
        if (netAmount > 0) {
            _fund(budget, rewardToken, campaign, netAmount);
        }
    }

    /// @notice Send tokens to a target and verify the full amount was received
    /// @param budget The budget to disburse from, or address(0) to transfer from this contract
    /// @param token The ERC20 token to send
    /// @param target The recipient
    /// @param amount The amount to send
    function _fund(ABudget budget, address token, address target, uint256 amount) internal {
        uint256 balanceBefore = SafeTransferLib.balanceOf(token, target);
        if (address(budget) == address(0)) {
            token.safeTransfer(target, amount);
        } else {
            bytes memory transfer = abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: token,
                    target: target,
                    data: abi.encode(ABudget.FungiblePayload({amount: amount}))
                })
            );
            if (!budget.disburse(transfer)) revert DisburseFailed();
        }
        if (SafeTransferLib.balanceOf(token, target) - balanceBefore != amount) {
            revert FeeOnTransferNotSupported();
        }
    }

    /// @notice Clone and register a referral distributor for a campaign
    /// @param campaignId The campaign ID
    /// @param referralFeeBps Referral fee in basis points of the protocol fee
    /// @return distributor The cloned (not yet initialized) distributor
    /// @dev Reverts until the owner configures the distributor implementation and a
    ///      non-zero claim window, so referrals ship dark on upgraded deployments
    function _cloneReferralDistributor(uint256 campaignId, uint64 referralFeeBps)
        internal
        returns (address distributor)
    {
        if (referralDistributorImplementation == address(0) || referralClaimWindowDuration == 0) {
            revert ReferralsNotConfigured();
        }
        distributor = LibClone.clone(referralDistributorImplementation);
        referralDistributors[campaignId] = distributor;
        campaignReferralFeeBps[campaignId] = referralFeeBps;
    }

    /// @notice Get a campaign contract by ID
    /// @param campaignId The campaign ID
    /// @return The campaign contract address
    function getCampaign(uint256 campaignId) external view returns (address) {
        return campaigns[campaignId];
    }

    /// @notice Get the referral distributor for a campaign
    /// @param campaignId The campaign ID
    /// @return The distributor address (address(0) if the campaign has no referral fee)
    function getReferralDistributor(uint256 campaignId) external view returns (address) {
        return referralDistributors[campaignId];
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

    /// @notice Set the claim expiry duration (time after campaign end that claims remain valid)
    /// @param duration_ New claim expiry duration in seconds (minimum 1 day)
    function setClaimExpiryDuration(uint64 duration_) external onlyOwner {
        if (duration_ < 1 days) revert ClaimExpiryDurationTooShort();
        uint64 oldDuration = claimExpiryDuration;
        claimExpiryDuration = duration_;
        emit ClaimExpiryDurationUpdated(oldDuration, duration_);
    }

    /// @notice Update the merkle root for a campaign
    /// @dev Roots are immutable once the campaign is finalized
    /// @param campaignId The campaign ID
    /// @param root The new merkle root
    /// @param totalCommitted Total amount committed to users in the merkle tree
    /// @param finalize If true, marks the campaign as finalized (unlocks withdrawal)
    function updateRoot(uint256 campaignId, bytes32 root, uint256 totalCommitted, bool finalize) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();

        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        bytes32 oldRoot = TimeBasedIncentiveCampaign(campaign).setMerkleRoot(root, totalCommitted);

        emit RootUpdated(campaignId, oldRoot, root, totalCommitted);

        if (finalize && !TimeBasedIncentiveCampaign(campaign).finalized()) {
            TimeBasedIncentiveCampaign(campaign).setFinalized();
            emit CampaignFinalized(campaignId);
        }
    }

    /// @notice Update merkle roots for multiple campaigns in a single transaction
    /// @param updates Array of RootUpdate structs containing campaignId, root, and totalCommitted
    /// @dev If any entry has finalize=true but the campaign hasn't ended, the entire batch reverts.
    ///      Ensure finalize=false for campaigns that have not yet reached an end condition.
    ///      Likewise, an entry for a campaign that has not yet started reverts the entire batch
    ///      (CampaignNotStarted) — exclude campaigns whose startTime is in the future.
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

            if (updates[i].finalize && !TimeBasedIncentiveCampaign(campaign).finalized()) {
                TimeBasedIncentiveCampaign(campaign).setFinalized();
                emit CampaignFinalized(updates[i].campaignId);
            }
        }
    }

    /// @notice Set the campaign implementation address (for upgrades)
    /// @param campaignImpl_ New campaign implementation for cloning
    function setCampaignImplementation(address campaignImpl_) external onlyOwner {
        if (campaignImpl_ == address(0)) revert InvalidImplementation();
        address oldImplementation = campaignImplementation;
        campaignImplementation = campaignImpl_;
        emit CampaignImplementationUpdated(oldImplementation, campaignImpl_);
    }

    /// @notice Set the referral distributor implementation (enables referral campaigns)
    /// @param distributorImpl_ New referral distributor implementation for cloning
    function setReferralDistributorImplementation(address distributorImpl_) external onlyOwner {
        if (distributorImpl_ == address(0)) revert InvalidImplementation();
        address oldImplementation = referralDistributorImplementation;
        referralDistributorImplementation = distributorImpl_;
        emit ReferralDistributorImplementationUpdated(oldImplementation, distributorImpl_);
    }

    /// @notice Set the referral claim window duration passed to new distributors
    /// @param duration_ New duration in seconds (minimum 1 day)
    function setReferralClaimWindowDuration(uint64 duration_) external onlyOwner {
        if (duration_ < 1 days) revert ClaimExpiryDurationTooShort();
        uint64 oldDuration = referralClaimWindowDuration;
        referralClaimWindowDuration = duration_;
        emit ReferralClaimWindowDurationUpdated(oldDuration, duration_);
    }

    /// @notice Claim rewards from a campaign using a merkle proof
    /// @param campaignId The campaign ID to claim from
    /// @param user The user to claim rewards for
    /// @param cumulativeAmount The cumulative amount the user is entitled to
    /// @param proof The merkle proof validating the claim
    function claim(uint256 campaignId, address user, uint256 cumulativeAmount, bytes32[] calldata proof) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        uint256 amount = TimeBasedIncentiveCampaign(campaign).processClaim(user, cumulativeAmount, proof);

        emit Claimed(campaignId, user, amount, cumulativeAmount);
    }

    /// @notice Publish or correct the referral merkle root for a campaign
    /// @param campaignId The campaign ID
    /// @param root The referral merkle root
    /// @param committedTotal Total amount committed to referrers in the tree
    /// @dev The distributor enforces finalization, window, and commitment accounting
    function setReferralRoot(uint256 campaignId, bytes32 root, uint256 committedTotal) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();

        address distributor = referralDistributors[campaignId];
        if (distributor == address(0)) revert NoReferralDistributor();

        bytes32 oldRoot = ReferralDistributor(distributor).setReferralRoot(root, committedTotal);

        emit ReferralRootUpdated(campaignId, oldRoot, root, committedTotal);
    }

    /// @notice Claim a referral payout from a campaign's distributor
    /// @param campaignId The campaign ID
    /// @param referrer The referrer to pay
    /// @param amount The amount the referrer is entitled to
    /// @param proof The merkle proof validating the claim
    function claimReferral(uint256 campaignId, address referrer, uint256 amount, bytes32[] calldata proof) external {
        address distributor = referralDistributors[campaignId];
        if (distributor == address(0)) revert NoReferralDistributor();

        ReferralDistributor(distributor).claimReferral(referrer, amount, proof);

        emit ReferralClaimed(campaignId, referrer, amount);
    }

    /// @notice Sweep a campaign's remaining referral pool to the protocol fee receiver
    /// @param campaignId The campaign ID
    /// @dev Permissionless; the distributor enforces the claim window has elapsed
    function sweepReferralPool(uint256 campaignId) external {
        address distributor = referralDistributors[campaignId];
        if (distributor == address(0)) revert NoReferralDistributor();

        uint256 amount = ReferralDistributor(distributor).sweepReferralPool(protocolFeeReceiver);

        emit ReferralPoolSwept(campaignId, amount, protocolFeeReceiver);
    }

    /// @notice Cancel a campaign (emergency use - sets endTime to now)
    /// @param campaignId The campaign ID to cancel
    /// @dev Callable by owner, budget-authorized users (budget-funded), or creator (direct-funded)
    function cancelCampaign(uint256 campaignId) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        TimeBasedIncentiveCampaign c = TimeBasedIncentiveCampaign(campaign);
        address payable budgetAddr = payable(c.budget());

        if (msg.sender != owner()) {
            if (budgetAddr != address(0)) {
                if (!ABudget(budgetAddr).isAuthorized(msg.sender)) revert NotAuthorized();
            } else {
                if (msg.sender != c.creator()) revert NotAuthorized();
            }
        }

        uint64 oldEndTime = c.setEndTime(uint64(block.timestamp));

        emit CampaignCancelled(campaignId, oldEndTime, uint64(block.timestamp));
    }

    /// @notice Withdraw undistributed funds from a campaign
    /// @param campaignId The campaign ID to withdraw from
    /// @dev Budget-funded: callable by anyone authorized on the budget
    /// @dev Direct-funded: callable by the campaign creator
    function withdraw(uint256 campaignId) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        TimeBasedIncentiveCampaign c = TimeBasedIncentiveCampaign(campaign);
        address payable budgetAddr = payable(c.budget());

        if (budgetAddr != address(0)) {
            if (!ABudget(budgetAddr).isAuthorized(msg.sender)) revert NotAuthorized();
        } else {
            if (msg.sender != c.creator()) revert NotAuthorized();
        }
        if (block.timestamp <= c.endTime() && c.totalCommitted() < c.totalRewards()) revert CampaignNotEnded();
        if (!c.finalized()) revert CampaignNotFinalized();

        if (budgetAddr != address(0)) {
            // Budget-funded: route through budget clawback for accounting
            uint256 withdrawable = c.getWithdrawable();
            if (withdrawable == 0) revert ZeroAmount();

            bytes memory clawbackData = abi.encode(withdrawable);
            (uint256 clawbackAmount,) = ABudget(budgetAddr).clawbackFromTarget(campaign, clawbackData, 0, 0);

            emit Withdrawn(campaignId, clawbackAmount, budgetAddr);
        } else {
            // Direct-funded: transfer to creator
            uint256 amount = c.withdrawTo(c.creator());

            emit Withdrawn(campaignId, amount, c.creator());
        }
    }

    /// @notice Get the withdrawable amount for a campaign
    /// @param campaignId The campaign ID
    /// @return The amount that can be withdrawn (0 if not finalized or campaign hasn't ended)
    function getWithdrawable(uint256 campaignId) external view returns (uint256) {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();
        return TimeBasedIncentiveCampaign(campaign).getWithdrawable();
    }

    /// @notice Authorize an upgrade to a new implementation
    /// @param newImplementation The address of the new implementation
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /// @notice Get the version of the contract
    /// @return The version string
    function version() public pure virtual returns (string memory) {
        return "2.2.0";
    }
}
