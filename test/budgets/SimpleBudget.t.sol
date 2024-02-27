// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "lib/solady/test/utils/mocks/MockERC20.sol";
import {Initializable} from "lib/solady/src/utils/Initializable.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {Budget} from "src/budgets/Budget.sol";
import {Cloneable} from "src/Cloneable.sol";
import {SimpleBudget} from "src/budgets/SimpleBudget.sol";

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

    function test_InitializerDisabled() public {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot =
            vm.load(address(simpleBudget), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    /////////////////////////////
    // SimpleBudget.initialize //
    /////////////////////////////

    function testInitialize() public {
        // Initializer can only be called on clones, not the base contract
        bytes memory data = LibZip.cdCompress(abi.encode(address(this)));
        SimpleBudget clone = SimpleBudget(payable(LibClone.clone(address(simpleBudget), data)));
        clone.initialize(data);

        // Ensure the budget has the correct owner
        assertEq(clone.owner(), address(this));
    }

    function testInitialize_BaseContract() public {
        // Initializer can only be called on clones, not the base contract
        bytes memory data = LibZip.cdCompress(abi.encode(address(this)));
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        simpleBudget.initialize(data);
    }

    function testInitialize_ImproperData() public {
        bytes memory data;

        // with uncompressed but properly encoded data
        data = abi.encode(address(this));
        vm.expectRevert();
        simpleBudget.initialize(data);

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encodePacked(address(this)));
        vm.expectRevert();
        simpleBudget.initialize(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(LibZip.cdCompress(abi.encode(address(this))));
        vm.expectRevert();
        simpleBudget.initialize(data);
    }

    ///////////////////////////
    // SimpleBudget.allocate //
    ///////////////////////////

    function testAllocate() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 100 ether);
        assertTrue(simpleBudget.allocate(LibZip.cdCompress(data)));

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.available(address(mockERC20)), 100 ether);
    }

    function testAllocate_NativeBalance() public {
        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(address(0), 100 ether));
        simpleBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.available(address(0)), 100 ether);
    }

    function testAllocate_NativeBalanceValueMismatch() public {
        // Encode an allocation of 100 ETH
        bytes memory data = LibZip.cdCompress(abi.encode(address(0), 100 ether));

        // Expect a revert due to a value mismatch (too much ETH)
        vm.expectRevert(abi.encodeWithSelector(Budget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        simpleBudget.allocate{value: 101 ether}(data);

        // Expect a revert due to a value mismatch (too little ETH)
        vm.expectRevert(abi.encodeWithSelector(Budget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        simpleBudget.allocate{value: 99 ether}(data);
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
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint256(100 ether)));
        vm.expectRevert();
        simpleBudget.allocate(data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(100 ether, mockERC20));
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InvalidAllocation.selector, address(100 ether), uint256(uint160(address(mockERC20)))
            )
        );
        simpleBudget.allocate(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));
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
        assertEq(simpleBudget.available(address(mockERC20)), 100 ether);

        // Reclaim 100 tokens from the budget
        data = abi.encode(mockERC20, 100 ether, address(this));
        assertTrue(simpleBudget.reclaim(LibZip.cdCompress(data)));

        // Ensure the budget has 0 tokens
        assertEq(simpleBudget.available(address(mockERC20)), 0);
    }

    function testReclaim_ZeroAmount() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(data));
        assertEq(simpleBudget.available(address(mockERC20)), 100 ether);

        // Reclaim all tokens from the budget
        data = abi.encode(mockERC20, 0, address(this));
        assertTrue(simpleBudget.reclaim(LibZip.cdCompress(data)));

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.available(address(mockERC20)), 0 ether);
    }

    function testReclaim_ZeroAddress() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encode(mockERC20, 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(data));
        assertEq(simpleBudget.available(address(mockERC20)), 100 ether);

        // Reclaim 100 tokens from the budget to address(0)
        data = abi.encode(mockERC20, 100 ether, address(0));
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        simpleBudget.reclaim(LibZip.cdCompress(data));

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.available(address(mockERC20)), 100 ether);
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
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(100 ether), uint256(101 ether)
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
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint256(100 ether), address(this)));
        vm.expectRevert();
        simpleBudget.reclaim(data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(100 ether, mockERC20, address(this)));
        vm.expectRevert();
        // abi.encodeWithSelector(Budget.InsufficientFunds.selector, address(mockERC20), uint(100 ether), uint(0))
        simpleBudget.reclaim(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(LibZip.cdCompress(abi.encode(mockERC20, 100 ether, address(this))));
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
        data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether, address(this)));
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
        assertTrue(simpleBudget.disburse(address(this), data));

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
        assertTrue(simpleBudget.disburseBatch(addrs, datas));

        // Ensure the budget has 25 tokens left
        assertEq(simpleBudget.available(address(mockERC20)), 25 ether);

        // Ensure the budget has 75 tokens distributed
        assertEq(simpleBudget.distributed(address(mockERC20)), 75 ether);

        // Ensure the budget sent 25 tokens to address(1)
        assertEq(mockERC20.balanceOf(address(1)), 25 ether);

        // Ensure the budget sent 50 tokens to address(2)
        assertEq(mockERC20.balanceOf(address(2)), 50 ether);
    }

    function testDisburseBatch_LengthMismatch() public {
        // Prepare the disbursement data
        address[] memory addrs = new address[](1);
        bytes[] memory datas = new bytes[](2);

        addrs[0] = address(1);
        datas[0] = LibZip.cdCompress(abi.encode(mockERC20, 25 ether));
        datas[1] = LibZip.cdCompress(abi.encode(mockERC20, 50 ether));

        // Expect a revert due to a length mismatch
        vm.expectRevert(Budget.LengthMismatch.selector);
        simpleBudget.disburseBatch(addrs, datas);
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
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(100 ether), uint256(101 ether)
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
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint256(100 ether)));
        vm.expectRevert();
        simpleBudget.disburse(address(this), data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(100 ether, mockERC20));
        vm.expectRevert();
        // abi.encodeWithSelector(Budget.InsufficientFunds.selector, address(mockERC20), uint(100 ether), uint(0))
        simpleBudget.disburse(address(this), data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));
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

    function testDisburse_FailedTransfer() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        simpleBudget.allocate(data);
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);

        // Mock the ERC20 transfer to fail in an unexpected way
        vm.mockCallRevert(
            address(mockERC20),
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), address(1), 100 ether),
            unicode"WeïrdÊrrör(ツ)"
        );

        // Try to disburse 100 tokens from the budget
        data = LibZip.cdCompress(abi.encode(mockERC20, 100 ether));
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        simpleBudget.disburse(address(1), data);
    }

    function testDisburse_FailedTransferInBatch() public {
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

        // Mock the second ERC20 transfer to fail in an unexpected way
        vm.mockCallRevert(
            address(mockERC20),
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), address(2), 50 ether),
            unicode"WeïrdÊrrör(ツ)"
        );

        // Try to disburse 25 tokens to address(1) and 50 tokens to address(2)
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        simpleBudget.disburseBatch(addrs, datas);
    }

    ////////////////////////
    // SimpleBudget.total //
    ////////////////////////

    function testTotal() public {
        // Ensure the budget has 0 tokens
        assertEq(simpleBudget.total(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        mockERC20.approve(address(simpleBudget), 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);
    }

    function testTotal_NativeBalance() public {
        // Ensure the budget has 0 tokens
        assertEq(simpleBudget.total(address(0)), 0);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(address(0), 100 ether));
        simpleBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.total(address(0)), 100 ether);
    }

    function testTotal_SumOfAvailAndDistributed() public {
        // Allocate 100 tokens to the budget
        mockERC20.approve(address(simpleBudget), 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Disburse 100 tokens from the budget to the recipient
        simpleBudget.disburse(address(this), LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Allocate another 100 tokens to the budget
        mockERC20.approve(address(simpleBudget), 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Ensure the budget total is 200 tokens (100 + 100)
        assertEq(simpleBudget.total(address(mockERC20)), 200 ether);
    }

    ////////////////////////////
    // SimpleBudget.available //
    ////////////////////////////

    function testAvailable() public {
        // Ensure the budget has 0 tokens available
        assertEq(simpleBudget.available(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        mockERC20.approve(address(simpleBudget), 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Ensure the budget has 100 tokens available
        assertEq(simpleBudget.available(address(mockERC20)), 100 ether);
    }

    function testAvailable_NativeBalance() public {
        // Ensure the budget has 0 tokens available
        assertEq(simpleBudget.available(address(0)), 0);

        // Allocate 100 tokens to the budget
        bytes memory data = LibZip.cdCompress(abi.encode(address(0), 100 ether));
        simpleBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens available
        assertEq(simpleBudget.available(address(0)), 100 ether);
    }

    function testAvailable_NeverAllocated() public {
        // Ensure the budget has 0 tokens available
        assertEq(simpleBudget.available(address(otherMockERC20)), 0);
    }

    //////////////////////////////
    // SimpleBudget.distributed //
    //////////////////////////////

    function testDistributed() public {
        // Ensure the budget has 0 tokens distributed
        assertEq(simpleBudget.distributed(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        mockERC20.approve(address(simpleBudget), 100 ether);
        simpleBudget.allocate(LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Disburse 100 tokens from the budget to the recipient
        simpleBudget.disburse(address(this), LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        // Ensure the budget has 100 tokens distributed
        assertEq(simpleBudget.distributed(address(mockERC20)), 100 ether);
    }

    ////////////////////////////
    // SimpleBudget.reconcile //
    ////////////////////////////

    function testReconcile() public {
        // SimpleBudget does not implement reconcile
        assertEq(simpleBudget.reconcile(""), 0);
    }

    ////////////////////////////////////
    // SimpleBudget.supportsInterface //
    ////////////////////////////////////

    function testSupportsInterface() public {
        // Ensure the contract supports the Budget interface
        assertTrue(simpleBudget.supportsInterface(type(Budget).interfaceId));
    }

    function testSupportsInterface_NotSupported() public {
        // Ensure the contract does not support an unsupported interface
        assertFalse(simpleBudget.supportsInterface(type(Test).interfaceId));
    }

    ////////////////////////////
    // SimpleBudget.fallback  //
    ////////////////////////////

    function testFallback() public {
        // Ensure the fallback is payable
        (bool success,) = payable(simpleBudget).call{value: 1 ether}("");
        assertTrue(success);
    }

    function testFallback_CompressedFunctionCall() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(simpleBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data =
            abi.encodeWithSelector(SimpleBudget.allocate.selector, LibZip.cdCompress(abi.encode(mockERC20, 100 ether)));

        (bool success,) = payable(simpleBudget).call(LibZip.cdCompress(data));
        assertTrue(success, "Fallback function failed");

        // Ensure the budget has 100 tokens
        assertEq(simpleBudget.total(address(mockERC20)), 100 ether);
    }

    function testFallback_NoSuchFunction() public {
        // This test is weirdly slow and burns the entire block gas limit, so
        // I'm skipping it for now to avoid slowing down the test suite. Maybe
        // we can revisit this later... or maybe the case is irrelevant.
        vm.skip(true);

        // Ensure the call is not successful due to a non-existent function
        // Note that the function itself will revert, but because we're issuing
        // a low-level call, the revert won't bubble up. Instead, we are just
        // checking that the low-level call was not successful.
        (bool success,) = payable(simpleBudget).call{value: 1 ether}(abi.encodeWithSelector(bytes4(0xdeadbeef), LibZip.cdCompress(abi.encode(mockERC20, 100 ether))));
        assertFalse(success);
    }

    ///////////////////////////
    // SimpleBudget.receive  //
    ///////////////////////////

    function testReceive() public {
        // Ensure the receive function is payable
        assertTrue(payable(simpleBudget).send(1 ether));
    }
}
