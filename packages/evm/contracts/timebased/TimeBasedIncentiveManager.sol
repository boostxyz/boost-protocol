// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {UUPSUpgradeable} from "@solady/utils/UUPSUpgradeable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ITBIProtocolFeeModule} from "contracts/timebased/ITBIProtocolFeeModule.sol";
import {OpenEndedIncentiveCampaign} from "contracts/timebased/OpenEndedIncentiveCampaign.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/// @title TimeBasedIncentiveManager
/// @notice Factory and orchestration contract for time-based incentive campaigns
/// @dev Deploys TimeBasedIncentiveCampaign and OpenEndedIncentiveCampaign clones, manages
///      protocol fees, and runs each campaign's referral pools. UUPS upgradeable.
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

    /// @notice A referral pool funded alongside a campaign
    /// @param token The ERC20 token the pool pays referrers in; need not be the reward token
    /// @param amount The amount funded into the pool, on top of the campaign's total
    struct ReferralPoolParams {
        address token;
        uint256 amount;
    }

    /// @notice Maximum number of root updates in a single batch
    uint256 public constant MAX_BATCH_SIZE = 50;

    /// @notice Maximum number of referral pools per campaign (bounds the finalize loop)
    uint256 public constant MAX_REFERRAL_POOLS = 8;

    /// @dev Sentinel for "no protocol fee requested": apply the top of the allowed range
    uint256 private constant NO_FEE_REQUEST = type(uint256).max;

    /// @dev Budget placeholder for direct-funded campaigns: rewards and pools are pulled from the caller
    ABudget private constant NO_BUDGET = ABudget(payable(address(0)));

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

    /// @dev Formerly the per-campaign referral fee bps; the slot is kept so live proxies keep their layout
    /// @custom:oz-renamed-from campaignReferralFeeBps
    mapping(uint256 => uint64) private __deprecatedCampaignReferralFeeBps;

    /// @dev Distributors cloned before a campaign could hold several pools, one per campaign.
    ///      Read as pool 0 while the campaign's pool list is empty; the list takes over,
    ///      starting with this clone, once a further pool is added
    /// @custom:oz-renamed-from referralDistributors
    mapping(uint256 => address) private __legacyReferralDistributors;

    /// @notice The implementation contract used for cloning referral distributors
    address public referralDistributorImplementation;

    /// @notice Claim window duration passed to new referral distributors (default 60 days)
    uint64 public referralClaimWindowDuration;

    /// @notice Optional fee policy consulted at campaign creation (address(0) = standard fee only)
    /// @dev The module can only lower the fee: the applied fee is min(moduleFee, protocolFee)
    address public protocolFeeModule;

    /// @notice The implementation contract used for cloning open-ended campaigns
    address public openEndedCampaignImplementation;

    /// @notice Whether a campaign was created as open-ended (accepts top-ups via addRewards)
    mapping(uint256 => bool) public isOpenEnded;

    /// @notice Protocol fee in basis points applied at creation, snapshotted for an open-ended
    ///         campaign's top-ups (unset for fixed-end campaigns)
    mapping(uint256 => uint64) public campaignProtocolFeeBps;

    /// @notice Mapping of campaign ID to its referral distributor clones, one per pool, by pool index
    /// @dev Empty for a campaign whose only pool predates pool indexing; see __legacyReferralDistributors
    mapping(uint256 => address[]) private campaignReferralPools;

    /// @notice Allocated gap space for future variables
    uint256[42] private __gap;

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

    /// @notice Emitted when a referral pool is created and funded for a campaign
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool's index among the campaign's referral pools
    /// @param distributor The distributor clone holding the pool
    /// @param token The ERC20 token the pool pays referrers in
    /// @param amount The pool's initial funding
    event ReferralPoolCreated(
        uint256 indexed campaignId,
        uint256 indexed poolIndex,
        address indexed distributor,
        address token,
        uint256 amount
    );

    /// @notice Emitted when a referral pool is topped up
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool's index among the campaign's referral pools
    /// @param funder The caller that funded the top-up
    /// @param amount The amount added, in the pool's token
    /// @param newReferralPool The pool's total funding after the top-up
    event ReferralPoolFunded(
        uint256 indexed campaignId,
        uint256 indexed poolIndex,
        address indexed funder,
        uint256 amount,
        uint256 newReferralPool
    );

    /// @notice Emitted when a referral pool's root is published or corrected
    event ReferralRootUpdated(
        uint256 indexed campaignId, uint256 indexed poolIndex, bytes32 oldRoot, bytes32 newRoot, uint256 committedTotal
    );

    /// @notice Emitted when a referrer claims from a referral pool
    event ReferralClaimed(
        uint256 indexed campaignId, uint256 indexed poolIndex, address indexed referrer, uint256 amount
    );

    /// @notice Emitted when a referral pool's remaining balance is swept
    event ReferralPoolSwept(
        uint256 indexed campaignId, uint256 indexed poolIndex, uint256 amount, address indexed destination
    );

    /// @notice Emitted when the referral distributor implementation is updated
    event ReferralDistributorImplementationUpdated(
        address indexed oldImplementation, address indexed newImplementation
    );

    /// @notice Emitted when the referral claim window duration is updated
    event ReferralClaimWindowDurationUpdated(uint64 oldDuration, uint64 newDuration);

    /// @notice Emitted when the protocol fee module is updated
    event ProtocolFeeModuleUpdated(address indexed oldModule, address indexed newModule);

    /// @notice Emitted with the protocol fee actually charged to a campaign at creation
    event ProtocolFeeApplied(uint256 indexed campaignId, uint64 feeBps, uint256 feeAmount);

    /// @notice Emitted when the fee module fails to quote and the standard fee is applied instead
    event ProtocolFeeModuleFallback(address indexed module, address indexed creator, address indexed budget);

    /// @notice Emitted when the open-ended campaign implementation is updated
    event OpenEndedCampaignImplementationUpdated(address indexed oldImplementation, address indexed newImplementation);

    /// @notice Emitted when an open-ended campaign is topped up
    /// @param campaignId The campaign ID
    /// @param funder The budget-authorized caller that funded the top-up
    /// @param totalAmount Gross top-up drawn from the campaign's budget
    /// @param netAmount Rewards added to the campaign (total minus fee)
    /// @param feeAmount Protocol fee at the campaign's snapshotted rate
    /// @param newTotalRewards The campaign's total rewards after the top-up
    event RewardsAdded(
        uint256 indexed campaignId,
        address indexed funder,
        uint256 totalAmount,
        uint256 netAmount,
        uint256 feeAmount,
        uint256 newTotalRewards
    );

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

    /// @notice Error when a referral pool's token is the zero address
    error InvalidReferralToken();

    /// @notice Error when a campaign already has MAX_REFERRAL_POOLS referral pools
    error TooManyReferralPools();

    /// @notice Error when funding a referral pool of a campaign that has ended or been finalized
    error CampaignEnded();

    /// @notice Error when referral distributor implementation or claim window is not configured
    error ReferralsNotConfigured();

    /// @notice Error when a campaign has no referral distributor
    error NoReferralDistributor();

    /// @notice Error when the protocol fee module address has no code
    error InvalidProtocolFeeModule();

    /// @notice Error when a requested protocol fee is outside the range allowed for the creator
    error ProtocolFeeOutOfRange(uint64 requestedFeeBps, uint64 minFeeBps, uint64 maxFeeBps);

    /// @notice Error when topping up a campaign that is not open-ended
    error NotOpenEnded();

    /// @notice Error when creating an open-ended campaign with a zero emission rate
    error ZeroEmissionRate();

    /// @notice Error when an open-ended campaign's net funding covers less than a day of emission
    error InitialFundingTooSmall();

    /// @notice Error when a referral pool's distributor cannot accept top-ups (a clone of a
    ///         template deployed before ReferralDistributor.addToPool)
    error ReferralDistributorNotTopUpCompatible();

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
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @return campaignId The ID of the created campaign
    /// @dev Legacy overload preserving the pre-referral selector; creates the campaign
    ///      with no referral pools so existing callers keep working across the upgrade
    function createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        return _createCampaign(budget, configHash, rewardToken, totalAmount, startTime, endTime, NO_FEE_REQUEST);
    }

    /// @notice Create a new time-based incentive campaign funded by a budget, with referral pools
    /// @param budget The budget to fund the campaign and its referral pools from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralPools Referral pools funded on top of totalAmount, each in its own token
    ///        (empty = no referral pool); no protocol fee is taken from them
    /// @return campaignId The ID of the created campaign
    function createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        ReferralPoolParams[] calldata referralPools
    ) external returns (uint256 campaignId) {
        campaignId = _createCampaign(budget, configHash, rewardToken, totalAmount, startTime, endTime, NO_FEE_REQUEST);
        _createReferralPools(campaignId, referralPools);
    }

    /// @notice Create a budget-funded campaign at a protocol fee chosen by the creator
    /// @param budget The budget to fund the campaign and its referral pools from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralPools Referral pools funded on top of totalAmount, each in its own token
    ///        (empty = no referral pool); no protocol fee is taken from them
    /// @param protocolFeeBps Protocol fee in basis points; must lie within the range
    ///        quoteProtocolFeeRange reports for the caller and budget
    /// @return campaignId The ID of the created campaign
    function createCampaignWithProtocolFee(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        ReferralPoolParams[] calldata referralPools,
        uint64 protocolFeeBps
    ) external returns (uint256 campaignId) {
        campaignId = _createCampaign(budget, configHash, rewardToken, totalAmount, startTime, endTime, protocolFeeBps);
        _createReferralPools(campaignId, referralPools);
    }

    /// @notice Create a new fixed-end campaign (shared by all fixed-end entry points)
    /// @param budget The budget to fund from, or NO_BUDGET to pull the rewards from the caller
    /// @param requestedFeeBps The creator's protocol fee, or NO_FEE_REQUEST for the default
    function _createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 requestedFeeBps
    ) internal returns (uint256 campaignId) {
        // Validate caller is authorized on budget
        if (address(budget) != address(0) && !budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();

        // Validate parameters
        _validateCampaignParams(rewardToken, totalAmount, startTime, endTime);

        // Direct funding: pull tokens from caller and verify full amount received
        if (address(budget) == address(0)) _pullFromCaller(rewardToken, address(this), totalAmount);

        // Clone the campaign
        address campaign = LibClone.clone(campaignImplementation);

        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;

        // Split the protocol fee and fund the fee receiver and campaign
        (uint256 netAmount,) = _splitAndFund(budget, rewardToken, totalAmount, requestedFeeBps, campaign, campaignId);

        // Initialize the campaign (budget = address(0) for direct-funded campaigns)
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

        _announceCampaign(campaignId, configHash, campaign, address(budget), rewardToken, netAmount, startTime, endTime);
    }

    /// @notice Create a new time-based incentive campaign with direct token transfer
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @return campaignId The ID of the created campaign
    /// @dev Legacy overload preserving the pre-referral selector; creates the campaign
    ///      with no referral pools so existing callers keep working across the upgrade
    function createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        return _createCampaign(NO_BUDGET, configHash, rewardToken, totalAmount, startTime, endTime, NO_FEE_REQUEST);
    }

    /// @notice Create a new time-based incentive campaign with direct token transfer, with referral pools
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralPools Referral pools pulled from the caller on top of totalAmount, each in
    ///        its own token (empty = no referral pool); no protocol fee is taken from them
    /// @return campaignId The ID of the created campaign
    /// @dev Fee-on-transfer and rebasing tokens are not supported
    /// @dev Caller must approve this contract to transfer the reward and pool tokens before calling
    function createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        ReferralPoolParams[] calldata referralPools
    ) external returns (uint256 campaignId) {
        campaignId = _createCampaign(
            NO_BUDGET, configHash, rewardToken, totalAmount, startTime, endTime, NO_FEE_REQUEST
        );
        _createReferralPools(campaignId, referralPools);
    }

    /// @notice Create a direct-funded campaign at a protocol fee chosen by the creator
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralPools Referral pools pulled from the caller on top of totalAmount, each in
    ///        its own token (empty = no referral pool); no protocol fee is taken from them
    /// @param protocolFeeBps Protocol fee in basis points; must lie within the range
    ///        quoteProtocolFeeRange reports for the caller with no budget
    /// @return campaignId The ID of the created campaign
    /// @dev Fee-on-transfer and rebasing tokens are not supported
    /// @dev Caller must approve this contract to transfer the reward and pool tokens before calling
    function createCampaignDirectWithProtocolFee(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        ReferralPoolParams[] calldata referralPools,
        uint64 protocolFeeBps
    ) external returns (uint256 campaignId) {
        campaignId = _createCampaign(
            NO_BUDGET, configHash, rewardToken, totalAmount, startTime, endTime, protocolFeeBps
        );
        _createReferralPools(campaignId, referralPools);
    }

    /// @notice Create an open-ended campaign funded by a budget
    /// @param budget The budget to fund the campaign and its referral pools from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Initial reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Maximum campaign end timestamp; the campaign ends earlier if its
    ///        rewards are exhausted or it is cancelled
    /// @param emissionRate Flow rate in reward-token base units per second, scaled by 1e12
    /// @param referralPools Referral pools funded on top of totalAmount, each in its own token
    ///        (empty = no referral pool); no protocol fee is taken from them
    /// @return campaignId The ID of the created campaign
    function createOpenEndedCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 emissionRate,
        ReferralPoolParams[] calldata referralPools
    ) external returns (uint256 campaignId) {
        campaignId = _createOpenEndedCampaign(
            budget, configHash, rewardToken, totalAmount, startTime, endTime, emissionRate, NO_FEE_REQUEST
        );
        _createReferralPools(campaignId, referralPools);
    }

    /// @notice Create a budget-funded open-ended campaign at a protocol fee chosen by the creator
    /// @param budget The budget to fund the campaign and its referral pools from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Initial reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Maximum campaign end timestamp
    /// @param emissionRate Flow rate in reward-token base units per second, scaled by 1e12
    /// @param referralPools Referral pools funded on top of totalAmount, each in its own token
    ///        (empty = no referral pool); no protocol fee is taken from them
    /// @param protocolFeeBps Protocol fee in basis points; must lie within the range
    ///        quoteProtocolFeeRange reports for the caller and budget
    /// @return campaignId The ID of the created campaign
    function createOpenEndedCampaignWithProtocolFee(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 emissionRate,
        ReferralPoolParams[] calldata referralPools,
        uint64 protocolFeeBps
    ) external returns (uint256 campaignId) {
        campaignId = _createOpenEndedCampaign(
            budget, configHash, rewardToken, totalAmount, startTime, endTime, emissionRate, protocolFeeBps
        );
        _createReferralPools(campaignId, referralPools);
    }

    /// @notice Create a new open-ended campaign funded by a budget (shared by both entry points)
    /// @param requestedFeeBps The creator's protocol fee, or NO_FEE_REQUEST for the default
    /// @dev Validates like _createCampaign, plus a non-zero emission rate and initial net
    ///      funding of at least a day of emission. The applied protocol fee is recorded so
    ///      every top-up is charged at the creation-time rate
    function _createOpenEndedCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 emissionRate,
        uint256 requestedFeeBps
    ) internal returns (uint256 campaignId) {
        // Validate caller is authorized on budget
        if (!budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();

        // Validate parameters
        _validateCampaignParams(rewardToken, totalAmount, startTime, endTime);
        if (emissionRate == 0) revert ZeroEmissionRate();

        // Clone the campaign. The implementation is unset until the owner configures it,
        // so open-ended campaigns ship dark
        address campaign;
        {
            address implementation = openEndedCampaignImplementation;
            if (implementation == address(0)) revert InvalidImplementation();
            campaign = LibClone.clone(implementation);
        }

        campaignId = ++campaignCount;
        campaigns[campaignId] = campaign;
        isOpenEnded[campaignId] = true;

        // Scoped to keep the CampaignCreated emit within stack limits
        uint256 netAmount;
        {
            // Split the protocol fee, fund the fee receiver and campaign, and snapshot the fee
            (uint256 net, uint64 feeBps) =
                _splitAndFund(budget, rewardToken, totalAmount, requestedFeeBps, campaign, campaignId);
            campaignProtocolFeeBps[campaignId] = feeBps;
            netAmount = net;

            // Initialize the campaign
            _initializeOpenEndedCampaign(
                campaign, address(budget), configHash, rewardToken, netAmount, startTime, endTime, emissionRate
            );
        }

        _announceCampaign(campaignId, configHash, campaign, address(budget), rewardToken, netAmount, startTime, endTime);
    }

    /// @notice Emit CampaignCreated for a newly initialized campaign
    /// @dev Shared by every creation path so the event encoding exists once in the bytecode
    function _announceCampaign(
        uint256 campaignId,
        bytes32 configHash,
        address campaign,
        address budget,
        address rewardToken,
        uint256 netAmount,
        uint64 startTime,
        uint64 endTime
    ) internal {
        emit CampaignCreated(
            campaignId,
            configHash,
            campaign,
            msg.sender,
            budget,
            rewardToken,
            netAmount,
            startTime,
            endTime,
            claimExpiryDuration
        );
    }

    /// @notice Initialize an open-ended campaign clone and check its initial funding
    /// @dev Split out of _createOpenEndedCampaign to stay within stack limits. The minimum
    ///      is read from the initialized campaign so the rule lives in one place
    function _initializeOpenEndedCampaign(
        address campaign,
        address budget,
        bytes32 configHash,
        address rewardToken,
        uint256 netAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 emissionRate
    ) internal {
        OpenEndedIncentiveCampaign(campaign)
            .initialize(
                address(this),
                budget,
                msg.sender,
                configHash,
                rewardToken,
                netAmount,
                startTime,
                endTime,
                claimExpiryDuration,
                emissionRate
            );
        if (netAmount < OpenEndedIncentiveCampaign(campaign).minTopUp()) revert InitialFundingTooSmall();
    }

    /// @notice Top up an open-ended campaign's rewards from its own budget
    /// @param campaignId The campaign ID
    /// @param totalAmount Gross top-up; the protocol fee is taken from it
    /// @dev The fee is charged at the rate snapshotted at creation, not the current fee or
    ///      fee module. Referral pools are not touched; fundReferralPool tops those up on
    ///      their own. Both legs are funded and balance-checked before the campaign records
    ///      the top-up, which reverts once the campaign is finalized or past its end, or
    ///      when the net top-up is below its minimum
    function addRewards(uint256 campaignId, uint256 totalAmount) external {
        if (!isOpenEnded[campaignId]) revert NotOpenEnded();

        OpenEndedIncentiveCampaign c = OpenEndedIncentiveCampaign(campaigns[campaignId]);
        ABudget budget = ABudget(payable(c.budget()));
        if (!budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();

        address rewardToken = c.rewardToken();

        uint256 feeAmount = (totalAmount * campaignProtocolFeeBps[campaignId]) / 10000;
        uint256 netAmount = totalAmount - feeAmount;

        if (feeAmount > 0) {
            _fund(budget, rewardToken, protocolFeeReceiver, feeAmount);
        }
        if (netAmount > 0) {
            _fund(budget, rewardToken, address(c), netAmount);
        }

        uint256 newTotalRewards = c.addRewards(netAmount);

        emit RewardsAdded(campaignId, msg.sender, totalAmount, netAmount, feeAmount, newTotalRewards);
    }

    /// @notice Add a referral pool to a campaign
    /// @param campaignId The campaign ID
    /// @param token The ERC20 token the pool pays referrers in
    /// @param amount The amount funded into the pool
    /// @return poolIndex The new pool's index among the campaign's referral pools
    /// @dev A budget-funded campaign draws the pool from its budget, and any caller authorized
    ///      on the budget may add one; a direct-funded campaign pulls the pool from its creator,
    ///      who must approve this contract first. Only while the campaign runs: pools are
    ///      settled against the final reward tree once the campaign finalizes
    function addReferralPool(uint256 campaignId, address token, uint256 amount) external returns (uint256 poolIndex) {
        (address campaign, ABudget budget) = _requireReferralPoolFunder(campaignId);
        poolIndex = _addReferralPool(campaignId, campaign, budget, token, amount);
    }

    /// @notice Top up one of a campaign's referral pools
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool to top up
    /// @param amount The amount to add, in the pool's token
    /// @dev Same funding and access rules as addReferralPool. Only this pool changes: the
    ///      campaign's other pools and its rewards are untouched
    function fundReferralPool(uint256 campaignId, uint256 poolIndex, uint256 amount) external {
        (, ABudget budget) = _requireReferralPoolFunder(campaignId);
        if (amount == 0) revert ZeroAmount();

        address distributor = _referralPoolOrRevert(campaignId, poolIndex);
        _requireTopUpCompatible(distributor);

        address token = ReferralDistributor(distributor).referralToken();
        _fundReferralPool(budget, token, distributor, amount);
        ReferralDistributor(distributor).addToPool(amount);

        emit ReferralPoolFunded(
            campaignId, poolIndex, msg.sender, amount, ReferralDistributor(distributor).referralPool()
        );
    }

    /// @notice Resolve a campaign and check that the caller may fund its referral pools now
    /// @param campaignId The campaign ID
    /// @return campaign The campaign contract address
    /// @return budget The campaign's budget (address(0) for a direct-funded campaign)
    function _requireReferralPoolFunder(uint256 campaignId) internal view returns (address campaign, ABudget budget) {
        campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        TimeBasedIncentiveCampaign c = TimeBasedIncentiveCampaign(campaign);
        budget = _requireCampaignController(c);
        if (c.finalized() || block.timestamp >= c.endTime()) revert CampaignEnded();
    }

    /// @notice Revert unless the caller controls a campaign's funds
    /// @param c The campaign
    /// @return budget The campaign's budget (address(0) for a direct-funded campaign)
    /// @dev Budget-funded: anyone authorized on the budget. Direct-funded: the creator
    function _requireCampaignController(TimeBasedIncentiveCampaign c) internal view returns (ABudget budget) {
        budget = ABudget(payable(c.budget()));
        if (address(budget) != address(0)) {
            if (!budget.isAuthorized(msg.sender)) revert NotAuthorized();
        } else if (msg.sender != c.creator()) {
            revert NotAuthorized();
        }
    }

    /// @notice Create the referral pools requested at campaign creation
    /// @param campaignId The campaign ID
    /// @param pools The pools to create, in index order
    /// @dev Runs after the campaign is initialized and announced, so every ReferralPoolCreated
    ///      follows its CampaignCreated
    function _createReferralPools(uint256 campaignId, ReferralPoolParams[] calldata pools) internal {
        if (pools.length == 0) return;

        address campaign = campaigns[campaignId];
        ABudget budget = ABudget(payable(TimeBasedIncentiveCampaign(campaign).budget()));
        for (uint256 i; i < pools.length; ++i) {
            _addReferralPool(campaignId, campaign, budget, pools[i].token, pools[i].amount);
        }
    }

    /// @notice Clone, fund, and initialize the distributor for a new referral pool
    /// @param campaignId The campaign ID
    /// @param campaign The initialized campaign the pool pays referrals for
    /// @param budget The budget to draw from, or address(0) to pull from the caller
    /// @param token The ERC20 token the pool pays referrers in
    /// @param amount The amount funded into the pool
    /// @return poolIndex The new pool's index among the campaign's referral pools
    /// @dev A campaign whose only pool predates pool indexing has that distributor moved into
    ///      its pool list as pool 0 before the new pool is appended, so indexes never shift
    function _addReferralPool(uint256 campaignId, address campaign, ABudget budget, address token, uint256 amount)
        internal
        returns (uint256 poolIndex)
    {
        if (token == address(0)) revert InvalidReferralToken();
        if (amount == 0) revert ZeroAmount();

        address[] storage pools = campaignReferralPools[campaignId];
        if (pools.length == 0) {
            address legacy = __legacyReferralDistributors[campaignId];
            if (legacy != address(0)) pools.push(legacy);
        }
        poolIndex = pools.length;
        if (poolIndex >= MAX_REFERRAL_POOLS) revert TooManyReferralPools();

        address distributor = _cloneReferralDistributor();
        pools.push(distributor);
        _fundReferralPool(budget, token, distributor, amount);
        ReferralDistributor(distributor)
            .initialize(campaign, campaignId, poolIndex, token, amount, referralClaimWindowDuration);

        emit ReferralPoolCreated(campaignId, poolIndex, distributor, token, amount);
    }

    /// @notice Send pool tokens to a distributor and verify the full amount arrived
    /// @param budget The budget to disburse from, or address(0) to pull from the caller
    /// @param token The ERC20 token to send
    /// @param distributor The distributor to fund
    /// @param amount The amount to send
    function _fundReferralPool(ABudget budget, address token, address distributor, uint256 amount) internal {
        if (address(budget) != address(0)) {
            _fund(budget, token, distributor, amount);
        } else {
            _pullFromCaller(token, distributor, amount);
        }
    }

    /// @notice Pull tokens from the caller to a target and verify the full amount arrived
    /// @param token The ERC20 token to pull
    /// @param target The recipient
    /// @param amount The amount to pull
    function _pullFromCaller(address token, address target, uint256 amount) internal {
        uint256 balanceBefore = SafeTransferLib.balanceOf(token, target);
        token.safeTransferFrom(msg.sender, target, amount);
        if (SafeTransferLib.balanceOf(token, target) - balanceBefore != amount) {
            revert FeeOnTransferNotSupported();
        }
    }

    /// @notice Revert unless a referral pool's distributor accepts top-ups
    /// @param distributor The distributor clone to probe
    /// @dev A low-level staticcall turns a missing selector (clones of templates deployed
    ///      before addToPool) or a malformed or false answer into
    ///      ReferralDistributorNotTopUpCompatible instead of an opaque revert
    function _requireTopUpCompatible(address distributor) internal view {
        (bool ok, bytes memory ret) = distributor.staticcall(abi.encodeCall(ReferralDistributor.supportsTopUps, ()));
        if (!ok || ret.length != 32 || uint256(bytes32(ret)) != 1) revert ReferralDistributorNotTopUpCompatible();
    }

    /// @notice Validate the parameters shared by every campaign creation path
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    function _validateCampaignParams(address rewardToken, uint256 totalAmount, uint64 startTime, uint64 endTime)
        internal
        view
    {
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        uint64 duration = endTime - startTime;
        if (duration > maxCampaignDuration) revert DurationTooLong();
        if (duration < minCampaignDuration) revert DurationTooShort();
    }

    /// @notice Take the protocol fee from the total and fund the fee receiver and campaign
    /// @param budget The budget to disburse from (pass address(0) to transfer from this contract)
    /// @param rewardToken The ERC20 reward token
    /// @param totalAmount Total reward amount funded; the protocol fee is taken from it
    /// @param requestedFeeBps The creator's protocol fee, or NO_FEE_REQUEST for the default
    /// @param campaign The campaign clone to fund
    /// @param campaignId The campaign ID
    /// @return netAmount Rewards sent to the campaign (total minus fee)
    /// @return feeBps The protocol fee in basis points that was applied
    function _splitAndFund(
        ABudget budget,
        address rewardToken,
        uint256 totalAmount,
        uint256 requestedFeeBps,
        address campaign,
        uint256 campaignId
    ) internal returns (uint256 netAmount, uint64 feeBps) {
        feeBps = _selectProtocolFee(
            ITBIProtocolFeeModule.FeeContext({
                creator: msg.sender, budget: address(budget), rewardToken: rewardToken, totalAmount: totalAmount
            }),
            requestedFeeBps
        );

        uint256 feeAmount = (totalAmount * feeBps) / 10000;
        netAmount = totalAmount - feeAmount;
        emit ProtocolFeeApplied(campaignId, feeBps, feeAmount);

        // Fee to protocol fee receiver (if fee > 0)
        if (feeAmount > 0) {
            _fund(budget, rewardToken, protocolFeeReceiver, feeAmount);
        }

        // Net rewards to campaign (skip if 0, e.g., 100% fee)
        if (netAmount > 0) {
            _fund(budget, rewardToken, campaign, netAmount);
        }
    }

    /// @notice Pick the protocol fee for a campaign from the range the module allows
    /// @param ctx The campaign's fee context
    /// @param requestedFeeBps The creator's protocol fee, or NO_FEE_REQUEST for the default
    /// @return The fee in basis points to apply
    /// @dev Without a request the top of the range applies. With one, the request must lie
    ///      inside the range or creation reverts: a creator asking for a fee they are not
    ///      allowed finds out rather than being charged something else. The check lives
    ///      here, not in the module, because a reverting module falls back to the standard
    ///      fee and would otherwise swallow the rejection.
    function _selectProtocolFee(ITBIProtocolFeeModule.FeeContext memory ctx, uint256 requestedFeeBps)
        internal
        returns (uint64)
    {
        (uint64 minFeeBps, uint64 maxFeeBps) = _resolveProtocolFeeRange(ctx);
        if (requestedFeeBps == NO_FEE_REQUEST) return maxFeeBps;
        if (requestedFeeBps < minFeeBps || requestedFeeBps > maxFeeBps) {
            // forge-lint: disable-next-line(unsafe-typecast)
            revert ProtocolFeeOutOfRange(uint64(requestedFeeBps), minFeeBps, maxFeeBps);
        }
        // forge-lint: disable-next-line(unsafe-typecast)
        return uint64(requestedFeeBps); // guarded: requestedFeeBps <= maxFeeBps, a uint64
    }

    /// @notice Resolve the range of protocol fees for a campaign, consulting the fee module if set
    /// @param ctx The campaign's fee context
    /// @return minFeeBps Lowest fee the creator may pick; never above maxFeeBps
    /// @return maxFeeBps Fee applied by default; never above the standard protocol fee
    /// @dev The module is reached via a low-level staticcall so that a reverting module,
    ///      an EOA, or malformed return data all fall back to the standard fee (with an
    ///      event) instead of blocking campaign creation. Failing open to the higher fee
    ///      is safe for the protocol, and unsetting a broken module is behind the owner's
    ///      timelock. Both bounds are capped at the standard fee, so the module can only
    ///      ever discount.
    function _resolveProtocolFeeRange(ITBIProtocolFeeModule.FeeContext memory ctx)
        internal
        returns (uint64 minFeeBps, uint64 maxFeeBps)
    {
        address module = protocolFeeModule;
        if (module == address(0)) return (protocolFee, protocolFee);

        (bool ok, bytes memory ret) =
            module.staticcall(abi.encodeCall(ITBIProtocolFeeModule.quoteProtocolFeeRange, (ctx)));
        if (!ok || ret.length != 64) {
            emit ProtocolFeeModuleFallback(module, ctx.creator, ctx.budget);
            return (protocolFee, protocolFee);
        }

        (uint256 moduleMin, uint256 moduleMax) = abi.decode(ret, (uint256, uint256));
        return _capFeeRange(moduleMin, moduleMax);
    }

    /// @notice Cap a module-reported fee range at the standard protocol fee
    /// @param moduleMin The module's lower bound
    /// @param moduleMax The module's upper bound
    /// @return minFeeBps The lower bound, capped so that minFeeBps <= maxFeeBps
    /// @return maxFeeBps The upper bound, capped at the standard protocol fee
    function _capFeeRange(uint256 moduleMin, uint256 moduleMax)
        internal
        view
        returns (uint64 minFeeBps, uint64 maxFeeBps)
    {
        // forge-lint: disable-start(unsafe-typecast)
        maxFeeBps = moduleMax >= protocolFee ? protocolFee : uint64(moduleMax);
        minFeeBps = moduleMin >= maxFeeBps ? maxFeeBps : uint64(moduleMin);
        // forge-lint: disable-end(unsafe-typecast)
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

    /// @notice Clone a referral distributor
    /// @return distributor The cloned (not yet initialized) distributor
    /// @dev Reverts until the owner configures the distributor implementation and a
    ///      non-zero claim window, so referrals ship dark on upgraded deployments
    function _cloneReferralDistributor() internal returns (address distributor) {
        if (referralDistributorImplementation == address(0) || referralClaimWindowDuration == 0) {
            revert ReferralsNotConfigured();
        }
        distributor = LibClone.clone(referralDistributorImplementation);
    }

    /// @notice Look up the distributor for one of a campaign's referral pools
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool index
    /// @return The distributor address (address(0) if the campaign has no such pool)
    function _referralPool(uint256 campaignId, uint256 poolIndex) internal view returns (address) {
        address[] storage pools = campaignReferralPools[campaignId];
        if (pools.length != 0) return poolIndex < pools.length ? pools[poolIndex] : address(0);
        return poolIndex == 0 ? __legacyReferralDistributors[campaignId] : address(0);
    }

    /// @notice Look up the distributor for one of a campaign's referral pools, reverting if none
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool index
    /// @return distributor The distributor address
    function _referralPoolOrRevert(uint256 campaignId, uint256 poolIndex) internal view returns (address distributor) {
        distributor = _referralPool(campaignId, poolIndex);
        if (distributor == address(0)) revert NoReferralDistributor();
    }

    /// @notice Get a campaign contract by ID
    /// @param campaignId The campaign ID
    /// @return The campaign contract address
    function getCampaign(uint256 campaignId) external view returns (address) {
        return campaigns[campaignId];
    }

    /// @notice Get a campaign's referral distributors, one per pool, by pool index
    /// @param campaignId The campaign ID
    /// @return pools The distributor addresses (empty if the campaign has no referral pool)
    function getReferralDistributors(uint256 campaignId) public view returns (address[] memory pools) {
        pools = campaignReferralPools[campaignId];
        if (pools.length != 0) return pools;

        address legacy = __legacyReferralDistributors[campaignId];
        if (legacy == address(0)) return pools;
        pools = new address[](1);
        pools[0] = legacy;
    }

    /// @notice Get the distributor for one of a campaign's referral pools
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool index
    /// @return The distributor address (address(0) if the campaign has no such pool)
    function getReferralDistributor(uint256 campaignId, uint256 poolIndex) external view returns (address) {
        return _referralPool(campaignId, poolIndex);
    }

    /// @notice Get the number of referral pools a campaign has
    /// @param campaignId The campaign ID
    /// @return The pool count
    function referralPoolCount(uint256 campaignId) external view returns (uint256) {
        return getReferralDistributors(campaignId).length;
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

    /// @notice Set the protocol fee module
    /// @param module_ New fee module (address(0) disables discounts; standard fee applies)
    function setProtocolFeeModule(address module_) external onlyOwner {
        if (module_ != address(0) && module_.code.length == 0) revert InvalidProtocolFeeModule();
        address oldModule = protocolFeeModule;
        protocolFeeModule = module_;
        emit ProtocolFeeModuleUpdated(oldModule, module_);
    }

    /// @notice Quote the range of protocol fees a campaign may be charged at creation
    /// @param creator The account that will create the campaign
    /// @param budget The funding budget, or address(0) for a direct-funded campaign
    /// @param rewardToken The ERC20 reward token
    /// @param totalAmount Gross reward amount, before the protocol fee is deducted
    /// @return minFeeBps Lowest fee the creator may pass to the WithProtocolFee entry points
    /// @return maxFeeBps Fee applied by createCampaign / createCampaignDirect for the same state
    /// @dev Unlike creation, this does not fall back on module failure: a broken module
    ///      makes quoting revert loudly so off-chain callers notice
    function quoteProtocolFeeRange(address creator, address budget, address rewardToken, uint256 totalAmount)
        external
        view
        returns (uint64 minFeeBps, uint64 maxFeeBps)
    {
        address module = protocolFeeModule;
        if (module == address(0)) return (protocolFee, protocolFee);

        (uint64 moduleMin, uint64 moduleMax) = ITBIProtocolFeeModule(module)
            .quoteProtocolFeeRange(
                ITBIProtocolFeeModule.FeeContext({
                    creator: creator, budget: budget, rewardToken: rewardToken, totalAmount: totalAmount
                })
            );
        return _capFeeRange(moduleMin, moduleMax);
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
            _finalizeCampaign(campaignId, campaign);
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
                _finalizeCampaign(updates[i].campaignId, campaign);
            }
        }
    }

    /// @notice Finalize a campaign and record the finalization on its referral distributors
    /// @param campaignId The campaign ID
    /// @param campaign The campaign contract address
    /// @dev Recording finalizedAt on a distributor starts its no-root sweep clock
    function _finalizeCampaign(uint256 campaignId, address campaign) internal {
        TimeBasedIncentiveCampaign(campaign).setFinalized();

        address[] memory pools = getReferralDistributors(campaignId);
        for (uint256 i; i < pools.length; ++i) {
            ReferralDistributor(pools[i]).recordFinalized();
        }

        emit CampaignFinalized(campaignId);
    }

    /// @notice Set the campaign implementation address (for upgrades)
    /// @param campaignImpl_ New campaign implementation for cloning
    function setCampaignImplementation(address campaignImpl_) external onlyOwner {
        if (campaignImpl_ == address(0)) revert InvalidImplementation();
        address oldImplementation = campaignImplementation;
        campaignImplementation = campaignImpl_;
        emit CampaignImplementationUpdated(oldImplementation, campaignImpl_);
    }

    /// @notice Set the open-ended campaign implementation (enables open-ended campaigns)
    /// @param impl New open-ended campaign implementation for cloning
    /// @dev Requires deployed bytecode (which also rejects the zero address), for the same
    ///      reason as setReferralDistributorImplementation
    function setOpenEndedCampaignImplementation(address impl) external onlyOwner {
        if (impl.code.length == 0) revert InvalidImplementation();
        address oldImplementation = openEndedCampaignImplementation;
        openEndedCampaignImplementation = impl;
        emit OpenEndedCampaignImplementationUpdated(oldImplementation, impl);
    }

    /// @notice Set the referral distributor implementation (enables referral campaigns)
    /// @param distributorImpl_ New referral distributor implementation for cloning
    /// @dev Requires deployed bytecode (which also rejects the zero address): a clone of a
    ///      codeless implementation delegatecalls into empty code, so its initialize would
    ///      silently no-op and referral funding sent to the clone would be unreachable
    function setReferralDistributorImplementation(address distributorImpl_) external onlyOwner {
        if (distributorImpl_.code.length == 0) revert InvalidImplementation();
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

    /// @notice Publish or correct the referral merkle root for one of a campaign's pools
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool index
    /// @param root The referral merkle root
    /// @param committedTotal Total amount committed to referrers in the tree
    /// @dev The distributor enforces finalization, window, and commitment accounting
    function setReferralRoot(uint256 campaignId, uint256 poolIndex, bytes32 root, uint256 committedTotal) external {
        if (msg.sender != owner() && msg.sender != operator) revert NotAuthorized();

        address distributor = _referralPoolOrRevert(campaignId, poolIndex);
        bytes32 oldRoot = ReferralDistributor(distributor).setReferralRoot(root, committedTotal);

        emit ReferralRootUpdated(campaignId, poolIndex, oldRoot, root, committedTotal);
    }

    /// @notice Claim a referral payout from one of a campaign's pools
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool index
    /// @param referrer The referrer to pay
    /// @param amount The amount the referrer is entitled to
    /// @param proof The merkle proof validating the claim
    /// @dev Permissionless — anyone may claim on a referrer's behalf; tokens always go to
    ///      the referrer. The distributor only accepts calls from this contract, so this
    ///      is the sole claim path and every claim emits ReferralClaimed here
    function claimReferral(
        uint256 campaignId,
        uint256 poolIndex,
        address referrer,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        address distributor = _referralPoolOrRevert(campaignId, poolIndex);
        ReferralDistributor(distributor).claimReferral(referrer, amount, proof);

        emit ReferralClaimed(campaignId, poolIndex, referrer, amount);
    }

    /// @notice Sweep the remaining balance of one of a campaign's pools to the protocol fee receiver
    /// @param campaignId The campaign ID
    /// @param poolIndex The pool index
    /// @dev Permissionless; the distributor enforces the claim window has elapsed
    function sweepReferralPool(uint256 campaignId, uint256 poolIndex) external {
        address distributor = _referralPoolOrRevert(campaignId, poolIndex);
        uint256 amount = ReferralDistributor(distributor).sweepReferralPool(protocolFeeReceiver);

        emit ReferralPoolSwept(campaignId, poolIndex, amount, protocolFeeReceiver);
    }

    /// @notice Cancel a campaign (emergency use - sets endTime to now)
    /// @param campaignId The campaign ID to cancel
    /// @dev Callable by owner, budget-authorized users (budget-funded), or creator (direct-funded)
    function cancelCampaign(uint256 campaignId) external {
        address campaign = campaigns[campaignId];
        if (campaign == address(0)) revert InvalidCampaign();

        TimeBasedIncentiveCampaign c = TimeBasedIncentiveCampaign(campaign);
        if (msg.sender != owner()) _requireCampaignController(c);

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
        ABudget budget = _requireCampaignController(c);
        if (block.timestamp <= c.endTime() && c.totalCommitted() < c.totalRewards()) revert CampaignNotEnded();
        if (!c.finalized()) revert CampaignNotFinalized();

        if (address(budget) != address(0)) {
            // Budget-funded: route through budget clawback for accounting
            uint256 withdrawable = c.getWithdrawable();
            if (withdrawable == 0) revert ZeroAmount();

            bytes memory clawbackData = abi.encode(withdrawable);
            (uint256 clawbackAmount,) = budget.clawbackFromTarget(campaign, clawbackData, 0, 0);

            emit Withdrawn(campaignId, clawbackAmount, address(budget));
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
        return "2.5.0";
    }
}
