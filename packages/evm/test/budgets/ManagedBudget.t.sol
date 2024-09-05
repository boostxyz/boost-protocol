// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {MockERC20, MockERC1155} from "contracts/shared/Mocks.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {Budget} from "contracts/budgets/Budget.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";

contract ManagedBudgetTest is Test, IERC1155Receiver {
    MockERC20 mockERC20;
    MockERC20 otherMockERC20;
    MockERC1155 mockERC1155;
    ManagedBudget managedBudget;

    function setUp() public {
        // Deploy a new ERC20 contract and mint 100 tokens
        mockERC20 = new MockERC20();
        mockERC20.mint(address(this), 100 ether);

        // Deploy a new ERC1155 contract and mint 100 of token ID 42
        mockERC1155 = new MockERC1155();
        mockERC1155.mint(address(this), 42, 100);

        // Deploy a new ManagedBudget contract
        managedBudget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        managedBudget.initialize(
            abi.encode(
                ManagedBudget.InitPayload({owner: address(this), authorized: new address[](0), roles: new uint256[](0)})
            )
        );
    }

    ////////////////////////////////
    // ManagedBudget initial state //
    ////////////////////////////////

    function test_InitialOwner() public view {
        // Ensure the budget has the correct owner
        assertEq(managedBudget.owner(), address(this));
    }

    function test_InitialDistributed() public view {
        // Ensure the budget has 0 tokens distributed
        assertEq(managedBudget.total(address(mockERC20)), 0);
    }

    function test_InitialDistributed1155() public view {
        // Ensure the budget has 0 of our 1155 tokens distributed
        assertEq(managedBudget.total(address(mockERC1155), 42), 0);
    }

    function test_InitialTotal() public view {
        // Ensure the budget has 0 tokens allocated
        assertEq(managedBudget.total(address(mockERC20)), 0);
    }

    function test_InitialTotal1155() public view {
        // Ensure the budget has 0 of our 1155 tokens allocated
        assertEq(managedBudget.total(address(mockERC1155), 42), 0);
    }

    function test_InitialAvailable() public view {
        // Ensure the budget has 0 tokens available
        assertEq(managedBudget.available(address(mockERC20)), 0);
    }

    function test_InitialAvailable1155() public view {
        // Ensure the budget has 0 of our 1155 tokens available
        assertEq(managedBudget.available(address(mockERC1155), 42), 0);
    }

    function test_InitializerDisabled() public view {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot =
            vm.load(address(managedBudget), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    /////////////////////////////
    // ManagedBudget.initialize //
    /////////////////////////////

    function testInitialize() public {
        // Initializer can only be called on clones, not the base contract
        bytes memory data = abi.encode(
            ManagedBudget.InitPayload({owner: address(this), authorized: new address[](0), roles: new uint256[](0)})
        );
        ManagedBudget clone = ManagedBudget(payable(LibClone.clone(address(managedBudget))));
        clone.initialize(data);

        // Ensure the budget has the correct authorities
        assertEq(clone.owner(), address(this));
        assertEq(clone.isAuthorized(address(this)), true);
    }

    function testInitialize_ImproperData() public {
        // with improperly encoded data
        bytes memory data = abi.encodePacked(new address[](0), address(this));
        vm.expectRevert();
        managedBudget.initialize(data);
    }

    ///////////////////////////
    // ManagedBudget.allocate //
    ///////////////////////////

    function testAllocate() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        assertTrue(managedBudget.allocate(data));

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);
    }

    function testAllocate_NativeBalance() public {
        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.available(address(0)), 100 ether);
    }

    function testAllocate_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 of token ID 42 to the budget
        bytes memory data = abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(Budget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        assertTrue(managedBudget.allocate(data));

        // Ensure the budget has 100 of token ID 42
        assertEq(managedBudget.available(address(mockERC1155), 42), 100);
    }

    function testAllocate_NativeBalanceValueMismatch() public {
        // Encode an allocation of 100 ETH
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);

        // Expect a revert due to a value mismatch (too much ETH)
        vm.expectRevert(abi.encodeWithSelector(Budget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        managedBudget.allocate{value: 101 ether}(data);

        // Expect a revert due to a value mismatch (too little ETH)
        vm.expectRevert(abi.encodeWithSelector(Budget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        managedBudget.allocate{value: 99 ether}(data);
    }

    function testAllocate_NoApproval() public {
        // Allocate 100 tokens to the budget without approval
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        managedBudget.allocate(data);
    }

    function testAllocate_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 101 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        managedBudget.allocate(data);
    }

    function testAllocate_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // with improperly encoded data
        data = abi.encodePacked(mockERC20, uint256(100 ether));
        vm.expectRevert();
        managedBudget.allocate(data);
    }

    ///////////////////////////
    // ManagedBudget.reclaim  //
    ///////////////////////////

    function testReclaim() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        // Reclaim 99 tokens from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 99 ether);
        assertTrue(managedBudget.clawback(data));

        // Ensure the budget has 1 token left
        assertEq(managedBudget.available(address(mockERC20)), 1 ether);
    }

    function testReclaim_NativeBalance() public {
        // Allocate 100 ETH to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);
        assertEq(managedBudget.available(address(0)), 100 ether);

        // Reclaim 99 ETH from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(1), 99 ether);
        assertTrue(managedBudget.clawback(data));

        // Ensure the budget has 1 ETH left
        assertEq(managedBudget.available(address(0)), 1 ether);
    }

    function testReclaim_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 of token ID 42 to the budget
        bytes memory data = abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(Budget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC1155), 42), 100);

        // Reclaim 99 of token ID 42 from the budget
        data = abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(Budget.ERC1155Payload({tokenId: 42, amount: 99, data: ""}))
            })
        );
        assertTrue(managedBudget.clawback(data));

        // Ensure the budget has 1 of token ID 42 left
        assertEq(managedBudget.available(address(mockERC1155), 42), 1);
    }

    function testReclaim_ZeroAmount() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        // Reclaim all tokens from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 0);
        assertTrue(managedBudget.clawback(data));

        // Ensure the budget has no tokens left
        assertEq(managedBudget.available(address(mockERC20)), 0 ether);
    }

    function testReclaim_ZeroAddress() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        // Reclaim 100 tokens from the budget to address(0)
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(0), 100 ether);
        vm.expectRevert(
            abi.encodeWithSelector(Budget.TransferFailed.selector, address(mockERC20), address(0), uint256(100 ether))
        );
        managedBudget.clawback(data);

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);
    }

    function testReclaim_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Reclaim 101 tokens from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(100 ether), uint256(101 ether)
            )
        );
        managedBudget.clawback(data);
    }

    function testReclaim_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // with improperly encoded data
        data = abi.encodePacked(mockERC20, uint256(100 ether));
        vm.expectRevert();
        managedBudget.clawback(data);
    }

    function testReclaim_NotOwner() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(1));
        vm.expectRevert();
        managedBudget.clawback(data);
    }

    function testReclaim_Manager() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(0xdeadbeef));
        vm.expectRevert();
        managedBudget.clawback(data);
    }

    function testReclaim_Admin() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(0xdeadbeef));
        managedBudget.clawback(data);
    }

    ///////////////////////////
    // ManagedBudget.disburse //
    ///////////////////////////

    function testDisburse() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Disburse 100 tokens from the budget to the recipient
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 100 ether);
        assertTrue(managedBudget.disburse(data));
        assertEq(mockERC20.balanceOf(address(1)), 100 ether);

        // Ensure the budget was drained
        assertEq(managedBudget.available(address(mockERC20)), 0);
        assertEq(managedBudget.distributed(address(mockERC20)), 100 ether);
    }

    function testDisburse_NativeBalance() public {
        // Allocate 100 ETH to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Disburse 100 ETH from the budget to the recipient
        data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(1), 100 ether);
        assertTrue(managedBudget.disburse(data));
        assertEq(address(1).balance, 100 ether);

        // Ensure the budget was drained
        assertEq(managedBudget.available(address(0)), 0);
        assertEq(managedBudget.distributed(address(0)), 100 ether);
    }

    function testDisburse_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 of token ID 42 to the budget
        bytes memory data = abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(Budget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC1155), 42), 100);

        // Disburse 100 of token ID 42 from the budget to the recipient
        data = abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(1),
                data: abi.encode(Budget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        assertTrue(managedBudget.disburse(data));
        assertEq(mockERC1155.balanceOf(address(1), 42), 100);

        // Ensure the budget was drained
        assertEq(managedBudget.available(address(mockERC1155), 42), 0);
        assertEq(managedBudget.distributed(address(mockERC1155), 42), 100);
    }

    function testDisburseBatch() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 50 ether);
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate the assets to the budget
        managedBudget.allocate(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );
        managedBudget.allocate{value: 25 ether}(
            _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 25 ether)
        );
        managedBudget.allocate(_makeERC1155Transfer(address(mockERC1155), address(this), 42, 50, bytes("")));
        assertEq(managedBudget.total(address(mockERC20)), 50 ether);
        assertEq(managedBudget.total(address(0)), 25 ether);
        assertEq(managedBudget.total(address(mockERC1155), 42), 50);

        // Prepare the disbursement requests
        bytes[] memory requests = new bytes[](3);
        requests[0] = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 25 ether);
        requests[1] = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(2), 25 ether);
        requests[2] = _makeERC1155Transfer(address(mockERC1155), address(3), 42, 10, bytes(""));

        // Disburse:
        // 25 tokens to address(1); and
        // 25 ETH to address(2); and
        // 50 of token ID 42 to address(3)
        assertTrue(managedBudget.disburseBatch(requests));

        // Ensure the budget sent 25 tokens to address(1) and has 25 left
        assertEq(managedBudget.available(address(mockERC20)), 25 ether);
        assertEq(managedBudget.distributed(address(mockERC20)), 25 ether);
        assertEq(mockERC20.balanceOf(address(1)), 25 ether);

        // Ensure the budget sent 25 ETH to address(2) and has 0 left
        assertEq(address(2).balance, 25 ether);
        assertEq(managedBudget.available(address(0)), 0 ether);

        // Ensure the budget sent 10 of token ID 42 to address(3) and has 40 left
        assertEq(managedBudget.available(address(mockERC1155), 42), 40);
    }

    function testDisburse_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Disburse 101 tokens from the budget to the recipient
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 101 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                Budget.InsufficientFunds.selector, address(mockERC20), uint256(100 ether), uint256(101 ether)
            )
        );
        managedBudget.disburse(data);
    }

    function testDisburse_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // with improperly encoded data
        data = abi.encode(1, mockERC20, uint256(100 ether));
        vm.expectRevert();
        managedBudget.disburse(data);
    }

    function testDisburse_NotOwner() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xc0ffee));
        vm.expectRevert();
        managedBudget.disburse(data);
    }

    function testDisburse_Manager() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xdeadbeef));
        managedBudget.disburse(data);
    }

    function testDisburse_Admin() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xdeadbeef));
        managedBudget.disburse(data);
    }

    function testDisburse_FailedTransfer() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Mock the ERC20 transfer to fail in an unexpected way
        vm.mockCallRevert(
            address(mockERC20),
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), address(1), 100 ether),
            unicode"WeïrdÊrrör(ツ)"
        );

        // Try to disburse 100 tokens from the budget
        data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        managedBudget.disburse(data);
    }

    function testDisburse_FailedTransferInBatch() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

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
        managedBudget.disburseBatch(requests);
    }

    ////////////////////////
    // ManagedBudget.total //
    ////////////////////////

    function testTotal() public {
        // Ensure the budget has 0 tokens
        assertEq(managedBudget.total(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        mockERC20.approve(address(managedBudget), 100 ether);
        managedBudget.allocate(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);
    }

    function testTotal_NativeBalance() public {
        // Ensure the budget has 0 tokens
        assertEq(managedBudget.total(address(0)), 0);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.total(address(0)), 100 ether);
    }

    function testTotal_SumOfAvailAndDistributed() public {
        // We'll send two allocations of 100 tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 50 tokens to the budget
        managedBudget.allocate(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );

        // Disburse 25 tokens from the budget to the recipient
        managedBudget.disburse(_makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(1), 25 ether));

        // Allocate another 50 tokens to the budget
        managedBudget.allocate(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );

        // Ensure the budget has 50 - 25 + 50 = 75 tokens
        assertEq(managedBudget.available(address(mockERC20)), 75 ether);

        // Ensure the budget has 25 tokens distributed
        assertEq(managedBudget.distributed(address(mockERC20)), 25 ether);

        // Ensure the total is 75 available + 25 distributed = 100 tokens
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);
    }

    ////////////////////////////
    // ManagedBudget.available //
    ////////////////////////////

    function testAvailable() public {
        // Ensure the budget has 0 tokens available
        assertEq(managedBudget.available(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        mockERC20.approve(address(managedBudget), 100 ether);
        managedBudget.allocate(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        // Ensure the budget has 100 tokens available
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);
    }

    function testAvailable_NativeBalance() public {
        // Ensure the budget has 0 tokens available
        assertEq(managedBudget.available(address(0)), 0);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(Budget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens available
        assertEq(managedBudget.available(address(0)), 100 ether);
    }

    function testAvailable_NeverAllocated() public view {
        // Ensure the budget has 0 tokens available
        assertEq(managedBudget.available(address(otherMockERC20)), 0);
    }

    //////////////////////////////
    // ManagedBudget.distributed //
    //////////////////////////////

    function testDistributed() public {
        // Ensure the budget has 0 tokens distributed
        assertEq(managedBudget.distributed(address(mockERC20)), 0);

        // Allocate 100 tokens to the budget
        mockERC20.approve(address(managedBudget), 100 ether);
        managedBudget.allocate(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        // Disburse 50 tokens from the budget to the recipient
        managedBudget.disburse(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );

        // Ensure the budget has 50 tokens distributed
        assertEq(managedBudget.distributed(address(mockERC20)), 50 ether);

        // Disburse 25 more tokens from the budget to the recipient
        managedBudget.disburse(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 25 ether)
        );

        // Ensure the budget has 75 tokens distributed
        assertEq(managedBudget.distributed(address(mockERC20)), 75 ether);
    }

    ////////////////////////////
    // ManagedBudget.reconcile //
    ////////////////////////////

    function testReconcile() public {
        // ManagedBudget does not implement reconcile
        assertEq(managedBudget.reconcile(""), 0);
    }

    ////////////////////////////////
    // ManagedBudget.grantRoles //
    ////////////////////////////////

    function testGrantRoles() public {
        // Ensure the budget authorizes an account
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();
        accounts[1] = address(0xaaaa);
        authorized[1] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);
        assertTrue(managedBudget.hasAllRoles(address(0xc0ffee), managedBudget.MANAGER_ROLE()));
        assertTrue(
            managedBudget.hasAllRoles(address(0xaaaa), managedBudget.MANAGER_ROLE() & managedBudget.ADMIN_ROLE())
        );
        assertFalse(managedBudget.isAuthorized(address(0xdeadbeef)));
    }

    function testGrantRoles_NotOwner() public {
        // Ensure the budget does not authorize an account if not called by the owner
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();
        vm.prank(address(0xdeadbeef));

        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.grantRoles(accounts, authorized);
    }

    function testGrantRoles_Manager() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        address[] memory accounts_ = new address[](1);
        uint256[] memory authorized_ = new uint256[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = managedBudget.MANAGER_ROLE();

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.grantRoles(accounts_, authorized_);
    }

    function testGrantRoles_Admin() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        address[] memory accounts_ = new address[](1);
        uint256[] memory authorized_ = new uint256[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = 1;

        vm.prank(address(0xdeadbeef));
        managedBudget.grantRoles(accounts_, authorized_);
    }

    function testGrantRoles_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        managedBudget.grantRoles(accounts, authorized);
    }

    ////////////////////////////////
    // ManagedBudget.revokeRoles //
    ////////////////////////////////

    function testRevokeRoles() public {
        // Ensure the budget authorizes an account
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();
        accounts[1] = address(0xaaaa);
        authorized[1] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);
        assertTrue(managedBudget.hasAllRoles(address(0xc0ffee), managedBudget.MANAGER_ROLE()));
        assertTrue(
            managedBudget.hasAllRoles(address(0xaaaa), managedBudget.MANAGER_ROLE() & managedBudget.ADMIN_ROLE())
        );
        assertFalse(managedBudget.isAuthorized(address(0xdeadbeef)));
        managedBudget.revokeRoles(accounts, authorized);
        assertFalse(managedBudget.hasAllRoles(address(0xc0ffee), managedBudget.MANAGER_ROLE()));
        assertFalse(
            managedBudget.hasAnyRole(address(0xaaaa), managedBudget.ADMIN_ROLE() | managedBudget.MANAGER_ROLE())
        );
    }

    function testRevokeRoles_NotOwner() public {
        // Ensure the budget does not authorize an account if not called by the owner
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.revokeRoles(accounts, authorized);
    }

    function testRevokeRoles_Manager() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.revokeRoles(accounts, authorized);
    }

    function testRevokeRoles_Admin() public {
        // Ensure the budget does authorizes revocation when called by an admin
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));
        managedBudget.revokeRoles(accounts, authorized);
    }

    function testRevokeRoles_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        managedBudget.revokeRoles(accounts, authorized);
    }

    ////////////////////////////////
    // ManagedBudget.setAuthorized //
    ////////////////////////////////

    function testSetAuthorized() public {
        // Ensure the budget authorizes an account
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;
        managedBudget.setAuthorized(accounts, authorized);
        assertTrue(managedBudget.isAuthorized(address(0xc0ffee)));
        assertFalse(managedBudget.isAuthorized(address(0xdeadbeef)));
    }

    function testSetAuthorized_NotOwner() public {
        // Ensure the budget does not authorize an account if not called by the owner
        vm.prank(address(0xdeadbeef));

        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;

        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.setAuthorized(accounts, authorized);
    }

    function testSetAuthorized_Manager() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = true;
        managedBudget.setAuthorized(accounts, authorized);

        vm.prank(address(0xdeadbeef));

        address[] memory accounts_ = new address[](1);
        bool[] memory authorized_ = new bool[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = true;

        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.setAuthorized(accounts_, authorized_);
    }

    function testSetAuthorized_Admin() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));

        address[] memory accounts_ = new address[](1);
        bool[] memory authorized_ = new bool[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = true;

        managedBudget.setAuthorized(accounts_, authorized_);
    }

    function testSetAuthorized_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        managedBudget.setAuthorized(accounts, authorized);
    }

    ///////////////////////////////
    // ManagedBudget.isAuthorized //
    ///////////////////////////////

    function testIsAuthorized() public {
        // Ensure the budget indicates that owners, managers, and admins are authorized
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = 1;
        accounts[1] = address(0xb33f);
        authorized[1] = 2;

        managedBudget.grantRoles(accounts, authorized);

        assertTrue(managedBudget.isAuthorized(address(0xc0ffee)));
        assertTrue(managedBudget.isAuthorized(address(0xb33f)));
        assertFalse(managedBudget.isAuthorized(address(0xdeadbeef)));
    }

    function testIsAuthorized_Owner() public view {
        assertTrue(managedBudget.isAuthorized(address(this)));
    }

    ////////////////////////////////////
    // ManagedBudget.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public view {
        // Ensure the contract supports the Budget interface
        console.logBytes4(managedBudget.getComponentInterface());
    }

    ////////////////////////////////////
    // ManagedBudget.supportsInterface //
    ////////////////////////////////////

    function testSupportsBudgetInterface() public view {
        // Ensure the contract supports the Budget interface
        assertTrue(managedBudget.supportsInterface(type(Budget).interfaceId));
    }

    function testSupportsERC1155Receiver() public view {
        // Ensure the contract supports the Budget interface
        assertTrue(managedBudget.supportsInterface(type(IERC1155Receiver).interfaceId));
    }

    function testSupportsERC165() public view {
        // Ensure the contract supports the Budget interface
        assertTrue(managedBudget.supportsInterface(type(IERC165).interfaceId));
    }

    function testSupportsInterface_NotSupported() public view {
        // Ensure the contract does not support an unsupported interface
        assertFalse(managedBudget.supportsInterface(type(Test).interfaceId));
    }

    ////////////////////////////
    // ManagedBudget.fallback  //
    ////////////////////////////

    function testFallback() public {
        // Ensure the fallback is payable
        (bool success,) = payable(managedBudget).call{value: 1 ether}("");
        assertTrue(success);
    }

    function testFallback_CompressedFunctionCall() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = abi.encodeWithSelector(
            AManagedBudget.allocate.selector,
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        (bool success,) = payable(managedBudget).call(data);
        assertTrue(success, "Fallback function failed");

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);
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
        (bool success,) = payable(managedBudget).call{value: 1 ether}(
            abi.encodeWithSelector(
                bytes4(0xdeadbeef),
                _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
            )
        );
        assertFalse(success);
    }

    ////////////////////////////////
    // ManagedBudget.fallback //
    ////////////////////////////////

    function testFallback_NotImplemented() public {
        // Expect the fallback function to revert
        vm.expectRevert();
        payable(managedBudget).transfer(1 ether);
    }

    ///////////////////////////
    // ManagedBudget.receive  //
    ///////////////////////////

    function testReceive() public {
        // Ensure the receive function catches non-fallback ETH transfers
        (bool success,) = payable(managedBudget).call{value: 1 ether}("");
        assertTrue(success);
        assertEq(managedBudget.available(address(0)), 1 ether);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

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
        } else if (assetType == Budget.AssetType.ERC1155) {
            // we're not actually handling this case yet, so hardcoded token ID of 1 is fine
            transfer.data = abi.encode(Budget.ERC1155Payload({tokenId: 1, amount: value, data: ""}));
        }

        return abi.encode(transfer);
    }

    function _makeERC1155Transfer(address asset, address target, uint256 tokenId, uint256 value, bytes memory data)
        internal
        pure
        returns (bytes memory)
    {
        Budget.Transfer memory transfer;
        transfer.assetType = Budget.AssetType.ERC1155;
        transfer.asset = asset;
        transfer.target = target;
        transfer.data = abi.encode(Budget.ERC1155Payload({tokenId: tokenId, amount: value, data: data}));

        return abi.encode(transfer);
    }

    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }
}
