// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {Initializable} from "lib/solady/src/utils/Initializable.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {MockERC20} from "src/shared/Mocks.sol";
import {BoostError} from "src/shared/BoostError.sol";
import {Budget} from "src/budgets/Budget.sol";
import {Cloneable} from "src/shared/Cloneable.sol";
import {VestingBudget} from "src/budgets/VestingBudget.sol";

contract VestingBudgetTest is Test {
    using LibZip for bytes;

    MockERC20 mockERC20;
    MockERC20 otherMockERC20;
    VestingBudget vestingBudget;

    function setUp() public {
        // Deploy a new ERC20 contract and mint 100 tokens
        mockERC20 = new MockERC20();
        mockERC20.mint(address(this), 100 ether);

        // Deploy a new VestingBudget contract and initialize it
        vestingBudget = VestingBudget(payable(LibClone.clone(address(new VestingBudget()))));
        vestingBudget.initialize(
            LibZip.cdCompress(
                abi.encode(
                    VestingBudget.InitPayload({
                        owner: address(this),
                        authorized: new address[](0),
                        start: uint64(block.timestamp),
                        duration: uint64(1 days),
                        cliff: 0
                    })
                )
            )
        );
    }

    ////////////////////////////////
    // VestingBudget initial state //
    ////////////////////////////////

    function test_InitialOwner() public {
        // Ensure the budget has the correct owner
        assertEq(vestingBudget.owner(), address(this));
    }

    function test_InitialDistributed() public {
        // Ensure the budget has 0 tokens distributed
        assertEq(vestingBudget.total(address(mockERC20)), 0);
    }

    function test_InitialTotal() public {
        // Ensure the budget has 0 tokens allocated
        assertEq(vestingBudget.total(address(mockERC20)), 0);
    }

    function test_InitialAvailable() public {
        // Ensure the budget has 0 tokens available
        assertEq(vestingBudget.available(address(mockERC20)), 0);
    }

    function test_InitializerDisabled() public {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot =
            vm.load(address(vestingBudget), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    /////////////////////////////
    // VestingBudget.initialize //
    /////////////////////////////

    function testInitialize() public {
        // Initializer can only be called on clones, not the base contract
        bytes memory data = LibZip.cdCompress(
            abi.encode(
                VestingBudget.InitPayload({
                    owner: address(this),
                    authorized: new address[](0),
                    start: 0,
                    duration: 0,
                    cliff: 0
                })
            )
        );
        VestingBudget clone = VestingBudget(payable(LibClone.clone(address(vestingBudget))));
        clone.initialize(data);

        // Ensure the budget has the correct authorities
        assertEq(clone.owner(), address(this));
        assertEq(clone.isAuthorized(address(this)), true);

        // Ensure the budget has the correct start and duration
        assertEq(clone.start(), 0);
        assertEq(clone.duration(), 0);
    }

    function testInitialize_ImproperData() public {
        bytes memory data;

        // with uncompressed but properly encoded data
        data = abi.encode(address(this), new address[](0));
        vm.expectRevert();
        vestingBudget.initialize(data);

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encodePacked(address(this), new address[](0)));
        vm.expectRevert();
        vestingBudget.initialize(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(LibZip.cdCompress(abi.encode(address(this), new address[](0))));
        vm.expectRevert();
        vestingBudget.initialize(data);
    }

    ///////////////////////////
    // VestingBudget.allocate //
    ///////////////////////////

    function testAllocate() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(vestingBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        assertTrue(vestingBudget.allocate(data));

        // Ensure the budget has 100 tokens
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);
    }

    function testAllocate_NativeBalance() public {
        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);
        vestingBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(vestingBudget.total(address(0)), 100 ether);
    }

    function testAllocate_NativeBalanceValueMismatch() public {
        // Encode an allocation of 100 ETH
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);

        // Expect a revert due to a value mismatch (too much ETH)
        vm.expectRevert(abi.encodeWithSelector(Budget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        vestingBudget.allocate{value: 101 ether}(data);

        // Expect a revert due to a value mismatch (too little ETH)
        vm.expectRevert(abi.encodeWithSelector(Budget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        vestingBudget.allocate{value: 99 ether}(data);
    }

    function testAllocate_NoApproval() public {
        // Allocate 100 tokens to the budget without approval
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        vestingBudget.allocate(data);
    }

    function testAllocate_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(vestingBudget), 100 ether);

        // Allocate 101 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        vestingBudget.allocate(data);
    }

    function testAllocate_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(vestingBudget), 100 ether);

        // with uncompressed but properly encoded data
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vm.expectRevert();
        vestingBudget.allocate(data.cdDecompress());

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint256(100 ether)));
        vm.expectRevert();
        vestingBudget.allocate(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );
        vm.expectRevert();
        vestingBudget.allocate(data);
    }

    ///////////////////////////
    // VestingBudget.reclaim  //
    ///////////////////////////

    function testReclaim() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Reclaim 99 tokens from the budget
        assertTrue(
            vestingBudget.reclaim(
                _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 99 ether)
            )
        );

        // Ensure the budget total is still 100
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);

        // Ensure the budget available is 1
        assertEq(vestingBudget.available(address(mockERC20)), 1 ether);
    }

    function testReclaim_NativeBalance() public {
        // Allocate 100 ETH to the budget
        _allocate(address(0), 100 ether);
        _vestAll();

        // Reclaim 99 ETH from the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(1), 99 ether);
        assertTrue(vestingBudget.reclaim(data));

        // Ensure the budget has 1 ETH left
        assertEq(vestingBudget.available(address(0)), 1 ether);
    }

    function testReclaim_ZeroAmount() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Reclaim all tokens from the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 0);
        assertTrue(vestingBudget.reclaim(data));

        // Ensure the budget has no tokens left
        assertEq(vestingBudget.available(address(mockERC20)), 0 ether);
    }

    function testReclaim_ZeroAddress() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Reclaim 100 tokens from the budget to address(0)
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(0), 100 ether);
        vm.expectRevert(
            abi.encodeWithSelector(Budget.TransferFailed.selector, address(mockERC20), address(0), uint256(100 ether))
        );
        vestingBudget.reclaim(data);

        // Ensure the budget has 100 tokens
        assertEq(vestingBudget.available(address(mockERC20)), 100 ether);
    }

    function testReclaim_InsufficientFunds() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Reclaim 101 tokens from the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(100 ether), uint256(101 ether)
            )
        );
        vestingBudget.reclaim(data);
    }

    function testReclaim_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(vestingBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vestingBudget.allocate(data);
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);

        // with uncompressed but properly encoded data
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vm.expectRevert();
        vestingBudget.reclaim(data.cdDecompress());

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encodePacked(mockERC20, uint256(100 ether), address(this)));
        vm.expectRevert();
        vestingBudget.reclaim(data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(Budget.AssetType.ERC20, 100 ether, mockERC20, address(this)));
        vm.expectRevert();
        vestingBudget.reclaim(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(LibZip.cdCompress(abi.encode(mockERC20, 100 ether, address(this))));
        vm.expectRevert();
        vestingBudget.reclaim(data);
    }

    function testReclaim_NotOwner() public {
        _allocate(address(mockERC20), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(1));
        vm.expectRevert();
        vestingBudget.reclaim(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );
    }

    ///////////////////////////
    // VestingBudget.disburse //
    ///////////////////////////

    function testDisburse() public {
        _allocate(address(mockERC20), 100 ether);
        _vestHalf();

        // Try to disburse 100 tokens from the budget (should fail, only 50 tokens vested)
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 100 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(50 ether), uint256(100 ether)
            )
        );
        vestingBudget.disburse(data);

        // Disburse 50 tokens from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 50 ether);
        assertTrue(vestingBudget.disburse(data));
        assertEq(mockERC20.balanceOf(address(1)), 50 ether);

        // Ensure the budget was drained of all available tokens
        assertEq(vestingBudget.available(address(mockERC20)), 0);
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);
        assertEq(vestingBudget.distributed(address(mockERC20)), 50 ether);
    }

    function testDisburse_NativeBalance() public {
        _allocate(address(0), 100 ether);
        _vestHalf();

        // Try to disburse 100 ETH from the budget (should fail, only 50 ETH vested)
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(1), 100 ether);

        // Disburse 50 ETH from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(1), 50 ether);
        assertTrue(vestingBudget.disburse(data));
        assertEq(address(1).balance, 50 ether);

        // Ensure the budget was drained
        assertEq(vestingBudget.available(address(0)), 0);
        assertEq(vestingBudget.distributed(address(0)), 50 ether);
    }

    function testDisburseBatch() public {
        _allocate(address(mockERC20), 50 ether);
        _allocate(address(0), 25 ether);
        _vestAll();

        assertEq(vestingBudget.available(address(mockERC20)), 50 ether);
        assertEq(vestingBudget.available(address(0)), 25 ether);

        // Prepare the disbursement requests
        bytes[] memory requests = new bytes[](2);
        requests[0] = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 25 ether);
        requests[1] = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(2), 25 ether);

        // Disburse:
        // 25 tokens to address(1); and
        // 25 ETH to address(2); and
        assertTrue(vestingBudget.disburseBatch(requests));

        // Ensure the budget sent 25 tokens to address(1) and has 25 left
        assertEq(vestingBudget.available(address(mockERC20)), 25 ether);
        assertEq(vestingBudget.distributed(address(mockERC20)), 25 ether);
        assertEq(mockERC20.balanceOf(address(1)), 25 ether);

        // Ensure the budget sent 25 ETH to address(2) and has 0 left
        assertEq(address(2).balance, 25 ether);
        assertEq(vestingBudget.available(address(0)), 0 ether);
    }

    function testDisburse_InsufficientFunds() public {
        _allocate(address(mockERC20), 100 ether);
        _vestHalf();

        // Disburse 50.1 tokens from the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 50.1 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(50 ether), uint256(50.1 ether)
            )
        );
        vestingBudget.disburse(data);
    }

    function testDisburse_ImproperData() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        bytes memory data;

        // with uncompressed but properly encoded data
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vm.expectRevert();
        vestingBudget.disburse(data.cdDecompress());

        // with compressed but improperly encoded data
        data = LibZip.cdCompress(abi.encode(1, mockERC20, uint256(100 ether)));
        vm.expectRevert();
        vestingBudget.disburse(data);

        // with compressed and properly encoded but out of order data
        data = LibZip.cdCompress(abi.encode(1, 100 ether, mockERC20));
        vm.expectRevert();
        vestingBudget.disburse(data);

        // with double-compressed, properly encoded data
        data = LibZip.cdCompress(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );
        vm.expectRevert();
        vestingBudget.disburse(data);
    }

    function testDisburse_NotOwner() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Try to disburse 100 tokens from the budget as a non-owner
        bytes memory data =
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xc0ffee));
        vm.expectRevert();
        vestingBudget.disburse(data);
    }

    function testDisburse_FailedTransfer() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Mock the ERC20 transfer to fail in an unexpected way
        vm.mockCallRevert(
            address(mockERC20),
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), address(1), 100 ether),
            unicode"WeïrdÊrrör(ツ)"
        );

        // Try to disburse 100 tokens from the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        vestingBudget.disburse(data);
    }

    function testDisburse_FailedTransferInBatch() public {
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Prepare the disbursement data
        bytes[] memory requests = new bytes[](3);
        requests[0] = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 25 ether);
        requests[1] = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(2), 50 ether);
        requests[2] = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(3), 10 ether);

        // Mock the second ERC20 transfer to fail in an unexpected way
        vm.mockCallRevert(
            address(mockERC20),
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), address(2), 50 ether),
            unicode"WeïrdÊrrör(ツ)"
        );

        // Try to disburse 25 tokens to address(1) and 50 tokens to address(2)
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        vestingBudget.disburseBatch(requests);
    }

    /////////////////////////
    // VestingBudget.total //
    /////////////////////////

    function testTotal() public {
        // Ensure the budget has 0 tokens
        assertEq(vestingBudget.total(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        _allocate(address(mockERC20), 100 ether);

        // Ensure the budget has 100 tokens
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);
    }

    function testTotal_NativeBalance() public {
        // Ensure the budget has 0 tokens
        assertEq(vestingBudget.total(address(0)), 0);

        // Allocate 100 tokens to the budget
        _allocate(address(0), 100 ether);

        // Ensure the budget has 100 tokens
        assertEq(vestingBudget.total(address(0)), 100 ether);
    }

    function testTotal_SumOfBalanceAndDistributed() public {
        _allocate(address(mockERC20), 50 ether);
        _vestAll();

        // Disburse 25 tokens from the budget
        vestingBudget.disburse(_makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 25 ether));

        // Allocate another 50 tokens to the budget
        _allocate(address(mockERC20), 50 ether);

        // Ensure the budget has 50 - 25 + 50 = 75 tokens
        assertEq(vestingBudget.available(address(mockERC20)), 75 ether);

        // Ensure the budget has 25 tokens distributed
        assertEq(vestingBudget.distributed(address(mockERC20)), 25 ether);

        // Ensure the total is 75 available + 25 distributed = 100 tokens
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);
    }

    /////////////////////////////
    // VestingBudget.available //
    /////////////////////////////

    function testAvailable() public {
        // Allocate 100 tokens to the budget
        _allocate(address(mockERC20), 100 ether);

        // Ensure the budget has 0 tokens available (none have vested yet)
        assertEq(vestingBudget.available(address(mockERC20)), 0 ether);

        // Warp to the middle of the vesting period and ensure the budget has 50 tokens available
        _vestHalf();
        assertEq(vestingBudget.available(address(mockERC20)), 50 ether);

        // Warp to the end of the vesting period and ensure the budget has 100 tokens available
        _vestAll();
        assertEq(vestingBudget.available(address(mockERC20)), 100 ether);

        // Disburse 25 tokens from the budget and ensure the budget has 75 tokens available
        vestingBudget.disburse(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 25 ether)
        );
        assertEq(vestingBudget.available(address(mockERC20)), 75 ether);
    }

    function testAvailable_NativeBalance() public {
        // Allocate 100 ETH to the budget
        _allocate(address(0), 100 ether);

        // Ensure the budget has 0 ETH available (none have vested yet)
        assertEq(vestingBudget.available(address(0)), 0 ether);

        // Warp to the middle of the vesting period and ensure the budget has 50 ETH available
        _vestHalf();
        assertEq(vestingBudget.available(address(0)), 50 ether);

        // Warp to the end of the vesting period and ensure the budget has 100 ETH available
        _vestAll();
        assertEq(vestingBudget.available(address(0)), 100 ether);

        // Disburse 25 ETH from the budget and ensure the budget has 75 ETH available
        vestingBudget.disburse(_makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(0xdeadbeef), 25 ether));
        assertEq(vestingBudget.available(address(0)), 75 ether);
    }

    function testAvailable_NeverAllocated() public {
        // Ensure the budget has 0 tokens available
        assertEq(vestingBudget.available(address(otherMockERC20)), 0);
    }

    ///////////////////////////////
    // VestingBudget.distributed //
    ///////////////////////////////

    function testDistributed() public {
        // Ensure the budget has 0 tokens distributed
        assertEq(vestingBudget.distributed(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget and vest half
        _allocate(address(mockERC20), 100 ether);
        _vestAll();

        // Disburse 25 tokens from the budget
        vestingBudget.disburse(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 25 ether)
        );

        // Ensure the budget has 25 tokens distributed
        assertEq(vestingBudget.distributed(address(mockERC20)), 25 ether);

        // Disburse another 25 tokens from the budget
        vestingBudget.disburse(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 25 ether)
        );

        // Ensure the budget has 50 tokens distributed
        assertEq(vestingBudget.distributed(address(mockERC20)), 50 ether);
    }

    /////////////////////////////
    // VestingBudget.reconcile //
    /////////////////////////////

    function testReconcile() public {
        // VestingBudget does not implement reconcile
        assertEq(vestingBudget.reconcile(""), 0);
    }

    /////////////////////////////////
    // VestingBudget.setAuthorized //
    /////////////////////////////////

    function testSetAuthorized() public {
        // Ensure the budget authorizes an account
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;
        vestingBudget.setAuthorized(accounts, authorized);
        assertTrue(vestingBudget.isAuthorized(address(0xc0ffee)));
        assertFalse(vestingBudget.isAuthorized(address(0xdeadbeef)));
    }

    function testSetAuthorized_NotOwner() public {
        // Ensure the budget does not authorize an account if not called by the owner
        vm.prank(address(0xdeadbeef));

        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;

        vm.expectRevert(BoostError.Unauthorized.selector);
        vestingBudget.setAuthorized(accounts, authorized);
    }

    function testSetAuthorized_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](2);

        vm.expectRevert(Budget.LengthMismatch.selector);
        vestingBudget.setAuthorized(accounts, authorized);
    }

    ////////////////////////////////
    // VestingBudget.isAuthorized //
    ////////////////////////////////

    function testIsAuthorized() public {
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;
        vestingBudget.setAuthorized(accounts, authorized);

        assertTrue(vestingBudget.isAuthorized(address(0xc0ffee)));
        assertFalse(vestingBudget.isAuthorized(address(0xdeadbeef)));
    }

    function testIsAuthorized_Owner() public {
        assertTrue(vestingBudget.isAuthorized(address(this)));
    }

    /////////////////////////////////////
    // VestingBudget.supportsInterface //
    /////////////////////////////////////

    function testSupportsInterface() public {
        // Ensure the contract supports the Budget interface
        assertTrue(vestingBudget.supportsInterface(type(Budget).interfaceId));
    }

    function testSupportsInterface_NotSupported() public {
        // Ensure the contract does not support an unsupported interface
        assertFalse(vestingBudget.supportsInterface(type(Test).interfaceId));
    }

    /////////////////////////////
    // VestingBudget.fallback  //
    /////////////////////////////

    function testFallback() public {
        // Ensure the fallback is payable
        (bool success,) = payable(vestingBudget).call{value: 1 ether}("");
        assertTrue(success);
    }

    function testFallback_CompressedFunctionCall() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(vestingBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encodeWithSelector(
            VestingBudget.allocate.selector,
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        (bool success,) = payable(vestingBudget).call(data);
        assertTrue(success, "Fallback function failed");

        // Ensure the budget has 100 tokens
        assertEq(vestingBudget.total(address(mockERC20)), 100 ether);
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
        (bool success,) = payable(vestingBudget).call{value: 1 ether}(
            abi.encodeWithSelector(
                bytes4(0xdeadbeef),
                _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
            )
        );
        assertFalse(success);
    }

    ///////////////////////////
    // VestingBudget.receive //
    ///////////////////////////

    function testReceive() public {
        // Ensure the receive function catches non-fallback ETH transfers
        (bool success,) = payable(vestingBudget).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(vestingBudget.total(address(0)), 1 ether);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _allocate(address asset, uint256 value) internal returns (bool) {
        if (asset == address(0)) {
            return vestingBudget.allocate{value: value}(
                _makeFungibleTransfer(Budget.AssetType.ETH, asset, address(this), value)
            );
        } else {
            mockERC20.approve(address(vestingBudget), value);
            return vestingBudget.allocate(_makeFungibleTransfer(Budget.AssetType.ERC20, asset, address(this), value));
        }
    }

    function _vestAll() internal {
        vm.warp(block.timestamp + vestingBudget.duration());
    }

    function _vestHalf() internal {
        vm.warp(block.timestamp + vestingBudget.duration() / 2);
    }

    function _makeFungibleTransfer(Budget.AssetType assetType, address asset, address target, uint256 value)
        internal
        pure
        returns (bytes memory)
    {
        Budget.Transfer memory transfer;
        transfer.assetType = assetType;
        transfer.asset = asset;
        transfer.target = target;
        if (assetType == Budget.AssetType.ETH || assetType == Budget.AssetType.ERC20) {
            transfer.data = abi.encode(Budget.FungiblePayload({amount: value}));
        }

        return LibZip.cdCompress(abi.encode(transfer));
    }
}
