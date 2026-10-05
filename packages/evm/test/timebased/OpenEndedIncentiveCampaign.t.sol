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
    uint64 constant REFERRAL_FEE_BPS = 2000; // 20% of the protocol fee
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

        rewardToken.mint(address(this), 1000 ether);
        rewardToken.approve(address(b), 1000 ether);
        b.allocate(
            abi.encode(
                ABudget.Transfer({
                    assetType: ABudget.AssetType.ERC20,
                    asset: address(rewardToken),
                    target: address(this),
                    data: abi.encode(ABudget.FungiblePayload({amount: 1000 ether}))
                })
            )
        );
    }

    function _times() internal view returns (uint64 startTime, uint64 endTime) {
        startTime = uint64(block.timestamp + 1 hours);
        endTime = uint64(block.timestamp + 30 days);
    }

    function _create(uint256 totalAmount, uint256 rate, uint64 referralFeeBps)
        internal
        returns (uint256 campaignId, OpenEndedIncentiveCampaign campaign)
    {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), totalAmount, startTime, endTime, rate, referralFeeBps
        );
        campaign = OpenEndedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    function _create(uint64 referralFeeBps) internal returns (uint256 campaignId, OpenEndedIncentiveCampaign campaign) {
        return _create(TOTAL, RATE, referralFeeBps);
    }

    function _createFixed() internal returns (uint256 campaignId) {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId =
            manager.createCampaign(budget, keccak256("fixed"), address(rewardToken), TOTAL, startTime, endTime, 0);
    }

    function _topUp(uint256 campaignId, uint256 totalAmount) internal {
        vm.prank(CREATOR);
        manager.addRewards(campaignId, totalAmount);
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
        assertEq(manager.campaignReferralFeeBps(campaignId), 0);
        assertEq(manager.getReferralDistributor(campaignId), address(0));

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
        vm.expectEmit(true, false, false, true, address(manager));
        emit TimeBasedIncentiveManager.ReferralDistributorCreated(1, address(0), REFERRAL_FEE_BPS, 0.2 ether);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);

        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
        assertTrue(address(dist) != address(0));
        assertEq(dist.campaign(), address(campaign));
        assertEq(dist.referralToken(), address(rewardToken));
        assertEq(dist.referralPool(), 0.2 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0.2 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.8 ether);
        assertEq(campaign.totalRewards(), 9 ether, "Referral fee must not change net rewards");
        assertEq(manager.campaignReferralFeeBps(campaignId), REFERRAL_FEE_BPS);
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

    function test_Create_ReferralBpsWrittenWithoutDistributor() public {
        // With no protocol fee there is no referral slice and no distributor, but the
        // referral bps is still recorded for an open-ended campaign
        manager.setProtocolFee(0);
        (uint256 campaignId,) = _create(REFERRAL_FEE_BPS);

        assertEq(manager.getReferralDistributor(campaignId), address(0));
        assertEq(manager.campaignReferralFeeBps(campaignId), REFERRAL_FEE_BPS);
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
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, REFERRAL_FEE_BPS, 300
        );

        assertEq(manager.campaignProtocolFeeBps(campaignId), 300);
        assertEq(OpenEndedIncentiveCampaign(manager.getCampaign(campaignId)).totalRewards(), 9.7 ether);
        // 0.3 ether fee, 20% of it to referrals
        assertEq(ReferralDistributor(manager.getReferralDistributor(campaignId)).referralPool(), 0.06 ether);
    }

    function test_CreateWithProtocolFee_RevertOutOfRange() public {
        manager.setProtocolFeeModule(address(module));
        vm.prank(SAFE);
        module.setFee(CREATOR, 100, 500);

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(abi.encodeWithSelector(TimeBasedIncentiveManager.ProtocolFeeOutOfRange.selector, 600, 100, 500));
        manager.createOpenEndedCampaignWithProtocolFee(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, 0, 600
        );

        vm.prank(CREATOR);
        vm.expectRevert(abi.encodeWithSelector(TimeBasedIncentiveManager.ProtocolFeeOutOfRange.selector, 50, 100, 500));
        manager.createOpenEndedCampaignWithProtocolFee(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, 0, 50
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
        fresh.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, 0);
    }

    function test_Create_RevertZeroEmissionRate() public {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ZeroEmissionRate.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, 0, 0);
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
            budget, CONFIG_HASH, address(rewardToken), DAY_OF_EMISSION - 1, startTime, endTime, RATE, 0
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
            budget, CONFIG_HASH, address(rewardToken), 0.96 ether - 2, startTime, endTime, RATE, 0
        );
    }

    function test_Create_InitialFundingBoundary_RoundsUp() public {
        manager.setProtocolFee(0);
        // 1e12 + 1 scaled per second => ceil(86400.0000000864) = 86401 base units per day
        uint256 rate = 1e12 + 1;

        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InitialFundingTooSmall.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), 86400, startTime, endTime, rate, 0);

        (, OpenEndedIncentiveCampaign campaign) = _create(86401, rate, 0);
        assertEq(campaign.minTopUp(), 86401);
    }

    function test_Create_RevertDurationBounds() public {
        uint64 startTime = uint64(block.timestamp + 1 hours);

        vm.startPrank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.DurationTooShort.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 1 days - 1, RATE, 0
        );

        vm.expectRevert(TimeBasedIncentiveManager.DurationTooLong.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 365 days + 1, RATE, 0
        );

        vm.expectRevert(TimeBasedIncentiveManager.EndTimeBeforeStart.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime, RATE, 0);

        vm.expectRevert(TimeBasedIncentiveManager.StartTimeInPast.selector);
        manager.createOpenEndedCampaign(
            budget,
            CONFIG_HASH,
            address(rewardToken),
            TOTAL,
            uint64(block.timestamp - 1),
            uint64(block.timestamp + 30 days),
            RATE,
            0
        );

        // Both bounds are inclusive
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 1 days, RATE, 0
        );
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, startTime + 365 days, RATE, 0
        );
        vm.stopPrank();
    }

    function test_Create_RevertInvalidParams() public {
        (uint64 startTime, uint64 endTime) = _times();

        vm.startPrank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.InvalidRewardToken.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(0), TOTAL, startTime, endTime, RATE, 0);

        vm.expectRevert(TimeBasedIncentiveManager.ZeroAmount.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), 0, startTime, endTime, RATE, 0);

        vm.expectRevert(TimeBasedIncentiveManager.ReferralFeeTooHigh.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, 2501
        );
        vm.stopPrank();
    }

    function test_Create_RevertUnauthorizedCreator() public {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(RANDO);
        vm.expectRevert(TimeBasedIncentiveManager.NotAuthorizedOnBudget.selector);
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, 0);
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
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9 ether, 1 ether, 0, 18 ether);
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
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9.5 ether, 0.5 ether, 0, 19 ether);
        _topUp(campaignId, 10 ether);

        manager.setProtocolFeeModule(address(0));
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9.5 ether, 0.5 ether, 0, 28.5 ether);
        _topUp(campaignId, 10 ether);

        assertEq(campaign.totalRewards(), 28.5 ether);
    }

    function test_AddRewards_ReferralSliceToPool() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);

        vm.expectEmit(true, true, true, true, address(dist));
        emit ReferralDistributor.ReferralPoolIncreased(0.2 ether, 0.4 ether);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(
            campaignId, CREATOR, 10 ether, 9 ether, 1 ether, 0.2 ether, 18 ether
        );
        _topUp(campaignId, 10 ether);

        assertEq(dist.referralPool(), 0.4 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0.4 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore, 0.8 ether);
        assertEq(campaign.totalRewards(), 18 ether);
    }

    function test_AddRewards_NoDistributor_ReferralFoldedIntoProtocol() public {
        // A tiny initial funding makes the referral slice round to zero, so no distributor
        // is cloned even though the campaign carries a referral bps
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(40, 1, REFERRAL_FEE_BPS);
        assertEq(manager.getReferralDistributor(campaignId), address(0));
        assertEq(manager.campaignReferralFeeBps(campaignId), REFERRAL_FEE_BPS);
        assertEq(campaign.totalRewards(), 36);

        uint256 receiverBefore = rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 10 ether, 9 ether, 1 ether, 0, 9 ether + 36);
        _topUp(campaignId, 10 ether);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER) - receiverBefore, 1 ether, "Whole fee to protocol");
        assertEq(manager.getReferralDistributor(campaignId), address(0), "Top-ups never clone a distributor");
    }

    function test_AddRewards_ZeroFeeSnapshot() public {
        manager.setProtocolFee(0);
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        manager.setProtocolFee(1000);

        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(campaignId, CREATOR, 5 ether, 5 ether, 0, 0, 15 ether);
        _topUp(campaignId, 5 ether);
        assertEq(campaign.totalRewards(), 15 ether);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0);
    }

    function test_AddRewards_AnyAuthorizedCallerOnCampaignBudget() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(0);

        // The budget owner is authorized too; the funder field records the caller
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(
            campaignId, address(this), 1 ether, 0.9 ether, 0.1 ether, 0, 9.9 ether
        );
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

    function test_AddRewards_RevertAfterEndTime_WithDistributor() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));

        vm.warp(campaign.endTime() + 1);
        vm.prank(CREATOR);
        vm.expectRevert(OpenEndedIncentiveCampaign.CampaignAlreadyEnded.selector);
        manager.addRewards(campaignId, 1 ether);
        assertEq(dist.referralPool(), 0.2 ether, "Pool increase must roll back with the top-up");
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

    function test_AddRewards_RevertAfterFinalize_WithDistributor() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        vm.warp(campaign.startTime());
        manager.updateRoot(campaignId, keccak256("root"), campaign.totalRewards(), true);

        // The distributor rejects first; its error shares the campaign's selector
        vm.prank(CREATOR);
        vm.expectRevert(ReferralDistributor.CampaignAlreadyFinalized.selector);
        manager.addRewards(campaignId, 1 ether);
        assertEq(
            ReferralDistributor.CampaignAlreadyFinalized.selector,
            OpenEndedIncentiveCampaign.CampaignAlreadyFinalized.selector
        );
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
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        _topUp(campaignId, 10 ether);
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
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
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
        (uint256 campaignId,) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));

        vm.expectEmit(true, true, true, true, address(dist));
        emit ReferralDistributor.ReferralPoolIncreased(1 ether, 1.2 ether);
        vm.prank(address(manager));
        dist.addToPool(1 ether);
        assertEq(dist.referralPool(), 1.2 ether);
    }

    function test_AddToPool_RevertNotManager() public {
        (uint256 campaignId,) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));

        vm.prank(CREATOR);
        vm.expectRevert(ReferralDistributor.OnlyTimeBasedIncentiveManager.selector);
        dist.addToPool(1 ether);
    }

    function test_AddToPool_RevertFinalized() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("root"), 0, true);

        vm.prank(address(manager));
        vm.expectRevert(ReferralDistributor.CampaignAlreadyFinalized.selector);
        dist.addToPool(1 ether);
    }

    function test_AddToPool_RevertSwept() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("root"), 0, true);
        vm.warp(block.timestamp + 60 days + 1);
        manager.sweepReferralPool(campaignId);
        assertTrue(dist.swept());

        vm.prank(address(manager));
        vm.expectRevert(ReferralDistributor.PoolAlreadySwept.selector);
        dist.addToPool(1 ether);
    }

    function test_ReferralRoot_CanCommitToppedUpPool() public {
        (uint256 campaignId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(campaignId));
        _topUp(campaignId, 10 ether);
        assertEq(dist.referralPool(), 0.4 ether);

        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(campaignId, keccak256("root"), 0, true);

        vm.expectRevert(ReferralDistributor.CommitmentExceedsPool.selector);
        manager.setReferralRoot(campaignId, keccak256("ref"), 0.4 ether + 1);

        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, campaignId, REFERRER, address(rewardToken), 0.4 ether)))
        );
        manager.setReferralRoot(campaignId, leaf, 0.4 ether);
        manager.claimReferral(campaignId, REFERRER, 0.4 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(REFERRER), 0.4 ether);
    }

    ////////////////////////////////
    // Referral distributor template compatibility
    ////////////////////////////////

    function test_Create_RevertLegacyDistributorTemplate() public {
        manager.setReferralDistributorImplementation(address(new ReferralDistributorV2_3()));
        (uint64 startTime, uint64 endTime) = _times();

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, REFERRAL_FEE_BPS
        );

        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.createOpenEndedCampaignWithProtocolFee(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, REFERRAL_FEE_BPS, PROTOCOL_FEE
        );

        // No referral fee: no distributor, so creation proceeds
        (uint256 campaignId,) = _create(0);
        assertEq(manager.getReferralDistributor(campaignId), address(0));

        // Gated on an actual clone: a referral fee whose slice rounds to zero clones nothing
        (uint256 zeroSliceId,) = _create(40, 1, REFERRAL_FEE_BPS);
        assertEq(manager.getReferralDistributor(zeroSliceId), address(0));
        assertEq(manager.campaignReferralFeeBps(zeroSliceId), REFERRAL_FEE_BPS);

        // Fixed-end referral creation is unaffected by the template
        vm.prank(CREATOR);
        uint256 fixedId = manager.createCampaign(
            budget, keccak256("fixed"), address(rewardToken), TOTAL, startTime, endTime, REFERRAL_FEE_BPS
        );
        assertTrue(manager.getReferralDistributor(fixedId) != address(0));
    }

    function test_Create_RevertTemplateMarkerFalseOrMalformed() public {
        (uint64 startTime, uint64 endTime) = _times();

        manager.setReferralDistributorImplementation(address(new FalseTopUpMarker()));
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, REFERRAL_FEE_BPS
        );

        manager.setReferralDistributorImplementation(address(new NonBoolTopUpMarker()));
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, REFERRAL_FEE_BPS
        );
    }

    function test_SupportsTopUps_OnImplementationAndClone() public {
        assertTrue(distributorImpl.supportsTopUps(), "Probe must work on the uninitializable implementation");
        (uint256 campaignId,) = _create(REFERRAL_FEE_BPS);
        assertTrue(ReferralDistributor(manager.getReferralDistributor(campaignId)).supportsTopUps());
    }

    ////////////////////////////////
    // Version
    ////////////////////////////////

    function test_Version() public view {
        assertEq(manager.version(), "2.4.0");
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
            budget, keccak256("legacy"), address(rewardToken), TOTAL, startTime, endTime, REFERRAL_FEE_BPS
        );
        legacyCampaign = legacy.getCampaign(legacyId);
        legacyDistributor = legacy.getReferralDistributor(legacyId);

        manager.upgradeToAndCall(address(new TimeBasedIncentiveManager()), "");
    }

    function _referralLeaf(uint256 campaignId, uint256 amount) internal view returns (bytes32) {
        return keccak256(
            bytes.concat(keccak256(abi.encode(block.chainid, campaignId, REFERRER, address(rewardToken), amount)))
        );
    }

    function test_UpgradeFrom2_3_PreservesState() public {
        // Every pre-existing variable reads back unchanged
        assertEq(manager.version(), "2.4.0");
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
        assertEq(manager.campaignReferralFeeBps(legacyId), REFERRAL_FEE_BPS);
        assertEq(manager.getReferralDistributor(legacyId), legacyDistributor);
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
        manager.createOpenEndedCampaign(budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, 0);

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

        // Fixed-end referral campaigns still create on the legacy template
        vm.prank(CREATOR);
        uint256 fixedId = manager.createCampaign(
            budget, keccak256("fixed"), address(rewardToken), TOTAL, startTime, endTime, REFERRAL_FEE_BPS
        );
        assertTrue(manager.getReferralDistributor(fixedId) != address(0));

        // An open-ended referral campaign would get a distributor that cannot take top-ups
        vm.prank(CREATOR);
        vm.expectRevert(TimeBasedIncentiveManager.ReferralDistributorNotTopUpCompatible.selector);
        manager.createOpenEndedCampaign(
            budget, CONFIG_HASH, address(rewardToken), TOTAL, startTime, endTime, RATE, REFERRAL_FEE_BPS
        );

        // Without a referral fee there is no distributor, so the legacy template is irrelevant
        (uint256 plainId, OpenEndedIncentiveCampaign plain) = _create(0);
        assertEq(manager.campaignProtocolFeeBps(plainId), 500, "Fee module discount snapshotted");
        assertEq(plain.claimExpiryDuration(), 30 days);
        _topUp(plainId, 10 ether);
        assertEq(plain.totalRewards(), 19 ether);

        // Once the template is updated, referral open-ended campaigns work end to end
        manager.setReferralDistributorImplementation(address(distributorImpl));
        (uint256 openId, OpenEndedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);
        ReferralDistributor dist = ReferralDistributor(manager.getReferralDistributor(openId));
        assertEq(dist.referralPool(), 0.1 ether);

        vm.expectEmit(true, true, true, true, address(dist));
        emit ReferralDistributor.ReferralPoolIncreased(0.1 ether, 0.2 ether);
        vm.expectEmit(true, true, true, true, address(manager));
        emit TimeBasedIncentiveManager.RewardsAdded(
            openId, CREATOR, 10 ether, 9.5 ether, 0.5 ether, 0.1 ether, 19 ether
        );
        _topUp(openId, 10 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0.2 ether);

        vm.warp(campaign.endTime() + 1);
        manager.updateRoot(openId, keccak256("root"), 0, true);
        manager.setReferralRoot(openId, _referralLeaf(openId, 0.2 ether), 0.2 ether);
        manager.claimReferral(openId, REFERRER, 0.2 ether, new bytes32[](0));
        assertEq(rewardToken.balanceOf(REFERRER), 0.2 ether);
        assertEq(rewardToken.balanceOf(address(dist)), 0);
    }
}
