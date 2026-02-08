// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Initializable} from "@solady/utils/Initializable.sol";
import {MerkleProofLib} from "@solady/utils/MerkleProofLib.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {IClaw} from "contracts/shared/IClaw.sol";

/// @title TimeBasedIncentiveCampaign
/// @notice Per-campaign clone that holds reward tokens for time-based incentives
/// @dev Deployed as minimal proxy by TimeBasedIncentiveManager
contract TimeBasedIncentiveCampaign is Initializable, IClaw {
    /// @notice The TimeBasedIncentiveManager contract that deployed this campaign
    address public timeBasedIncentiveManager;

    /// @notice The budget that funded this campaign (address(0) if direct-funded)
    address public budget;

    /// @notice The address that created the campaign
    address public creator;

    /// @notice Hash of the off-chain campaign configuration
    bytes32 public configHash;

    /// @notice The ERC20 token used for rewards
    address public rewardToken;

    /// @notice Total rewards deposited (after protocol fee)
    uint256 public totalRewards;

    /// @notice Campaign start timestamp
    uint64 public startTime;

    /// @notice Campaign end timestamp
    uint64 public endTime;

    /// @notice Merkle root for reward claims
    bytes32 public merkleRoot;

    /// @notice Total amount committed to users (sum of all cumulative amounts in merkle tree)
    uint256 public totalCommitted;

    /// @notice Running total of all claimed amounts
    uint256 public totalClaimed;

    /// @notice Duration after endTime during which claims are still valid
    uint64 public claimExpiryDuration;

    /// @notice Cumulative amount claimed per user
    mapping(address => uint256) public claimed;

    /// @notice Emitted when the campaign is initialized
    event CampaignInitialized(
        address indexed timeBasedIncentiveManager,
        address indexed budget,
        address indexed creator,
        bytes32 configHash,
        address rewardToken,
        uint256 totalRewards,
        uint64 startTime,
        uint64 endTime
    );

    /// @notice Emitted when the merkle root is updated
    event MerkleRootUpdated(bytes32 oldRoot, bytes32 newRoot, uint256 totalCommitted);

    /// @notice Emitted when a user claims rewards
    event Claimed(address indexed user, uint256 amount, uint256 cumulativeAmount);

    /// @notice Emitted when undistributed funds are withdrawn
    event UndistributedWithdrawn(uint256 amount, address indexed destination);

    /// @notice Emitted when the end time is updated (e.g., campaign cancelled)
    event EndTimeUpdated(uint64 oldEndTime, uint64 newEndTime);

    /// @notice Error when caller is not the TimeBasedIncentiveManager
    error OnlyTimeBasedIncentiveManager();

    /// @notice Error when caller is not the creator
    error OnlyCreator();

    /// @notice Error when caller is not the budget
    error OnlyBudget();

    /// @notice Error when campaign has not ended
    error CampaignNotEnded();

    /// @notice Error when there is nothing to withdraw
    error NothingToWithdraw();

    /// @notice Error when clawback amount exceeds available balance
    error InsufficientBalance();

    /// @notice Error when new end time is after current end time
    error InvalidEndTime();

    /// @notice Error when campaign has already ended
    error CampaignAlreadyEnded();

    /// @notice Error when merkle proof is invalid
    error InvalidProof();

    /// @notice Error when the claim window has expired
    error ClaimExpired();

    /// @notice Error when there is nothing to claim
    error NothingToClaim();

    /// @notice Error when trying to use withdrawUndistributed on a budget-funded campaign
    error UseBudgetClawback();

    /// @notice Disable initialization on the implementation contract
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the campaign (called by TimeBasedIncentiveManager after cloning)
    /// @param timeBasedIncentiveManager_ The TimeBasedIncentiveManager contract
    /// @param budget_ The budget that funded this campaign
    /// @param creator_ The address that created the campaign
    /// @param configHash_ Hash of the off-chain configuration
    /// @param rewardToken_ The ERC20 reward token address
    /// @param totalRewards_ Total rewards after protocol fee
    /// @param startTime_ Campaign start timestamp
    /// @param endTime_ Campaign end timestamp
    /// @param claimExpiryDuration_ Duration after endTime during which claims are valid
    function initialize(
        address timeBasedIncentiveManager_,
        address budget_,
        address creator_,
        bytes32 configHash_,
        address rewardToken_,
        uint256 totalRewards_,
        uint64 startTime_,
        uint64 endTime_,
        uint64 claimExpiryDuration_
    ) external initializer {
        if (msg.sender != timeBasedIncentiveManager_) revert OnlyTimeBasedIncentiveManager();
        timeBasedIncentiveManager = timeBasedIncentiveManager_;
        budget = budget_;
        creator = creator_;
        configHash = configHash_;
        rewardToken = rewardToken_;
        totalRewards = totalRewards_;
        startTime = startTime_;
        endTime = endTime_;
        claimExpiryDuration = claimExpiryDuration_;

        emit CampaignInitialized(
            timeBasedIncentiveManager_,
            budget_,
            creator_,
            configHash_,
            rewardToken_,
            totalRewards_,
            startTime_,
            endTime_
        );
    }

    /// @notice Modifier to restrict access to the TimeBasedIncentiveManager
    modifier onlyTimeBasedIncentiveManager() {
        if (msg.sender != timeBasedIncentiveManager) revert OnlyTimeBasedIncentiveManager();
        _;
    }

    /// @notice Set the merkle root for reward claims
    /// @param root The new merkle root
    /// @param totalCommitted_ Total amount committed to users in the merkle tree
    /// @return oldRoot The previous merkle root
    function setMerkleRoot(bytes32 root, uint256 totalCommitted_)
        external
        onlyTimeBasedIncentiveManager
        returns (bytes32 oldRoot)
    {
        oldRoot = merkleRoot;
        merkleRoot = root;
        totalCommitted = totalCommitted_;
        emit MerkleRootUpdated(oldRoot, root, totalCommitted_);
    }

    /// @notice Process a claim for a user
    /// @param user The user claiming rewards
    /// @param cumulativeAmount The cumulative amount the user is entitled to
    /// @param proof The merkle proof validating the claim
    /// @return amount The amount of tokens transferred
    function processClaim(address user, uint256 cumulativeAmount, bytes32[] calldata proof)
        external
        onlyTimeBasedIncentiveManager
        returns (uint256 amount)
    {
        // Check claim window hasn't expired
        if (block.timestamp > uint256(endTime) + uint256(claimExpiryDuration)) revert ClaimExpired();

        // Verify merkle proof
        if (merkleRoot == bytes32(0)) revert InvalidProof();
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(user, rewardToken, cumulativeAmount))));
        if (!MerkleProofLib.verifyCalldata(proof, merkleRoot, leaf)) revert InvalidProof();

        // Calculate claimable amount
        uint256 alreadyClaimed = claimed[user];
        if (cumulativeAmount <= alreadyClaimed) revert NothingToClaim();
        amount = cumulativeAmount - alreadyClaimed;

        claimed[user] = cumulativeAmount;
        totalClaimed += amount;

        // Transfer tokens to user
        SafeTransferLib.safeTransfer(rewardToken, user, amount);

        emit Claimed(user, amount, cumulativeAmount);
    }

    /// @notice Withdraw undistributed funds back to creator (direct-funded campaigns only)
    /// @dev Only callable by the campaign creator after the campaign has ended
    /// @dev For budget-funded campaigns, use TimeBasedIncentiveManager.withdrawToBudget() instead
    function withdrawUndistributed() external {
        if (msg.sender != creator) revert OnlyCreator();
        if (budget != address(0)) revert UseBudgetClawback();
        if (block.timestamp <= endTime) revert CampaignNotEnded();

        uint256 balance = SafeTransferLib.balanceOf(rewardToken, address(this));
        uint256 owed = _stillOwed();

        // Only withdraw what's not owed to users
        uint256 withdrawable = balance > owed ? balance - owed : 0;
        if (withdrawable == 0) revert NothingToWithdraw();

        SafeTransferLib.safeTransfer(rewardToken, creator, withdrawable);
        emit UndistributedWithdrawn(withdrawable, creator);
    }

    /// @notice Clawback funds to the budget (called by budget.clawbackFromTarget)
    /// @param data_ The encoded ClawbackPayload
    /// @param boostId Unused, for interface compatibility
    /// @param incentiveId Unused, for interface compatibility
    /// @return amount The amount clawed back
    /// @return asset The asset address
    function clawback(bytes calldata data_, uint256 boostId, uint256 incentiveId)
        external
        override
        returns (uint256 amount, address asset)
    {
        (boostId, incentiveId); // unused variables

        if (msg.sender != budget) revert OnlyBudget();
        if (block.timestamp <= endTime) revert CampaignNotEnded();

        AIncentive.ClawbackPayload memory payload = abi.decode(data_, (AIncentive.ClawbackPayload));
        amount = abi.decode(payload.data, (uint256));
        asset = rewardToken;

        uint256 balance = SafeTransferLib.balanceOf(rewardToken, address(this));
        uint256 owed = _stillOwed();
        uint256 available = balance > owed ? balance - owed : 0;

        if (amount > available) revert InsufficientBalance();

        SafeTransferLib.safeTransfer(rewardToken, payload.target, amount);
    }

    /// @notice Get the amount available to withdraw (not owed to users)
    /// @return withdrawable The amount that can be withdrawn
    function getWithdrawable() external view returns (uint256 withdrawable) {
        if (block.timestamp <= endTime) return 0;
        uint256 balance = SafeTransferLib.balanceOf(rewardToken, address(this));
        uint256 owed = _stillOwed();
        withdrawable = balance > owed ? balance - owed : 0;
    }

    /// @notice Calculate how much is still owed to users (respects claim expiry)
    /// @return The amount still owed, or 0 if the claim window has expired
    function _stillOwed() internal view returns (uint256) {
        if (block.timestamp > uint256(endTime) + uint256(claimExpiryDuration)) return 0;
        return totalCommitted > totalClaimed ? totalCommitted - totalClaimed : 0;
    }

    /// @notice Set the campaign end time (for emergency cancellation)
    /// @param newEndTime The new end time (must be <= current endTime)
    /// @return oldEndTime The previous end time
    function setEndTime(uint64 newEndTime) external onlyTimeBasedIncentiveManager returns (uint64 oldEndTime) {
        // Cannot cancel a campaign that has already ended
        if (block.timestamp > endTime) revert CampaignAlreadyEnded();

        // Only allow setting to current time or earlier (no extensions)
        if (newEndTime > endTime) revert InvalidEndTime();

        oldEndTime = endTime;
        endTime = newEndTime;

        emit EndTimeUpdated(oldEndTime, newEndTime);
    }
}
