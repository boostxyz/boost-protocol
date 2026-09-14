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
    function quoteProtocolFee(ITBIProtocolFeeModule.FeeContext calldata) external pure returns (uint64) {
        revert("boom");
    }
}

/// @dev Module that returns a value wider than uint64
contract WideReturnFeeModule {
    uint256 immutable fee;

    constructor(uint256 fee_) {
        fee = fee_;
    }

    function quoteProtocolFee(ITBIProtocolFeeModule.FeeContext calldata) external view returns (uint256) {
        return fee;
    }
}

/// @dev Module that returns nothing
contract NoReturnFeeModule {
    function quoteProtocolFee(ITBIProtocolFeeModule.FeeContext calldata) external pure {}
}

/// @dev Module that returns two words
contract LongReturnFeeModule {
    function quoteProtocolFee(ITBIProtocolFeeModule.FeeContext calldata) external pure returns (uint64, uint64) {
        return (100, 100);
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

    function _setFee(address account, uint64 feeBps) internal {
        vm.prank(SAFE);
        module.setFee(account, feeBps);
    }

    function _quote(address budget_) internal view returns (uint64) {
        return manager.quoteProtocolFee(CREATOR, budget_, address(rewardToken), TOTAL);
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
        manager.setProtocolFeeModule(address(new WideReturnFeeModule(uint256(type(uint64).max) + 1)));

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

    function test_Create_ModuleReturnsTwoWords_FallsBack() public {
        address bad = address(new LongReturnFeeModule());
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
    // quoteProtocolFee
    ////////////////////////////////

    function test_Quote_NoModule_ReturnsStandard() public view {
        assertEq(_quote(address(budget)), PROTOCOL_FEE);
        assertEq(_quote(address(0)), PROTOCOL_FEE);
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
