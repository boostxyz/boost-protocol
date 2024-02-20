// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "lib/solady/test/utils/mocks/MockERC20.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {Budget} from "../../src/budgets/Budget.sol";
import {SimpleBudget} from "../../src/budgets/SimpleBudget.sol";

contract SimpleBudgetTest is Test {
    MockERC20 mockERC20;
    MockERC20 otherMockERC20;
    SimpleBudget simpleBudget;

    function setUp() public {
        // Deploy a new MockERC20 contract and mint some tokens
        mockERC20 = new MockERC20("MockERC20", "M20", 18);
        mockERC20.mint(address(this), 100 ether);

        // Deploy a new SimpleBudget contract
        simpleBudget = new SimpleBudget();
    }

    ////////////////////////////////
    // SimpleBudget initial state //
    ////////////////////////////////

    function test_InitialOwner() public {
        // Ensure the budget has the correct owner
        assertEq(simpleBudget.owner(), address(this));
    }

    function test_InitialDistributed() public {
        // Ensure the budget has 0 tokens distributed
        assertEq(simpleBudget.total(address(mockERC20)), 0);
    }

    function test_InitialTotal() public {
        // Ensure the budget has 0 tokens allocated
        assertEq(simpleBudget.total(address(mockERC20)), 0);
    }

    function test_InitialAvailable() public {
        // Ensure the budget has 0 tokens available
        assertEq(simpleBudget.available(address(mockERC20)), 0);
    }

    ///////////////////////////
    // SimpleBudget.allocate //
    ///////////////////////////

    function testAllocate() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(data));

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);
    }

    function testAllocate_NoApproval() public {
        // Allocate 100 tokens to the budget without approval
        bytes memory data = abi.encode(mockERC20, 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        simpleBudget.allocate(LibZip.cdCompress(data));
    }

    function testAllocate_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 101 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 101 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        simpleBudget.allocate(LibZip.cdCompress(data));
    }

    function testAllocate_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // with uncompressed but properly encoded data
        data = abi.encode(mockERC20, 100 ether);
        vm.expectRevert();
        simpleBudget.allocate(data);

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint(100 ether)));
        vm.expectRevert();
        simpleBudget.allocate(data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(100 ether, mockERC20));
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InvalidAllocation.selector,
                address(100 ether),
                uint(uint160(address(mockERC20)))
            )
        );
        simpleBudget.allocate(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(
            LibZip.cdCompress(abi.encode(mockERC20, 100 ether))
        );
        vm.expectRevert();
        simpleBudget.allocate(data);
    }

    ///////////////////////////
    // SimpleBudget.reclaim  //
    ///////////////////////////

    function testReclaim() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(data));
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Reclaim 100 tokens from the budget
        data = abi.encode(mockERC20, 100 ether, address(this));
        simpleBudget.reclaim(LibZip.cdCompress(data));

        // Ensure the budget has 0 tokens
        assertEq(simpleBudget.total(address(mockERC20)), 0);
    }

    function testReclaim_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(data));
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Reclaim 101 tokens from the budget
        data = abi.encode(mockERC20, 101 ether, address(this));
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector,
                address(mockERC20),
                uint(100 ether),
                uint(101 ether)
            )
        );
        simpleBudget.reclaim(LibZip.cdCompress(data));
    }

    function testReclaim_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = abi.encode(mockERC20, 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(data));
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // with uncompressed but properly encoded data
        data = abi.encode(mockERC20, 100 ether, address(this));
        vm.expectRevert();
        simpleBudget.reclaim(data);

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(
            abi.encodePacked(mockERC20, uint(100 ether), address(this))
        );
        vm.expectRevert();
        simpleBudget.reclaim(data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(
            abi.encode(100 ether, mockERC20, address(this))
        );
        vm.expectRevert();
        // abi.encodeWithSelector(Budget.InsufficientFunds.selector, address(mockERC20), uint(100 ether), uint(0))
        simpleBudget.reclaim(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(
            LibZip.cdCompress(abi.encode(mockERC20, 100 ether, address(this)))
        );
        vm.expectRevert();
        simpleBudget.reclaim(data);
    }

    function testReclaim_NotOwner() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        data = LibZip.cdCompress(
            abi.encode(mockERC20, 100 ether, address(this))
        );
        vm.prank(address(1));
        vm.expectRevert();
        simpleBudget.reclaim(data);
    }

    ///////////////////////////
    // SimpleBudget.disburse //
    ///////////////////////////

    function testDisburse() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Disburse 100 tokens from the budget to the recipient
        data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.disburse(address(this), data);

        // Ensure the budget has 0 tokens available
        assertEq(simpleBudget.available(address(mockERC20)), 0);

        // Ensure the budget has 100 tokens distributed
        assertEq(simpleBudget.distributed(address(mockERC20)), 100 ether);
    }

    function testDisburseBatch() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Prepare the disbursement data
        address[] memory addrs = new address[](2);
        bytes[] memory datas = new bytes[](2);

        addrs[0] = address(1);
        datas[0] = LibZip.cdCompress(abi.encode(mockERC20, 25 ether));

        addrs[1] = address(2);
        datas[1] = LibZip.cdCompress(abi.encode(mockERC20, 50 ether));

        // Disburse:
        // 25 tokens to address(1); and
        // 50 tokens to address(2)
        simpleBudget.disburseBatch(addrs, datas);

        // Ensure the budget has 25 tokens left
        assertEq(simpleBudget.available(address(mockERC20)), 25 ether);

        // Ensure the budget has 75 tokens distributed
        assertEq(simpleBudget.distributed(address(mockERC20)), 75 ether);

        // Ensure the budget sent 25 tokens to address(1)
        assertEq(mockERC20.balanceOf(address(1)), 25 ether);

        // Ensure the budget sent 50 tokens to address(2)
        assertEq(mockERC20.balanceOf(address(2)), 50 ether);
    }

    function testDisburse_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Disburse 101 tokens from the budget to the recipient
        data = LibZip.cdCompress(abi.encode(mockERC20, 101 ether));
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector,
                address(mockERC20),
                uint(100 ether),
                uint(101 ether)
            )
        );
        simpleBudget.disburse(address(this), data);
    }

    function testDisburse_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // with uncompressed but properly encoded data
        data = abi.encode(mockERC20, 100 ether);
        vm.expectRevert();
        simpleBudget.disburse(address(this), data);

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint(100 ether)));
        vm.expectRevert();
        simpleBudget.disburse(address(this), data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(100 ether, mockERC20));
        vm.expectRevert();
        // abi.encodeWithSelector(Budget.InsufficientFunds.selector, address(mockERC20), uint(100 ether), uint(0))
        simpleBudget.disburse(address(this), data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(
            LibZip.cdCompress(abi.encode(mockERC20, 100 ether))
        );
        vm.expectRevert();
        simpleBudget.disburse(address(this), data);
    }

    function testDisburse_NotOwner() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        vm.prank(address(1));
        vm.expectRevert();
        simpleBudget.disburse(address(this), data);
    }
}
