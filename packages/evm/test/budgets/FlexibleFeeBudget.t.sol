// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibClone} from "@solady/utils/LibClone.sol";
import {Test} from "lib/forge-std/src/Test.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {FlexibleFeeBudget} from "contracts/budgets/FlexibleFeeBudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

contract FlexibleFeeBudgetTest is Test {
    FlexibleFeeBudget public budget;
    MockERC20 public token;

    event ManagementFeeSet(uint256 newFee);

    function setUp() public {
        // Deploy a new ERC20 contract and mint 100 tokens
        token = new MockERC20();
        token.mint(address(this), 100 ether);

        // Deploy and initialize budget
        budget = FlexibleFeeBudget(payable(LibClone.clone(address(new FlexibleFeeBudget()))));
        budget.initialize(
            abi.encode(
                ManagedBudget.InitPayload({owner: address(this), authorized: new address[](0), roles: new uint256[](0)})
            )
        );
    }

    function testInitialState() public view {
        assertEq(budget.managementFee(), 0, "Initial management fee should be 0");
        assertEq(budget.reservedFunds(), 0, "Initial reserved funds should be 0");
    }

    ///////////////////////////////////////////
    // ManagedBudgetWithFees.setManagementFee //
    ////////////////////////////////////////////

    function testSetManagementFee() public {
        // Simulate a transaction from the owner of the budget contract
        vm.prank(budget.owner());

        // Expect the ManagementFeeSet event to be emitted
        vm.expectEmit();
        emit ManagementFeeSet(500);

        // Call the setManagementFee function with a value of 5%
        budget.setManagementFee(500);

        // Assert that the managementFee has been correctly set to 5%
        assertEq(budget.managementFee(), 500);
    }

    function testSetManagementFee_ExceedsMax() public {
        // Simulate a transaction from the owner of the budget contract
        vm.prank(budget.owner());

        // Set an initial valid management fee (5%)
        budget.setManagementFee(500);

        // Attempt to set a management fee that exceeds 100%
        vm.expectRevert("Fee cannot exceed 100%");
        budget.setManagementFee(10001);

        // Assert that the management fee remains unchanged at 5%
        assertEq(budget.managementFee(), 500);
    }

    function testSetManagementFee_Unauthorized() public {
        // Simulate a transaction from a non-owner address
        address nonOwner = makeAddr("nonOwner");
        vm.prank(nonOwner);

        // Call the setManagementFee function with a value of 5%
        vm.expectRevert(BoostError.Unauthorized.selector);
        budget.setManagementFee(500);
    }

    function testSetManagementFee_RevertIfTooHigh() public {
        // Test setting fee > 100%
        vm.expectRevert("Fee cannot exceed 100%");
        budget.setManagementFee(10001);
    }

    /////////////////////////////////////
    // ManagedBudgetWithFees.available //
    /////////////////////////////////////

    function testAvailable_WithNoFees() public {
        // Allocate tokens to budget
        token.approve(address(budget), 100 ether);
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(token), address(this), 100 ether);
        budget.allocate(data);

        // Check available balance with no fees set
        assertEq(budget.available(address(token)), 100 ether, "Available should be full amount when no fees");
    }

    // Helper function to create transfer data
    function _makeFungibleTransfer(ABudget.AssetType assetType, address asset, address target, uint256 value)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer;
        transfer.assetType = assetType;
        transfer.asset = asset;
        transfer.target = target;
        transfer.data = abi.encode(ABudget.FungiblePayload({amount: value}));
        return abi.encode(transfer);
    }
}
