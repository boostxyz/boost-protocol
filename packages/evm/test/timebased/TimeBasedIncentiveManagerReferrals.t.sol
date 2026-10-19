// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";

/// @dev Distributor whose top-up marker reports no support
contract FalseTopUpMarker {
    function supportsTopUps() external pure returns (bool) {
        return false;
    }
}

/// @dev Distributor whose top-up marker returns a word that is not a valid bool
contract NonBoolTopUpMarker {
    function supportsTopUps() external pure returns (uint256) {
        return 2;
    }
}

contract TimeBasedIncentiveManagerReferralsTest is Test {
    MockERC20 rewardToken;
    MockERC20 bonusToken;
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
    uint256 constant TOTAL = 10 ether;
    uint256 constant REFERRAL_AMOUNT = 0.2 ether;
    uint256 constant BONUS_AMOUNT = 5 ether;

    function setUp() public {
        rewardToken = new MockERC20();
        bonusToken = new MockERC20();
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

        _allocate(rewardToken, 100 ether);
        _allocate(bonusToken, 100 ether);
    }

    ////////////////////////////////
    // Helpers
    ////////////////////////////////

    function _allocate(MockERC20 token, uint256 amount) internal {
        token.mint(address(this), amount);
        token.approve(address(budget), amount);
        budget.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(token),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: amount}))
                })
            )
        );
    }

    function _times() internal view returns (uint64 startTime, uint64 endTime) {
        startTime = uint64(block.timestamp + 1 hours);
        endTime = uint64(block.timestamp + 30 days);
    }

    function _noPools() internal pure returns (TimeBasedIncentiveManager.ReferralPoolParams[] memory pools) {
        pools = new TimeBasedIncentiveManager.ReferralPoolParams[](0);
    }

    function _pool(address token, uint256 amount)
        internal
        pure
        returns (TimeBasedIncentiveManager.ReferralPoolParams[] memory pools)
    {
        pools = new TimeBasedIncentiveManager.ReferralPoolParams[](1);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: token, amount: amount});
    }

    /// @notice A reward-token pool at index 0 and a bonus-token pool at index 1
    function _twoPools() internal view returns (TimeBasedIncentiveManager.ReferralPoolParams[] memory pools) {
        pools = new TimeBasedIncentiveManager.ReferralPoolParams[](2);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(rewardToken), amount: REFERRAL_AMOUNT});
        pools[1] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(bonusToken), amount: BONUS_AMOUNT});
    }

    function _create(TimeBasedIncentiveManager.ReferralPoolParams[] memory pools)
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign)
    {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createCampaign(
            budget, keccak256("referral-test"), address(rewardToken), TOTAL, startTime, endTime, pools
        );
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    /// @notice Create a campaign with a single reward-token pool (none if the amount is 0)
    function _createReferralCampaign(uint256 referralAmount)
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist)
    {
        (campaignId, campaign) = _create(referralAmount == 0 ? _noPools() : _pool(address(rewardToken), referralAmount));
        dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));
    }

    /// @notice Create a direct-funded campaign; the creator holds exactly the reward total plus
    ///         one reward-token pool and one bonus pool, and approves both tokens
    function _createDirect(TimeBasedIncentiveManager.ReferralPoolParams[] memory pools)
        internal
        returns (uint256 campaignId)
    {
        rewardToken.mint(CREATOR, TOTAL + REFERRAL_AMOUNT);
        bonusToken.mint(CREATOR, BONUS_AMOUNT);
        (uint64 startTime, uint64 endTime) = _times();
        vm.startPrank(CREATOR);
        rewardToken.approve(address(manager), type(uint256).max);
        bonusToken.approve(address(manager), type(uint256).max);
        campaignId =
            manager.createCampaignDirect(keccak256("direct"), address(rewardToken), TOTAL, startTime, endTime, pools);
        vm.stopPrank();
    }

    function _dist(uint256 campaignId, uint256 poolIndex) internal view returns (ReferralDistributor) {
        return ReferralDistributor(manager.getReferralDistributor(campaignId, poolIndex));
    }

    /// @notice Warp past the campaign's end and finalize it via the manager
    function _finalize(uint256 campaignId, TimeBasedIncentiveCampaign campaign) internal {
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("reward-root"), 0, true);
    }

    /// @notice Double-hashed, chain- and pool-bound referral leaf
    function _leaf(uint256 campaignId, uint256 poolIndex, address referrer, address token, uint256 amount)
        internal
        view
        returns (bytes32)
    {
        return keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, campaignId, poolIndex, referrer, token, amount)))
        );
    }

    /// @notice Sorted-pair hash matching MerkleProofLib's verification
    function _hashPair(bytes32 a, bytes32 b) internal pure returns (bytes32) {
        return uint256(a) < uint256(b) ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }

    ////////////////////////////////
    // Creation - budget funded
    ////////////////////////////////

    function test_CreateCampaign_PoolFundedOnTopOfTotal() public {
        // The fee applies to the 10 ether total only; the 0.2 ether pool is drawn on top of it
        vm.expectEmit(true, true, true, false, address(manager));
        emit TimeBasedIncentiveManager.CampaignCreated(
            1, bytes32(0), address(0), CREATOR, address(budget), address(rewardToken), 0, 0, 0, 0
        );
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(1, 0, address(0), address(rewardToken), REFERRAL_AMOUNT);
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_AMOUNT);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Fee receiver should get the full fee");
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether, "Campaign should get total minus fee");
        assertEq(campaign.totalRewards(), 9 ether, "Net rewards should not be reduced by the pool");
        assertEq(rewardToken.balanceOf(address(dist)), REFERRAL_AMOUNT, "Distributor should hold the pool");
        assertEq(rewardToken.balanceOf(address(budget)), 100 ether - TOTAL - REFERRAL_AMOUNT, "Pool drawn on top");

        assertEq(dist.timeBasedIncentiveManager(), address(manager), "Distributor manager should be set");
        assertEq(dist.campaign(), address(campaign), "Distributor campaign should be set");
        assertEq(dist.campaignId(), campaignId, "Distributor campaign ID should be set");
        assertEq(dist.poolIndex(), 0, "First pool should be index 0");
        assertEq(dist.referralToken(), address(rewardToken), "Distributor token should be the pool token");
        assertEq(dist.referralPool(), REFERRAL_AMOUNT, "Distributor pool should equal the amount");
        assertEq(dist.claimWindowDuration(), 60 days, "Distributor window should use the manager default");
        assertEq(manager.referralPoolCount(campaignId), 1, "One pool");
    }

    function test_CreateCampaign_MultiplePoolsInDifferentTokens() public {
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(1, 0, address(0), address(rewardToken), REFERRAL_AMOUNT);
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(1, 1, address(0), address(bonusToken), BONUS_AMOUNT);
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());

        address[] memory pools = manager.getReferralDistributors(campaignId);
        assertEq(pools.length, 2, "Two pools");
        assertEq(manager.referralPoolCount(campaignId), 2, "Pool count");
        assertEq(pools[0], manager.getReferralDistributor(campaignId, 0), "Pool 0 getter");
        assertEq(pools[1], manager.getReferralDistributor(campaignId, 1), "Pool 1 getter");
        assertTrue(pools[0] != pools[1], "Each pool gets its own clone");

        ReferralDistributor first = ReferralDistributor(pools[0]);
        ReferralDistributor second = ReferralDistributor(pools[1]);
        assertEq(first.poolIndex(), 0);
        assertEq(first.referralToken(), address(rewardToken));
        assertEq(first.referralPool(), REFERRAL_AMOUNT);
        assertEq(second.poolIndex(), 1);
        assertEq(second.referralToken(), address(bonusToken));
        assertEq(second.referralPool(), BONUS_AMOUNT);
        assertEq(second.campaign(), address(campaign));

        assertEq(rewardToken.balanceOf(pools[0]), REFERRAL_AMOUNT, "Pool 0 funded in the reward token");
        assertEq(bonusToken.balanceOf(pools[1]), BONUS_AMOUNT, "Pool 1 funded in the bonus token");
        assertEq(bonusToken.balanceOf(address(budget)), 100 ether - BONUS_AMOUNT, "Bonus drawn from the budget");
        assertEq(bonusToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0, "No protocol fee on referral pools");
        assertEq(campaign.totalRewards(), 9 ether, "Pools never touch the rewards");
    }

    function test_CreateCampaign_SameTokenTwice() public {
        TimeBasedIncentiveManager.ReferralPoolParams[] memory pools =
            new TimeBasedIncentiveManager.ReferralPoolParams[](2);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(rewardToken), amount: 1 ether});
        pools[1] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(rewardToken), amount: 2 ether});
        (uint256 campaignId,) = _create(pools);

        assertEq(_dist(campaignId, 0).referralPool(), 1 ether);
        assertEq(_dist(campaignId, 1).referralPool(), 2 ether);
        assertEq(_dist(campaignId, 1).referralToken(), address(rewardToken));
    }

    function test_CreateCampaign_NoPools() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) = _createReferralCampaign(0);

        assertEq(address(dist), address(0), "No distributor for an empty pool list");
        assertEq(manager.getReferralDistributors(campaignId).length, 0, "No pools");
        assertEq(manager.referralPoolCount(campaignId), 0, "Pool count");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Full fee should go to the fee receiver");
        assertEq(campaign.totalRewards(), 9 ether, "Net rewards should be total minus fee");
    }

    function test_CreateCampaign_RevertInvalidPool() public {
        (uint64 startTime, uint64 endTime) = _times();

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidReferralToken.selector);
        manager.createCampaign(
            budget, keccak256("t"), address(rewardToken), TOTAL, startTime, endTime, _pool(address(0), 1 ether)
        );

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ZeroAmount.selector);
        manager.createCampaign(
            budget, keccak256("t"), address(rewardToken), TOTAL, startTime, endTime, _pool(address(bonusToken), 0)
        );

        assertEq(manager.campaignCount(), 0, "A bad pool reverts the whole creation");
        assertEq(rewardToken.balanceOf(address(budget)), 100 ether, "Nothing drawn");
    }

    function test_CreateCampaign_RevertTooManyPools() public {
        uint256 max = manager.MAX_REFERRAL_POOLS();
        TimeBasedIncentiveManager.ReferralPoolParams[] memory pools =
            new TimeBasedIncentiveManager.ReferralPoolParams[](max + 1);
        for (uint256 i; i < pools.length; ++i) {
            pools[i] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(bonusToken), amount: 1 ether});
        }
        (uint64 startTime, uint64 endTime) = _times();

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.TooManyReferralPools.selector);
        manager.createCampaign(budget, keccak256("t"), address(rewardToken), TOTAL, startTime, endTime, pools);

        // Exactly the maximum is allowed
        assembly {
            mstore(pools, max)
        }
        (uint256 campaignId,) = _create(pools);
        assertEq(manager.referralPoolCount(campaignId), max);
    }

    function test_CreateCampaign_RevertWhenBudgetLacksPoolToken() public {
        MockERC20 otherToken = new MockERC20();
        (uint64 startTime, uint64 endTime) = _times();

        vm.prank(CREATOR);
        vm.expectRevert();
        manager.createCampaign(
            budget, keccak256("t"), address(rewardToken), TOTAL, startTime, endTime, _pool(address(otherToken), 1 ether)
        );
    }

    function test_CreateCampaign_ZeroProtocolFee_PoolStillFunded() public {
        manager.setProtocolFee(0);
        (, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) = _createReferralCampaign(REFERRAL_AMOUNT);

        assertTrue(address(dist) != address(0), "Referral pool should not depend on the protocol fee");
        assertEq(rewardToken.balanceOf(address(dist)), REFERRAL_AMOUNT, "Distributor should hold the pool");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0, "No fee should be taken");
        assertEq(campaign.totalRewards(), TOTAL, "Rewards should be the whole total");
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

        (uint64 startTime, uint64 endTime) = _times();

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralsNotConfigured.selector);
        darkManager.createCampaign(
            budget,
            keccak256("t"),
            address(rewardToken),
            TOTAL,
            startTime,
            endTime,
            _pool(address(rewardToken), REFERRAL_AMOUNT)
        );

        // A campaign without pools still works while referrals are unconfigured
        vm.prank(CREATOR);
        darkManager.createCampaign(budget, keccak256("t"), address(rewardToken), TOTAL, startTime, endTime, _noPools());
    }

    function test_CreateCampaign_RevertWhenClaimWindowUnset() public {
        // Simulate an upgraded proxy where the implementation is set but the claim
        // window slot is still zero (slot 8: impl at offset 0, window at offset 20)
        vm.store(address(manager), bytes32(uint256(8)), bytes32(uint256(uint160(address(distributorImpl)))));
        assertEq(manager.referralClaimWindowDuration(), 0, "Window should be unset");

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralsNotConfigured.selector);
        manager.createCampaign(
            budget,
            keccak256("t"),
            address(rewardToken),
            TOTAL,
            startTime,
            endTime,
            _pool(address(rewardToken), REFERRAL_AMOUNT)
        );
    }

    function test_CreateCampaign_LegacySelectorNoReferralPool() public {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        uint256 campaignId =
            manager.createCampaign(budget, keccak256("legacy"), address(rewardToken), TOTAL, startTime, endTime);

        assertEq(manager.referralPoolCount(campaignId), 0, "Legacy calls should create no pool");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Full fee should go to the fee receiver");
        assertEq(rewardToken.balanceOf(manager.getCampaign(campaignId)), 9 ether, "Campaign should get net rewards");
    }

    ////////////////////////////////
    // Creation - direct funded
    ////////////////////////////////

    function test_CreateCampaignDirect_PoolsPulledFromCreator() public {
        uint256 campaignId = _createDirect(_twoPools());

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Fee receiver should get the full fee");
        assertEq(rewardToken.balanceOf(manager.getCampaign(campaignId)), 9 ether, "Campaign should get the rest");
        assertEq(rewardToken.balanceOf(address(_dist(campaignId, 0))), REFERRAL_AMOUNT, "Pool 0 from the creator");
        assertEq(bonusToken.balanceOf(address(_dist(campaignId, 1))), BONUS_AMOUNT, "Pool 1 from the creator");
        assertEq(rewardToken.balanceOf(CREATOR), 0, "Creator paid the total plus the reward-token pool");
        assertEq(bonusToken.balanceOf(CREATOR), 0, "Creator paid the bonus pool");
        assertEq(rewardToken.balanceOf(address(manager)), 0, "Manager should hold nothing after the split");
        assertEq(bonusToken.balanceOf(address(manager)), 0, "Pool tokens never pass through the manager");
    }

    function test_CreateCampaignDirect_RevertWithoutPoolApproval() public {
        rewardToken.mint(CREATOR, TOTAL);
        bonusToken.mint(CREATOR, BONUS_AMOUNT);
        (uint64 startTime, uint64 endTime) = _times();

        vm.startPrank(CREATOR);
        rewardToken.approve(address(manager), TOTAL);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        manager.createCampaignDirect(
            keccak256("direct"), address(rewardToken), TOTAL, startTime, endTime, _pool(address(bonusToken), 1 ether)
        );
        vm.stopPrank();

        assertEq(manager.campaignCount(), 0, "No campaign should be created");
        assertEq(rewardToken.balanceOf(CREATOR), TOTAL, "Reward funding should be returned on revert");
    }

    function test_CreateCampaignDirect_LegacySelectorNoReferralPool() public {
        rewardToken.mint(CREATOR, TOTAL);
        (uint64 startTime, uint64 endTime) = _times();

        vm.startPrank(CREATOR);
        rewardToken.approve(address(manager), TOTAL);
        uint256 campaignId =
            manager.createCampaignDirect(keccak256("legacy-direct"), address(rewardToken), TOTAL, startTime, endTime);
        vm.stopPrank();

        assertEq(manager.referralPoolCount(campaignId), 0, "Legacy calls should create no pool");
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Full fee should go to the fee receiver");
        assertEq(rewardToken.balanceOf(manager.getCampaign(campaignId)), 9 ether, "Campaign should get net rewards");
    }

    ////////////////////////////////
    // addReferralPool
    ////////////////////////////////

    function test_AddReferralPool_AppendsToBudgetFundedCampaign() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor first) =
            _createReferralCampaign(REFERRAL_AMOUNT);
        vm.warp(campaign.startTime() + 1 days);

        vm.prank(CREATOR);
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(campaignId, 1, address(0), address(bonusToken), BONUS_AMOUNT);
        uint256 poolIndex = manager.addReferralPool(campaignId, address(bonusToken), BONUS_AMOUNT);

        assertEq(poolIndex, 1, "Appended after the creation-time pool");
        address[] memory pools = manager.getReferralDistributors(campaignId);
        assertEq(pools.length, 2);
        assertEq(pools[0], address(first), "Existing pool keeps its index");
        ReferralDistributor second = ReferralDistributor(pools[1]);
        assertEq(second.poolIndex(), 1);
        assertEq(second.referralToken(), address(bonusToken));
        assertEq(second.referralPool(), BONUS_AMOUNT);
        assertEq(bonusToken.balanceOf(address(second)), BONUS_AMOUNT);
        assertEq(campaign.totalRewards(), 9 ether, "Rewards untouched");

        // Any account authorized on the budget may add a pool, not just the creator
        uint256 third = manager.addReferralPool(campaignId, address(rewardToken), 1 ether);
        assertEq(third, 2);
        assertEq(manager.referralPoolCount(campaignId), 3);
    }

    function test_AddReferralPool_FirstPoolAfterCreation() public {
        (uint256 campaignId,,) = _createReferralCampaign(0);

        vm.prank(CREATOR);
        uint256 poolIndex = manager.addReferralPool(campaignId, address(bonusToken), BONUS_AMOUNT);

        assertEq(poolIndex, 0, "First pool takes index 0 even when added after creation");
        assertEq(_dist(campaignId, 0).referralPool(), BONUS_AMOUNT);
    }

    function test_AddReferralPool_DirectFunded_CreatorOnly() public {
        uint256 campaignId = _createDirect(_noPools());

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.addReferralPool(campaignId, address(bonusToken), BONUS_AMOUNT);

        // Manager ownership does not grant it either
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.addReferralPool(campaignId, address(bonusToken), BONUS_AMOUNT);

        vm.prank(CREATOR);
        uint256 poolIndex = manager.addReferralPool(campaignId, address(bonusToken), BONUS_AMOUNT);
        assertEq(poolIndex, 0);
        assertEq(bonusToken.balanceOf(address(_dist(campaignId, 0))), BONUS_AMOUNT, "Pulled from the creator");
        assertEq(bonusToken.balanceOf(CREATOR), 0);
    }

    function test_AddReferralPool_RevertUnauthorizedOnBudget() public {
        (uint256 campaignId,,) = _createReferralCampaign(REFERRAL_AMOUNT);

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.addReferralPool(campaignId, address(bonusToken), BONUS_AMOUNT);
    }

    function test_AddReferralPool_RevertInvalidCampaign() public {
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidCampaign.selector);
        manager.addReferralPool(999, address(bonusToken), BONUS_AMOUNT);
    }

    function test_AddReferralPool_RevertInvalidPool() public {
        (uint256 campaignId,,) = _createReferralCampaign(0);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidReferralToken.selector);
        manager.addReferralPool(campaignId, address(0), 1 ether);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ZeroAmount.selector);
        manager.addReferralPool(campaignId, address(bonusToken), 0);
    }

    function test_AddReferralPool_RevertTooManyPools() public {
        uint256 max = manager.MAX_REFERRAL_POOLS();
        (uint256 campaignId,,) = _createReferralCampaign(0);
        for (uint256 i; i < max; ++i) {
            vm.prank(CREATOR);
            manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
        }

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.TooManyReferralPools.selector);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
    }

    function test_AddReferralPool_RevertAfterEndTime() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(0);

        vm.warp(campaign.endTime() - 1);
        vm.prank(CREATOR);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);

        vm.warp(campaign.endTime());
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
    }

    function test_AddReferralPool_RevertAfterCancel() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(0);
        vm.warp(campaign.startTime() + 1 days);

        vm.prank(CREATOR);
        manager.cancelCampaign(campaignId);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
    }

    function test_AddReferralPool_RevertAfterFinalize() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(0);
        _finalize(campaignId, campaign);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
    }

    ////////////////////////////////
    // fundReferralPool
    ////////////////////////////////

    function test_FundReferralPool_OnlyThatPool() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());
        ReferralDistributor first = _dist(campaignId, 0);
        ReferralDistributor second = _dist(campaignId, 1);

        vm.prank(CREATOR);
        vm.expectEmit(true, true, true, true, address(second));
        emit ReferralDistributor.ReferralPoolIncreased(1 ether, BONUS_AMOUNT + 1 ether);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolFunded(campaignId, 1, CREATOR, 1 ether, BONUS_AMOUNT + 1 ether);
        manager.fundReferralPool(campaignId, 1, 1 ether);

        assertEq(second.referralPool(), BONUS_AMOUNT + 1 ether, "Pool 1 grows");
        assertEq(bonusToken.balanceOf(address(second)), BONUS_AMOUNT + 1 ether, "Funded in the pool's token");
        assertEq(first.referralPool(), REFERRAL_AMOUNT, "Pool 0 untouched");
        assertEq(rewardToken.balanceOf(address(first)), REFERRAL_AMOUNT);
        assertEq(campaign.totalRewards(), 9 ether, "Rewards untouched");
        assertEq(bonusToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0, "No fee on pool top-ups");

        // The budget owner is authorized on the budget too
        manager.fundReferralPool(campaignId, 0, 0.1 ether);
        assertEq(first.referralPool(), REFERRAL_AMOUNT + 0.1 ether);
    }

    function test_FundReferralPool_DirectFunded_PullsFromCreator() public {
        uint256 campaignId = _createDirect(_twoPools());
        bonusToken.mint(CREATOR, 1 ether);

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.fundReferralPool(campaignId, 1, 1 ether);

        vm.prank(CREATOR);
        manager.fundReferralPool(campaignId, 1, 1 ether);
        assertEq(bonusToken.balanceOf(address(_dist(campaignId, 1))), BONUS_AMOUNT + 1 ether);
        assertEq(bonusToken.balanceOf(CREATOR), 0);
    }

    function test_FundReferralPool_RevertZeroAmount() public {
        (uint256 campaignId,,) = _createReferralCampaign(REFERRAL_AMOUNT);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ZeroAmount.selector);
        manager.fundReferralPool(campaignId, 0, 0);
    }

    function test_FundReferralPool_RevertNoSuchPool() public {
        (uint256 campaignId,,) = _createReferralCampaign(REFERRAL_AMOUNT);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.fundReferralPool(campaignId, 1, 1 ether);

        (uint256 plainId,,) = _createReferralCampaign(0);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.fundReferralPool(plainId, 0, 1 ether);
    }

    function test_FundReferralPool_RevertUnauthorized() public {
        (uint256 campaignId,,) = _createReferralCampaign(REFERRAL_AMOUNT);

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.fundReferralPool(campaignId, 0, 1 ether);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidCampaign.selector);
        manager.fundReferralPool(999, 0, 1 ether);
    }

    function test_FundReferralPool_RevertAfterEndOrFinalize() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_AMOUNT);

        vm.warp(campaign.endTime());
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.fundReferralPool(campaignId, 0, 1 ether);

        _finalize(campaignId, campaign);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.fundReferralPool(campaignId, 0, 1 ether);

        assertEq(dist.referralPool(), REFERRAL_AMOUNT, "Pool unchanged");
    }

    function test_FundReferralPool_RevertIncompatibleDistributor() public {
        (uint256 campaignId,, ReferralDistributor dist) = _createReferralCampaign(REFERRAL_AMOUNT);

        // A clone of a template without addToPool has no marker at all
        vm.etch(address(dist), hex"");
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.fundReferralPool(campaignId, 0, 1 ether);

        vm.etch(address(dist), address(new FalseTopUpMarker()).code);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.fundReferralPool(campaignId, 0, 1 ether);

        vm.etch(address(dist), address(new NonBoolTopUpMarker()).code);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.fundReferralPool(campaignId, 0, 1 ether);
    }

    ////////////////////////////////
    // Finalization recording
    ////////////////////////////////

    function test_Finalize_RecordsFinalizationOnEveryPool() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());
        assertEq(_dist(campaignId, 0).finalizedAt(), 0, "Finalization should not be recorded yet");
        assertEq(_dist(campaignId, 1).finalizedAt(), 0, "Finalization should not be recorded yet");

        _finalize(campaignId, campaign);

        assertEq(_dist(campaignId, 0).finalizedAt(), uint64(block.timestamp), "Pool 0 stamped");
        assertEq(_dist(campaignId, 1).finalizedAt(), uint64(block.timestamp), "Pool 1 stamped");
    }

    function test_FinalizeBatch_RecordsFinalizationOnEveryPool() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());

        vm.warp(campaign.endTime() + 1);
        TimeBasedIncentiveManager.RootUpdate[] memory updates = new TimeBasedIncentiveManager.RootUpdate[](1);
        updates[0] = TimeBasedIncentiveManager.RootUpdate({
            campaignId: campaignId, root: keccak256("reward-root"), totalCommitted: 0, finalize: true
        });
        manager.updateRootsBatch(updates);

        assertEq(_dist(campaignId, 0).finalizedAt(), uint64(block.timestamp), "Pool 0 stamped");
        assertEq(_dist(campaignId, 1).finalizedAt(), uint64(block.timestamp), "Pool 1 stamped");
    }

    ////////////////////////////////
    // Manager wrappers
    ////////////////////////////////

    function test_SetReferralRoot_PerPool() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralRootUpdated(campaignId, 1, bytes32(0), keccak256("bonus-root"), 4 ether);
        manager.setReferralRoot(campaignId, 1, keccak256("bonus-root"), 4 ether);

        ReferralDistributor second = _dist(campaignId, 1);
        assertEq(second.referralRoot(), keccak256("bonus-root"), "Root should be set on pool 1");
        assertEq(second.committedTotal(), 4 ether, "Committed total should be set");
        assertEq(second.claimWindowEnd(), uint64(block.timestamp) + 60 days, "Claim window should start");
        assertEq(_dist(campaignId, 0).referralRoot(), bytes32(0), "Pool 0 untouched");
        assertEq(_dist(campaignId, 0).claimWindowEnd(), 0, "Pool 0 window not started");
    }

    function test_SetReferralRoot_RevertWhenNotAuthorized() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(REFERRAL_AMOUNT);
        _finalize(campaignId, campaign);

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorized.selector);
        manager.setReferralRoot(campaignId, 0, keccak256("referral-root"), REFERRAL_AMOUNT);
    }

    function test_SetReferralRoot_RevertWhenNoSuchPool() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(REFERRAL_AMOUNT);
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.setReferralRoot(campaignId, 1, keccak256("referral-root"), REFERRAL_AMOUNT);

        (uint256 plainId, TimeBasedIncentiveCampaign plain,) = _createReferralCampaign(0);
        _finalize(plainId, plain);
        vm.prank(OPERATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.setReferralRoot(plainId, 0, keccak256("referral-root"), REFERRAL_AMOUNT);
    }

    function test_ClaimReferral_PaysInEachPoolsToken() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());
        _finalize(campaignId, campaign);

        bytes32 leaf1 = _leaf(campaignId, 0, REFERRER, address(rewardToken), 0.15 ether);
        bytes32 leaf2 = _leaf(campaignId, 0, REFERRER2, address(rewardToken), 0.05 ether);
        bytes32[] memory proof = new bytes32[](1);
        proof[0] = leaf2;
        bytes32 bonusLeaf = _leaf(campaignId, 1, REFERRER, address(bonusToken), 4 ether);

        vm.startPrank(OPERATOR);
        manager.setReferralRoot(campaignId, 0, _hashPair(leaf1, leaf2), REFERRAL_AMOUNT);
        manager.setReferralRoot(campaignId, 1, bonusLeaf, 4 ether);
        vm.stopPrank();

        vm.prank(RANDO);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralClaimed(campaignId, 0, REFERRER, 0.15 ether);
        manager.claimReferral(campaignId, 0, REFERRER, 0.15 ether, proof);

        vm.prank(RANDO);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralClaimed(campaignId, 1, REFERRER, 4 ether);
        manager.claimReferral(campaignId, 1, REFERRER, 4 ether, new bytes32[](0));

        assertEq(rewardToken.balanceOf(REFERRER), 0.15 ether, "Pool 0 pays the reward token");
        assertEq(bonusToken.balanceOf(REFERRER), 4 ether, "Pool 1 pays the bonus token");
        assertTrue(_dist(campaignId, 0).claimed(REFERRER), "One-shot flag per pool");
        assertTrue(_dist(campaignId, 1).claimed(REFERRER), "One-shot flag per pool");

        vm.expectRevert(ReferralDistributor.AlreadyClaimed.selector);
        manager.claimReferral(campaignId, 0, REFERRER, 0.15 ether, proof);
    }

    function test_ClaimReferral_LeafBoundToPoolIndex() public {
        // Two pools in the same token with identical entitlements: a proof for one pool
        // must not verify on the other, even against the same root
        TimeBasedIncentiveManager.ReferralPoolParams[] memory pools =
            new TimeBasedIncentiveManager.ReferralPoolParams[](2);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(rewardToken), amount: 1 ether});
        pools[1] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(rewardToken), amount: 1 ether});
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(pools);
        _finalize(campaignId, campaign);

        bytes32 leafPool0 = _leaf(campaignId, 0, REFERRER, address(rewardToken), 1 ether);
        vm.startPrank(OPERATOR);
        manager.setReferralRoot(campaignId, 0, leafPool0, 1 ether);
        manager.setReferralRoot(campaignId, 1, leafPool0, 1 ether);
        vm.stopPrank();

        vm.expectRevert(ReferralDistributor.InvalidProof.selector);
        manager.claimReferral(campaignId, 1, REFERRER, 1 ether, new bytes32[](0));

        manager.claimReferral(campaignId, 0, REFERRER, 1 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(REFERRER), 1 ether, "Only the pool the leaf names pays");
    }

    function test_ClaimReferral_RevertWhenNoSuchPool() public {
        (uint256 campaignId,,) = _createReferralCampaign(REFERRAL_AMOUNT);

        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.claimReferral(campaignId, 1, REFERRER, 0.15 ether, new bytes32[](0));

        (uint256 plainId,,) = _createReferralCampaign(0);
        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.claimReferral(plainId, 0, REFERRER, 0.15 ether, new bytes32[](0));
    }

    function test_SweepReferralPool_PerPool() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(_twoPools());
        _finalize(campaignId, campaign);

        vm.startPrank(OPERATOR);
        manager.setReferralRoot(campaignId, 0, keccak256("root-0"), REFERRAL_AMOUNT);
        manager.setReferralRoot(campaignId, 1, keccak256("root-1"), BONUS_AMOUNT);
        vm.stopPrank();

        vm.warp(uint256(_dist(campaignId, 1).claimWindowEnd()) + 1);

        // Permissionless: destination is locked to the protocol fee receiver
        vm.prank(RANDO);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolSwept(campaignId, 1, BONUS_AMOUNT, PROTOCOL_FEE_RECEIVER);
        manager.sweepReferralPool(campaignId, 1);

        assertEq(bonusToken.balanceOf(PROTOCOL_FEE_RECEIVER), BONUS_AMOUNT, "Pool 1 swept in its own token");
        assertTrue(_dist(campaignId, 1).swept());
        assertFalse(_dist(campaignId, 0).swept(), "Pool 0 untouched");
        assertEq(rewardToken.balanceOf(address(_dist(campaignId, 0))), REFERRAL_AMOUNT);

        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        manager.sweepReferralPool(campaignId, 0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore, REFERRAL_AMOUNT, "Pool 0 swept");
    }

    function test_SweepReferralPool_RevertBeforeWindowEnds() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign,) = _createReferralCampaign(REFERRAL_AMOUNT);
        _finalize(campaignId, campaign);

        vm.prank(OPERATOR);
        manager.setReferralRoot(campaignId, 0, keccak256("referral-root"), REFERRAL_AMOUNT);

        vm.expectRevert(ReferralDistributor.SweepNotReady.selector);
        manager.sweepReferralPool(campaignId, 0);

        vm.expectRevert(TimeBasedIncentiveManager.NoReferralDistributor.selector);
        manager.sweepReferralPool(campaignId, 1);
    }

    function test_SweepReferralPool_NoRootWaitsForFinalization() public {
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign, ReferralDistributor dist) =
            _createReferralCampaign(REFERRAL_AMOUNT);

        // Before finalization the no-root pool cannot be swept, no matter the time
        vm.warp(uint256(campaign.endTime()) + 61 days);
        vm.expectRevert(ReferralDistributor.CampaignNotFinalized.selector);
        manager.sweepReferralPool(campaignId, 0);

        manager.updateRoot(campaignId, keccak256("reward-root"), 0, true);

        // The sweep clock runs from the recorded finalization, not the end time
        vm.warp(uint256(dist.finalizedAt()) + 60 days);
        vm.expectRevert(ReferralDistributor.SweepNotReady.selector);
        manager.sweepReferralPool(campaignId, 0);

        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        vm.warp(uint256(dist.finalizedAt()) + 60 days + 1);
        vm.prank(RANDO);
        manager.sweepReferralPool(campaignId, 0);

        assertEq(
            rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore,
            REFERRAL_AMOUNT,
            "Full pool should sweep after the post-finalization window"
        );
    }

    ////////////////////////////////
    // Views
    ////////////////////////////////

    function test_GetReferralDistributor_OutOfRange() public {
        (uint256 campaignId,,) = _createReferralCampaign(REFERRAL_AMOUNT);

        assertEq(manager.getReferralDistributor(campaignId, 1), address(0), "Past the last pool");
        assertEq(manager.getReferralDistributor(999, 0), address(0), "Unknown campaign");
        assertEq(manager.getReferralDistributors(999).length, 0, "Unknown campaign");
        assertEq(manager.referralPoolCount(999), 0, "Unknown campaign");
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

        // A codeless implementation would make clones delegatecall into empty code,
        // silently no-op initialize, and strand the referral funding sent to the clone
        vm.expectRevert(TimeBasedIncentiveManager.InvalidImplementation.selector);
        manager.setReferralDistributorImplementation(RANDO);

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
        assertEq(manager.version(), "2.5.0", "Version should be bumped");
    }
}
