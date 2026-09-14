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

    /// @dev Flat rate: min == max
    function _setFee(address account, uint64 feeBps) internal {
        vm.prank(OWNER);
        module.setFee(account, feeBps, feeBps);
    }

    function _setRange(address account, uint64 minFeeBps, uint64 maxFeeBps) internal {
        vm.prank(OWNER);
        module.setFee(account, minFeeBps, maxFeeBps);
    }

    function _override(address account) internal view returns (bool set, uint64 minFeeBps, uint64 maxFeeBps) {
        (set, minFeeBps, maxFeeBps) = module.feeOverrides(account);
    }

    function _quote(address creator, address budget) internal view returns (uint64 minFeeBps, uint64 maxFeeBps) {
        return module.quoteProtocolFeeRange(_ctx(creator, budget));
    }

    function _assertRange(address creator, address budget, uint64 expectedMin, uint64 expectedMax) internal view {
        (uint64 minFeeBps, uint64 maxFeeBps) = _quote(creator, budget);
        assertEq(minFeeBps, expectedMin, "min");
        assertEq(maxFeeBps, expectedMax, "max");
    }

    function _assignments(uint256 n) internal pure returns (TBIProtocolFeeModule.FeeAssignment[] memory a) {
        a = new TBIProtocolFeeModule.FeeAssignment[](n);
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
        module.setFee(CREATOR, 500, 500);

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.clearFee(CREATOR);

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFees(_assignments(1));

        vm.prank(RANDO);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.transferOwnership(RANDO);
    }

    function test_Auth_ManagerOwnerCanSetFees() public {
        vm.prank(MANAGER_OWNER);
        module.setFee(CREATOR, 100, 500);
        _assertRange(CREATOR, address(0), 100, 500);
    }

    function test_Auth_ManagerOwnerCanRecoverOwnership() public {
        vm.prank(MANAGER_OWNER);
        module.transferOwnership(RANDO);
        assertEq(module.owner(), RANDO);

        vm.prank(OWNER);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFee(CREATOR, 500, 500);

        vm.prank(RANDO);
        module.setFee(CREATOR, 500, 500);
    }

    function test_Auth_FollowsManagerOwnershipTransfer() public {
        manager.transferOwnership(RANDO);

        vm.prank(MANAGER_OWNER);
        vm.expectRevert(Ownable.Unauthorized.selector);
        module.setFee(CREATOR, 500, 500);

        vm.prank(RANDO);
        module.setFee(CREATOR, 500, 500);
        _assertRange(CREATOR, address(0), 500, 500);
    }

    ////////////////////////////////
    // setFee / clearFee
    ////////////////////////////////

    function test_SetFee_FlatRate() public {
        vm.expectEmit(true, false, false, true);
        emit TBIProtocolFeeModule.FeeOverrideSet(CREATOR, 500, 500);
        _setFee(CREATOR, 500);

        (bool set, uint64 minFeeBps, uint64 maxFeeBps) = _override(CREATOR);
        assertTrue(set);
        assertEq(minFeeBps, 500);
        assertEq(maxFeeBps, 500);
    }

    function test_SetFee_Range() public {
        vm.expectEmit(true, false, false, true);
        emit TBIProtocolFeeModule.FeeOverrideSet(CREATOR, 100, 1000);
        _setRange(CREATOR, 100, 1000);

        (bool set, uint64 minFeeBps, uint64 maxFeeBps) = _override(CREATOR);
        assertTrue(set);
        assertEq(minFeeBps, 100);
        assertEq(maxFeeBps, 1000);
    }

    function test_SetFee_Update() public {
        _setRange(CREATOR, 100, 1000);
        _setRange(CREATOR, 250, 500);
        (, uint64 minFeeBps, uint64 maxFeeBps) = _override(CREATOR);
        assertEq(minFeeBps, 250);
        assertEq(maxFeeBps, 500);
    }

    function test_SetFee_ZeroIsAnOverride() public {
        _setFee(CREATOR, 0);
        (bool set, uint64 minFeeBps, uint64 maxFeeBps) = _override(CREATOR);
        assertTrue(set);
        assertEq(minFeeBps, 0);
        assertEq(maxFeeBps, 0);
        _assertRange(CREATOR, address(0), 0, 0);
    }

    function test_SetFee_FullRange() public {
        _setRange(CREATOR, 0, 10_000);
        _assertRange(CREATOR, address(0), 0, 10_000);
    }

    function test_SetFee_RevertMaxTooHigh() public {
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.FeeTooHigh.selector);
        module.setFee(CREATOR, 0, 10_001);
    }

    function test_SetFee_RevertMinAboveMax() public {
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.InvalidFeeRange.selector);
        module.setFee(CREATOR, 501, 500);
    }

    function test_SetFee_RevertMinTooHighEvenWithMaxAtCap() public {
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.FeeTooHigh.selector);
        module.setFee(CREATOR, 10_001, 10_001);
    }

    function test_ClearFee_Success() public {
        _setRange(CREATOR, 100, 500);
        vm.prank(OWNER);
        vm.expectEmit(true, false, false, false);
        emit TBIProtocolFeeModule.FeeOverrideCleared(CREATOR);
        module.clearFee(CREATOR);

        (bool set, uint64 minFeeBps, uint64 maxFeeBps) = _override(CREATOR);
        assertFalse(set);
        assertEq(minFeeBps, 0);
        assertEq(maxFeeBps, 0);
        _assertRange(CREATOR, address(0), STANDARD, STANDARD);
    }

    function test_ClearFee_NoOverrideIsNoop() public {
        vm.prank(OWNER);
        module.clearFee(CREATOR);
        (bool set,,) = _override(CREATOR);
        assertFalse(set);
    }

    ////////////////////////////////
    // setFees (batch)
    ////////////////////////////////

    function test_SetFees_Batch() public {
        TBIProtocolFeeModule.FeeAssignment[] memory a = _assignments(2);
        a[0] = TBIProtocolFeeModule.FeeAssignment({account: CREATOR, minFeeBps: 100, maxFeeBps: 1000});
        a[1] = TBIProtocolFeeModule.FeeAssignment({account: BUDGET, minFeeBps: 250, maxFeeBps: 250});

        vm.prank(OWNER);
        module.setFees(a);
        _assertRange(CREATOR, address(0), 100, 1000);
        _assertRange(RANDO, BUDGET, 250, 250);
    }

    function test_SetFees_RevertEmpty() public {
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.InvalidBatch.selector);
        module.setFees(_assignments(0));
    }

    function test_SetFees_RevertTooLarge() public {
        TBIProtocolFeeModule.FeeAssignment[] memory a = _assignments(module.MAX_BATCH_SIZE() + 1);
        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.BatchTooLarge.selector);
        module.setFees(a);
    }

    function test_SetFees_AtomicOnInvalidEntry() public {
        TBIProtocolFeeModule.FeeAssignment[] memory a = _assignments(2);
        a[0] = TBIProtocolFeeModule.FeeAssignment({account: CREATOR, minFeeBps: 100, maxFeeBps: 1000});
        a[1] = TBIProtocolFeeModule.FeeAssignment({account: BUDGET, minFeeBps: 600, maxFeeBps: 500});

        vm.prank(OWNER);
        vm.expectRevert(TBIProtocolFeeModule.InvalidFeeRange.selector);
        module.setFees(a);
        (bool set,,) = _override(CREATOR);
        assertFalse(set, "batch must not partially apply");
    }

    ////////////////////////////////
    // Quoting
    ////////////////////////////////

    function test_Quote_NoOverride_ReturnsStandard() public view {
        _assertRange(CREATOR, BUDGET, STANDARD, STANDARD);
        _assertRange(CREATOR, address(0), STANDARD, STANDARD);
    }

    function test_Quote_CreatorOverride() public {
        _setRange(CREATOR, 100, 500);
        _assertRange(CREATOR, address(0), 100, 500);
        _assertRange(CREATOR, BUDGET, 100, 500);
    }

    function test_Quote_BudgetOverride() public {
        _setRange(BUDGET, 100, 500);
        _assertRange(CREATOR, BUDGET, 100, 500);
        _assertRange(CREATOR, address(0), STANDARD, STANDARD);
    }

    function test_Quote_CreatorBeatsBudget() public {
        _setRange(CREATOR, 100, 500);
        _setFee(BUDGET, 250);
        _assertRange(CREATOR, BUDGET, 100, 500);
    }

    function test_Quote_CreatorZeroBeatsBudget() public {
        _setFee(CREATOR, 0);
        _setFee(BUDGET, 250);
        _assertRange(CREATOR, BUDGET, 0, 0);
    }
}
