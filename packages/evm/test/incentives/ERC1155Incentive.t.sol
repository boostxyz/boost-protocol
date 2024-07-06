// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC1155} from "contracts/shared/Mocks.sol";

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";
import {ERC1155Incentive} from "contracts/incentives/ERC1155Incentive.sol";
import {AERC1155Incentive} from "contracts/incentives/AERC1155Incentive.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {SimpleBudget} from "contracts/budgets/SimpleBudget.sol";

contract ERC1155IncentiveTest is Test, IERC1155Receiver {
    using SafeTransferLib for address;

    ERC1155Incentive public incentive;
    SimpleBudget public budget = new SimpleBudget();
    MockERC1155 public mockAsset = new MockERC1155();

    function setUp() public {
        incentive = _newIncentiveClone();

        // Preload the budget with some mock tokens
        mockAsset.mint(address(this), 42, 100);
        mockAsset.setApprovalForAll(address(budget), true);
        budget.allocate(_makeERC1155Transfer(address(mockAsset), address(this), 42, 100, bytes("")));

        // NOTE: This would normally be handled by BoostCore during the setup
        //   process, but we do it manually here to test without spinning up
        //   the entire protocol stack. This is a _unit_ test, after all.
        budget.disburse(_makeERC1155Transfer(address(mockAsset), address(incentive), 42, 100, bytes("")));
    }

    ///////////////////////////////
    // ERC1155Incentive.initialize //
    ///////////////////////////////

    function testInitialize() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5);

        // Check the incentive parameters
        assertTrue(incentive.strategy() == AERC1155Incentive.Strategy.POOL);
        assertEq(address(incentive.asset()), address(mockAsset));
        assertEq(incentive.tokenId(), 42);
        assertEq(incentive.limit(), 5);
    }

    function testInitialize_InsufficientAllocation() public {
        // Initialize with maxReward > allocation => revert
        vm.expectRevert(abi.encodeWithSelector(BoostError.InsufficientFunds.selector, mockAsset, 100, 101));
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 101);
    }

    function testInitialize_UnsupportedStrategy() public {
        // Initialize with MINT (not yet supported) => revert
        vm.expectRevert(BoostError.NotImplemented.selector);
        _initialize(mockAsset, AERC1155Incentive.Strategy.MINT, 42, 5);
    }

    function testInitialize_InvalidInitialization() public {
        // Initialize with zero max claims
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 0);

        // Initialize with MINT strategy (not yet supported)
        vm.expectRevert(BoostError.NotImplemented.selector);
        _initialize(mockAsset, AERC1155Incentive.Strategy.MINT, 42, 5);
    }

    //////////////////////////
    // ERC1155Incentive.claim //
    //////////////////////////

    function testClaim() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5);

        vm.expectEmit(true, false, false, true);
        emit Incentive.Claimed(
            address(1), abi.encodePacked(address(mockAsset), address(1), uint256(42), uint256(1), bytes(""))
        );

        // Claim the incentive
        bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")}));
        incentive.claim(claimPayload);

        // Check the claim status
        assertTrue(incentive.claimed(address(1)));
    }

    function testClaim_AlreadyClaimed() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5);

        // Claim the incentive on behalf of address(1)
        bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")}));
        incentive.claim(claimPayload);

        // Attempt to claim for address(1) again => revert
        vm.expectRevert(Incentive.NotClaimable.selector);
        incentive.claim(claimPayload);
    }

    ////////////////////////////
    // ERC1155Incentive.reclaim //
    ////////////////////////////

    function testReclaim() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 100);
        assertEq(incentive.limit(), 100);

        // Reclaim 50x the reward amount
        bytes memory reclaimPayload = abi.encode(Incentive.ClaimPayload({target: address(1), data: abi.encode(50)}));
        incentive.reclaim(reclaimPayload);
        assertEq(mockAsset.balanceOf(address(1), 42), 50);

        // Check that enough assets remain to cover 50 more claims
        assertEq(mockAsset.balanceOf(address(incentive), 42), 50);
        assertEq(incentive.limit(), 50);
    }

    function testReclaim_InvalidAmount() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 100);

        // Reclaim 101 tokens => exceeds balance => revert
        bytes memory reclaimPayload = abi.encode(Incentive.ClaimPayload({target: address(1), data: abi.encode(101)}));
        vm.expectRevert(abi.encodeWithSelector(BoostError.ClaimFailed.selector, address(this), reclaimPayload));
        incentive.reclaim(reclaimPayload);
    }

    ////////////////////////////////
    // ERC1155Incentive.isClaimable //
    ////////////////////////////////

    function testIsClaimable() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5);

        // Check if the incentive is claimable
        bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")}));
        assertTrue(incentive.isClaimable(claimPayload));
    }

    function testIsClaimable_AlreadyClaimed() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5);

        // Claim the incentive on behalf of address(1)
        bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")}));
        incentive.claim(claimPayload);

        // Check if the incentive is still claimable for address(1) => false
        assertFalse(incentive.isClaimable(claimPayload));
    }

    function testIsClaimable_ExceedsMaxClaims() public {
        // Initialize the ERC1155Incentive
        _initialize(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5);

        // Claim the incentive for 5 different addresses
        address[] memory recipients = _randomAccounts(6);
        for (uint256 i = 0; i < 5; i++) {
            bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: recipients[i], data: bytes("")}));
            incentive.claim(claimPayload);
        }

        // Check the claim count
        assertEq(incentive.claims(), 5);

        // Check if the incentive is claimable for the 6th address => false
        bytes memory nextClaimPayload = abi.encode(Incentive.ClaimPayload({target: recipients[5], data: bytes("")}));
        assertFalse(incentive.isClaimable(nextClaimPayload));
    }

    //////////////////////////////
    // ERC1155Incentive.preflight //
    //////////////////////////////

    function testPreflight() public {
        // Check the preflight data
        bytes memory data = incentive.preflight(_initPayload(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 5));
        Budget.Transfer memory budgetRequest = abi.decode(data, (Budget.Transfer));

        assertEq(budgetRequest.asset, address(mockAsset));

        Budget.ERC1155Payload memory payload = abi.decode(budgetRequest.data, (Budget.ERC1155Payload));
        assertEq(payload.tokenId, 42);
        assertEq(payload.amount, 5);
        assertEq(payload.data, "");
    }

    function testPreflight_WeirdRewards() public {
        // Preflight with zero max claims
        bytes memory noClaims = incentive.preflight(_initPayload(mockAsset, AERC1155Incentive.Strategy.POOL, 42, 0));
        Budget.Transfer memory request = abi.decode(noClaims, (Budget.Transfer));
        Budget.ERC1155Payload memory payload = abi.decode(request.data, (Budget.ERC1155Payload));
        assertEq(payload.amount, 0);
    }

    ////////////////////////////////////
    // ERC1155Incentive.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
    }

    /////////////////////////////////////
    // ERC1155Incentive.supportsInterface //
    /////////////////////////////////////

    function testSupportsInterface() public {
        // Ensure the contract supports the Budget interface
        assertTrue(incentive.supportsInterface(type(Incentive).interfaceId));
    }

    function testSupportsInterface_NotSupported() public {
        // Ensure the contract does not support an unsupported interface
        assertFalse(incentive.supportsInterface(type(Test).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newIncentiveClone() internal returns (ERC1155Incentive) {
        return ERC1155Incentive(LibClone.clone(address(new ERC1155Incentive())));
    }

    function _initialize(MockERC1155 asset, ERC1155Incentive.Strategy strategy, uint256 tokenId, uint256 limit)
        internal
    {
        incentive.initialize(_initPayload(asset, strategy, tokenId, limit));
    }

    function _initPayload(MockERC1155 asset, ERC1155Incentive.Strategy strategy, uint256 tokenId, uint256 limit)
        internal
        pure
        returns (bytes memory)
    {
        return abi.encode(
            ERC1155Incentive.InitPayload({
                asset: IERC1155(address(asset)),
                strategy: strategy,
                tokenId: tokenId,
                limit: limit,
                extraData: ""
            })
        );
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

    function _randomAccounts(uint256 count) internal returns (address[] memory accounts) {
        accounts = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            accounts[i] = makeAddr(string(abi.encodePacked(uint256(i))));
        }
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
