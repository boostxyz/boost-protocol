// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Initializable} from "@solady/utils/Initializable.sol";
import {MerkleProofLib} from "@solady/utils/MerkleProofLib.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";

/// @title ReferralDistributor
/// @notice Per-campaign clone that holds the referral fee pool and pays referrers
///         against an operator-published merkle root
/// @dev Deployed as minimal proxy by TimeBasedIncentiveManager when a campaign is
///      created with a non-zero referral fee. Root publishes, claims, and sweeps are
///      only callable by the manager, whose wrappers apply access control and emit the
///      campaign-scoped events, so every referral action indexes from one address.
///      Referral leaves are (chainid, campaignId, referrer, token, amount). The chainid
///      binds a root to this chain so it cannot be replayed against a deployment on
///      another chain, and the sequential campaign id in the second slot never matches
///      the campaign address that the campaign's (chainid, campaign, user, token,
///      cumulativeAmount) reward leaves carry there, so a reward proof can never verify
///      against a referral root
contract ReferralDistributor is Initializable {
    /// @notice The TimeBasedIncentiveManager that deployed this distributor
    address public timeBasedIncentiveManager;

    /// @notice Duration of the claim window, starting when the first root is published
    uint64 public claimWindowDuration;

    /// @notice Whether the pool has been swept (blocks any further root publishes)
    bool public swept;

    /// @notice The campaign this distributor pays referrals for
    address public campaign;

    /// @notice Timestamp after which claims are no longer valid (0 until first root publish)
    uint64 public claimWindowEnd;

    /// @notice Timestamp when the campaign's finalization was recorded (0 until recorded)
    uint64 public finalizedAt;

    /// @notice The ERC20 token referrals are paid in (the campaign's reward token)
    address public referralToken;

    /// @notice The campaign ID in the manager (included in every leaf)
    uint256 public campaignId;

    /// @notice Total referral fees funded to this distributor
    uint256 public referralPool;

    /// @notice Merkle root for referral claims
    bytes32 public referralRoot;

    /// @notice Total amount committed to referrers in the current merkle tree
    uint256 public committedTotal;

    /// @notice Lifetime cap on claims: claims already paid when the current root was
    ///         published, plus the current root's committed total
    uint256 public maxClaimable;

    /// @notice Running total of all claimed amounts across all published roots
    uint256 public totalClaimed;

    /// @notice Whether a referrer has already claimed (one-shot)
    mapping(address => bool) public claimed;

    /// @notice Emitted when the distributor is initialized
    event ReferralDistributorInitialized(
        address indexed timeBasedIncentiveManager,
        address indexed campaign,
        uint256 indexed campaignId,
        address referralToken,
        uint256 referralPool,
        uint64 claimWindowDuration
    );

    /// @notice Emitted when the referral root is published or corrected
    event ReferralRootUpdated(bytes32 oldRoot, bytes32 newRoot, uint256 committedTotal, uint64 claimWindowEnd);

    /// @notice Emitted when the campaign's finalization is recorded
    event FinalizationRecorded(uint64 finalizedAt);

    /// @notice Emitted when a referrer is paid
    event ReferralClaimed(address indexed referrer, uint256 amount);

    /// @notice Emitted when the remaining pool is swept
    event ReferralPoolSwept(uint256 amount, address indexed destination);

    /// @notice Error when caller is not the TimeBasedIncentiveManager
    error OnlyTimeBasedIncentiveManager();

    /// @notice Error when the campaign has not been finalized
    error CampaignNotFinalized();

    /// @notice Error when a root commits more than the pool net of already-claimed amounts
    error CommitmentExceedsPool();

    /// @notice Error when publishing or claiming outside the claim window
    error ClaimWindowClosed();

    /// @notice Error when a referrer has already claimed
    error AlreadyClaimed();

    /// @notice Error when merkle proof is invalid
    error InvalidProof();

    /// @notice Error when the claim amount is zero
    error NothingToClaim();

    /// @notice Error when cumulative claims would exceed the committed amount
    error ClaimExceedsCommitment();

    /// @notice Error when publishing a root after the pool has been swept
    error PoolAlreadySwept();

    /// @notice Error when sweeping before the claim window has elapsed
    error SweepNotReady();

    /// @notice Error when there is nothing to sweep
    error NothingToSweep();

    /// @notice Error when the sweep destination is the zero address
    error ZeroSweepDestination();

    /// @notice Error when the claim window duration is zero
    error InvalidClaimWindow();

    /// @notice Disable initialization on the implementation contract
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the distributor (called by TimeBasedIncentiveManager after cloning)
    /// @param campaign_ The campaign this distributor pays referrals for (must be initialized)
    /// @param campaignId_ The campaign's ID in the manager
    /// @param referralPool_ Total referral fees funded to this distributor
    /// @param claimWindowDuration_ Duration of the claim window once the root is published
    function initialize(address campaign_, uint256 campaignId_, uint256 referralPool_, uint64 claimWindowDuration_)
        external
        initializer
    {
        address manager = TimeBasedIncentiveCampaign(campaign_).timeBasedIncentiveManager();
        if (msg.sender != manager) revert OnlyTimeBasedIncentiveManager();
        if (claimWindowDuration_ == 0) revert InvalidClaimWindow();

        timeBasedIncentiveManager = manager;
        campaign = campaign_;
        campaignId = campaignId_;
        referralToken = TimeBasedIncentiveCampaign(campaign_).rewardToken();
        referralPool = referralPool_;
        claimWindowDuration = claimWindowDuration_;

        emit ReferralDistributorInitialized(
            manager, campaign_, campaignId_, referralToken, referralPool_, claimWindowDuration_
        );
    }

    /// @notice Modifier to restrict access to the TimeBasedIncentiveManager
    modifier onlyTimeBasedIncentiveManager() {
        if (msg.sender != timeBasedIncentiveManager) revert OnlyTimeBasedIncentiveManager();
        _;
    }

    /// @notice Record the campaign's finalization time, starting the no-root sweep clock
    /// @dev Permissionless and idempotent — the manager calls this when it finalizes the
    ///      campaign, and anyone may call it once the campaign reports finalized. Until
    ///      recorded, a distributor with no published root cannot be swept
    function recordFinalized() external {
        if (finalizedAt != 0) return;
        if (!TimeBasedIncentiveCampaign(campaign).finalized()) revert CampaignNotFinalized();

        finalizedAt = uint64(block.timestamp);

        emit FinalizationRecorded(finalizedAt);
    }

    /// @notice Publish the referral merkle root and start the claim window
    /// @param root The merkle root of (chainid, campaignId, referrer, token, amount) leaves
    /// @param committedTotal_ Total amount committed to referrers in the tree
    /// @return oldRoot The previous referral root
    /// @dev Only after the campaign finalizes (not just end time, for reorg safety).
    ///      The first publish starts the claim window; re-publishes during the window
    ///      correct errors without restarting it. Every publish enforces
    ///      committedTotal <= referralPool - totalClaimed so a corrected root cannot
    ///      over-commit the pool net of amounts already paid out
    function setReferralRoot(bytes32 root, uint256 committedTotal_)
        external
        onlyTimeBasedIncentiveManager
        returns (bytes32 oldRoot)
    {
        if (swept) revert PoolAlreadySwept();
        if (!TimeBasedIncentiveCampaign(campaign).finalized()) revert CampaignNotFinalized();
        if (claimWindowEnd != 0 && block.timestamp > claimWindowEnd) revert ClaimWindowClosed();
        if (committedTotal_ > referralPool - totalClaimed) revert CommitmentExceedsPool();

        if (claimWindowEnd == 0) {
            claimWindowEnd = uint64(block.timestamp) + claimWindowDuration;
        }

        oldRoot = referralRoot;
        referralRoot = root;
        committedTotal = committedTotal_;
        maxClaimable = totalClaimed + committedTotal_;

        emit ReferralRootUpdated(oldRoot, root, committedTotal_, claimWindowEnd);
    }

    /// @notice Claim a referral payout for a referrer
    /// @param referrer The referrer to pay
    /// @param amount The amount the referrer is entitled to
    /// @param proof The merkle proof validating the claim
    /// @dev Only the manager may call this; its permissionless wrapper lets anyone claim
    ///      on a referrer's behalf, and tokens always go to the referrer. One-shot per
    ///      referrer, and the flag is set before the transfer so a reentrant token
    ///      cannot double-pay
    function claimReferral(address referrer, uint256 amount, bytes32[] calldata proof)
        external
        onlyTimeBasedIncentiveManager
    {
        if (claimWindowEnd == 0 || block.timestamp > claimWindowEnd) revert ClaimWindowClosed();
        if (claimed[referrer]) revert AlreadyClaimed();
        if (amount == 0) revert NothingToClaim();

        if (referralRoot == bytes32(0)) revert InvalidProof();
        bytes32 leaf =
            keccak256(bytes.concat(keccak256(abi.encode(block.chainid, campaignId, referrer, referralToken, amount))));
        if (!MerkleProofLib.verifyCalldata(proof, referralRoot, leaf)) revert InvalidProof();

        // The publish-time check bounds maxClaimable to referralPool, so claims can
        // never exceed the pool even across corrected roots
        if (totalClaimed + amount > maxClaimable) revert ClaimExceedsCommitment();

        claimed[referrer] = true;
        totalClaimed += amount;

        SafeTransferLib.safeTransfer(referralToken, referrer, amount);

        emit ReferralClaimed(referrer, amount);
    }

    /// @notice Sweep the remaining pool balance after the claim window has elapsed
    /// @param to The destination for the remaining balance (the protocol fee receiver)
    /// @return amount The amount swept
    /// @dev If a root was published, sweepable once its claim window ends. If no root
    ///      was ever published (e.g. a cancelled campaign), sweepable once a full
    ///      claim-window duration has elapsed past the recorded finalization time,
    ///      which sweeps the full pool. Gating the no-root path on finalization means
    ///      a sweep can never preempt a root the operator could still publish
    function sweepReferralPool(address to) external onlyTimeBasedIncentiveManager returns (uint256 amount) {
        if (to == address(0)) revert ZeroSweepDestination();

        if (claimWindowEnd != 0) {
            if (block.timestamp <= claimWindowEnd) revert SweepNotReady();
        } else {
            if (finalizedAt == 0) revert CampaignNotFinalized();
            uint256 deadline = uint256(finalizedAt) + uint256(claimWindowDuration);
            if (block.timestamp <= deadline) revert SweepNotReady();
        }

        amount = SafeTransferLib.balanceOf(referralToken, address(this));
        if (amount == 0) revert NothingToSweep();

        swept = true;

        SafeTransferLib.safeTransfer(referralToken, to, amount);

        emit ReferralPoolSwept(amount, to);
    }
}
