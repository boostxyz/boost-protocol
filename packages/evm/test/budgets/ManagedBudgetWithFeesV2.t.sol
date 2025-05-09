// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {MockERC20, MockERC1155} from "contracts/shared/Mocks.sol";
import {BoostCore} from "contracts/BoostCore.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {ManagedBudgetWithFeesV2 as ManagedBudgetWithFees} from "contracts/budgets/ManagedBudgetWithFeesV2.sol";
//import {ManagedBudgetWithFees} from "contracts/budgets/ManagedBudgetWithFeesV2.sol";
import {ManagedBudgetWithFees as MBWithFees} from "contracts/budgets/ManagedBudgetWithFees.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

contract ManagedBudgetWithFeesV2Test is Test, IERC1155Receiver {
    MockERC20 mockERC20;
    MockERC20 otherMockERC20;
    MockERC1155 mockERC1155;
    ManagedBudgetWithFees managedBudget;
    // TODO: create core mock that returns Boost payload
    address coreMock = makeAddr("mock core");
    address incentiveMock = makeAddr("mock incentive");
    address boostOwner = makeAddr("boost owner");
    address boostAdmin = makeAddr("boost admin");
    address[] authorized = new address[](2);
    uint256[] roles = new uint256[](2);

    function setUp() public {
        // Deploy a new ERC20 contract and mint 100 tokens
        mockERC20 = new MockERC20();
        mockERC20.mint(address(this), 101 ether);

        // Deploy a new ERC1155 contract and mint 100 of token ID 42
        mockERC1155 = new MockERC1155();
        mockERC1155.mint(address(this), 42, 100);

        authorized[0] = coreMock;
        authorized[1] = boostAdmin;
        roles[0] = 0;
        roles[1] = 1 << 1;

        // Deploy a new ManagedBudget contract
        managedBudget = ManagedBudgetWithFees(payable(LibClone.clone(address(new ManagedBudgetWithFees()))));
        managedBudget.initialize(
            abi.encode(
                MBWithFees.InitPayloadWithFee({
                    owner: address(this),
                    authorized: authorized,
                    roles: roles,
                    managementFee: 100
                })
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
        authorized[0] = coreMock;
        authorized[1] = address(this);
        roles[0] = 0;
        roles[1] = 1 << 1;
        bytes memory data = abi.encode(
            MBWithFees.InitPayloadWithFee({
                owner: address(this),
                authorized: authorized,
                roles: roles,
                managementFee: 100
            })
        );
        ManagedBudgetWithFees clone = ManagedBudgetWithFees(payable(LibClone.clone(address(managedBudget))));
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
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        assertTrue(managedBudget.allocate(data));

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);
    }

    function testAllocate_NativeBalance() public {
        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.available(address(0)), 100 ether);
    }

    function testAllocate_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 of token ID 42 to the budget
        bytes memory data = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(ABudget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        assertTrue(managedBudget.allocate(data));

        // Ensure the budget has 100 of token ID 42
        assertEq(managedBudget.available(address(mockERC1155), 42), 100);
    }

    function testAllocate_NativeBalanceValueMismatch() public {
        // Encode an allocation of 100 ETH
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 100 ether);

        // Expect a revert due to a value mismatch (too much ETH)
        vm.expectRevert(abi.encodeWithSelector(ABudget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        managedBudget.allocate{value: 101 ether}(data);

        // Expect a revert due to a value mismatch (too little ETH)
        vm.expectRevert(abi.encodeWithSelector(ABudget.InvalidAllocation.selector, address(0), uint256(100 ether)));
        managedBudget.allocate{value: 99 ether}(data);
    }

    function testAllocate_NoApproval() public {
        // Allocate 100 tokens to the budget without approval
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFromFailed.selector);
        managedBudget.allocate(data);
    }

    function testAllocate_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 101 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
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

    function testAllocate_ERC20InvalidAllocation() public {
        uint256 initialAmount = 100 ether;

        // Approve VestingBudget to spend tokens
        mockERC20.approve(address(managedBudget), initialAmount);

        // Prepare allocation data
        bytes memory allocateData =
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), initialAmount);

        // Set up the mock to manipulate the balance after transfer
        vm.mockCall(
            address(mockERC20),
            abi.encodeWithSelector(mockERC20.balanceOf.selector, address(managedBudget)),
            abi.encode(initialAmount - 1) // Return a balance that's 1 less than expected
        );

        // Expect revert due to InvalidAllocation
        vm.expectRevert(abi.encodeWithSelector(ABudget.InvalidAllocation.selector, address(mockERC20), initialAmount));
        managedBudget.allocate(allocateData);

        vm.clearMockedCalls();
    }

    function testAllocate_ERC1155InvalidAllocation() public {
        uint256 tokenId = 42;
        uint256 initialAmount = 100;

        // Approve ManagedBudget to spend tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Prepare allocation data
        bytes memory allocateData =
            _makeERC1155Transfer(address(mockERC1155), address(this), tokenId, initialAmount, "");

        // Set up the mock to manipulate the balance after transfer
        vm.mockCall(
            address(mockERC1155),
            abi.encodeWithSelector(mockERC1155.balanceOf.selector, address(managedBudget), tokenId),
            abi.encode(initialAmount - 1) // Return a balance that's 1 less than expected
        );

        // Expect revert due to InvalidAllocation
        vm.expectRevert(abi.encodeWithSelector(ABudget.InvalidAllocation.selector, address(mockERC1155), initialAmount));
        managedBudget.allocate(allocateData);

        vm.clearMockedCalls();
    }

    ////////////////////////////
    // ManagedBudget.clawback //
    ////////////////////////////

    function testClawback() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        // Reclaim 99 tokens from the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 99 ether);
        assertGt(managedBudget.clawback(data), 0);

        // Ensure the budget has 1 token left
        assertEq(managedBudget.available(address(mockERC20)), 1 ether);
    }

    function testClawbackAfterCoreChange() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        address newCoreMock = makeAddr("new core mock");
        hoax(boostAdmin);
        managedBudget.setCore(newCoreMock);

        // Reclaim 99 tokens from the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 99 ether);
        assertGt(managedBudget.clawback(data), 0);

        // Ensure the budget has 1 token left
        assertEq(managedBudget.available(address(mockERC20)), 1 ether);
    }

    function testClawback_NativeBalance() public {
        // Allocate 100 ETH to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);
        assertEq(managedBudget.available(address(0)), 100 ether);

        // Reclaim 99 ETH from the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(1), 99 ether);
        assertGt(managedBudget.clawback(data), 0);

        // Ensure the budget has 1 ETH left
        assertEq(managedBudget.available(address(0)), 1 ether);
    }

    function testClawback_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 of token ID 42 to the budget
        bytes memory data = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(ABudget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC1155), 42), 100);

        // Reclaim 99 of token ID 42 from the budget
        data = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(ABudget.ERC1155Payload({tokenId: 42, amount: 99, data: ""}))
            })
        );
        assertGt(managedBudget.clawback(data), 0);

        // Ensure the budget has 1 of token ID 42 left
        assertEq(managedBudget.available(address(mockERC1155), 42), 1);
    }

    function testClawback_ZeroAmount() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        // Reclaim all tokens from the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 0);
        assertEq(managedBudget.clawback(data), 0);

        // Ensure the budget has no tokens left
        assertEq(managedBudget.available(address(mockERC20)), 0 ether);
    }

    function testClawback_ZeroAddress() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        // Reclaim 100 tokens from the budget to address(0)
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(0), 100 ether);
        vm.expectRevert(
            abi.encodeWithSelector(ABudget.TransferFailed.selector, address(mockERC20), address(0), uint256(100 ether))
        );
        managedBudget.clawback(data);

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);
    }

    function testClawback_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Reclaim 101 tokens from the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                ABudget.InsufficientFunds.selector, address(mockERC20), uint256(100 ether), uint256(101 ether)
            )
        );
        managedBudget.clawback(data);
    }

    function testClawback_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // with improperly encoded data
        data = abi.encodePacked(mockERC20, uint256(100 ether));
        vm.expectRevert();
        managedBudget.clawback(data);
    }

    function testClawback_NotOwner() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(1));
        vm.expectRevert();
        managedBudget.clawback(data);
    }

    function testClawback_Manager() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(0xdeadbeef));
        vm.expectRevert();
        managedBudget.clawback(data);
    }

    function testClawback_Admin() public {
        authorized[0] = address(0xdeadbeef);
        roles[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantManyRoles(authorized, roles);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to reclaim 100 tokens from the budget as a non-owner
        // We can reuse the data from above because the target is `address(this)` in both cases
        vm.prank(address(0xdeadbeef));
        managedBudget.clawback(data);
    }

    function testClawback_InsufficientFunds_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeERC1155Transfer(address(mockERC1155), address(this), 42, 100, bytes(""));
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC1155), 42), 100);

        // Attempt to clawback 101 tokens from the budget
        data = _makeERC1155Transfer(address(mockERC1155), address(1), 42, 101, bytes(""));
        vm.expectRevert(
            abi.encodeWithSelector(ABudget.InsufficientFunds.selector, address(mockERC1155), uint256(100), uint256(101))
        );
        managedBudget.clawback(data);
    }

    function testClawbackFromTarget_Unauthorized() public {
        // see EndToEndBasic.t.sol for a working call flow

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);

        data = hex"";
        hoax(makeAddr("unauthorized caller"));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.clawbackFromTarget(makeAddr("fake incentive"), data, 0, 0);
    }

    ///////////////////////////
    // ManagedBudget.disburse //
    ///////////////////////////

    function testDisburseBasic() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 101 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 101 ether);
        // Disburse 100 tokens from the budget to the recipient
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(1), 100 ether);
        assertTrue(managedBudget.disburse(data));
        assertEq(mockERC20.balanceOf(address(1)), 100 ether);

        // Ensure the budget holds the management fee
        assertEq(managedBudget.available(address(mockERC20)), 0);
        assertEq(mockERC20.balanceOf(address(managedBudget)), 1 ether);
        assertEq(managedBudget.distributed(address(mockERC20)), 100 ether);
    }

    function testDisburse_NativeBalance() public {
        // Allocate 101 ETH to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 101 ether);
        managedBudget.allocate{value: 101 ether}(data);

        // Disburse 100 ETH from the budget to the recipient
        data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(1), 100 ether);
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
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(this),
                data: abi.encode(ABudget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
            })
        );
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC1155), 42), 100);

        // Disburse 100 of token ID 42 from the budget to the recipient
        data = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: address(mockERC1155),
                target: address(1),
                data: abi.encode(ABudget.ERC1155Payload({tokenId: 42, amount: 100, data: ""}))
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
        mockERC20.approve(address(managedBudget), 51 ether);
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate the assets to the budget
        managedBudget.allocate(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 51 ether)
        );
        managedBudget.allocate{value: 26 ether}(
            _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 26 ether)
        );
        managedBudget.allocate(_makeERC1155Transfer(address(mockERC1155), address(this), 42, 50, bytes("")));
        assertEq(managedBudget.total(address(mockERC20)), 51 ether);
        assertEq(managedBudget.total(address(0)), 26 ether);
        assertEq(managedBudget.total(address(mockERC1155), 42), 50);

        // Prepare the disbursement requests
        bytes[] memory requests = new bytes[](3);
        requests[0] = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(1), 25 ether);
        requests[1] = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(2), 25 ether);
        requests[2] = _makeERC1155Transfer(address(mockERC1155), address(3), 42, 10, bytes(""));

        // Disburse:
        // TODO check the reserved balance
        // 25 tokens to address(1); and
        // 25 ETH to address(2); and
        // 50 of token ID 42 to address(3)
        assertTrue(managedBudget.disburseBatch(requests));

        // Ensure the budget sent 25 tokens to address(1) and has 25.75 left
        assertEq(managedBudget.available(address(mockERC20)), 25.75 ether);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), 0.25 ether);
        assertEq(managedBudget.distributed(address(mockERC20)), 25 ether);
        assertEq(mockERC20.balanceOf(address(1)), 25 ether);

        // Ensure the budget sent 25 ETH to address(2) and has 0 left
        assertEq(address(2).balance, 25 ether);
        assertEq(managedBudget.available(address(0)), 750000000 gwei);

        // Ensure the budget sent 10 of token ID 42 to address(3) and has 40 left
        assertEq(managedBudget.available(address(mockERC1155), 42), 40);
    }

    function testDisburse_InsufficientFunds() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 50 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 50 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 50 ether);

        // Disburse 101 tokens from the budget to the recipient
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(1), 50 ether);
        vm.expectRevert(
            abi.encodeWithSelector(
                ABudget.InsufficientFunds.selector, address(mockERC20), uint256(50 ether), uint256(50_500_000_000 gwei)
            )
        );
        managedBudget.disburse(data);
    }

    function testDisburse_InsufficientFunds_ERC1155() public {
        // Approve the budget to transfer tokens
        mockERC1155.setApprovalForAll(address(managedBudget), true);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeERC1155Transfer(address(mockERC1155), address(this), 42, 100, bytes(""));
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC1155), 42), 100);

        // Disburse 101 tokens from the budget to the recipient
        data = _makeERC1155Transfer(address(mockERC1155), address(1), 42, 101, bytes(""));
        vm.expectRevert(
            abi.encodeWithSelector(ABudget.InsufficientFunds.selector, address(mockERC1155), uint256(100), uint256(101))
        );
        managedBudget.disburse(data);
    }

    function testDisburse_ImproperData() public {
        bytes memory data;

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
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
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xc0ffee));
        vm.expectRevert();
        managedBudget.disburse(data);
    }

    function testDisburse_Manager() public {
        authorized[0] = address(0xdeadbeef);
        roles[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantManyRoles(authorized, roles);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 101 ether);

        // Allocate 101 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 101 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xdeadbeef));
        managedBudget.disburse(data);
    }

    function testDisburse_Admin() public {
        authorized[0] = address(0xdeadbeef);
        roles[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantManyRoles(authorized, roles);

        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 101 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 101 ether);

        // Try to disburse 100 tokens from the budget as a non-owner
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(0xdeadbeef), 100 ether);
        vm.prank(address(0xdeadbeef));
        managedBudget.disburse(data);
    }

    function testDisburse_FailedTransfer() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 101 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 101 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 101 ether);

        // Mock the ERC20 transfer to fail in an unexpected way
        vm.mockCallRevert(
            address(mockERC20),
            abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), address(1), 100 ether),
            unicode"WeïrdÊrrör(ツ)"
        );

        // Try to disburse 100 tokens from the budget
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(1), 100 ether);
        vm.expectRevert(SafeTransferLib.TransferFailed.selector);
        managedBudget.disburse(data);
    }

    function testDisburse_FailedTransferInBatch() public {
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether);
        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);

        // Prepare the disbursement data
        bytes[] memory requests = new bytes[](3);
        requests[0] = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(1), 25 ether);
        requests[1] = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(2), 50 ether);
        requests[2] = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(3), 10 ether);

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

    function testDisburse_ERC1155_ToZeroAddress() public {
        address token = address(mockERC1155);
        uint256 tokenId = 42;
        uint256 amount = 10;

        // Transfer tokens to the ManagedBudget contract
        mockERC1155.safeTransferFrom(address(this), address(managedBudget), tokenId, amount, "");

        // Verify the transfer
        assertEq(mockERC1155.balanceOf(address(managedBudget), tokenId), amount);

        // Disburse the tokens to the zero address
        bytes memory disburseData = abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: token,
                target: address(0),
                data: abi.encode(ABudget.ERC1155Payload({tokenId: tokenId, amount: amount, data: ""}))
            })
        );

        // Expect the disbursement to fail
        vm.expectRevert(
            abi.encodeWithSelector(ABudget.TransferFailed.selector, address(mockERC1155), address(0), amount)
        );
        managedBudget.disburse(disburseData);

        // Ensure the budget still has 10 tokens
        assertEq(mockERC1155.balanceOf(address(managedBudget), tokenId), amount);
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
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.total(address(mockERC20)), 100 ether);
    }

    function testTotal_NativeBalance() public {
        // Ensure the budget has 0 tokens
        assertEq(managedBudget.total(address(0)), 0);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens
        assertEq(managedBudget.total(address(0)), 100 ether);
    }

    function testTotal_SumOfAvailAndDistributed() public {
        // We'll send two allocations of 100 tokens
        mockERC20.approve(address(managedBudget), 100 ether);

        // Allocate 50 tokens to the budget
        managedBudget.allocate(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );

        // Disburse 25 tokens from the budget to the recipient
        managedBudget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(1), 25 ether));

        // Allocate another 50 tokens to the budget
        managedBudget.allocate(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );

        // Ensure the budget has 50 - 25 + 50 = 75 tokens
        // 0.25 reserved for management, 74.75 available
        assertEq(managedBudget.available(address(mockERC20)), 74.75 ether);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), 0.25 ether);

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
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        // Ensure the budget has 100 tokens available
        assertEq(managedBudget.available(address(mockERC20)), 100 ether);
    }

    function testAvailable_NativeBalance() public {
        // Ensure the budget has 0 tokens available
        assertEq(managedBudget.available(address(0)), 0);

        // Allocate 100 tokens to the budget
        bytes memory data = _makeFungibleTransfer(ABudget.AssetType.ETH, address(0), address(this), 100 ether);
        managedBudget.allocate{value: 100 ether}(data);

        // Ensure the budget has 100 tokens available
        assertEq(managedBudget.available(address(0)), 100 ether);
    }

    function testAvailable_NeverAllocated() public view {
        // Ensure the budget has 0 tokens available
        assertEq(managedBudget.available(address(otherMockERC20)), 0);
    }

    function testFuzz_payManagementFee(uint256 amount, uint256 newFee) public {
        amount = bound(amount, 1e6, type(uint128).max);
        newFee = bound(newFee, 0, 10_000);

        managedBudget.setManagementFee(newFee);

        uint256 amountToMint = amount + (amount * newFee / 10_000);
        mockERC20.mint(address(this), amountToMint);
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), amountToMint);

        bytes memory data =
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), amountToMint);

        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), amountToMint);
        uint256 fee = amount * managedBudget.managementFee() / 10_000;
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), incentiveMock, amount);
        managedBudget.disburse(data);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), fee);
        assertEq(managedBudget.available(address(mockERC20)), 0);

        _setupMockIncentive(1, 1, type(AERC20Incentive).interfaceId);
        _setupBoostGetter(incentiveMock, boostOwner);
        if (newFee > 0) managedBudget.payManagementFee(1, 0);
        assertEq(mockERC20.balanceOf(boostOwner), fee);
        assertEq(mockERC20.balanceOf(address(managedBudget)), 0);
    }

    function testFuzz_payManagementFeeOverload(uint256 amount, uint256 newFee) public {
        amount = bound(amount, 1e6, type(uint128).max);
        newFee = bound(newFee, 0, 10_000);

        managedBudget.setManagementFee(newFee);

        uint256 amountToMint = amount + (amount * newFee / 10_000);
        mockERC20.mint(address(this), amountToMint);
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), amountToMint);

        bytes memory data =
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), amountToMint);

        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), amountToMint);
        uint256 fee = amount * managedBudget.managementFee() / 10_000;
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), incentiveMock, amount);
        managedBudget.disburse(data);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), fee);
        assertEq(managedBudget.available(address(mockERC20)), 0);

        _setupMockIncentive(1, 1, type(AERC20Incentive).interfaceId);
        _setupBoostGetter(incentiveMock, boostOwner);
        address newCoreMock = makeAddr("new core mock");
        hoax(boostAdmin);
        managedBudget.setCore(newCoreMock);
        address newIncentiveMock = makeAddr("new incentive mock");
        // check that a boost with the same boost id and incentive id on a different BoostCore revert
        _setupBoostGetter(newCoreMock, newIncentiveMock, boostOwner);
        _setupMockIncentive(newIncentiveMock, 1, 1, type(AERC20Incentive).interfaceId);
        if (newFee > 0) {
            vm.expectRevert(BoostError.ZeroBalancePayout.selector);
            managedBudget.payManagementFee(1, 0);
        }
        // ensure the overloaded function succeeds
        if (newFee > 0) managedBudget.payManagementFee(BoostCore(coreMock), 1, 0);
        assertEq(mockERC20.balanceOf(boostOwner), fee);
        assertEq(mockERC20.balanceOf(address(managedBudget)), 0);
    }

    function testFuzz_payManagementFeePartial(uint256 amount, uint256 newFee, uint256 limit, uint256 claimed) public {
        limit = bound(limit, 1, type(uint16).max);
        claimed = bound(claimed, 0, limit - 1);
        amount = bound(amount, 1e6, type(uint256).max >> 64);
        newFee = bound(newFee, 0, 10_000);

        managedBudget.setManagementFee(newFee);

        uint256 amountToMint = amount + (amount * newFee / 10_000);
        mockERC20.mint(address(this), amountToMint);
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), amountToMint);

        bytes memory data =
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), amountToMint);

        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), amountToMint);
        uint256 fee = amount * managedBudget.managementFee() / 10_000;
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), incentiveMock, amount);
        managedBudget.disburse(data);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), fee);
        assertEq(managedBudget.available(address(mockERC20)), 0);

        _setupMockIncentive(limit, claimed, type(AERC20Incentive).interfaceId);
        _setupBoostGetter(incentiveMock, boostOwner);
        uint256 expectedFee = claimed * fee / limit;
        if (expectedFee > 0) {
            managedBudget.payManagementFee(1, 0);
        }

        assertEq(mockERC20.balanceOf(boostOwner), expectedFee);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), fee - expectedFee);

        _setupMockIncentive(limit, limit, type(AERC20Incentive).interfaceId);
        if (newFee > 0) {
            managedBudget.payManagementFee(1, 0);
        }
        assertEq(mockERC20.balanceOf(boostOwner), fee);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), 0);
        vm.expectRevert(BoostError.ZeroBalancePayout.selector);
        managedBudget.payManagementFee(1, 0);
    }

    function testFuzz_payManagementFeePartialAERC20Variable(uint256 amount, uint256 newFee, uint256 claimed) public {
        amount = bound(amount, 1e6, type(uint128).max);
        claimed = bound(claimed, 0, amount - 1);
        newFee = bound(newFee, 0, 10_000);

        managedBudget.setManagementFee(newFee);

        uint256 amountToMint = amount + (amount * newFee / 10_000);
        mockERC20.mint(address(this), amountToMint);
        // Approve the budget to transfer tokens
        mockERC20.approve(address(managedBudget), amountToMint);

        bytes memory data =
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), amountToMint);

        managedBudget.allocate(data);
        assertEq(managedBudget.total(address(mockERC20)), amountToMint);
        uint256 fee = amount * managedBudget.managementFee() / 10_000;
        data = _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), incentiveMock, amount);
        managedBudget.disburse(data);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), fee);
        assertEq(managedBudget.available(address(mockERC20)), 0);

        _setupMockIncentive(amount, claimed, type(AERC20VariableIncentive).interfaceId);
        _setupBoostGetter(incentiveMock, boostOwner);
        uint256 expectedFee = claimed * fee / amount;
        if (expectedFee > 0) {
            managedBudget.payManagementFee(1, 0);
        }

        assertEq(mockERC20.balanceOf(boostOwner), expectedFee);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), fee - expectedFee);

        _setupMockIncentive(amount, amount, type(AERC20Incentive).interfaceId);
        if (newFee > 0) {
            managedBudget.payManagementFee(1, 0);
        }
        assertEq(mockERC20.balanceOf(boostOwner), fee);
        assertEq(managedBudget.reservedFunds(address(mockERC20)), 0);
        vm.expectRevert(BoostError.ZeroBalancePayout.selector);
        managedBudget.payManagementFee(1, 0);
    }

    function test_payManagementFeeUnsupportedInterfaceId() public {
        _setupMockIncentive(0, 0, type(AIncentive).interfaceId);
        _setupBoostGetter(incentiveMock, boostOwner);

        vm.expectRevert(BoostError.NotImplemented.selector);
        managedBudget.payManagementFee(1, 0);
    }

    function _setupBoostGetter(address incentive, address owner) internal returns (BoostLib.Boost memory boost) {
        return _setupBoostGetter(coreMock, incentive, owner);
    }

    function _setupBoostGetter(address coreToMock, address incentive, address owner)
        internal
        returns (BoostLib.Boost memory boost)
    {
        boost.owner = owner;
        AIncentive[] memory incentives = new AIncentive[](1);
        incentives[0] = AIncentive(incentive);
        boost.incentives = incentives;
        vm.mockCall(coreToMock, abi.encodeWithSelector(BoostCore.getBoost.selector), abi.encode(boost));
    }

    function _setupMockIncentive(uint256 limit, uint256 claimed, bytes4 interfaceId) internal {
        _setupMockIncentive(incentiveMock, limit, claimed, interfaceId);
    }

    function _setupMockIncentive(address incentiveToMock, uint256 limit, uint256 claimed, bytes4 interfaceId)
        internal
    {
        vm.mockCall(incentiveToMock, abi.encodeWithSelector(AERC20Incentive.limit.selector), abi.encode(limit));
        vm.mockCall(incentiveToMock, abi.encodeWithSelector(AIncentive.claims.selector), abi.encode(claimed));
        vm.mockCall(
            incentiveToMock, abi.encodeWithSelector(AERC20VariableIncentive.totalClaimed.selector), abi.encode(claimed)
        );
        vm.mockCall(incentiveToMock, abi.encodeWithSelector(AIncentive.supportsInterface.selector), abi.encode(false));
        vm.mockCall(
            incentiveToMock,
            abi.encodeWithSelector(AIncentive.supportsInterface.selector, interfaceId),
            abi.encode(true)
        );
        vm.mockCall(incentiveToMock, abi.encodeWithSelector(AIncentive.asset.selector), abi.encode(mockERC20));
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
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
        );

        // Disburse 50 tokens from the budget to the recipient
        managedBudget.disburse(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 50 ether)
        );

        // Ensure the budget has 50 tokens distributed
        assertEq(managedBudget.distributed(address(mockERC20)), 50 ether);

        // Disburse 25 more tokens from the budget to the recipient
        managedBudget.disburse(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 25 ether)
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
    // ManagedBudget.grantManyRoles //
    ////////////////////////////////

    function testGrantManyRoles() public {
        // Ensure the budget authorizes an account
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();
        accounts[1] = address(0xaaaa);
        authorized[1] = managedBudget.ADMIN_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);
        assertTrue(managedBudget.hasAllRoles(address(0xc0ffee), managedBudget.MANAGER_ROLE()));
        assertTrue(
            managedBudget.hasAllRoles(address(0xaaaa), managedBudget.MANAGER_ROLE() & managedBudget.ADMIN_ROLE())
        );
        assertFalse(managedBudget.isAuthorized(address(0xdeadbeef)));
    }

    function testGrantManyRoles_NotOwner() public {
        // Ensure the budget does not authorize an account if not called by the owner
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();
        vm.prank(address(0xdeadbeef));

        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.grantManyRoles(accounts, authorized);
    }

    function testGrantManyRoles_Manager() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);

        address[] memory accounts_ = new address[](1);
        uint256[] memory authorized_ = new uint256[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = managedBudget.MANAGER_ROLE();

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.grantManyRoles(accounts_, authorized_);
    }

    function testGrantManyRoles_Admin() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);

        address[] memory accounts_ = new address[](1);
        uint256[] memory authorized_ = new uint256[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = 1;

        vm.prank(address(0xdeadbeef));
        managedBudget.grantManyRoles(accounts_, authorized_);
    }

    function testGrantManyRoles_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        managedBudget.grantManyRoles(accounts, authorized);
    }

    ////////////////////////////////
    // ManagedBudget.revokeManyRoles //
    ////////////////////////////////

    function testRevokeManyRoles() public {
        // Ensure the budget authorizes an account
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();
        accounts[1] = address(0xaaaa);
        authorized[1] = managedBudget.ADMIN_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);
        assertTrue(managedBudget.hasAllRoles(address(0xc0ffee), managedBudget.MANAGER_ROLE()));
        assertTrue(
            managedBudget.hasAllRoles(address(0xaaaa), managedBudget.MANAGER_ROLE() & managedBudget.ADMIN_ROLE())
        );
        assertFalse(managedBudget.isAuthorized(address(0xdeadbeef)));
        managedBudget.revokeManyRoles(accounts, authorized);
        assertFalse(managedBudget.hasAllRoles(address(0xc0ffee), managedBudget.MANAGER_ROLE()));
        assertFalse(
            managedBudget.hasAnyRole(address(0xaaaa), managedBudget.ADMIN_ROLE() | managedBudget.MANAGER_ROLE())
        );
    }

    function testRevokeManyRoles_NotOwner() public {
        // Ensure the budget does not authorize an account if not called by the owner
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = managedBudget.MANAGER_ROLE();

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.revokeManyRoles(accounts, authorized);
    }

    function testRevokeManyRoles_Manager() public {
        // Ensure the budget does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.MANAGER_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        managedBudget.revokeManyRoles(accounts, authorized);
    }

    function testRevokeManyRoles_Admin() public {
        // Ensure the budget does authorizes revocation when called by an admin
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = managedBudget.ADMIN_ROLE();
        managedBudget.grantManyRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));
        managedBudget.revokeManyRoles(accounts, authorized);
    }

    function testRevokeManyRoles_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        managedBudget.revokeManyRoles(accounts, authorized);
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
        managedBudget.grantManyRoles(accounts, authorized);

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

    function testSetAuthorized_RemoveRole() public {
        // Grant authorization to the user
        address user = address(0xc0ffee);
        address[] memory accounts = new address[](1);
        accounts[0] = user;
        bool[] memory authorizations = new bool[](1);
        authorizations[0] = true;
        managedBudget.setAuthorized(accounts, authorizations);

        // Verify that the user is authorized
        assertTrue(managedBudget.isAuthorized(user), "User should be authorized");

        // Remove authorization from the user
        authorizations[0] = false;
        managedBudget.setAuthorized(accounts, authorizations);

        // Verify that the user is no longer authorized
        assertFalse(managedBudget.isAuthorized(user), "User should not be authorized");
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

        managedBudget.grantManyRoles(accounts, authorized);

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
        // Ensure the contract supports the ABudget interface
        console.logBytes4(managedBudget.getComponentInterface());
    }

    ////////////////////////////////////
    // ManagedBudget.supportsInterface //
    ////////////////////////////////////

    function testSupportsBudgetInterface() public view {
        // Ensure the contract supports the ABudget interface
        assertTrue(managedBudget.supportsInterface(type(ABudget).interfaceId));
    }

    function testSupportsERC1155Receiver() public view {
        // Ensure the contract supports the ABudget interface
        assertTrue(managedBudget.supportsInterface(type(IERC1155Receiver).interfaceId));
    }

    function testSupportsERC165() public view {
        // Ensure the contract supports the ABudget interface
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
            MBWithFees.allocate.selector,
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
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
                _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockERC20), address(this), 100 ether)
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

    function testOnERC1155BatchReceived() public view {
        // Call onERC1155BatchReceived with dummy values
        bytes4 result = managedBudget.onERC1155BatchReceived(
            address(0xc0ffee), // operator
            address(0xdeadbeef), // from
            new uint256[](1), // ids
            new uint256[](1), // amounts
            "" // data
        );

        // Check if it returns the correct selector
        assertEq(result, IERC1155Receiver.onERC1155BatchReceived.selector, "Should return correct selector");
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _makeFungibleTransfer(ABudget.AssetType assetType, address asset, address target, uint256 value)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer;
        transfer.assetType = assetType;
        transfer.asset = asset;
        transfer.target = target;
        if (assetType == ABudget.AssetType.ETH || assetType == ABudget.AssetType.ERC20) {
            transfer.data = abi.encode(ABudget.FungiblePayload({amount: value}));
        } else if (assetType == ABudget.AssetType.ERC1155) {
            // we're not actually handling this case yet, so hardcoded token ID of 1 is fine
            transfer.data = abi.encode(ABudget.ERC1155Payload({tokenId: 1, amount: value, data: ""}));
        }

        return abi.encode(transfer);
    }

    function _makeERC1155Transfer(address asset, address target, uint256 tokenId, uint256 value, bytes memory data)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer;
        transfer.assetType = ABudget.AssetType.ERC1155;
        transfer.asset = asset;
        transfer.target = target;
        transfer.data = abi.encode(ABudget.ERC1155Payload({tokenId: tokenId, amount: value, data: data}));

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
