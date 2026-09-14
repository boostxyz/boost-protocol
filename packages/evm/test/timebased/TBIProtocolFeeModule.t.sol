// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";

import {Ownable} from "@solady/auth/Ownable.sol";

import {ITBIProtocolFeeModule} from "contracts/timebased/ITBIProtocolFeeModule.sol";
import {TBIProtocolFeeModule} from "contracts/timebased/TBIProtocolFeeModule.sol";

/// @dev Stand-in for the Manager: the module only reads its owner()
contract MockManager {
    address public owner;

    constructor(address owner_) {
        owner = owner_;
    }

    function transferOwnership(address newOwner) external {
        owner = newOwner;
    }
}

contract TBIProtocolFeeModuleTest is Test {
    TBIProtocolFeeModule module;
    MockManager manager;

    address constant OWNER = address(0x5AFE);
    address constant MANAGER_OWNER = address(0x71ED);
    address constant CREATOR = address(0xCAFE);
    address constant BUDGET = address(0xB0D6);
    address constant TOKEN = address(0x70CE);
    address constant RANDO = address(0xD00D);

    uint64 constant STANDARD = type(uint64).max;

    function setUp() public {
        manager = new MockManager(MANAGER_OWNER);
        module = new TBIProtocolFeeModule(address(manager), OWNER);
    }

    function _ctx(address creator, address budget) internal pure returns (ITBIProtocolFeeModule.FeeContext memory) {
        return
            ITBIProtocolFeeModule.FeeContext({creator: creator, budget: budget, rewardToken: TOKEN, totalAmount: 1e18});
    }

    function _setFee(address account, uint64 feeBps) internal {
        vm.prank(OWNER);
        module.setFee(account, feeBps);
    }

    function _override(address account) internal view returns (bool set, uint64 feeBps) {
        (set, feeBps) = module.feeOverrides(account);
    }

    ////////////////////////////////
    // Constructor
    ////////////////////////////////

    function test_Constructor_SetsManagerAndOwner() public view {
        assertEq(module.MANAGER(), address(manager));
        assertEq(module.owner(), OWNER);
        assertEq(module.STANDARD_FEE(), STANDARD);
    }

    function test_Constructor_RevertManagerWithoutCode() public {
        vm.expectRevert(TBIProtocolFeeModule.InvalidManager.selector);
        new TBIProtocolFeeModule(RANDO, OWNER);
    }

    ////////////////////////////////
    // Authorization: module owner or Manager owner
    ////////////////////////////////

    function test_Auth_RevertUnauthorized() public {
        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFee(CREATOR, 500);

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.clearFee(CREATOR);

        address[] memory accounts = new address[](1);
        uint64[] memory fees = new uint64[](1);
        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFees(accounts, fees);

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.transferOwnership(RANDO);
    }

    function test_Auth_ManagerOwnerCanSetFees() public {
        vm.prank(MANAGER_OWNER);
        module.setFee(CREATOR, 500);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), 500);
    }

    function test_Auth_ManagerOwnerCanRecoverOwnership() public {
        vm.prank(MANAGER_OWNER);
        module.transferOwnership(RANDO);
        assertEq(module.owner(), RANDO);

        vm.prank(OWNER);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFee(CREATOR, 500);

        vm.prank(RANDO);
        module.setFee(CREATOR, 500);
    }

    function test_Auth_FollowsManagerOwnershipTransfer() public {
        manager.transferOwnership(RANDO);

        vm.prank(MANAGER_OWNER);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFee(CREATOR, 500);

        vm.prank(RANDO);
        module.setFee(CREATOR, 500);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), 500);
    }

    ////////////////////////////////
    // setFee / clearFee
    ////////////////////////////////

    function test_SetFee_Success() public {
        vm.expectEmit(true, false, false, true);
        emit TBIProtocolFeeModule.FeeOverrideSet(CREATOR, 500);
        _setFee(CREATOR, 500);

        (bool set, uint64 feeBps) = _override(CREATOR);
        assertTrue(set);
        assertEq(feeBps, 500);
    }

    function test_SetFee_Update() public {
        _setFee(CREATOR, 500);
        _setFee(CREATOR, 250);
        (, uint64 feeBps) = _override(CREATOR);
        assertEq(feeBps, 250);
    }

    function test_SetFee_ZeroIsAnOverride() public {
        _setFee(CREATOR, 0);
        (bool set, uint64 feeBps) = _override(CREATOR);
        assertTrue(set);
        assertEq(feeBps, 0);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), 0);
    }

    function test_SetFee_MaxFee() public {
        _setFee(CREATOR, 10_000);
        (, uint64 feeBps) = _override(CREATOR);
        assertEq(feeBps, 10_000);
    }

    function test_SetFee_RevertFeeTooHigh() public {
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.FeeTooHigh.selector);
        module.setFee(CREATOR, 10_001);
    }

    function test_ClearFee_Success() public {
        _setFee(CREATOR, 500);
        vm.prank(OWNER);
        vm.expectEmit(true, false, false, false);
        emit TBIProtocolFeeModule.FeeOverrideCleared(CREATOR);
        module.clearFee(CREATOR);

        (bool set, uint64 feeBps) = _override(CREATOR);
        assertFalse(set);
        assertEq(feeBps, 0);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), STANDARD);
    }

    function test_ClearFee_NoOverrideIsNoop() public {
        vm.prank(OWNER);
        module.clearFee(CREATOR);
        (bool set,) = _override(CREATOR);
        assertFalse(set);
    }

    ////////////////////////////////
    // setFees (batch)
    ////////////////////////////////

    function test_SetFees_Batch() public {
        address[] memory accounts = new address[](2);
        accounts[0] = CREATOR;
        accounts[1] = BUDGET;
        uint64[] memory fees = new uint64[](2);
        fees[0] = 500;
        fees[1] = 250;

        vm.prank(OWNER);
        module.setFees(accounts, fees);
        (, uint64 creatorFee) = _override(CREATOR);
        (, uint64 budgetFee) = _override(BUDGET);
        assertEq(creatorFee, 500);
        assertEq(budgetFee, 250);
    }

    function test_SetFees_RevertLengthMismatch() public {
        address[] memory accounts = new address[](2);
        uint64[] memory fees = new uint64[](1);
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.InvalidBatch.selector);
        module.setFees(accounts, fees);
    }

    function test_SetFees_RevertEmpty() public {
        address[] memory accounts = new address[](0);
        uint64[] memory fees = new uint64[](0);
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.InvalidBatch.selector);
        module.setFees(accounts, fees);
    }

    function test_SetFees_RevertTooLarge() public {
        uint256 n = module.MAX_BATCH_SIZE() + 1;
        address[] memory accounts = new address[](n);
        uint64[] memory fees = new uint64[](n);
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.BatchTooLarge.selector);
        module.setFees(accounts, fees);
    }

    function test_SetFees_AtomicOnFeeTooHigh() public {
        address[] memory accounts = new address[](2);
        accounts[0] = CREATOR;
        accounts[1] = BUDGET;
        uint64[] memory fees = new uint64[](2);
        fees[0] = 500;
        fees[1] = 10_001;

        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.FeeTooHigh.selector);
        module.setFees(accounts, fees);
        (bool set,) = _override(CREATOR);
        assertFalse(set, "batch must not partially apply");
    }

    ////////////////////////////////
    // Quoting
    ////////////////////////////////

    function test_Quote_NoOverride_ReturnsStandard() public view {
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, BUDGET)), STANDARD);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), STANDARD);
    }

    function test_Quote_CreatorOverride() public {
        _setFee(CREATOR, 500);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), 500);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, BUDGET)), 500);
    }

    function test_Quote_BudgetOverride() public {
        _setFee(BUDGET, 500);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, BUDGET)), 500);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, address(0))), STANDARD, "direct-funded ignores budget override");
    }

    function test_Quote_CreatorBeatsBudget() public {
        _setFee(CREATOR, 500);
        _setFee(BUDGET, 250);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, BUDGET)), 500);
    }

    function test_Quote_CreatorZeroBeatsBudget() public {
        _setFee(CREATOR, 0);
        _setFee(BUDGET, 250);
        assertEq(module.quoteProtocolFee(_ctx(CREATOR, BUDGET)), 0);
    }
}
