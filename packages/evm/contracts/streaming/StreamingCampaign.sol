// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Initializable} from "@solady/utils/Initializable.sol";
import {MerkleProofLib} from "@solady/utils/MerkleProofLib.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {IClaw} from "contracts/shared/IClaw.sol";

/// @title StreamingCampaign
/// @notice Per-campaign clone that holds reward tokens for streaming incentives
/// @dev Deployed as minimal proxy by StreamingManager
contract StreamingCampaign is Initializable, IClaw {
    /// @notice The StreamingManager contract that deployed this campaign
    address public streamingManager;

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

    /// @notice Cumulative amount claimed per user
    mapping(address => uint256) public claimed;

    /// @notice Emitted when the campaign is initialized
    event CampaignInitialized(
        address indexed streamingManager,
        address indexed budget,
        address indexed creator,
        bytes32 configHash,
        address rewardToken,
        uint256 totalRewards,
        uint64 startTime,
        uint64 endTime
    );

    /// @notice Emitted when the merkle root is updated
    event MerkleRootUpdated(bytes32 oldRoot, bytes32 newRoot);

    /// @notice Emitted when a user claims rewards
    event Claimed(address indexed user, uint256 amount, uint256 cumulativeAmount);

    /// @notice Error when caller is not the StreamingManager
    error OnlyStreamingManager();

    /// @notice Error when merkle proof is invalid
    error InvalidProof();

    /// @notice Error when there is nothing to claim
    error NothingToClaim();

    /// @notice Disable initialization on the implementation contract
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the campaign (called by StreamingManager after cloning)
    /// @param streamingManager_ The StreamingManager contract
    /// @param budget_ The budget that funded this campaign
    /// @param creator_ The address that created the campaign
    /// @param configHash_ Hash of the off-chain configuration
    /// @param rewardToken_ The ERC20 reward token address
    /// @param totalRewards_ Total rewards after protocol fee
    /// @param startTime_ Campaign start timestamp
    /// @param endTime_ Campaign end timestamp
    function initialize(
        address streamingManager_,
        address budget_,
        address creator_,
        bytes32 configHash_,
        address rewardToken_,
        uint256 totalRewards_,
        uint64 startTime_,
        uint64 endTime_
    ) external initializer {
        if (msg.sender != streamingManager_) revert OnlyStreamingManager();
        streamingManager = streamingManager_;
        budget = budget_;
        creator = creator_;
        configHash = configHash_;
        rewardToken = rewardToken_;
        totalRewards = totalRewards_;
        startTime = startTime_;
        endTime = endTime_;

        emit CampaignInitialized(
            streamingManager_, budget_, creator_, configHash_, rewardToken_, totalRewards_, startTime_, endTime_
        );
    }

    /// @notice Modifier to restrict access to the StreamingManager
    modifier onlyStreamingManager() {
        if (msg.sender != streamingManager) revert OnlyStreamingManager();
        _;
    }

    /// @notice Set the merkle root for reward claims
    /// @param root The new merkle root
    /// @return oldRoot The previous merkle root
    function setMerkleRoot(bytes32 root) external onlyStreamingManager returns (bytes32 oldRoot) {
        oldRoot = merkleRoot;
        merkleRoot = root;
        emit MerkleRootUpdated(oldRoot, root);
    }

    /// @notice Process a claim for a user
    /// @param user The user claiming rewards
    /// @param cumulativeAmount The cumulative amount the user is entitled to
    /// @param proof The merkle proof validating the claim
    /// @return amount The amount of tokens transferred
    function processClaim(address user, uint256 cumulativeAmount, bytes32[] calldata proof)
        external
        onlyStreamingManager
        returns (uint256 amount)
    {
        // Verify merkle proof
        if (merkleRoot == bytes32(0)) revert InvalidProof();
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(user, rewardToken, cumulativeAmount))));
        if (!MerkleProofLib.verifyCalldata(proof, merkleRoot, leaf)) revert InvalidProof();

        // Calculate claimable amount
        uint256 alreadyClaimed = claimed[user];
        if (cumulativeAmount <= alreadyClaimed) revert NothingToClaim();
        amount = cumulativeAmount - alreadyClaimed;

        claimed[user] = cumulativeAmount;

        // Transfer tokens to user
        SafeTransferLib.safeTransfer(rewardToken, user, amount);

        emit Claimed(user, amount, cumulativeAmount);
    }
}
