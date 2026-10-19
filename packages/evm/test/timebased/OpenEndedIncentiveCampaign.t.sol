// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {OpenEndedIncentiveCampaign} from "contracts/timebased/OpenEndedIncentiveCampaign.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TBIProtocolFeeModule} from "contracts/timebased/TBIProtocolFeeModule.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";

import {ReferralDistributorV2_3} from "test/timebased/archive/ReferralDistributorV2_3.sol";
import {TimeBasedIncentiveManagerV2_3} from "test/timebased/archive/TimeBasedIncentiveManagerV2_3.sol";

/// @dev Distributor template whose marker reports no top-up support
contract FalseTopUpMarker {
    function supportsTopUps() external pure returns (bool) {
        return false;
    }
}

/// @dev Distributor template whose marker returns a word that is not a valid bool
contract NonBoolTopUpMarker {
    function supportsTopUps() external pure returns (uint256) {
        return 2;
    }
}

/// @dev Budget that re-enters addRewards instead of paying the campaign leg, so the outer
///      balance-delta check sees the nested deposit and the net amount would be counted twice
contract ReentrantTopUpBudget {
    TimeBasedIncentiveManager immutable manager;
    address immutable token;
    address public armedTarget;
    uint256 armedCampaignId;
    uint256 armedAmount;

    constructor(TimeBasedIncentiveManager manager_, address token_) {
        manager = manager_;
        token = token_;
    }

    function arm(address target, uint256 campaignId, uint256 amount) external {
        armedTarget = target;
        armedCampaignId = campaignId;
        armedAmount = amount;
    }

    function isAuthorized(address) external pure returns (bool) {
        return true;
    }

    function disburse(bytes calldata data_) external returns (bool) {
        ABudget.Transfer memory t = abi.decode(data_, (ABudget.Transfer));
        if (t.target == armedTarget) {
            armedTarget = address(0);
            manager.addRewards(armedCampaignId, armedAmount);
            return true;
        }
        MockERC20(token).transfer(t.target, abi.decode(t.data, (ABudget.FungiblePayload)).amount);
        return true;
    }
}

/// @notice Shared fixture: a manager proxy with open-ended campaigns, referrals, and a funded budget
abstract contract OpenEndedFixture is Test {
    MockERC20 rewardToken;
    MockERC20 bonusToken;
    ManagedBudget budget;
    TimeBasedIncentiveManager manager;
    TimeBasedIncentiveCampaign campaignImpl;
    OpenEndedIncentiveCampaign openEndedImpl;
    ReferralDistributor distributorImpl;

    address constant PROTOCOL_FEE_RECEIVER = address(0xFEE);
    address constant CREATOR = address(0xCAFE);
    address constant OPERATOR = address(0x09E7);
    address constant CLAIMER = address(0xC1A1);
    address constant CLAIMER2 = address(0xC1A2);
    address constant REFERRER = address(0xAAA1);
    address constant RANDO = address(0xD00D);
    address constant SAFE = address(0x5AFE);
    uint64 constant PROTOCOL_FEE = 1000; // 10%
    uint256 constant REFERRAL_AMOUNT = 0.2 ether;
    uint256 constant TOTAL = 10 ether;
    bytes32 constant CONFIG_HASH = keccak256("open-ended");

    /// @dev 1e13 base units per second: exactly 0.864 ether per day
    uint256 constant RATE = 1e25;
    uint256 constant DAY_OF_EMISSION = 0.864 ether;

    function _deployBudget(address authorizedCaller) internal returns (ManagedBudget b) {
        b = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        address[] memory authorized = new address[](2);
        authorized[0] = authorizedCaller;
        authorized[1] = address(manager);
        uint256[] memory roles = new uint256[](2);
        roles[0] = b.MANAGER_ROLE();
        roles[1] = b.MANAGER_ROLE();
        b.initialize(
            abi.encode(ManagedBudget.InitPayload({owner: address(this), authorized: authorized, roles: roles}))
        );

        if (address(bonusToken) == address(0)) bonusToken = new MockERC20();
        _allocate(b, rewardToken, 1000 ether);
        _allocate(b, bonusToken, 1000 ether);
    }

    function _allocate(ManagedBudget b, MockERC20 token, uint256 amount) internal {
        token.mint(address(this), amount);
        token.approve(address(b), amount);
        b.allocate(
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

    function _noPools() internal pure returns (TimeBasedIncentiveManager.ReferralPoolParams[] memory pools) {
        pools = new TimeBasedIncentiveManager.ReferralPoolParams[](0);
    }

    /// @dev A single reward-token referral pool, or none for 0
    function _pools(uint256 referralAmount)
        internal
        view
        returns (TimeBasedIncentiveManager.ReferralPoolParams[] memory pools)
    {
        if (referralAmount == 0) return pools;
        pools = new TimeBasedIncentiveManager.ReferralPoolParams[](1);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(rewardToken), amount: referralAmount});
    }

    function _dist(uint256 campaignId, uint256 poolIndex) internal view returns (ReferralDistributor) {
        return ReferralDistributor(manager.getReferralDistributor(campaignId, poolIndex));
    }

    function _times() internal view returns (uint64 startTime, uint64 endTime) {
        startTime = uint64(block.timestamp + 1 hours);
        endTime = uint64(block.timestamp + 30 days);
    }

    function _create(uint256 totalAmount, uint256 rate, uint256 referralAmount)
        internal
        returns (uint256 campaignId, OpenEndedIncentiveCampaign campaign)
    {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), totalAmount, startTime, endTime, rate, _pools(referralAmount)
        );
        campaign = OpenEndedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    function _create(uint256 referralAmount)
        internal
        returns (uint256 campaignId, OpenEndedIncentiveCampaign campaign)
    {
        return _create(TOTAL, RATE, referralAmount);
    }

    function _createFixed() internal returns (uint256 campaignId) {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createCampaign(budget, keccak256("fixed"), address(rewardToken), TOTAL, startTime, endTime);
    }

    function _topUp(uint256 campaignId, uint256 totalAmount) internal {
        vm.prank(CREATOR);
        manager.addRewards(campaignId, totalAmount);
    }

    function _fundPool(uint256 campaignId, uint256 poolIndex, uint256 amount) internal {
        vm.prank(CREATOR);
        manager.fundReferralPool(campaignId, poolIndex, amount);
    }

    /// @notice Double-hashed, domain-separated (v2) merkle leaf, identical to the fixed-end campaign's
    function _makeLeaf(address campaign, address user, uint256 cumulativeAmount) internal view returns (bytes32) {
        return keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, campaign, user, address(rewardToken), cumulativeAmount)))
        );
    }

    /// @notice Sorted-pair hash matching MerkleProofLib's verification
    function _hashPair(bytes32 a, bytes32 b) internal pure returns (bytes32) {
        return uint256(a) < uint256(b) ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a));
    }

    function _proof(bytes32 sibling) internal pure returns (bytes32[] memory proof) {
        proof = new bytes32[](1);
        proof[0] = sibling;
    }
}

contract OpenEndedIncentiveCampaignTest is OpenEndedFixture {
    TBIProtocolFeeModule module;

    function setUp() public {
        rewardToken = new MockERC20();
        campaignImpl = new TimeBasedIncentiveCampaign();
        openEndedImpl = new OpenEndedIncentiveCampaign();
        distributorImpl = new ReferralDistributor();

        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManager()));
        manager = TimeBasedIncentiveManager(proxy);
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
        manager.setOperator(OPERATOR);
        manager.setReferralDistributorImplementation(address(distributorImpl));
        manager.setOpenEndedCampaignImplementation(address(openEndedImpl));

        module = new TBIProtocolFeeModule(address(manager), SAFE);
        budget = _deployBudget(CREATOR);
    }

    ////////////////////////////////
    // setOpenEndedCampaignImplementation
    ////////////////////////////////

    function test_SetOpenEndedCampaignImplementation() public {
        OpenEndedIncentiveCampaign newImpl = new OpenEndedIncentiveCampaign();

        vm.expectEmit(true, true, false, false, address(manager));
        emit TimeBasedIncentiveManager.OpenEndedCampaignImplementationUpdated(address(openEndedImpl), address(newImpl));
        manager.setOpenEndedCampaignImplementation(address(newImpl));
        assertEq(manager.openEndedCampaignImplementation(), address(newImpl));
    }

    function test_SetOpenEndedCampaignImplementation_RevertZeroOrNoCode() public {
        vm.expectRevert(TimeBasedIncentiveManager.InvalidImplementation.selector);
        manager.setOpenEndedCampaignImplementation(address(0));

        vm.expectRevert(TimeBasedIncentiveManager.InvalidImplementation.selector);
        manager.setOpenEndedCampaignImplementation(RANDO);
    }

    function test_SetOpenEndedCampaignImplementation_RevertNotOwner() public {
        address newImpl = address(new OpenEndedIncentiveCampaign());
        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        manager.setOpenEndedCampaignImplementation(newImpl);
    }

    function test_Implementation_CannotBeInitializedDirectly() public {
        vm.expectRevert();
        openEndedImpl.initialize(
            address(this), address(budget), CREATOR, CONFIG_HASH, address(rewardToken), 1, 1, 2, 1, 1
        );
    }

    function test_Initialize_RevertCallerNotManager() public {
        OpenEndedIncentiveCampaign clone = OpenEndedIncentiveCampaign(LibClone.clone(address(openEndedImpl)));
        vm.expectRevert(OpenEndedIncentiveCampaign.OnlyTimeBasedIncentiveManager.selector);
        clone.initialize(address(manager), address(budget), CREATOR, CONFIG_HASH, address(rewardToken), 1, 1, 2, 1, 1);
    }

    ////////////////////////////////
    // createOpenEndedCampaign - success
    ////////////////////////////////

    function test_Create_Success() public {
        (uint64 startTime, uint64 endTime) = _times();
        address predicted = vm.computeCreateAddress(address(manager), vm.getNonce(address(manager)));

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        vm.expectEmit(true, true, true, true, predicted);
        emit OpenEndedIncentiveCampaign.CampaignInitialized(
            address(manager), address(budget), CREATOR, CONFIG_HASH, address(rewardToken), 9 ether, startTime, endTime
        );
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.CampaignCreated(
            1,
            CONFIG_HASH,
            predicted,
            CREATOR,
            address(budget),
            address(rewardToken),
            9 ether,
            startTime,
            endTime,
            60 days
        );
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        assertEq(campaignId, 1);
        assertEq(address(campaign), predicted);
        assertEq(manager.campaignCount(), 1);
        assertTrue(manager.isOpenEnded(campaignId));
        assertEq(manager.campaignProtocolFeeBps(campaignId), PROTOCOL_FEE, "Applied fee should be snapshotted");
        assertEq(manager.getReferralDistributor(campaignId, 0), address(0));

        assertEq(campaign.timeBasedIncentiveManager(), address(manager));
        assertEq(campaign.budget(), address(budget));
        assertEq(campaign.creator(), CREATOR);
        assertEq(campaign.configHash(), CONFIG_HASH);
        assertEq(campaign.rewardToken(), address(rewardToken));
        assertEq(campaign.totalRewards(), 9 ether);
        assertEq(campaign.startTime(), startTime);
        assertEq(campaign.endTime(), endTime);
        assertEq(campaign.claimExpiryDuration(), 60 days);
        assertEq(campaign.emissionRate(), RATE);
        assertEq(campaign.minTopUp(), DAY_OF_EMISSION);
        assertEq(campaign.LEAF_VERSION(), 2);
        assertEq(campaign.EMISSION_PRECISION(), 1e12);
        assertEq(campaign.MIN_TOP_UP_DURATION(), 1 days);

        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
    }

    function test_Create_WithReferral() public {
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(1, 0, address(0), address(rewardToken), REFERRAL_AMOUNT);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);

        ReferralDistributor dist = _dist(campaignId, 0);
        assertTrue(address(dist) != address(0));
        assertEq(dist.campaign(), address(campaign));
        assertEq(dist.poolIndex(), 0);
        assertEq(dist.referralToken(), address(rewardToken));
        assertEq(dist.referralPool(), REFERRAL_AMOUNT);
        assertEq(rewardToken.balanceOf(address(dist)), REFERRAL_AMOUNT);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether, "Full fee to the protocol");
        assertEq(campaign.totalRewards(), 9 ether, "The pool is funded on top of the total");
    }

    function test_Create_InitialFundingBoundary_IgnoresReferralPools() public {
        // 0.96 ether gross at the 10% fee nets exactly a day of emission, whatever the pools
        (, OpenEndedIncentiveCampaign campaign) = _create(0.96 ether, RATE, 5 ether);
        assertEq(campaign.totalRewards(), DAY_OF_EMISSION);

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InitialFundingTooSmall.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), 0.96 ether - 2, startTime, endTime, RATE, _pools(5 ether)
        );
    }

    function test_Create_SharesCampaignCountWithFixedEnd() public {
        uint256 fixedId = _createFixed();
        (uint256 openId,) = _create(0);

        assertEq(fixedId, 1);
        assertEq(openId, 2);
        assertFalse(manager.isOpenEnded(fixedId));
        assertEq(manager.campaignProtocolFeeBps(fixedId), 0, "Fixed-end campaigns get no snapshot");
        assertTrue(manager.isOpenEnded(openId));
    }

    function test_Create_ZeroProtocolFee_PoolStillFunded() public {
        manager.setProtocolFee(0);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);

        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));
        assertTrue(address(dist) != address(0), "Referral pool is independent of the fee");
        assertEq(dist.referralPool(), REFERRAL_AMOUNT);
        assertEq(campaign.totalRewards(), TOTAL);
        assertEq(manager.campaignProtocolFeeBps(campaignId), 0);
    }

    function test_Create_SnapshotsFeeModuleDiscount() public {
        manager.setProtocolFeeModule(address(module));
        vm.prank(SAFE);
        module.setFee(CREATOR, 500, 500);

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, 500, 0.5 ether);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        assertEq(manager.campaignProtocolFeeBps(campaignId), 500);
        assertEq(campaign.totalRewards(), 9.5 ether);
    }

    function test_CreateWithProtocolFee_SnapshotsRequestedFee() public {
        manager.setProtocolFeeModule(address(module));
        vm.prank(SAFE);
        module.setFee(CREATOR, 100, 500);

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        uint256 campaignId = manager.createOpenEndedCampaignWithProtocolFee(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _pools(REFERRAL_AMOUNT), 300
        );

        assertEq(manager.campaignProtocolFeeBps(campaignId), 300);
        // 0.3 ether fee leaves 9.7 ether of rewards; the 0.2 ether pool is funded on top
        assertEq(OpenEndedIncentiveCampaign(manager.getCampaign(campaignId)).totalRewards(), 9.7 ether);
        assertEq(ReferralDistributor(manager.getReferralDistributor(campaignId, 0)).referralPool(), REFERRAL_AMOUNT);
    }

    function test_CreateWithProtocolFee_RevertOutOfRange() public {
        manager.setProtocolFeeModule(address(module));
        vm.prank(SAFE);
        module.setFee(CREATOR, 100, 500);

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(abi.encodeWithSelector(TimeBasedIncentiveManager.ProtocolFeeOutOfRange.selector, 600, 100, 500));
        manager.createOpenEndedCampaignWithProtocolFee(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _noPools(), 600
        );

        vm.prank(CREATOR);
        vm.expectRevert(abi.encodeWithSelector(TimeBasedIncentiveManager.ProtocolFeeOutOfRange.selector, 50, 100, 500));
        manager.createOpenEndedCampaignWithProtocolFee(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _noPools(), 50
        );
    }

    ////////////////////////////////
    // createOpenEndedCampaign - validation
    ////////////////////////////////

    function test_Create_RevertImplementationNotSet() public {
        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManager()));
        TimeBasedIncentiveManager fresh = TimeBasedIncentiveManager(proxy);
        fresh.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidImplementation.selector);
        fresh.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _noPools()
        );
    }

    function test_Create_RevertZeroEmissionRate() public {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ZeroEmissionRate.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, 0, _noPools()
        );
    }

    function test_Create_InitialFundingBoundary_NoFee() public {
        manager.setProtocolFee(0);

        // Exactly 24h of emission passes
        (, OpenEndedIncentiveCampaign campaign) = _create(DAY_OF_EMISSION, RATE, 0);
        assertEq(campaign.totalRewards(), DAY_OF_EMISSION);

        // One wei less fails
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InitialFundingTooSmall.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), DAY_OF_EMISSION - 1, startTime, endTime, RATE, _noPools()
        );
    }

    function test_Create_InitialFundingBoundary_AppliesToNetAmount() public {
        // 10% fee: 0.96 ether gross nets exactly 0.864 ether
        (, OpenEndedIncentiveCampaign campaign) = _create(0.96 ether, RATE, 0);
        assertEq(campaign.totalRewards(), DAY_OF_EMISSION);

        // Gross above the minimum, net below it
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InitialFundingTooSmall.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), 0.96 ether - 2, startTime, endTime, RATE, _noPools()
        );
    }

    function test_Create_InitialFundingBoundary_RoundsUp() public {
        manager.setProtocolFee(0);
        // 1e12 + 1 scaled per second => ceil(86400.0000000864) = 86401 base units per day
        uint256 rate = 1e12 + 1;

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InitialFundingTooSmall.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), 86400, startTime, endTime, rate, _noPools()
        );

        (, OpenEndedIncentiveCampaign campaign) = _create(86401, rate, 0);
        assertEq(campaign.minTopUp(), 86401);
    }

    function test_Create_RevertDurationBounds() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);

        vm.startPrank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.DurationTooShort.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 1 days - 1, RATE, _noPools()
        );

        vm.expectRevert(TimeBasedIncentiveManager.DurationTooLong.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 365 days + 1, RATE, _noPools()
        );

        vm.expectRevert(TimeBasedIncentiveManager.EndTimeBeforeStart.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime, RATE, _noPools()
        );

        vm.expectRevert(TimeBasedIncentiveManager.StartTimeInPast.selector);
        manager.createOpenEndedCampaign(
            budget,
            CONFIG_HASH,
            address(rewardToken),
            TOTAL,
            uint64(block.timestamp - 1),
            uint64(block.timestamp + 30 days),
            RATE,
            _noPools()
        );

        // Both bounds are inclusive
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 1 days, RATE, _noPools()
        );
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 365 days, RATE, _noPools()
        );
        vm.stopPrank();
    }

    function test_Create_RevertInvalidParams() public {
        (uint64 startTime, uint64 endTime) = _times();

        vm.startPrank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidRewardToken.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(0), TOTAL, startTime, endTime, RATE, _noPools());

        vm.expectRevert(TimeBasedIncentiveManager.ZeroAmount.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), 0, startTime, endTime, RATE, _noPools()
        );

        vm.expectRevert(TimeBasedIncentiveManager.InvalidReferralToken.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _badPool()
        );
        vm.stopPrank();
    }

    function _badPool() internal pure returns (TimeBasedIncentiveManager.ReferralPoolParams[] memory pools) {
        pools = new TimeBasedIncentiveManager.ReferralPoolParams[](1);
        pools[0] = TimeBasedIncentiveManager.ReferralPoolParams({token: address(0), amount: 1 ether});
    }

    function test_Create_RevertUnauthorizedCreator() public {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorizedOnBudget.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _noPools()
        );
    }

    ////////////////////////////////
    // minTopUp
    ////////////////////////////////

    function test_MinTopUp_RoundsUp() public {
        manager.setProtocolFee(0);

        (, OpenEndedIncentiveCampaign exact) = _create(1 ether, 1e12, 0);
        assertEq(exact.minTopUp(), 86400, "Exact: 1 base unit per second for a day");

        (, OpenEndedIncentiveCampaign up) = _create(1 ether, 1e12 + 1, 0);
        assertEq(up.minTopUp(), 86401, "Fractional remainder rounds up");

        (, OpenEndedIncentiveCampaign tiny) = _create(1 ether, 1, 0);
        assertEq(tiny.minTopUp(), 1, "Any positive rate needs at least 1 base unit");
    }

    ////////////////////////////////
    // addRewards - success
    ////////////////////////////////

    function test_AddRewards_Success() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        vm.expectEmit(true, true, true, true, address(campaign));
        emit OpenEndedIncentiveCampaign.RewardsAdded(9 ether, 18 ether);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9 ether, 1 ether, 18 ether);
        _topUp(campaignId, 10 ether);

        assertEq(campaign.totalRewards(), 18 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 18 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 2 ether);
        assertEq(campaign.endTime(), uint64(block.timestamp + 30 days), "Top-ups never extend the max end");
    }

    function test_AddRewards_BeforeStartAllowed() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        assertLt(block.timestamp, campaign.startTime());
        _topUp(campaignId, 1 ether);
        assertEq(campaign.totalRewards(), 9.9 ether);
    }

    function test_AddRewards_FeeFromSnapshot_AfterSetProtocolFee() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        manager.setProtocolFee(2000);
        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        _topUp(campaignId, 10 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore, 1 ether, "Raise must not apply");

        manager.setProtocolFee(0);
        receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        _topUp(campaignId, 10 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore, 1 ether, "Cut must not apply");

        assertEq(campaign.totalRewards(), 27 ether);
    }

    function test_AddRewards_FeeFromSnapshot_AfterFeeModuleChange() public {
        manager.setProtocolFeeModule(address(module));
        vm.prank(SAFE);
        module.setFee(CREATOR, 500, 500);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        assertEq(manager.campaignProtocolFeeBps(campaignId), 500);

        // The creator's override changes, then the module is removed entirely
        vm.prank(SAFE);
        module.setFee(CREATOR, 100, 100);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9.5 ether, 0.5 ether, 19 ether);
        _topUp(campaignId, 10 ether);

        manager.setProtocolFeeModule(address(0));
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9.5 ether, 0.5 ether, 28.5 ether);
        _topUp(campaignId, 10 ether);

        assertEq(campaign.totalRewards(), 28.5 ether);
    }

    function test_FundReferralPool_OpenEnded() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = _dist(campaignId, 0);
        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);

        vm.expectEmit(true, true, true, true, address(dist));
        emit ReferralDistributor.ReferralPoolIncreased(0.2 ether, 0.4 ether);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolFunded(campaignId, 0, CREATOR, 0.2 ether, 0.4 ether);
        _fundPool(campaignId, 0, 0.2 ether);

        assertEq(dist.referralPool(), 0.4 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0.4 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), receiverBefore, "No fee on pool top-ups");
        assertEq(campaign.totalRewards(), 9 ether, "Pool top-ups never touch the rewards");
    }

    function test_AddRewards_LeavesPoolsAlone() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = _dist(campaignId, 0);

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9 ether, 1 ether, 18 ether);
        _topUp(campaignId, 10 ether);

        assertEq(dist.referralPool(), REFERRAL_AMOUNT, "A reward top-up leaves the pool alone");
        assertEq(campaign.totalRewards(), 18 ether);
    }

    function test_AddReferralPool_MidCampaign() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        assertEq(manager.referralPoolCount(campaignId), 0);
        vm.warp(campaign.startTime() + 1 days);

        vm.prank(CREATOR);
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(campaignId, 0, address(0), address(bonusToken), 5 ether);
        uint256 first = manager.addReferralPool(campaignId, address(bonusToken), 5 ether);
        assertEq(first, 0, "First pool added after creation is index 0");

        ReferralDistributor dist = _dist(campaignId, 0);
        assertEq(dist.campaign(), address(campaign));
        assertEq(dist.campaignId(), campaignId);
        assertEq(dist.referralToken(), address(bonusToken));
        assertEq(dist.referralPool(), 5 ether);
        assertEq(bonusToken.balanceOf(address(dist)), 5 ether);

        // Pools and reward top-ups are independent legs
        vm.prank(CREATOR);
        uint256 second = manager.addReferralPool(campaignId, address(rewardToken), 0.1 ether);
        assertEq(second, 1);
        _topUp(campaignId, 10 ether);
        assertEq(campaign.totalRewards(), 18 ether);
        assertEq(dist.referralPool(), 5 ether);
        assertEq(_dist(campaignId, 1).referralPool(), 0.1 ether);
        assertEq(manager.referralPoolCount(campaignId), 2);
    }

    function test_AddRewards_ZeroFeeSnapshot() public {
        manager.setProtocolFee(0);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        manager.setProtocolFee(1000);

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 5 ether, 5 ether, 0, 15 ether);
        _topUp(campaignId, 5 ether);
        assertEq(campaign.totalRewards(), 15 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0);
    }

    function test_AddRewards_AnyAuthorizedCallerOnCampaignBudget() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        // The budget owner is authorized too; the funder field records the caller
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, address(this), 1 ether, 0.9 ether, 0.1 ether, 9.9 ether);
        manager.addRewards(campaignId, 1 ether);
        assertEq(campaign.totalRewards(), 9.9 ether);
    }

    ////////////////////////////////
    // addRewards - reverts
    ////////////////////////////////

    function test_AddRewards_TopUpTooSmallBoundary() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        // 0.96 ether gross nets exactly one day of emission at the 10% snapshot
        _topUp(campaignId, 0.96 ether);
        assertEq(campaign.totalRewards(), 9 ether + DAY_OF_EMISSION);

        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.TopUpTooSmall.selector);
        manager.addRewards(campaignId, 0.96 ether - 2);

        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.TopUpTooSmall.selector);
        manager.addRewards(campaignId, 0);
    }

    function test_Campaign_AddRewards_Boundary() public {
        (, OpenEndedIncentiveCampaign campaign) = _create(0);

        vm.prank(address(manager));
        vm.expectRevert(OpenEndedIncentiveCampaign.TopUpTooSmall.selector);
        campaign.addRewards(DAY_OF_EMISSION - 1);

        vm.prank(address(manager));
        vm.expectRevert(OpenEndedIncentiveCampaign.TopUpNotFunded.selector);
        campaign.addRewards(DAY_OF_EMISSION);

        rewardToken.mint(address(campaign), DAY_OF_EMISSION);
        vm.prank(address(manager));
        assertEq(campaign.addRewards(DAY_OF_EMISSION), 9 ether + DAY_OF_EMISSION);
    }

    function test_Campaign_AddRewards_RevertNotManager() public {
        (, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.OnlyTimeBasedIncentiveManager.selector);
        campaign.addRewards(1 ether);
    }

    function test_AddRewards_RevertAtOrAfterEndTime() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        vm.warp(campaign.endTime() - 1);
        _topUp(campaignId, 1 ether);

        vm.warp(campaign.endTime());
        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.CampaignAlreadyEnded.selector);
        manager.addRewards(campaignId, 1 ether);
    }

    function test_FundReferralPool_RevertAfterEndTime() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = _dist(campaignId, 0);

        vm.warp(campaign.endTime() + 1);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.fundReferralPool(campaignId, 0, 0.1 ether);
        assertEq(dist.referralPool(), 0.2 ether, "Pool unchanged");
    }

    function test_AddRewards_RevertAfterCancel() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime() + 1 days);

        vm.prank(CREATOR);
        manager.cancelCampaign(campaignId);
        assertEq(campaign.endTime(), uint64(block.timestamp));

        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.CampaignAlreadyEnded.selector);
        manager.addRewards(campaignId, 1 ether);
    }

    function test_AddRewards_RevertAfterFinalize() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime());
        manager.updateRoot(campaignId, keccak256("root"), campaign.totalRewards(), true);
        assertTrue(campaign.finalized());

        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.CampaignAlreadyFinalized.selector);
        manager.addRewards(campaignId, 1 ether);
    }

    function test_FundReferralPool_RevertAfterFinalize() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        vm.warp(campaign.startTime());
        manager.updateRoot(campaignId, keccak256("root"), campaign.totalRewards(), true);

        // Exhaustion finalizes before the max end; the manager refuses before the distributor would
        assertLt(block.timestamp, campaign.endTime());
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.fundReferralPool(campaignId, 0, 0.1 ether);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.CampaignEnded.selector);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
    }

    function test_AddRewards_RevertNotOpenEnded() public {
        uint256 fixedId = _createFixed();

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NotOpenEnded.selector);
        manager.addRewards(fixedId, 1 ether);

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NotOpenEnded.selector);
        manager.addRewards(999, 1 ether);
    }

    function test_AddRewards_RevertUnauthorized() public {
        (uint256 campaignId,) = _create(0);

        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorizedOnBudget.selector);
        manager.addRewards(campaignId, 1 ether);

        // Authorization on some other budget does not count: only the campaign's own budget funds it
        _deployBudget(RANDO);
        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorizedOnBudget.selector);
        manager.addRewards(campaignId, 1 ether);

        // Nor does manager ownership
        manager.transferOwnership(RANDO);
        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorizedOnBudget.selector);
        manager.addRewards(campaignId, 1 ether);
    }

    ////////////////////////////////
    // Roots, exhaustion, finalize, withdraw
    ////////////////////////////////

    function test_OverDistributionGuard_PassesAfterTopUp() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime());

        vm.expectRevert(OpenEndedIncentiveCampaign.CommitmentExceedsBudget.selector);
        manager.updateRoot(campaignId, keccak256("root"), 9 ether + 1, false);

        _topUp(campaignId, 10 ether);
        manager.updateRoot(campaignId, keccak256("root"), 9 ether + 1, false);
        assertEq(campaign.totalCommitted(), 9 ether + 1);

        vm.expectRevert(OpenEndedIncentiveCampaign.CommitmentExceedsBudget.selector);
        manager.updateRoot(campaignId, keccak256("root"), 18 ether + 1, false);
    }

    function test_Exhaustion_FinalizeBeforeEndTime() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        _topUp(campaignId, 10 ether);
        vm.warp(campaign.startTime() + 5 days);

        // Final root commits the full budget well before the max end
        uint256 total = campaign.totalRewards();
        bytes32 leaf1 = _makeLeaf(address(campaign), CLAIMER, total - 1 ether);
        bytes32 leaf2 = _makeLeaf(address(campaign), CLAIMER2, 1 ether);
        manager.updateRoot(campaignId, _hashPair(leaf1, leaf2), total, true);
        assertTrue(campaign.finalized());
        assertLt(block.timestamp, campaign.endTime());

        // Nothing is withdrawable: every token is owed to users
        assertEq(manager.getWithdrawable(campaignId), 0);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ZeroAmount.selector);
        manager.withdraw(campaignId);

        // No further top-ups
        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.CampaignAlreadyFinalized.selector);
        manager.addRewards(campaignId, 1 ether);

        // Users claim the full budget
        manager.claim(campaignId, CLAIMER, total - 1 ether, _proof(leaf2));
        manager.claim(campaignId, CLAIMER2, 1 ether, _proof(leaf1));
        assertEq(rewardToken.balanceOf(address(campaign)), 0);
    }

    function test_TopUpThenFinalizeBeforeEnd_RevertCampaignNotEnded() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime() + 1 days);
        _topUp(campaignId, 10 ether);

        // Committing only the pre-top-up budget no longer exhausts the campaign
        vm.expectRevert(OpenEndedIncentiveCampaign.CampaignNotEnded.selector);
        manager.updateRoot(campaignId, keccak256("root"), 9 ether, true);

        // Publishing without finalizing is fine
        manager.updateRoot(campaignId, keccak256("root"), 9 ether, false);
        assertFalse(campaign.finalized());
    }

    function test_MaxEndFinalize_WithdrawRemainder() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        _topUp(campaignId, 10 ether);
        vm.warp(campaign.startTime());

        bytes32 leaf = _makeLeaf(address(campaign), CLAIMER, 4 ether);
        manager.updateRoot(campaignId, leaf, 4 ether, false);

        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, leaf, 4 ether, true);

        uint256 budgetBefore = rewardToken.balanceOf(address(budget));
        assertEq(manager.getWithdrawable(campaignId), 14 ether);
        vm.prank(CREATOR);
        manager.withdraw(campaignId);
        assertEq(rewardToken.balanceOf(address(budget)) - budgetBefore, 14 ether);

        manager.claim(campaignId, CLAIMER, 4 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(CLAIMER), 4 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 0);
    }

    function test_CancelThenWithdraw() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        _topUp(campaignId, 10 ether);
        _fundPool(campaignId, 0, 0.2 ether);
        vm.warp(campaign.startTime() + 2 days);

        bytes32 leaf = _makeLeaf(address(campaign), CLAIMER, 1 ether);
        manager.updateRoot(campaignId, leaf, 1 ether, false);

        vm.prank(CREATOR);
        manager.cancelCampaign(campaignId);

        vm.warp(block.timestamp + 1);
        manager.updateRoot(campaignId, leaf, 1 ether, true);

        uint256 budgetBefore = rewardToken.balanceOf(address(budget));
        vm.prank(CREATOR);
        manager.withdraw(campaignId);
        assertEq(rewardToken.balanceOf(address(budget)) - budgetBefore, 17 ether, "Everything not owed returns");

        // The referral distributor recorded finalization, so the referral lifecycle proceeds
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));
        assertEq(dist.finalizedAt(), uint64(block.timestamp));
        assertEq(dist.referralPool(), 0.4 ether);
    }

    ////////////////////////////////
    // Claims and claim expiry (same as fixed-end)
    ////////////////////////////////

    function test_Claim_PartialThenTopUpThenClaimMore() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime());

        bytes32 leaf = _makeLeaf(address(campaign), CLAIMER, 5 ether);
        manager.updateRoot(campaignId, leaf, 5 ether, false);

        vm.expectEmit(true, true, true, true, address(campaign));
        emit OpenEndedIncentiveCampaign.Claimed(CLAIMER, 5 ether, 5 ether);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.Claimed(campaignId, CLAIMER, 5 ether, 5 ether);
        manager.claim(campaignId, CLAIMER, 5 ether, new bytes32[](0));

        _topUp(campaignId, 10 ether);
        leaf = _makeLeaf(address(campaign), CLAIMER, 12 ether);
        manager.updateRoot(campaignId, leaf, 12 ether, false);
        manager.claim(campaignId, CLAIMER, 12 ether, new bytes32[](0));

        assertEq(rewardToken.balanceOf(CLAIMER), 12 ether);
        assertEq(campaign.claimed(CLAIMER), 12 ether);
        assertEq(campaign.totalClaimed(), 12 ether);

        vm.expectRevert(OpenEndedIncentiveCampaign.NothingToClaim.selector);
        manager.claim(campaignId, CLAIMER, 12 ether, new bytes32[](0));
    }

    function test_Claim_RevertInvalidProofAndFixedEndLeafDomain() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime());

        // A leaf bound to another campaign address does not verify here
        bytes32 foreignLeaf = keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, address(0xBEEF), CLAIMER, address(rewardToken), 1 ether)))
        );
        manager.updateRoot(campaignId, foreignLeaf, 1 ether, false);

        vm.expectRevert(OpenEndedIncentiveCampaign.InvalidProof.selector);
        manager.claim(campaignId, CLAIMER, 1 ether, new bytes32[](0));
    }

    function test_ClaimExpiry_AnchorsToMaxEndAfterExhaustion() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime() + 1 days);

        uint256 total = campaign.totalRewards();
        bytes32 leaf = _makeLeaf(address(campaign), CLAIMER, total);
        manager.updateRoot(campaignId, leaf, total, true);

        uint256 expiry = uint256(campaign.endTime()) + 60 days;

        // Still claimable at the expiry boundary, anchored to the max end
        vm.warp(expiry);
        manager.claim(campaignId, CLAIMER, total, new bytes32[](0));
        assertEq(rewardToken.balanceOf(CLAIMER), total);
    }

    function test_ClaimExpiry_ClaimRevertsThenFullWithdraw() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);
        vm.warp(campaign.startTime());

        bytes32 leaf = _makeLeaf(address(campaign), CLAIMER, 3 ether);
        manager.updateRoot(campaignId, leaf, 3 ether, false);

        vm.warp(uint256(campaign.endTime()) + 60 days + 1);
        manager.updateRoot(campaignId, leaf, 3 ether, true);

        vm.expectRevert(OpenEndedIncentiveCampaign.ClaimExpired.selector);
        manager.claim(campaignId, CLAIMER, 3 ether, new bytes32[](0));

        assertEq(manager.getWithdrawable(campaignId), 9 ether, "Expired entitlements are withdrawable");
        vm.prank(CREATOR);
        manager.withdraw(campaignId);
        assertEq(rewardToken.balanceOf(address(campaign)), 0);
    }

    ////////////////////////////////
    // ReferralDistributor.addToPool
    ////////////////////////////////

    function test_AddToPool_Success() public {
        (uint256 campaignId,) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));

        vm.expectEmit(true, true, true, true, address(dist));
        emit ReferralDistributor.ReferralPoolIncreased(1 ether, 1.2 ether);
        vm.prank(address(manager));
        dist.addToPool(1 ether);
        assertEq(dist.referralPool(), 1.2 ether);
    }

    function test_AddToPool_RevertNotManager() public {
        (uint256 campaignId,) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));

        vm.prank(CREATOR);
        vm.expectRevert(ReferralDistributor.OnlyTimeBasedIncentiveManager.selector);
        dist.addToPool(1 ether);
    }

    function test_AddToPool_RevertFinalized() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("root"), 0, true);

        vm.prank(address(manager));
        vm.expectRevert(ReferralDistributor.CampaignAlreadyFinalized.selector);
        dist.addToPool(1 ether);
    }

    function test_AddToPool_RevertSwept() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId, 0));
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("root"), 0, true);
        vm.warp(block.timestamp + 60 days + 1);
        manager.sweepReferralPool(campaignId, 0);
        assertTrue(dist.swept());

        vm.prank(address(manager));
        vm.expectRevert(ReferralDistributor.PoolAlreadySwept.selector);
        dist.addToPool(1 ether);
    }

    function test_ReferralRoot_CanCommitToppedUpPool() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = _dist(campaignId, 0);
        _fundPool(campaignId, 0, 0.2 ether);
        assertEq(dist.referralPool(), 0.4 ether);

        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("root"), 0, true);

        vm.expectRevert(ReferralDistributor.CommitmentExceedsPool.selector);
        manager.setReferralRoot(campaignId, 0, keccak256("ref"), 0.4 ether + 1);

        bytes32 leaf = keccak256(
            bytes.concat(
                keccak256(abi.encode(block.chainid, campaignId, uint256(0), REFERRER, address(rewardToken), 0.4 ether))
            )
        );
        manager.setReferralRoot(campaignId, 0, leaf, 0.4 ether);
        manager.claimReferral(campaignId, 0, REFERRER, 0.4 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(REFERRER), 0.4 ether);
    }

    ////////////////////////////////
    // Referral distributor template compatibility
    ////////////////////////////////

    function test_Create_RevertLegacyDistributorTemplate() public {
        // A template without the pool-indexed initializer cannot back a pool; the clone reverts
        // on initialize, so every pool creation fails until the template is updated
        manager.setReferralDistributorImplementation(address(new ReferralDistributorV2_3()));
        (uint64 startTime, uint64 endTime) = _times();

        vm.prank(CREATOR);
        vm.expectRevert();
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _pools(REFERRAL_AMOUNT)
        );

        vm.prank(CREATOR);
        vm.expectRevert();
        manager.createCampaign(
            budget, keccak256("fixed"), address(rewardToken), TOTAL, startTime, endTime, _pools(REFERRAL_AMOUNT)
        );

        // No referral pool: no distributor, so creation proceeds
        (uint256 campaignId,) = _create(0);
        assertEq(manager.referralPoolCount(campaignId), 0);

        vm.prank(CREATOR);
        vm.expectRevert();
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
        assertEq(manager.referralPoolCount(campaignId), 0);

        manager.setReferralDistributorImplementation(address(distributorImpl));
        vm.prank(CREATOR);
        manager.addReferralPool(campaignId, address(bonusToken), 1 ether);
        assertEq(manager.referralPoolCount(campaignId), 1);
    }

    function test_FundReferralPool_RevertMarkerFalseOrMalformed() public {
        (uint256 campaignId,) = _create(REFERRAL_AMOUNT);
        address dist = address(_dist(campaignId, 0));

        vm.etch(dist, address(new FalseTopUpMarker()).code);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.fundReferralPool(campaignId, 0, 0.1 ether);

        vm.etch(dist, address(new NonBoolTopUpMarker()).code);
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.fundReferralPool(campaignId, 0, 0.1 ether);
    }

    function test_SupportsTopUps_OnImplementationAndClone() public {
        assertTrue(distributorImpl.supportsTopUps(), "Probe must work on the uninitializable implementation");
        (uint256 campaignId,) = _create(REFERRAL_AMOUNT);
        assertTrue(ReferralDistributor(manager.getReferralDistributor(campaignId, 0)).supportsTopUps());
    }

    ////////////////////////////////
    // Version
    ////////////////////////////////

    function test_Version() public view {
        assertEq(manager.version(), "2.5.0");
    }
}

/// @notice Upgrades a manager proxy running the 2.3.0 code, with the 2.3.0 referral distributor
///         template still configured, to the current version and checks that pre-existing state and
///         campaigns carry over and that open-ended campaigns refuse the legacy template
contract OpenEndedUpgradeFrom2_3Test is OpenEndedFixture {
    TimeBasedIncentiveManagerV2_3 legacy;
    ReferralDistributorV2_3 legacyDistributorImpl;
    TBIProtocolFeeModule module;
    uint256 legacyId;
    address legacyCampaign;
    address legacyDistributor;

    /// @dev The 2.3.0 manager takes a referral fee in basis points of the protocol fee
    uint64 constant LEGACY_REFERRAL_FEE_BPS = 2000;

    function setUp() public {
        rewardToken = new MockERC20();
        campaignImpl = new TimeBasedIncentiveCampaign();
        openEndedImpl = new OpenEndedIncentiveCampaign();
        distributorImpl = new ReferralDistributor();
        legacyDistributorImpl = new ReferralDistributorV2_3();

        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManagerV2_3()));
        legacy = TimeBasedIncentiveManagerV2_3(proxy);
        legacy.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
        legacy.setOperator(OPERATOR);
        legacy.setReferralDistributorImplementation(address(legacyDistributorImpl));
        legacy.setMaxCampaignDuration(200 days);
        legacy.setMinCampaignDuration(2 days);
        legacy.setClaimExpiryDuration(30 days);
        legacy.setReferralClaimWindowDuration(45 days);
        manager = TimeBasedIncentiveManager(proxy);

        module = new TBIProtocolFeeModule(proxy, SAFE);
        legacy.setProtocolFeeModule(address(module));
        vm.prank(SAFE);
        module.setFee(CREATOR, 500, 500);

        budget = _deployBudget(CREATOR);

        // A fixed-end referral campaign created by the 2.3.0 code on the legacy template
        assertEq(legacy.version(), "2.3.0");
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        legacyId = legacy.createCampaign(
            budget, keccak256("legacy"), address(rewardToken), TOTAL, startTime, endTime, LEGACY_REFERRAL_FEE_BPS
        );
        legacyCampaign = legacy.getCampaign(legacyId);
        legacyDistributor = legacy.getReferralDistributor(legacyId);

        manager.upgradeToAndCall(address(new TimeBasedIncentiveManager()), "");
    }

    /// @dev The 2.3.0 distributor's leaf: no pool index
    function _legacyReferralLeaf(uint256 campaignId, uint256 amount) internal view returns (bytes32) {
        return keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, campaignId, REFERRER, address(rewardToken), amount)))
        );
    }

    function _referralLeaf(uint256 campaignId, uint256 poolIndex, address token, uint256 amount)
        internal
        view
        returns (bytes32)
    {
        return keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, campaignId, poolIndex, REFERRER, token, amount)))
        );
    }

    function test_UpgradeFrom2_3_PreservesState() public {
        // Every pre-existing variable reads back unchanged
        assertEq(manager.version(), "2.5.0");
        assertEq(manager.owner(), address(this));
        assertEq(manager.campaignImplementation(), address(campaignImpl));
        assertEq(manager.campaignCount(), 1);
        assertEq(manager.getCampaign(legacyId), legacyCampaign);
        assertEq(manager.protocolFee(), PROTOCOL_FEE);
        assertEq(manager.protocolFeeReceiver(), PROTOCOL_FEE_RECEIVER);
        assertEq(manager.operator(), OPERATOR);
        assertEq(manager.maxCampaignDuration(), 200 days);
        assertEq(manager.minCampaignDuration(), 2 days);
        assertEq(manager.claimExpiryDuration(), 30 days);
        assertEq(manager.getReferralDistributor(legacyId, 0), legacyDistributor);
        assertEq(manager.referralDistributorImplementation(), address(legacyDistributorImpl));
        assertEq(manager.referralClaimWindowDuration(), 45 days);
        assertEq(manager.protocolFeeModule(), address(module));

        // New variables start empty, so open-ended creation ships dark
        assertEq(manager.openEndedCampaignImplementation(), address(0));
        assertFalse(manager.isOpenEnded(legacyId));
        assertEq(manager.campaignProtocolFeeBps(legacyId), 0);

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidImplementation.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _noPools()
        );

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.NotOpenEnded.selector);
        manager.addRewards(legacyId, 1 ether);

        // The legacy campaign still roots, finalizes, and pays out, and its legacy
        // distributor records the finalization
        vm.warp(endTime + 1);
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, legacyCampaign, CLAIMER, address(rewardToken), 1 ether)))
        );
        manager.updateRoot(legacyId, leaf, 1 ether, true);
        manager.claim(legacyId, CLAIMER, 1 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(CLAIMER), 1 ether);
        assertEq(ReferralDistributorV2_3(legacyDistributor).finalizedAt(), uint64(block.timestamp));
    }

    function test_UpgradeFrom2_3_LegacyDistributorTemplate() public {
        manager.setOpenEndedCampaignImplementation(address(openEndedImpl));
        (uint64 startTime, uint64 endTime) = _times();

        // On the legacy template no pool can be created, fixed-end or open-ended
        vm.prank(CREATOR);
        vm.expectRevert();
        manager.createCampaign(
            budget, keccak256("fixed"), address(rewardToken), TOTAL, startTime, endTime, _pools(REFERRAL_AMOUNT)
        );
        vm.prank(CREATOR);
        vm.expectRevert();
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, _pools(REFERRAL_AMOUNT)
        );

        // Without pools there is no distributor, so the legacy template is irrelevant
        (uint256 plainId, OpenEndedIncentiveCampaign plain) = _create(0);
        assertEq(manager.campaignProtocolFeeBps(plainId), 500, "Fee module discount snapshotted");
        assertEq(plain.claimExpiryDuration(), 30 days);
        _topUp(plainId, 10 ether);
        assertEq(plain.totalRewards(), 19 ether);

        // Once the template is updated, referral open-ended campaigns work end to end
        // (5% fee from the module discount: 0.5 ether fee, 9.5 ether rewards, 0.2 ether pool on top)
        manager.setReferralDistributorImplementation(address(distributorImpl));
        (uint256 openId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_AMOUNT);
        ReferralDistributor dist = _dist(openId, 0);
        assertEq(dist.referralPool(), REFERRAL_AMOUNT);
        assertEq(dist.claimWindowDuration(), 45 days, "Pre-existing window setting applies");
        assertEq(campaign.totalRewards(), 9.5 ether);

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(openId, CREATOR, 10 ether, 9.5 ether, 0.5 ether, 19 ether);
        _topUp(openId, 10 ether);

        vm.expectEmit(true, true, true, true, address(dist));
        emit ReferralDistributor.ReferralPoolIncreased(0.1 ether, 0.3 ether);
        _fundPool(openId, 0, 0.1 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0.3 ether);

        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(openId, keccak256("root"), 0, true);
        manager.setReferralRoot(openId, 0, _referralLeaf(openId, 0, address(rewardToken), 0.3 ether), 0.3 ether);
        manager.claimReferral(openId, 0, REFERRER, 0.3 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(REFERRER), 0.3 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0);
    }

    function test_UpgradeFrom2_3_LegacyDistributorIsPoolZero() public {
        // The pre-upgrade distributor reads as the campaign's pool 0
        address[] memory pools = manager.getReferralDistributors(legacyId);
        assertEq(pools.length, 1);
        assertEq(pools[0], legacyDistributor);
        assertEq(manager.referralPoolCount(legacyId), 1);
        assertEq(manager.getReferralDistributor(legacyId, 0), legacyDistributor);
        assertEq(manager.getReferralDistributor(legacyId, 1), address(0));
        uint256 legacyPool = ReferralDistributorV2_3(legacyDistributor).referralPool();
        assertGt(legacyPool, 0);

        // The 2.3.0 clone has no addToPool, so it cannot be topped up
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.fundReferralPool(legacyId, 0, 0.1 ether);

        // A pool added on the new template lands at index 1, after the legacy clone
        manager.setReferralDistributorImplementation(address(distributorImpl));
        vm.prank(CREATOR);
        vm.expectEmit(true, true, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralPoolCreated(legacyId, 1, address(0), address(bonusToken), 5 ether);
        uint256 poolIndex = manager.addReferralPool(legacyId, address(bonusToken), 5 ether);
        assertEq(poolIndex, 1);
        pools = manager.getReferralDistributors(legacyId);
        assertEq(pools.length, 2);
        assertEq(pools[0], legacyDistributor, "Legacy clone keeps index 0");
        assertEq(manager.getReferralDistributor(legacyId, 0), legacyDistributor);
        assertEq(manager.referralPoolCount(legacyId), 2);
        ReferralDistributor bonus = ReferralDistributor(pools[1]);
        assertEq(bonus.poolIndex(), 1);
        assertEq(bonus.referralToken(), address(bonusToken));
        _fundPool(legacyId, 1, 1 ether);
        assertEq(bonus.referralPool(), 6 ether);

        // Finalization is recorded on both, and each pool roots and pays in its own leaf format
        vm.warp(TimeBasedIncentiveCampaign(legacyCampaign).endTime() + 1);
        manager.updateRoot(legacyId, keccak256("root"), 0, true);
        assertEq(ReferralDistributorV2_3(legacyDistributor).finalizedAt(), uint64(block.timestamp));
        assertEq(bonus.finalizedAt(), uint64(block.timestamp));

        vm.startPrank(OPERATOR);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralRootUpdated(
            legacyId, 0, bytes32(0), _legacyReferralLeaf(legacyId, legacyPool), legacyPool
        );
        manager.setReferralRoot(legacyId, 0, _legacyReferralLeaf(legacyId, legacyPool), legacyPool);
        manager.setReferralRoot(legacyId, 1, _referralLeaf(legacyId, 1, address(bonusToken), 6 ether), 6 ether);
        vm.stopPrank();

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralClaimed(legacyId, 0, REFERRER, legacyPool);
        manager.claimReferral(legacyId, 0, REFERRER, legacyPool, new bytes32[](0));
        manager.claimReferral(legacyId, 1, REFERRER, 6 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(REFERRER), legacyPool, "Legacy pool pays in the reward token");
        assertEq(bonusToken.balanceOf(REFERRER), 6 ether, "New pool pays in its own token");
        assertEq(rewardToken.balanceOf(legacyDistributor), 0);
        assertEq(bonusToken.balanceOf(address(bonus)), 0);
    }
}

contract OpenEndedReentrantTopUpTest is OpenEndedFixture {
    function setUp() public {
        rewardToken = new MockERC20();
        campaignImpl = new TimeBasedIncentiveCampaign();
        openEndedImpl = new OpenEndedIncentiveCampaign();
        distributorImpl = new ReferralDistributor();

        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManager()));
        manager = TimeBasedIncentiveManager(proxy);
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
        manager.setOperator(OPERATOR);
        manager.setReferralDistributorImplementation(address(distributorImpl));
        manager.setOpenEndedCampaignImplementation(address(openEndedImpl));
    }

    function test_AddRewards_RevertReentrantBudgetDoubleCount() public {
        ReentrantTopUpBudget evil = new ReentrantTopUpBudget(manager, address(rewardToken));
        rewardToken.mint(address(evil), 100 ether);
        budget = ManagedBudget(payable(address(evil)));
        (uint256 id, OpenEndedIncentiveCampaign campaign) = _create(0);

        evil.arm(address(campaign), id, 2 ether);
        vm.expectRevert(OpenEndedIncentiveCampaign.TopUpNotFunded.selector);
        vm.prank(CREATOR);
        manager.addRewards(id, 2 ether);

        assertEq(campaign.totalRewards(), 9 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_AddRewards_SameBudgetWithoutReentrySucceeds() public {
        ReentrantTopUpBudget evil = new ReentrantTopUpBudget(manager, address(rewardToken));
        rewardToken.mint(address(evil), 100 ether);
        budget = ManagedBudget(payable(address(evil)));
        (uint256 id, OpenEndedIncentiveCampaign campaign) = _create(0);

        _topUp(id, 2 ether);

        assertEq(campaign.totalRewards(), 10.8 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 10.8 ether);
    }
}
