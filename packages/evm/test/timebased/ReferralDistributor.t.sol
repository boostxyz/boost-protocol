// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";

/// @notice ERC20 that reenters the distributor during transfer to test flag-before-transfer
contract ReentrantERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    ReferralDistributor public target;
    address public reenterReferrer;
    uint256 public reenterAmount;
    bytes32[] public reenterProof;
    bool public reenterAttempted;
    bool public reenterSucceeded;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function arm(ReferralDistributor target_, address referrer, uint256 amount, bytes32[] calldata proof) external {
        target = target_;
        reenterReferrer = referrer;
        reenterAmount = amount;
        reenterProof = proof;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (address(target) != address(0) && !reenterAttempted) {
            reenterAttempted = true;
            try target.claimReferral(reenterReferrer, reenterAmount, reenterProof) {
                reenterSucceeded = true;
            } catch {}
        }
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

contract ReferralDistributorTest is Test {
    MockERC20 rewardToken;
    ManagedBudget budget;
    TimeBasedIncentiveManager manager;
    TimeBasedIncentiveCampaign campaignImpl;
    ReferralDistributor distributorImpl;

    address constant PROTOCOL_FEE_RECEIVER = address(0xFEE);
    address constant CREATOR = address(0xCAFE);
    address constant OPERATOR = address(0x09E7);
    address constant REFERRER = address(0xAAA1);
    address constant REFERRER2 = address(0xAAA2);
    address constant RANDO = address(0xD00D);
    uint64 constant PROTOCOL_FEE = 1000; // 10%
    uint64 constant CLAIM_WINDOW = 60 days;
    uint256 constant REFERRAL_POOL = 1 ether;

    function setUp() public {
        rewardToken = new MockERC20();
        campaignImpl = new TimeBasedIncentiveCampaign();
        distributorImpl = new ReferralDistributor();

        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManager()));
        manager = TimeBasedIncentiveManager(proxy);
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
        manager.setOperator(OPERATOR);

        budget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        address[] memory authorized = new address[](2);
        authorized[0] = CREATOR;
        authorized[1] = address(manager);
        uint256[] memory roles = new uint256[](2);
        roles[0] = budget.MANAGER_ROLE();
        roles[1] = budget.MANAGER_ROLE();
        budget.initialize(
            abi.encode(ManagedBudget.InitPayload({owner: address(this), authorized: authorized, roles: roles}))
        );

        rewardToken.mint(address(this), 100 ether);
        rewardToken.approve(address(budget), 100 ether);
        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(rewardToken),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: 100 ether}))
                })
            )
        );
    }

    ////////////////////////////////
    // Helpers
    ////////////////////////////////

    /// @notice Create a campaign that ends 30 days from now
    function _createCampaign() internal returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign) {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        vm.prank(CREATOR);
        campaignId =
            manager.createCampaign(budget, keccak256("test"), address(rewardToken), 10 ether, startTime, endTime, 0);
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    /// @notice Warp past the campaign's end and finalize it via the manager
    function _finalize(uint256 campaignId, TimeBasedIncentiveCampaign campaign) internal {
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("reward-root"), 0, true);
    }

    /// @notice Clone the distributor for a campaign and fund it with the referral pool
    function _deployDistributor(uint256 campaignId, address campaign) internal returns (ReferralDistributor dist) {
        dist = ReferralDistributor(LibClone.clone(address(distributorImpl)));
        vm.prank(address(manager));
        dist.initialize(campaign, campaignId, REFERRAL_POOL, CLAIM_WINDOW);
        rewardToken.mint(address(dist), REFERRAL_POOL);
    }

    /// @notice Create a campaign, finalize it, and deploy its funded distributor
    function _createFinalizedWithDistributor()
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist)
    {
        (campaignId, campaign) = _createCampaign();
        _finalize(campaignId, campaign);
        dist = _deployDistributor(campaignId, address(campaign));
    }

    /// @notice Double-hashed 4-field referral leaf
    function _makeReferralLeaf(uint256 campaignId, address referrer, address token, uint256 amount)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(bytes.concat(keccak256(abi.encode(campaignId, referrer, token, amount))));
    }

    /// @notice Double-hashed, domain-separated reward leaf (the campaign's v2 claim format)
    function _makeRewardLeaf(address campaign, address user, address token, uint256 cumulativeAmount)
        internal
        view
        returns (bytes32)
    {
        return keccak256(bytes.concat(keccak256(abi.encode(block.chainid, campaign, user, token, cumulativeAmount))));
    }

    /// @notice Sorted-pair hash matching MerkleProofLib's verification
    function _hashPair(bytes32 a, bytes32 b) internal pure returns (bytes32) {
        return uint256(a) < uint256(b) ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }

    /// @notice Build a two-leaf referral tree for REFERRER/REFERRER2 with the given amounts
    function _twoReferrerTree(ReferralDistributor dist, uint256 amount1, uint256 amount2)
        internal
        view
        returns (bytes32 root, bytes32[] memory proof1, bytes32[] memory proof2)
    {
        bytes32 leaf1 = _makeReferralLeaf(dist.campaignId(), REFERRER, address(rewardToken), amount1);
        bytes32 leaf2 = _makeReferralLeaf(dist.campaignId(), REFERRER2, address(rewardToken), amount2);
        root = _hashPair(leaf1, leaf2);
        proof1 = new bytes32[](1);
        proof1[0] = leaf2;
        proof2 = new bytes32[](1);
        proof2[0] = leaf1;
    }

    ////////////////////////////////
    // Initialization
    ////////////////////////////////

    function test_Initialize_Success() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();

        ReferralDistributor dist = ReferralDistributor(LibClone.clone(address(distributorImpl)));
        vm.prank(address(manager));
        vm.expectEmit(true, true, true, true);
        emit ReferralDistributor.ReferralDistributorInitialized(
            address(manager), address(campaign), campaignId, address(rewardToken), REFERRAL_POOL, CLAIM_WINDOW
        );
        dist.initialize(address(campaign), campaignId, REFERRAL_POOL, CLAIM_WINDOW);

        assertEq(dist.timeBasedIncentiveManager(), address(manager), "Manager should be set");
        assertEq(dist.campaign(), address(campaign), "Campaign should be set");
        assertEq(dist.campaignId(), campaignId, "Campaign ID should be set");
        assertEq(dist.referralToken(), address(rewardToken), "Referral token should come from the campaign");
        assertEq(dist.referralPool(), REFERRAL_POOL, "Referral pool should be set");
        assertEq(dist.claimWindowDuration(), CLAIM_WINDOW, "Claim window duration should be set");
        assertEq(dist.claimWindowEnd(), 0, "Claim window should not have started");
        assertEq(dist.referralRoot(), bytes32(0), "Root should be unset");
    }

    function test_Initialize_RevertWhenNotManager() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();

        ReferralDistributor dist = ReferralDistributor(LibClone.clone(address(distributorImpl)));
        vm.prank(RANDO);
        vm.expectRevert(ReferralDistributor.OnlyTimeBasedIncentiveManager.selector);
        dist.initialize(address(campaign), campaignId, REFERRAL_POOL, CLAIM_WINDOW);
    }

    function test_Initialize_RevertWhenAlreadyInitialized() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();
        ReferralDistributor dist = _deployDistributor(campaignId, address(campaign));

        vm.prank(address(manager));
        vm.expectRevert();
        dist.initialize(address(campaign), campaignId, REFERRAL_POOL, CLAIM_WINDOW);
    }

    function test_Initialize_RevertOnImplementation() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();

        vm.prank(address(manager));
        vm.expectRevert();
        distributorImpl.initialize(address(campaign), campaignId, REFERRAL_POOL, CLAIM_WINDOW);
    }

    ////////////////////////////////
    // setReferralRoot - gating
    ////////////////////////////////

    function test_SetReferralRoot_RevertWhenNotFinalized_EvenAfterEndTime() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();
        ReferralDistributor dist = _deployDistributor(campaignId, address(campaign));

        // Past end time but not finalized — reorg safety requires the finalized flag
        vm.warp(campaign.endTime() + 1);

        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.CampaignNotFinalized.selector);
        dist.setReferralRoot(keccak256("referral-root"), REFERRAL_POOL);
    }

    function test_SetReferralRoot_RevertWhenNotAuthorized() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        vm.prank(RANDO);
        vm.expectRevert(ReferralDistributor.NotAuthorized.selector);
        dist.setReferralRoot(keccak256("referral-root"), REFERRAL_POOL);
    }

    function test_SetReferralRoot_SuccessByOperator() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        vm.prank(OPERATOR);
        vm.expectEmit(true, true, true, true);
        emit ReferralDistributor.ReferralRootUpdated(
            bytes32(0), keccak256("referral-root"), REFERRAL_POOL, uint64(block.timestamp) + CLAIM_WINDOW
        );
        dist.setReferralRoot(keccak256("referral-root"), REFERRAL_POOL);

        assertEq(dist.referralRoot(), keccak256("referral-root"), "Root should be set");
        assertEq(dist.committedTotal(), REFERRAL_POOL, "Committed total should be set");
        assertEq(dist.claimWindowEnd(), uint64(block.timestamp) + CLAIM_WINDOW, "Window should start now");
    }

    function test_SetReferralRoot_SuccessByOwner() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        dist.setReferralRoot(keccak256("referral-root"), REFERRAL_POOL);
        assertEq(dist.referralRoot(), keccak256("referral-root"), "Owner should be able to publish");
    }

    function test_SetReferralRoot_RevertWhenCommitmentExceedsPool() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.CommitmentExceedsPool.selector);
        dist.setReferralRoot(keccak256("referral-root"), REFERRAL_POOL + 1);
    }

    ////////////////////////////////
    // setReferralRoot - re-publish
    ////////////////////////////////

    function test_SetReferralRoot_RepublishDoesNotRestartWindow() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root-1"), REFERRAL_POOL);
        uint64 windowEnd = dist.claimWindowEnd();

        vm.warp(block.timestamp + 10 days);
        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root-2"), REFERRAL_POOL / 2);

        assertEq(dist.referralRoot(), keccak256("root-2"), "Corrected root should be set");
        assertEq(dist.committedTotal(), REFERRAL_POOL / 2, "Committed total may decrease on correction");
        assertEq(dist.claimWindowEnd(), windowEnd, "Re-publish should not restart the window");
    }

    function test_SetReferralRoot_RepublishAccountsForClaimedAmounts() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        // Root commits 0.6 of the 1.0 pool; REFERRER claims 0.4
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.4 ether, 0.2 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, 0.6 ether);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);

        // Corrected root may commit at most pool - claimed = 0.6
        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.CommitmentExceedsPool.selector);
        dist.setReferralRoot(keccak256("corrected-root"), 0.6 ether + 1);

        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("corrected-root"), 0.6 ether);
        assertEq(dist.committedTotal(), 0.6 ether, "Corrected commitment within net pool should succeed");
    }

    function test_SetReferralRoot_RevertAfterWindow() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root-1"), REFERRAL_POOL);

        vm.warp(uint256(dist.claimWindowEnd()) + 1);
        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.ClaimWindowClosed.selector);
        dist.setReferralRoot(keccak256("root-2"), REFERRAL_POOL);
    }

    function test_SetReferralRoot_RevertAfterSweep() public {
        (, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) = _createFinalizedWithDistributor();

        // No root ever published; sweep after the no-root deadline, then try to publish
        vm.warp(uint256(campaign.endTime()) + CLAIM_WINDOW + 1);
        vm.prank(OPERATOR);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);

        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.PoolAlreadySwept.selector);
        dist.setReferralRoot(keccak256("late-root"), 0);
    }

    ////////////////////////////////
    // claimReferral
    ////////////////////////////////

    function test_ClaimReferral_Success() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1, bytes32[] memory proof2) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);

        vm.expectEmit(true, true, true, true);
        emit ReferralDistributor.ReferralClaimed(REFERRER, 0.4 ether);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);

        assertEq(rewardToken.balanceOf(REFERRER), 0.4 ether, "Referrer should be paid");
        assertTrue(dist.claimed(REFERRER), "Referrer should be flagged as claimed");
        assertEq(dist.totalClaimed(), 0.4 ether, "Total claimed should be tracked");

        dist.claimReferral(REFERRER2, 0.6 ether, proof2);
        assertEq(rewardToken.balanceOf(REFERRER2), 0.6 ether, "Second referrer should be paid");
        assertEq(dist.totalClaimed(), REFERRAL_POOL, "Total claimed should sum both claims");
    }

    function test_ClaimReferral_PermissionlessPaysReferrerNotCaller() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);

        vm.prank(RANDO);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);

        assertEq(rewardToken.balanceOf(REFERRER), 0.4 ether, "Referrer should receive the tokens");
        assertEq(rewardToken.balanceOf(RANDO), 0, "Caller should receive nothing");
    }

    function test_ClaimReferral_RevertOnDoubleClaim() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);

        dist.claimReferral(REFERRER, 0.4 ether, proof1);

        vm.expectRevert(ReferralDistributor.AlreadyClaimed.selector);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);
    }

    function test_ClaimReferral_OneShotEvenAfterRepublishIncrease() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.3 ether, 0.2 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, 0.5 ether);
        dist.claimReferral(REFERRER, 0.3 ether, proof1);

        // Corrected root raises REFERRER's entitlement, but claims are one-shot
        (bytes32 newRoot, bytes32[] memory newProof1,) = _twoReferrerTree(dist, 0.5 ether, 0.2 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(newRoot, 0.7 ether);

        vm.expectRevert(ReferralDistributor.AlreadyClaimed.selector);
        dist.claimReferral(REFERRER, 0.5 ether, newProof1);
    }

    function test_ClaimReferral_RevertAfterWindow() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);

        vm.warp(uint256(dist.claimWindowEnd()) + 1);
        vm.expectRevert(ReferralDistributor.ClaimWindowClosed.selector);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);
    }

    function test_ClaimReferral_RevertBeforeRootPublished() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        vm.expectRevert(ReferralDistributor.ClaimWindowClosed.selector);
        dist.claimReferral(REFERRER, 0.4 ether, new bytes32[](0));
    }

    function test_ClaimReferral_RevertOnInvalidProof() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);

        // Wrong amount for a valid proof
        vm.expectRevert(ReferralDistributor.InvalidProof.selector);
        dist.claimReferral(REFERRER, 0.5 ether, proof1);

        // Wrong referrer for a valid proof
        vm.expectRevert(ReferralDistributor.InvalidProof.selector);
        dist.claimReferral(RANDO, 0.4 ether, proof1);
    }

    function test_ClaimReferral_RevertZeroAmount() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root,,) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);

        vm.expectRevert(ReferralDistributor.NothingToClaim.selector);
        dist.claimReferral(REFERRER, 0, new bytes32[](0));
    }

    /// @notice A valid reward-tree proof must never verify against the referral tree,
    ///         even if the operator mistakenly publishes the reward root here
    function test_ClaimReferral_RejectsRewardProof() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();

        // Publish a reward root the user can genuinely claim against
        bytes32 rewardLeaf1 = _makeRewardLeaf(address(campaign), REFERRER, address(rewardToken), 0.4 ether);
        bytes32 rewardLeaf2 = _makeRewardLeaf(address(campaign), REFERRER2, address(rewardToken), 0.6 ether);
        bytes32 rewardRoot = _hashPair(rewardLeaf1, rewardLeaf2);
        bytes32[] memory rewardProof = new bytes32[](1);
        rewardProof[0] = rewardLeaf2;

        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, rewardRoot, REFERRAL_POOL, true);
        ReferralDistributor dist = _deployDistributor(campaignId, address(campaign));

        // The proof is valid for the campaign's reward claim
        manager.claim(campaignId, REFERRER, 0.4 ether, rewardProof);
        assertEq(rewardToken.balanceOf(REFERRER), 0.4 ether, "Reward proof should work on the campaign");

        // Operator mistakenly publishes the same root on the distributor: the reward
        // proof still fails because referral leaves include the campaign id
        vm.prank(OPERATOR);
        dist.setReferralRoot(rewardRoot, REFERRAL_POOL);

        vm.expectRevert(ReferralDistributor.InvalidProof.selector);
        dist.claimReferral(REFERRER, 0.4 ether, rewardProof);
    }

    function test_ClaimReferral_RevertWhenExceedingCommitment() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();

        // Malformed tree: leaves sum to 0.9 but only 0.5 is committed
        (bytes32 root, bytes32[] memory proof1, bytes32[] memory proof2) = _twoReferrerTree(dist, 0.4 ether, 0.5 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, 0.5 ether);

        dist.claimReferral(REFERRER2, 0.5 ether, proof2);

        vm.expectRevert(ReferralDistributor.ClaimExceedsCommitment.selector);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);
    }

    function test_ClaimReferral_ReentrantTokenCannotDoublePay() public {
        // Direct-funded campaign whose reward token reenters the distributor on transfer
        ReentrantERC20 evilToken = new ReentrantERC20();
        evilToken.mint(address(this), 10 ether);
        evilToken.approve(address(manager), 10 ether);

        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        uint256 campaignId =
            manager.createCampaignDirect(keccak256("evil"), address(evilToken), 10 ether, startTime, endTime, 0);
        TimeBasedIncentiveCampaign campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
        _finalize(campaignId, campaign);

        ReferralDistributor dist = ReferralDistributor(LibClone.clone(address(distributorImpl)));
        vm.prank(address(manager));
        dist.initialize(address(campaign), campaignId, REFERRAL_POOL, CLAIM_WINDOW);
        evilToken.mint(address(dist), REFERRAL_POOL);

        bytes32 leaf1 = _makeReferralLeaf(campaignId, REFERRER, address(evilToken), 0.4 ether);
        bytes32 leaf2 = _makeReferralLeaf(campaignId, REFERRER2, address(evilToken), 0.4 ether);
        bytes32[] memory proof1 = new bytes32[](1);
        proof1[0] = leaf2;

        vm.prank(OPERATOR);
        dist.setReferralRoot(_hashPair(leaf1, leaf2), 0.8 ether);

        evilToken.arm(dist, REFERRER, 0.4 ether, proof1);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);

        assertTrue(evilToken.reenterAttempted(), "Token should have attempted reentry");
        assertFalse(evilToken.reenterSucceeded(), "Reentrant claim should have reverted");
        assertEq(evilToken.balanceOf(REFERRER), 0.4 ether, "Referrer should be paid exactly once");
        assertEq(dist.totalClaimed(), 0.4 ether, "Total claimed should count one payment");
    }

    ////////////////////////////////
    // sweepReferralPool
    ////////////////////////////////

    function test_Sweep_RevertBeforeWindowEnds() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root"), REFERRAL_POOL);

        // Still sweepable-not: exactly at the window boundary claims are valid
        vm.warp(uint256(dist.claimWindowEnd()));
        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.SweepNotReady.selector);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);
    }

    function test_Sweep_SuccessAfterWindow() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        (bytes32 root, bytes32[] memory proof1,) = _twoReferrerTree(dist, 0.4 ether, 0.6 ether);
        vm.prank(OPERATOR);
        dist.setReferralRoot(root, REFERRAL_POOL);
        dist.claimReferral(REFERRER, 0.4 ether, proof1);

        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        vm.warp(uint256(dist.claimWindowEnd()) + 1);
        vm.prank(OPERATOR);
        vm.expectEmit(true, true, true, true);
        emit ReferralDistributor.ReferralPoolSwept(0.6 ether, PROTOCOL_FEE_RECEIVER);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);

        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore,
            0.6 ether,
            "Unclaimed remainder should be swept"
        );
        assertTrue(dist.swept(), "Swept flag should be set");
    }

    function test_Sweep_RevertWhenNotAuthorized() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root"), REFERRAL_POOL);

        vm.warp(uint256(dist.claimWindowEnd()) + 1);
        vm.prank(RANDO);
        vm.expectRevert(ReferralDistributor.NotAuthorized.selector);
        dist.sweepReferralPool(RANDO);
    }

    function test_Sweep_RevertZeroDestination() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root"), REFERRAL_POOL);

        vm.warp(uint256(dist.claimWindowEnd()) + 1);
        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.ZeroSweepDestination.selector);
        dist.sweepReferralPool(address(0));
    }

    function test_Sweep_RevertWhenNothingToSweep() public {
        (,, ReferralDistributor dist) = _createFinalizedWithDistributor();
        vm.prank(OPERATOR);
        dist.setReferralRoot(keccak256("root"), REFERRAL_POOL);

        vm.warp(uint256(dist.claimWindowEnd()) + 1);
        vm.prank(OPERATOR);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);

        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.NothingToSweep.selector);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);
    }

    function test_Sweep_CancelledCampaign_FullPoolAfterGracePeriod() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createCampaign();
        ReferralDistributor dist = _deployDistributor(campaignId, address(campaign));

        // Cancel mid-campaign; no referral root is ever published
        vm.warp(campaign.startTime() + 5 days);
        manager.cancelCampaign(campaignId);
        uint64 cancelTime = campaign.endTime();

        // Not sweepable until a full claim-window duration past the (moved-up) end time
        vm.warp(uint256(cancelTime) + CLAIM_WINDOW);
        vm.prank(OPERATOR);
        vm.expectRevert(ReferralDistributor.SweepNotReady.selector);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);

        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        vm.warp(uint256(cancelTime) + CLAIM_WINDOW + 1);
        vm.prank(OPERATOR);
        dist.sweepReferralPool(PROTOCOL_FEE_RECEIVER);

        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore, REFERRAL_POOL, "Full pool should be swept"
        );
    }
}
