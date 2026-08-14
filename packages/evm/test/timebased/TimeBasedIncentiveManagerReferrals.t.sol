// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";

contract TimeBasedIncentiveManagerReferralsTest is Test {
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
    uint64 constant REFERRAL_FEE_BPS = 2000; // 20% of the protocol fee

    function setUp() public {
        rewardToken = new MockERC20();
        campaignImpl = new TimeBasedIncentiveCampaign();
        distributorImpl = new ReferralDistributor();

        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManager()));
        manager = TimeBasedIncentiveManager(proxy);
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
        manager.setOperator(OPERATOR);
        manager.setReferralDistributorImplementation(address(distributorImpl));

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

    function _createReferralCampaign(uint64 referralFeeBps)
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist)
    {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        vm.prank(CREATOR);
        campaignId = manager.createCampaign(
            budget, keccak256("referral-test"), address(rewardToken), 10 ether, startTime, endTime, referralFeeBps
        );
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
        dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
    }

    /// @notice Warp past the campaign's end and finalize it via the manager
    function _finalize(uint256 campaignId, TimeBasedIncentiveCampaign campaign) internal {
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("reward-root"), 0, true);
    }

    /// @notice Double-hashed 4-field referral leaf
    function _makeReferralLeaf(uint256 campaignId, address referrer, address token, uint256 amount)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(bytes.concat(keccak256(abi.encode(campaignId, referrer, token, amount))));
    }

    /// @notice Sorted-pair hash matching MerkleProofLib's verification
    function _hashPair(bytes32 a, bytes32 b) internal pure returns (bytes32) {
        return uint256(a) < uint256(b) ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }

    ////////////////////////////////
    // Fee split - createCampaign
    ////////////////////////////////

    function test_CreateCampaign_ReferralFeeSplit() public {
        // 10 ether total, 10% fee = 1 ether; 20% of the fee = 0.2 ether referral slice
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ReferralDistributorCreated(1, address(0), REFERRAL_FEE_BPS, 0.2 ether);
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_FEE_BPS);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.8 ether, "Fee receiver should get fee minus slice");
        assertEq(rewardToken.balanceOf(address(dist)), 0.2 ether, "Distributor should hold the referral slice");
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether, "Campaign should receive full net rewards");

        assertEq(manager.campaignReferralFeeBps(campaignId), REFERRAL_FEE_BPS, "Per-campaign bps should be stored");
        assertEq(dist.timeBasedIncentiveManager(), address(manager), "Distributor manager should be set");
        assertEq(dist.campaign(), address(campaign), "Distributor campaign should be set");
        assertEq(dist.campaignId(), campaignId, "Distributor campaign ID should be set");
        assertEq(dist.referralToken(), address(rewardToken), "Distributor token should match campaign");
        assertEq(dist.referralPool(), 0.2 ether, "Distributor pool should equal the slice");
        assertEq(dist.claimWindowDuration(), 60 days, "Distributor window should use the manager default");
    }

    function test_CreateCampaign_NetRewardsUnchangedByReferralFee() public {
        (, TimeBasedIncentiveCampaign plainCampaign,) = _createReferralCampaign(0);
        (, TimeBasedIncentiveCampaign referralCampaign,) = _createReferralCampaign(2500);

        assertEq(
            referralCampaign.totalRewards(), plainCampaign.totalRewards(), "Referral fee must not change net rewards"
        );
        assertEq(referralCampaign.totalRewards(), 9 ether, "Net rewards should be total minus protocol fee");
    }

    function test_CreateCampaign_ZeroReferralFee_ShipsDark() public {
        (uint256 campaignId,, ReferralDistributor dist) = _createReferralCampaign(0);

        assertEq(address(dist), address(0), "No distributor should be cloned for 0 bps");
        assertEq(manager.campaignReferralFeeBps(campaignId), 0, "No bps should be stored");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Full fee should go to the fee receiver");
    }

    function test_CreateCampaign_MaxReferralFee() public {
        (,, ReferralDistributor dist) = _createReferralCampaign(2500);

        assertEq(rewardToken.balanceOf(address(dist)), 0.25 ether, "Distributor should get 25% of the fee");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.75 ether, "Fee receiver should get 75% of the fee");
    }

    function test_CreateCampaign_RevertWhenReferralFeeTooHigh() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralFeeTooHigh.selector);
        manager.createCampaign(budget, keccak256("t"), address(rewardToken), 10 ether, startTime, endTime, 2501);

        rewardToken.mint(CREATOR, 10 ether);
        vm.startPrank(CREATOR);
        rewardToken.approve(address(manager), 10 ether);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralFeeTooHigh.selector);
        manager.createCampaignDirect(keccak256("t"), address(rewardToken), 10 ether, startTime, endTime, 2501);
        vm.stopPrank();
    }

    function test_CreateCampaign_ReferralSliceRoundsDownToProtocol() public {
        // 9990 wei total, 10% fee = 999; 25% of 999 = 249.75 -> referral 249, protocol 750
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("odd"), address(rewardToken), 9990, startTime, endTime, 2500);

        address dist = manager.getReferralDistributor(campaignId);
        assertEq(rewardToken.balanceOf(dist), 249, "Referral slice should round down");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 750, "Protocol should keep the remainder");
        assertEq(rewardToken.balanceOf(manager.getCampaign(campaignId)), 8991, "Net rewards should be total minus fee");
    }

    function test_CreateCampaign_ZeroProtocolFee_NoDistributor() public {
        manager.setProtocolFee(0);
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_FEE_BPS);

        assertEq(address(dist), address(0), "No fee means no referral slice and no distributor");
        assertEq(manager.campaignReferralFeeBps(campaignId), 0, "No bps should be stored without a distributor");
        assertEq(campaign.totalRewards(), 10 ether, "Full amount should go to rewards");
    }

    function test_CreateCampaign_RevertWhenReferralsNotConfigured() public {
        // Fresh manager without a distributor implementation configured
        TimeBasedIncentiveManager darkManager =
            TimeBasedIncentiveManager(LibClone.deployERC1967(address(new TimeBasedIncentiveManager())));
        darkManager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);

        address[] memory accounts = new address[](1);
        accounts[0] = address(darkManager);
        bool[] memory flags = new bool[](1);
        flags[0] = true;
        budget.setAuthorized(accounts, flags);

        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralsNotConfigured.selector);
        darkManager.createCampaign(
            budget, keccak256("t"), address(rewardToken), 10 ether, startTime, endTime, REFERRAL_FEE_BPS
        );

        // A zero bps campaign still works while referrals are unconfigured
        vm.prank(CREATOR);
        darkManager.createCampaign(budget, keccak256("t"), address(rewardToken), 10 ether, startTime, endTime, 0);
    }

    function test_CreateCampaign_RevertWhenClaimWindowUnset() public {
        // Simulate an upgraded proxy where the implementation is set but the claim
        // window slot is still zero (slot 8: impl at offset 0, window at offset 20)
        vm.store(address(manager), bytes32(uint256(8)), bytes32(uint256(uint160(address(distributorImpl)))));
        assertEq(manager.referralClaimWindowDuration(), 0, "Window should be unset");

        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralsNotConfigured.selector);
        manager.createCampaign(
            budget, keccak256("t"), address(rewardToken), 10 ether, startTime, endTime, REFERRAL_FEE_BPS
        );
    }

    ////////////////////////////////
    // Fee split - createCampaignDirect
    ////////////////////////////////

    function test_CreateCampaignDirect_ReferralFeeSplit() public {
        rewardToken.mint(CREATOR, 10 ether);
        uint64 startTime = uint64(block.timestamp + 1 hours);
        uint64 endTime = uint64(block.timestamp + 30 days);

        vm.startPrank(CREATOR);
        rewardToken.approve(address(manager), 10 ether);
        uint256 campaignId = manager.createCampaignDirect(
            keccak256("direct"), address(rewardToken), 10 ether, startTime, endTime, REFERRAL_FEE_BPS
        );
        vm.stopPrank();

        address dist = manager.getReferralDistributor(campaignId);
        assertTrue(dist != address(0), "Distributor should be cloned");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.8 ether, "Fee receiver should get fee minus slice");
        assertEq(rewardToken.balanceOf(dist), 0.2 ether, "Distributor should hold the referral slice");
        assertEq(rewardToken.balanceOf(manager.getCampaign(campaignId)), 9 ether, "Campaign should get net rewards");
        assertEq(rewardToken.balanceOf(address(manager)), 0, "Manager should hold nothing after the split");
        assertEq(ReferralDistributor(dist).referralPool(), 0.2 ether, "Distributor pool should equal the slice");
    }

    ////////////////////////////////
    // Manager wrappers
    ////////////////////////////////

    function test_SetReferralRoot_ViaManager() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_FEE_BPS);
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        vm.expectEmit(true, true, true, true);
        emit TimeBasedIncentiveManager.ReferralRootUpdated(
            campaignId, bytes32(0), keccak256("referral-root"), 0.2 ether
        );
        manager.setReferralRoot(campaignId, keccak256("referral-root"), 0.2 ether);

        assertEq(dist.referralRoot(), keccak256("referral-root"), "Root should be set on the distributor");
        assertEq(dist.committedTotal(), 0.2 ether, "Committed total should be set");
        assertEq(dist.claimWindowEnd(), uint64(block.timestamp) + 60 days, "Claim window should start");
    }

    function test_SetReferralRoot_ViaManager_RevertWhenNotAuthorized() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(REFERRAL_FEE_BPS);
        _finalize(campaignId, campaign);

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.setReferralRoot(campaignId, keccak256("referral-root"), 0.2 ether);
    }

    function test_SetReferralRoot_ViaManager_RevertWhenNoDistributor() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(0);
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.setReferralRoot(campaignId, keccak256("referral-root"), 0.2 ether);
    }

    function test_ClaimReferral_ViaManager() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_FEE_BPS);
        _finalize(campaignId, campaign);

        bytes32 leaf1 = _makeReferralLeaf(campaignId, REFERRER, address(rewardToken), 0.15 ether);
        bytes32 leaf2 = _makeReferralLeaf(campaignId, REFERRER2, address(rewardToken), 0.05 ether);
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leaf2;

        vm.prank(OPERATOR);
        manager.setReferralRoot(campaignId, _hashPair(leaf1, leaf2), 0.2 ether);

        vm.prank(RANDO);
        vm.expectEmit(true, true, true, true);
        emit TimeBasedIncentiveManager.ReferralClaimed(campaignId, REFERRER, 0.15 ether);
        manager.claimReferral(campaignId, REFERRER, 0.15 ether, proof);

        assertEq(rewardToken.balanceOf(REFERRER), 0.15 ether, "Referrer should be paid via the wrapper");
        assertTrue(dist.claimed(REFERRER), "One-shot flag should be set");

        vm.expectRevert(ReferralDistributor.AlreadyClaimed.selector);
        manager.claimReferral(campaignId, REFERRER, 0.15 ether, proof);
    }

    function test_ClaimReferral_ViaManager_RevertWhenNoDistributor() public {
        (uint256 campaignId,,) = _createReferralCampaign(0);

        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.claimReferral(campaignId, REFERRER, 0.15 ether, new bytes32[](0));
    }

    function test_SweepReferralPool_ViaManager() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_FEE_BPS);
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        manager.setReferralRoot(campaignId, keccak256("referral-root"), 0.2 ether);

        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        vm.warp(uint256(dist.claimWindowEnd()) + 1);

        // Permissionless: destination is locked to the protocol fee receiver
        vm.prank(RANDO);
        vm.expectEmit(true, true, true, true);
        emit TimeBasedIncentiveManager.ReferralPoolSwept(campaignId, 0.2 ether, PROTOCOL_FEE_RECEIVER);
        manager.sweepReferralPool(campaignId);

        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore,
            0.2 ether,
            "Pool should be swept to the fee receiver"
        );
    }

    function test_SweepReferralPool_ViaManager_RevertBeforeWindowEnds() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(REFERRAL_FEE_BPS);
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        manager.setReferralRoot(campaignId, keccak256("referral-root"), 0.2 ether);

        vm.expectRevert(ReferralDistributor.SweepNotReady.selector);
        manager.sweepReferralPool(campaignId);
    }

    ////////////////////////////////
    // Config setters
    ////////////////////////////////

    function test_SetReferralDistributorImplementation() public {
        address newImpl = address(new ReferralDistributor());

        vm.expectEmit(true, true, true, true);
        emit TimeBasedIncentiveManager.ReferralDistributorImplementationUpdated(address(distributorImpl), newImpl);
        manager.setReferralDistributorImplementation(newImpl);
        assertEq(manager.referralDistributorImplementation(), newImpl, "Implementation should be updated");

        vm.expectRevert(TimeBasedIncentiveManager.InvalidImplementation.selector);
        manager.setReferralDistributorImplementation(address(0));

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        manager.setReferralDistributorImplementation(newImpl);
    }

    function test_SetReferralClaimWindowDuration() public {
        assertEq(manager.referralClaimWindowDuration(), 60 days, "Fresh deploys should default to 60 days");

        vm.expectEmit(true, true, true, true);
        emit TimeBasedIncentiveManager.ReferralClaimWindowDurationUpdated(60 days, 30 days);
        manager.setReferralClaimWindowDuration(30 days);
        assertEq(manager.referralClaimWindowDuration(), 30 days, "Duration should be updated");

        vm.expectRevert(TimeBasedIncentiveManager.ClaimExpiryDurationTooShort.selector);
        manager.setReferralClaimWindowDuration(1 days - 1);

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        manager.setReferralClaimWindowDuration(30 days);
    }

    function test_Version() public view {
        assertEq(manager.version(), "2.2.0", "Version should be bumped");
    }
}
