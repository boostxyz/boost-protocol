// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {UUPSUpgradeable} from "@solady/utils/UUPSUpgradeable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ITBIProtocolFeeModule} from "contracts/timebased/ITBIProtocolFeeModule.sol";
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

    /// @dev Sentinel for "no protocol fee requested": apply the top of the allowed range
    uint256 private constant NO_FEE_REQUEST = type(uint256).max;

    /// @dev Fee choices for a new campaign, grouped so the creation paths stay within stack limits
    /// @param referralFeeBps Referral fee in basis points of the protocol fee
    /// @param requestedFeeBps The creator's protocol fee, or NO_FEE_REQUEST for the default
    struct FeeParams {
        uint64 referralFeeBps;
        uint256 requestedFeeBps;
    }

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

    /// @notice Optional fee policy consulted at campaign creation (address(0) = standard fee only)
    /// @dev The module can only lower the fee: the applied fee is min(moduleFee, protocolFee)
    address public protocolFeeModule;

    /// @notice Allocated gap space for future variables
    uint256[46] private __gap;

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

    /// @notice Emitted when the protocol fee module is updated
    event ProtocolFeeModuleUpdated(address indexed oldModule, address indexed newModule);

    /// @notice Emitted with the protocol fee actually charged to a campaign at creation
    event ProtocolFeeApplied(uint256 indexed campaignId, uint64 feeBps, uint256 feeAmount);

    /// @notice Emitted when the fee module fails to quote and the standard fee is applied instead
    event ProtocolFeeModuleFallback(address indexed module, address indexed creator, address indexed budget);

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

    /// @notice Error when the protocol fee module address has no code
    error InvalidProtocolFeeModule();

    /// @notice Error when a requested protocol fee is outside the range allowed for the creator
    error ProtocolFeeOutOfRange(uint64 requestedFeeBps, uint64 minFeeBps, uint64 maxFeeBps);

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
    /// @return campaignId The ID of the created campaign
    /// @dev Legacy overload preserving the pre-referral selector; creates the campaign
    ///      with no referral fee so existing callers keep working across the upgrade
    function createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        return _createCampaign(
            budget, configHash, rewardToken, totalAmount, startTime, endTime, FeeParams(0, NO_FEE_REQUEST)
        );
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
        return _createCampaign(
            budget, configHash, rewardToken, totalAmount, startTime, endTime, FeeParams(referralFeeBps, NO_FEE_REQUEST)
        );
    }

    /// @notice Create a budget-funded campaign at a protocol fee chosen by the creator
    /// @param budget The budget to fund the campaign from
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralFeeBps Referral fee in basis points of the protocol fee (max 2500)
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
        uint64 referralFeeBps,
        uint64 protocolFeeBps
    ) external returns (uint256 campaignId) {
        return _createCampaign(
            budget, configHash, rewardToken, totalAmount, startTime, endTime, FeeParams(referralFeeBps, protocolFeeBps)
        );
    }

    /// @notice Create a new campaign funded by a budget (shared by all entry points)
    function _createCampaign(
        ABudget budget,
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        FeeParams memory fees
    ) internal returns (uint256 campaignId) {
        // Validate caller is authorized on budget
        if (!budget.isAuthorized(msg.sender)) revert NotAuthorizedOnBudget();

        // Validate parameters
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        if (fees.referralFeeBps > MAX_REFERRAL_FEE_BPS) revert ReferralFeeTooHigh();
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
            _splitAndFund(budget, rewardToken, totalAmount, fees, campaign, campaignId);

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
            emit ReferralDistributorCreated(campaignId, distributor, fees.referralFeeBps, referralAmount);
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
    /// @return campaignId The ID of the created campaign
    /// @dev Legacy overload preserving the pre-referral selector; creates the campaign
    ///      with no referral fee so existing callers keep working across the upgrade
    function createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime
    ) external returns (uint256 campaignId) {
        return _createCampaignDirect(
            configHash, rewardToken, totalAmount, startTime, endTime, FeeParams(0, NO_FEE_REQUEST)
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
        return _createCampaignDirect(
            configHash, rewardToken, totalAmount, startTime, endTime, FeeParams(referralFeeBps, NO_FEE_REQUEST)
        );
    }

    /// @notice Create a direct-funded campaign at a protocol fee chosen by the creator
    /// @param configHash Hash of the off-chain campaign configuration
    /// @param rewardToken The ERC20 token for rewards
    /// @param totalAmount Total reward amount (before protocol fee deduction)
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param referralFeeBps Referral fee in basis points of the protocol fee (max 2500)
    /// @param protocolFeeBps Protocol fee in basis points; must lie within the range
    ///        quoteProtocolFeeRange reports for the caller with no budget
    /// @return campaignId The ID of the created campaign
    /// @dev Fee-on-transfer and rebasing tokens are not supported
    /// @dev Caller must approve this contract to transfer tokens before calling
    function createCampaignDirectWithProtocolFee(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        uint64 referralFeeBps,
        uint64 protocolFeeBps
    ) external returns (uint256 campaignId) {
        return _createCampaignDirect(
            configHash, rewardToken, totalAmount, startTime, endTime, FeeParams(referralFeeBps, protocolFeeBps)
        );
    }

    /// @notice Create a new direct-funded campaign (shared by all entry points)
    function _createCampaignDirect(
        bytes32 configHash,
        address rewardToken,
        uint256 totalAmount,
        uint64 startTime,
        uint64 endTime,
        FeeParams memory fees
    ) internal returns (uint256 campaignId) {
        // Validate parameters
        if (rewardToken == address(0)) revert InvalidRewardToken();
        if (totalAmount == 0) revert ZeroAmount();
        if (startTime < block.timestamp) revert StartTimeInPast();
        if (endTime <= startTime) revert EndTimeBeforeStart();
        if (fees.referralFeeBps > MAX_REFERRAL_FEE_BPS) revert ReferralFeeTooHigh();
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
            _splitAndFund(ABudget(payable(address(0))), rewardToken, totalAmount, fees, campaign, campaignId);

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
            emit ReferralDistributorCreated(campaignId, distributor, fees.referralFeeBps, referralAmount);
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
    /// @param fees Referral fee and the creator's protocol fee request
    /// @param campaign The campaign clone to fund
    /// @param campaignId The campaign ID
    /// @return netAmount Rewards sent to the campaign (total minus fee, unchanged by referrals)
    /// @return referralAmount Referral slice carved from the protocol fee
    /// @return distributor The funded distributor clone (address(0) if the slice is 0)
    function _splitAndFund(
        ABudget budget,
        address rewardToken,
        uint256 totalAmount,
        FeeParams memory fees,
        address campaign,
        uint256 campaignId
    ) internal returns (uint256 netAmount, uint256 referralAmount, address distributor) {
        uint64 feeBps = _selectProtocolFee(
            ITBIProtocolFeeModule.FeeContext({
                creator: msg.sender, budget: address(budget), rewardToken: rewardToken, totalAmount: totalAmount
            }),
            fees.requestedFeeBps
        );

        // The referral slice is carved from the fee, not the total, so the net reward
        // budget is unchanged
        uint256 feeAmount = (totalAmount * feeBps) / 10000;
        referralAmount = (feeAmount * fees.referralFeeBps) / 10000;
        uint256 protocolAmount = feeAmount - referralAmount;
        netAmount = totalAmount - feeAmount;
        emit ProtocolFeeApplied(campaignId, feeBps, feeAmount);

        // Fee to protocol fee receiver (if fee > 0)
        if (protocolAmount > 0) {
            _fund(budget, rewardToken, protocolFeeReceiver, protocolAmount);
        }

        // Referral slice to a freshly cloned distributor (if slice > 0)
        if (referralAmount > 0) {
            distributor = _cloneReferralDistributor(campaignId, fees.referralFeeBps);
            _fund(budget, rewardToken, distributor, referralAmount);
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

    /// @notice Finalize a campaign and record the finalization on its referral distributor
    /// @param campaignId The campaign ID
    /// @param campaign The campaign contract address
    /// @dev Recording finalizedAt on the distributor starts its no-root sweep clock
    function _finalizeCampaign(uint256 campaignId, address campaign) internal {
        TimeBasedIncentiveCampaign(campaign).setFinalized();

        address distributor = referralDistributors[campaignId];
        if (distributor != address(0)) {
            ReferralDistributor(distributor).recordFinalized();
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
    /// @dev Permissionless — anyone may claim on a referrer's behalf; tokens always go to
    ///      the referrer. The distributor only accepts calls from this contract, so this
    ///      is the sole claim path and every claim emits ReferralClaimed here
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
        return "2.3.0";
    }
}
