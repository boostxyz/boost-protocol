// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {Ownable} from "@solady/auth/Ownable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";

import {MockERC20} from "contracts/shared/Mocks.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {ITBIProtocolFeeModule} from "contracts/timebased/ITBIProtocolFeeModule.sol";
import {ReferralDistributor} from "contracts/timebased/ReferralDistributor.sol";
import {TBIProtocolFeeModule} from "contracts/timebased/TBIProtocolFeeModule.sol";
import {TimeBasedIncentiveCampaign} from "contracts/timebased/TimeBasedIncentiveCampaign.sol";
import {TimeBasedIncentiveManager} from "contracts/timebased/TimeBasedIncentiveManager.sol";

/// @dev Module that always reverts when quoting
contract RevertingFeeModule {
    function quoteProtocolFeeRange(ITBIProtocolFeeModule.FeeContext calldata) external pure returns (uint64, uint64) {
        revert("boom");
    }
}

/// @dev Module that returns arbitrary uint256 bounds (wider than uint64, or min > max)
contract RawRangeFeeModule {
    uint256 immutable minFee;
    uint256 immutable maxFee;

    constructor(uint256 minFee_, uint256 maxFee_) {
        minFee = minFee_;
        maxFee = maxFee_;
    }

    function quoteProtocolFeeRange(ITBIProtocolFeeModule.FeeContext calldata) external view returns (uint256, uint256) {
        return (minFee, maxFee);
    }
}

/// @dev Module that returns nothing
contract NoReturnFeeModule {
    function quoteProtocolFeeRange(ITBIProtocolFeeModule.FeeContext calldata) external pure {}
}

/// @dev Module that returns a single word instead of a range
contract ShortReturnFeeModule {
    function quoteProtocolFeeRange(ITBIProtocolFeeModule.FeeContext calldata) external pure returns (uint64) {
        return 100;
    }
}

contract TimeBasedIncentiveManagerFeeModuleTest is Test {
    MockERC20 rewardToken;
    ManagedBudget budget;
    TimeBasedIncentiveManager manager;
    TimeBasedIncentiveCampaign campaignImpl;
    ReferralDistributor distributorImpl;
    TBIProtocolFeeModule module;

    address constant PROTOCOL_FEE_RECEIVER = address(0xFEE);
    address constant CREATOR = address(0xCAFE);
    address constant OPERATOR = address(0x09E7);
    address constant RANDO = address(0xD00D);
    address constant SAFE = address(0x5AFE);
    uint64 constant PROTOCOL_FEE = 1000; // 10%
    uint64 constant DISCOUNT_FEE = 500; // 5%
    uint64 constant MIN_FEE = 100; // 1%, bottom of the internal range
    uint64 constant REFERRAL_FEE_BPS = 2000; // 20% of the protocol fee
    uint256 constant TOTAL = 10 ether;

    function setUp() public {
        rewardToken = new MockERC20();
        campaignImpl = new TimeBasedIncentiveCampaign();
        distributorImpl = new ReferralDistributor();

        address proxy = LibClone.deployERC1967(address(new TimeBasedIncentiveManager()));
        manager = TimeBasedIncentiveManager(proxy);
        manager.initialize(address(this), address(campaignImpl), PROTOCOL_FEE, PROTOCOL_FEE_RECEIVER);
        manager.setOperator(OPERATOR);
        manager.setReferralDistributorImplementation(address(distributorImpl));

        module = new TBIProtocolFeeModule(address(manager), SAFE);

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

        rewardToken.mint(CREATOR, 100 ether);
        vm.prank(CREATOR);
        rewardToken.approve(address(manager), 100 ether);
    }

    ////////////////////////////////
    // Helpers
    ////////////////////////////////

    function _times() internal view returns (uint64 startTime, uint64 endTime) {
        startTime = uint64(block.timestamp + 1 hours);
        endTime = uint64(block.timestamp + 30 days);
    }

    function _create(uint64 referralFeeBps) internal returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign) {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createCampaign(
            budget, keccak256("fee-module"), address(rewardToken), TOTAL, startTime, endTime, referralFeeBps
        );
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    function _createDirect(uint64 referralFeeBps)
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign)
    {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createCampaignDirect(
            keccak256("fee-module-direct"), address(rewardToken), TOTAL, startTime, endTime, referralFeeBps
        );
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    function _createWithFee(uint64 referralFeeBps, uint64 protocolFeeBps)
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign)
    {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createCampaignWithProtocolFee(
            budget,
            keccak256("fee-module-with-fee"),
            address(rewardToken),
            TOTAL,
            startTime,
            endTime,
            referralFeeBps,
            protocolFeeBps
        );
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    function _createDirectWithFee(uint64 referralFeeBps, uint64 protocolFeeBps)
        internal
        returns (uint256 campaignId, TimeBasedIncentiveCampaign campaign)
    {
        (uint64 startTime, uint64 endTime) = _times();
        vm.prank(CREATOR);
        campaignId = manager.createCampaignDirectWithProtocolFee(
            keccak256("fee-module-direct-with-fee"),
            address(rewardToken),
            TOTAL,
            startTime,
            endTime,
            referralFeeBps,
            protocolFeeBps
        );
        campaign = TimeBasedIncentiveCampaign(manager.getCampaign(campaignId));
    }

    /// @dev Flat rate: min == max
    function _setFee(address account, uint64 feeBps) internal {
        vm.prank(SAFE);
        module.setFee(account, feeBps, feeBps);
    }

    function _setRange(address account, uint64 minFeeBps, uint64 maxFeeBps) internal {
        vm.prank(SAFE);
        module.setFee(account, minFeeBps, maxFeeBps);
    }

    /// @dev Default fee: top of the quoted range
    function _quote(address budget_) internal view returns (uint64 maxFeeBps) {
        (, maxFeeBps) = manager.quoteProtocolFeeRange(CREATOR, budget_, address(rewardToken), TOTAL);
    }

    function _quoteRange(address budget_) internal view returns (uint64 minFeeBps, uint64 maxFeeBps) {
        return manager.quoteProtocolFeeRange(CREATOR, budget_, address(rewardToken), TOTAL);
    }

    function _expectOutOfRange(uint64 requested, uint64 minFeeBps, uint64 maxFeeBps) internal {
        vm.expectRevert(
            abi.encodeWithSelector(
                TimeBasedIncentiveManager.ProtocolFeeOutOfRange.selector, requested, minFeeBps, maxFeeBps
            )
        );
    }

    ////////////////////////////////
    // setProtocolFeeModule
    ////////////////////////////////

    function test_SetProtocolFeeModule_Success() public {
        vm.expectEmit(true, true, false, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleUpdated(address(0), address(module));
        manager.setProtocolFeeModule(address(module));
        assertEq(manager.protocolFeeModule(), address(module));
    }

    function test_SetProtocolFeeModule_Unset() public {
        manager.setProtocolFeeModule(address(module));
        vm.expectEmit(true, true, false, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleUpdated(address(module), address(0));
        manager.setProtocolFeeModule(address(0));
        assertEq(manager.protocolFeeModule(), address(0));
    }

    function test_SetProtocolFeeModule_RevertNotOwner() public {
        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        manager.setProtocolFeeModule(address(module));
    }

    function test_SetProtocolFeeModule_RevertNoCode() public {
        vm.expectRevert(TimeBasedIncentiveManager.InvalidProtocolFeeModule.selector);
        manager.setProtocolFeeModule(RANDO);
    }

    ////////////////////////////////
    // Creation: no module (ships dark)
    ////////////////////////////////

    function test_Create_NoModule_StandardFee() public {
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
        assertEq(campaign.totalRewards(), 9 ether);
    }

    function test_Create_ModuleSetButNoAssignment_StandardFee() public {
        manager.setProtocolFeeModule(address(module));
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    ////////////////////////////////
    // Creation: discounts
    ////////////////////////////////

    function test_Create_CreatorDiscount() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, DISCOUNT_FEE, 0.5 ether);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.5 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.5 ether);
        assertEq(campaign.totalRewards(), 9.5 ether);
    }

    function test_Create_BudgetDiscount() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(address(budget), DISCOUNT_FEE);

        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.5 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.5 ether);
    }

    function test_Create_CreatorAssignmentBeatsBudget() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, 250);
        _setFee(address(budget), DISCOUNT_FEE);

        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.25 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.75 ether);
    }

    function test_CreateDirect_CreatorDiscount() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, DISCOUNT_FEE, 0.5 ether);
        (, TimeBasedIncentiveCampaign campaign) = _createDirect(0);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.5 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.5 ether);
        assertEq(rewardToken.balanceOf(CREATOR), 90 ether);
    }

    function test_CreateDirect_BudgetAssignmentDoesNotApply() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(address(budget), DISCOUNT_FEE);

        (, TimeBasedIncentiveCampaign campaign) = _createDirect(0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_Create_ZeroFeeOverride_NoFeeTransfer() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, 0);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, 0, 0);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0);
        assertEq(rewardToken.balanceOf(address(campaign)), TOTAL);
        assertEq(campaign.totalRewards(), TOTAL);
    }

    function test_Create_ZeroFeeOverride_ReferralsDoNotApply() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, 0);

        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);

        assertEq(manager.getReferralDistributor(campaignId), address(0), "no distributor at 0% fee");
        assertEq(manager.campaignReferralFeeBps(campaignId), 0);
        assertEq(rewardToken.balanceOf(address(campaign)), TOTAL);
    }

    function test_Create_ReferralSliceCarvedFromDiscountedFee() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);

        // 5% of 10 ether = 0.5 ether fee; 20% of that = 0.1 ether referral slice
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ReferralDistributorCreated(1, address(0), REFERRAL_FEE_BPS, 0.1 ether);
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _create(REFERRAL_FEE_BPS);

        address dist = manager.getReferralDistributor(campaignId);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.4 ether);
        assertEq(rewardToken.balanceOf(dist), 0.1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.5 ether);
    }

    function test_Create_DiscountRemovedRevertsToStandard() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);
        vm.prank(SAFE);
        module.clearFee(CREATOR);

        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    ////////////////////////////////
    // Creation: the module can only discount
    ////////////////////////////////

    function test_Create_ModuleAboveStandard_CappedAtStandard() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, 2000);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_Create_ModuleEqualToStandard_AppliesStandard() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        _create(0);
    }

    function test_Create_StandardLoweredBelowOverride_StandardWins() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);
        manager.setProtocolFee(100);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, 100, 0.1 ether);
        _create(0);
    }

    function test_Create_WideReturnAboveUint64_CappedAtStandard() public {
        uint256 wide = uint256(type(uint64).max) + 1;
        manager.setProtocolFeeModule(address(new RawRangeFeeModule(wide, wide)));

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    ////////////////////////////////
    // Creation: module failure falls back to the standard fee
    ////////////////////////////////

    function test_Create_ModuleReverts_FallsBack() public {
        address bad = address(new RevertingFeeModule());
        manager.setProtocolFeeModule(bad);

        vm.expectEmit(true, true, true, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleFallback(bad, CREATOR, address(budget));
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _create(0);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_Create_ModuleReturnsNothing_FallsBack() public {
        address bad = address(new NoReturnFeeModule());
        manager.setProtocolFeeModule(bad);

        vm.expectEmit(true, true, true, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleFallback(bad, CREATOR, address(budget));
        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_Create_ModuleReturnsOneWord_FallsBack() public {
        address bad = address(new ShortReturnFeeModule());
        manager.setProtocolFeeModule(bad);

        vm.expectEmit(true, true, true, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleFallback(bad, CREATOR, address(budget));
        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_Create_ModuleSelfDestructedToEOA_FallsBack() public {
        manager.setProtocolFeeModule(address(module));
        vm.etch(address(module), "");

        vm.expectEmit(true, true, true, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleFallback(address(module), CREATOR, address(budget));
        (, TimeBasedIncentiveCampaign campaign) = _create(0);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_CreateDirect_ModuleReverts_FallsBack() public {
        address bad = address(new RevertingFeeModule());
        manager.setProtocolFeeModule(bad);

        vm.expectEmit(true, true, true, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleFallback(bad, CREATOR, address(0));
        (, TimeBasedIncentiveCampaign campaign) = _createDirect(0);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    ////////////////////////////////
    // Creation: creator picks a fee inside the allowed range
    ////////////////////////////////

    function test_CreateWithFee_NoModule_StandardOnly() public {
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _createWithFee(0, PROTOCOL_FEE);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_CreateWithFee_NoModule_RevertBelowStandard() public {
        _expectOutOfRange(DISCOUNT_FEE, PROTOCOL_FEE, PROTOCOL_FEE);
        _createWithFee(0, DISCOUNT_FEE);
    }

    function test_CreateWithFee_NoModule_RevertAboveStandard() public {
        _expectOutOfRange(2000, PROTOCOL_FEE, PROTOCOL_FEE);
        _createWithFee(0, 2000);
    }

    function test_CreateWithFee_BottomOfRange() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, MIN_FEE, 0.1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _createWithFee(0, MIN_FEE);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.9 ether);
        assertEq(campaign.totalRewards(), 9.9 ether);
    }

    function test_CreateWithFee_InsideRange() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, DISCOUNT_FEE, 0.5 ether);
        (, TimeBasedIncentiveCampaign campaign) = _createWithFee(0, DISCOUNT_FEE);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.5 ether);
    }

    function test_CreateWithFee_TopOfRange() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        _createWithFee(0, PROTOCOL_FEE);
    }

    function test_CreateWithFee_RevertBelowRange() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        _expectOutOfRange(MIN_FEE - 1, MIN_FEE, PROTOCOL_FEE);
        _createWithFee(0, MIN_FEE - 1);
    }

    function test_CreateWithFee_RevertAboveRange_CannotOverpay() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, DISCOUNT_FEE);

        _expectOutOfRange(PROTOCOL_FEE, MIN_FEE, DISCOUNT_FEE);
        _createWithFee(0, PROTOCOL_FEE);
    }

    function test_CreateWithFee_FlatRate_OnlyThatFee() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);

        _expectOutOfRange(MIN_FEE, DISCOUNT_FEE, DISCOUNT_FEE);
        _createWithFee(0, MIN_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, DISCOUNT_FEE, 0.5 ether);
        _createWithFee(0, DISCOUNT_FEE);
    }

    function test_CreateWithFee_ZeroAllowed_NoReferrals() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, 0, PROTOCOL_FEE);

        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createWithFee(REFERRAL_FEE_BPS, 0);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0);
        assertEq(rewardToken.balanceOf(address(campaign)), TOTAL);
        assertEq(manager.getReferralDistributor(campaignId), address(0));
    }

    function test_CreateWithFee_ReferralCarvedFromChosenFee() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        // 1% of 10 ether = 0.1 ether fee; 20% of that = 0.02 ether referral slice
        (uint256 campaignId, TimeBasedIncentiveCampaign campaign) = _createWithFee(REFERRAL_FEE_BPS, MIN_FEE);
        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.08 ether);
        assertEq(rewardToken.balanceOf(manager.getReferralDistributor(campaignId)), 0.02 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.9 ether);
    }

    function test_CreateWithFee_StandardLowered_RangeCapped() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, DISCOUNT_FEE, PROTOCOL_FEE);
        manager.setProtocolFee(200);

        // Both bounds cap at the new standard: 2% is the only allowed fee
        _expectOutOfRange(DISCOUNT_FEE, 200, 200);
        _createWithFee(0, DISCOUNT_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, 200, 0.2 ether);
        _createWithFee(0, 200);
    }

    function test_CreateWithFee_ModuleReverts_OnlyStandardAllowed() public {
        address bad = address(new RevertingFeeModule());
        manager.setProtocolFeeModule(bad);

        _expectOutOfRange(MIN_FEE, PROTOCOL_FEE, PROTOCOL_FEE);
        _createWithFee(0, MIN_FEE);

        vm.expectEmit(true, true, true, false);
        emit TimeBasedIncentiveManager.ProtocolFeeModuleFallback(bad, CREATOR, address(budget));
        (, TimeBasedIncentiveCampaign campaign) = _createWithFee(0, PROTOCOL_FEE);
        assertEq(rewardToken.balanceOf(address(campaign)), 9 ether);
    }

    function test_CreateWithFee_ModuleMinAboveMax_MinClampedToMax() public {
        manager.setProtocolFeeModule(address(new RawRangeFeeModule(DISCOUNT_FEE, MIN_FEE)));

        (uint64 minFee, uint64 maxFee) = _quoteRange(address(budget));
        assertEq(minFee, MIN_FEE);
        assertEq(maxFee, MIN_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, MIN_FEE, 0.1 ether);
        _createWithFee(0, MIN_FEE);
    }

    function test_CreateWithFee_BudgetRangeApplies() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(address(budget), MIN_FEE, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, MIN_FEE, 0.1 ether);
        _createWithFee(0, MIN_FEE);
    }

    function test_CreateDirectWithFee_BottomOfRange() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, MIN_FEE, 0.1 ether);
        (, TimeBasedIncentiveCampaign campaign) = _createDirectWithFee(0, MIN_FEE);

        assertEq(rewardToken.balanceOf(PROTOCOL_FEE_RECEIVER), 0.1 ether);
        assertEq(rewardToken.balanceOf(address(campaign)), 9.9 ether);
        assertEq(rewardToken.balanceOf(CREATOR), 90 ether);
    }

    function test_CreateDirectWithFee_RevertBelowRange_NoTokensMoved() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        _expectOutOfRange(MIN_FEE - 1, MIN_FEE, PROTOCOL_FEE);
        _createDirectWithFee(0, MIN_FEE - 1);
        assertEq(rewardToken.balanceOf(CREATOR), 100 ether);
        assertEq(manager.campaignCount(), 0);
    }

    function test_CreateDirectWithFee_BudgetRangeDoesNotApply() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(address(budget), MIN_FEE, PROTOCOL_FEE);

        _expectOutOfRange(MIN_FEE, PROTOCOL_FEE, PROTOCOL_FEE);
        _createDirectWithFee(0, MIN_FEE);
    }

    ////////////////////////////////
    // Creation: plain entry points apply the top of the range
    ////////////////////////////////

    function test_Create_Range_DefaultIsTopOfRange() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, PROTOCOL_FEE, 1 ether);
        _create(0);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(2, PROTOCOL_FEE, 1 ether);
        _createDirect(0);
    }

    function test_Create_Range_TopBelowStandard_AppliesTop() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, DISCOUNT_FEE);

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, DISCOUNT_FEE, 0.5 ether);
        _create(0);
    }

    ////////////////////////////////
    // quoteProtocolFeeRange
    ////////////////////////////////

    function test_Quote_NoModule_ReturnsStandard() public view {
        (uint64 minFee, uint64 maxFee) = _quoteRange(address(budget));
        assertEq(minFee, PROTOCOL_FEE);
        assertEq(maxFee, PROTOCOL_FEE);
        assertEq(_quote(address(0)), PROTOCOL_FEE);
    }

    function test_Quote_Range() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);
        (uint64 minFee, uint64 maxFee) = _quoteRange(address(budget));
        assertEq(minFee, MIN_FEE);
        assertEq(maxFee, PROTOCOL_FEE);
    }

    function test_Quote_Range_CappedAtStandard() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, 2000, 5000);
        (uint64 minFee, uint64 maxFee) = _quoteRange(address(budget));
        assertEq(minFee, PROTOCOL_FEE);
        assertEq(maxFee, PROTOCOL_FEE);
    }

    function test_Quote_Range_MatchesApplied() public {
        manager.setProtocolFeeModule(address(module));
        _setRange(CREATOR, MIN_FEE, PROTOCOL_FEE);
        (uint64 minFee, uint64 maxFee) = _quoteRange(address(budget));

        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, minFee, (TOTAL * minFee) / 10000);
        _createWithFee(0, minFee);
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(2, maxFee, (TOTAL * maxFee) / 10000);
        _create(0);
    }

    function test_Quote_MatchesApplied_Discount() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);

        uint64 quoted = _quote(address(budget));
        assertEq(quoted, DISCOUNT_FEE);
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, quoted, (TOTAL * quoted) / 10000);
        _create(0);
    }

    function test_Quote_MatchesApplied_NoAssignment() public {
        manager.setProtocolFeeModule(address(module));
        uint64 quoted = _quote(address(budget));
        assertEq(quoted, PROTOCOL_FEE);
        vm.expectEmit(true, false, false, true);
        emit TimeBasedIncentiveManager.ProtocolFeeApplied(1, quoted, 1 ether);
        _create(0);
    }

    function test_Quote_CappedAtStandard() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, 2000);
        assertEq(_quote(address(budget)), PROTOCOL_FEE);
    }

    function test_Quote_BudgetAssignmentOnlyForBudgetFunded() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(address(budget), DISCOUNT_FEE);
        assertEq(_quote(address(budget)), DISCOUNT_FEE);
        assertEq(_quote(address(0)), PROTOCOL_FEE);
    }

    function test_Quote_RevertsWhenModuleReverts() public {
        manager.setProtocolFeeModule(address(new RevertingFeeModule()));
        vm.expectRevert();
        _quote(address(budget));
    }

    ////////////////////////////////
    // Upgrade / version
    ////////////////////////////////

    function test_Upgrade_PreservesModule() public {
        manager.setProtocolFeeModule(address(module));
        _setFee(CREATOR, DISCOUNT_FEE);
        _create(0);

        manager.upgradeToAndCall(address(new TimeBasedIncentiveManager()), "");

        assertEq(manager.protocolFeeModule(), address(module));
        assertEq(manager.campaignCount(), 1);
        assertEq(manager.referralDistributorImplementation(), address(distributorImpl));
        assertEq(manager.referralClaimWindowDuration(), 60 days);
        assertEq(_quote(address(budget)), DISCOUNT_FEE);
    }

    function test_Version() public view {
        assertEq(manager.version(), "2.3.0");
    }
}
