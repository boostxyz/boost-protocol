// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ERC20TopupIncentive} from "contracts/incentives/ERC20TopupIncentive.sol";
import {AERC20Incentive} from "contracts/incentives/AERC20Incentive.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

contract ERC20TopupIncentiveTest is Test {
    using SafeTransferLib for address;

    ERC20TopupIncentive public incentive;
    ManagedBudget public budget;
    MockERC20 public mockAsset = new MockERC20();

    ////////////////////////////////
    // setUp
    ////////////////////////////////

    /// @notice Sets up new clones of ERC20TopupIncentive + ManagedBudget,
    ///         mints 100 tokens to this address, and allocates them to the budget
    ///         (but does NOT disburse to the incentive here).
    function setUp() public {
        incentive = _newIncentiveClone();
        budget = _newBudgetClone();

        // Preload the budget with some mock tokens
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(budget), 100 ether);
        budget.allocate(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(this), 100 ether));

        // We no longer disburse tokens to the incentive here,
        // so each test can do exactly the right amount of disbursement.
    }

    //////////////////////////////////
    // ERC20TopupIncentive.initialize
    //////////////////////////////////

    /// @notice Tests normal initialization
    function testInitialize() public {
        // Disburse exactly 5 tokens (for limit=5, reward=1)
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));

        // Initialize the incentive
        _initialize(address(mockAsset), 1 ether, 5);

        // Check the incentive parameters
        // "limit()" is dynamic, so let's confirm it's 5 (5 tokens / 1 token per claim)
        assertEq(incentive.limit(), 5, "Unexpected limit after initialization");
        assertEq(incentive.asset(), address(mockAsset), "Unexpected asset");
        assertEq(incentive.reward(), 1 ether, "Unexpected reward");
    }

    /// @notice Tests insufficient initial funding
    function testInitialize_InsufficientAllocation() public {
        // Disburse only 100 tokens but we want 101 total (reward=1, limit=101).
        budget.disburse(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 100 ether)
        );

        // Attempt to initialize with a total needed of 101 ether
        vm.expectRevert(abi.encodeWithSelector(BoostError.InsufficientFunds.selector, mockAsset, 100 ether, 101 ether));
        _initialize(address(mockAsset), 1 ether, 101);
    }

    /// @notice Tests invalid initialization parameters
    function testInitialize_InvalidInitialization() public {
        // Disburse 5 tokens so we don't fail on InsufficientFunds
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));

        // Reward=0 => revert
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), 0 ether, 5);

        // Limit=0 => revert
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), 1 ether, 0);
    }

    ////////////////////////////////
    // ERC20TopupIncentive.claim
    ////////////////////////////////

    /// @notice Tests normal claiming of the incentive
    function testClaim() public {
        // Disburse 5 tokens (limit=5, reward=1)
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));
        _initialize(address(mockAsset), 1 ether, 5);

        // Expect a Claimed event
        vm.expectEmit(true, false, false, true);
        emit AIncentive.Claimed(address(1), abi.encodePacked(address(mockAsset), address(1), uint256(1 ether)));

        // Claim
        incentive.claim(address(1), hex"");

        // Check the claim was recorded
        assertTrue(incentive.claimed(address(1)), "Address 1 should be marked as claimed");
        assertEq(incentive.claims(), 1, "Unexpected claims count");
        assertEq(mockAsset.balanceOf(address(1)), 1 ether, "Address 1 should have 1 ether from incentive");
    }

    /// @notice Tests claiming twice reverts
    function testClaim_AlreadyClaimed() public {
        // Disburse 5 tokens (limit=5, reward=1)
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));
        _initialize(address(mockAsset), 1 ether, 5);

        // First claim
        incentive.claim(address(1), hex"");

        // Second claim => revert
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(address(1), hex"");
    }

    ////////////////////////////////////
    // ERC20TopupIncentive.isClaimable
    ////////////////////////////////////

    /// @notice Tests normal isClaimable
    function testIsClaimable() public {
        // Disburse 5 tokens
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));
        _initialize(address(mockAsset), 1 ether, 5);

        assertTrue(incentive.isClaimable(address(2), hex""), "Address 2 should be claimable");
    }

    /// @notice Tests isClaimable after a user has already claimed
    function testIsClaimable_AlreadyClaimed() public {
        // Disburse 5 tokens
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));
        _initialize(address(mockAsset), 1 ether, 5);

        // Claim
        incentive.claim(address(2), hex"");

        // After claiming, it should no longer be claimable
        assertFalse(incentive.isClaimable(address(2), hex""), "Address 2 should not be claimable anymore");
    }

    /// @notice Tests isClaimable once the dynamic limit is reached
    function testIsClaimable_ExceedsMaxClaims() public {
        // Disburse 5 tokens (limit=5, reward=1)
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 5 ether));
        _initialize(address(mockAsset), 1 ether, 5);

        // Fill up all 5 claims
        for (uint256 i = 0; i < 5; i++) {
            address newUser = address(uint160(i + 100));
            incentive.claim(newUser, hex"");
        }

        // Now the 6th user can't claim
        address sixthUser = address(999);
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(sixthUser, hex"");
    }

    /////////////////////////////////////
    // ERC20TopupIncentive (Top-Up Tests)
    /////////////////////////////////////

    /// @notice Tests that new funds increase the effective limit dynamically
    function testTopup() public {
        // Disburse 3 tokens initially (limit=3, reward=1)
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 3 ether));
        _initialize(address(mockAsset), 1 ether, 3);

        // Confirm initial limit is 3
        assertEq(incentive.limit(), 3, "Initial dynamic limit should be 3");

        // Use up all 3 claims
        for (uint256 i = 0; i < 3; i++) {
            address user = address(uint160(i + 200));
            incentive.claim(user, hex"");
        }

        // Attempt a 4th user => revert because we've exhausted 3 tokens
        address user4 = address(999);
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(user4, hex"");

        // Now top up with 2 more tokens => new dynamic limit = 5 (3 + 2)
        mockAsset.mint(address(this), 2 ether);
        mockAsset.approve(address(budget), 2 ether);
        budget.allocate(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(this), 2 ether));
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 2 ether));

        // limit() should now be 5
        assertEq(incentive.limit(), 5, "After top-up, limit should be 5");

        // The 4th user can now claim
        incentive.claim(user4, hex"");
        assertEq(mockAsset.balanceOf(user4), 1 ether, "User 4 should get their reward after top-up");
    }

    /// @notice Fuzz test that performs multiple top ups and multiple claims in sequences
    /// @param topUpAmount A fuzzed amount of tokens to top up each time
    /// @param topUpCount How many times to top up the incentive in total
    /// @param claimCount How many claims to attempt after all top ups
    function testFuzzMultipleTopupsAndClaim(uint128 topUpAmount, uint8 topUpCount, uint8 claimCount) public {
        // 1. Bound the fuzz inputs to keep values reasonable.
        //    For example, top up to 50 ETH, up to 5 top-ups, and up to 20 claims:
        topUpAmount = uint128(bound(topUpAmount, 0, 50 ether));
        topUpCount = uint8(bound(topUpCount, 0, 5));
        claimCount = uint8(bound(claimCount, 0, 20));

        // 2. Disburse an initial 2 tokens so the contract can be initialized (reward=1, limit=2).
        budget.disburse(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 2 ether));
        _initialize(address(mockAsset), 1 ether, 2);

        // 3. Perform multiple top-up cycles, each followed by 1 claim attempt.
        //    If we've exhausted the limit, that claim should revert with "NotClaimable".
        for (uint256 i = 0; i < topUpCount; i++) {
            if (topUpAmount > 0) {
                // Mint to this contract, then move to budget, then disburse to incentive
                mockAsset.mint(address(this), topUpAmount);
                mockAsset.approve(address(budget), topUpAmount);
                budget.allocate(
                    _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(this), topUpAmount)
                );
                budget.disburse(
                    _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), topUpAmount)
                );
            }

            // Attempt one claim right after the top-up
            address newClaimer = address(uint160(0xF00 + i)); // unique address each iteration
            uint256 currLimit = incentive.limit(); // dynamic: balance / reward
            uint256 currClaims = incentive.claims();
            if (currClaims < currLimit) {
                // Expect success
                incentive.claim(newClaimer, hex"");
                assertTrue(incentive.claimed(newClaimer), "User should be marked as claimed after top-up");
                assertEq(mockAsset.balanceOf(newClaimer), 1 ether, "Claimer should receive 1 token post top-up");
            } else {
                // Should revert if the limit is reached
                vm.expectRevert(AIncentive.NotClaimable.selector);
                incentive.claim(newClaimer, hex"");
            }
        }

        // 4. Attempt a final batch of claims (claimCount times).
        //    Each claim should succeed if the limit isn't reached, otherwise revert.
        for (uint256 j = 0; j < claimCount; j++) {
            address anotherClaimer = address(uint160(0xBEEF + j));
            uint256 currLimit = incentive.limit();
            uint256 currClaims = incentive.claims();

            if (currClaims < currLimit) {
                incentive.claim(anotherClaimer, hex"");
                assertTrue(incentive.claimed(anotherClaimer), "User should be marked as claimed in final batch");
                assertEq(mockAsset.balanceOf(anotherClaimer), 1 ether, "Final batch claimer should get 1 token");
            } else {
                vm.expectRevert(AIncentive.NotClaimable.selector);
                incentive.claim(anotherClaimer, hex"");
            }
        }
    }

    ////////////////////////////////
    // ERC20TopupIncentive.clawback
    ////////////////////////////////

    /// @notice Tests clawback to retrieve tokens from the incentive
    function testClawback() public {
        // Disburse 10 tokens (limit=10, reward=1)
        budget.disburse(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 10 ether)
        );
        _initialize(address(mockAsset), 1 ether, 10);
        assertEq(incentive.limit(), 10, "Initial limit is 10 claims");

        // Claw back 5 ether
        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(1), data: abi.encode(5 ether)}));
        incentive.clawback(reclaimPayload);

        // Check that address(1) received the tokens
        assertEq(mockAsset.balanceOf(address(1)), 5 ether, "Address(1) should have been clawed back 5 ether");

        // Now only 5 tokens remain in the contract
        assertEq(incentive.limit(), 5, "Limit should reflect 5 claims remain after clawback");
    }

    ////////////////////////////////
    // ERC20TopupIncentive.preflight
    ////////////////////////////////

    /// @notice Tests the preflight data encoding
    function testPreflight() public view {
        // Prepare the init payload
        bytes memory data = _initPayload(address(mockAsset), 1 ether, 5);

        // Preflight
        bytes memory result = incentive.preflight(data);

        // Decode the ABudget.Transfer
        ABudget.Transfer memory budgetRequest = abi.decode(result, (ABudget.Transfer));

        // Check the budget request
        assertEq(budgetRequest.asset, address(mockAsset));
        ABudget.FungiblePayload memory payload = abi.decode(budgetRequest.data, (ABudget.FungiblePayload));
        // reward=1 ether, limit=5 => total needed=5 ether
        assertEq(payload.amount, 5 ether, "Preflight amount mismatch");
    }

    /// @notice Tests the preflight with zero reward / zero limit
    function testPreflight_WeirdRewards() public view {
        // 1) 0 reward => amount=0
        bytes memory noRewards = incentive.preflight(_initPayload(address(mockAsset), 0 ether, 5));
        ABudget.Transfer memory request1 = abi.decode(noRewards, (ABudget.Transfer));
        ABudget.FungiblePayload memory payload1 = abi.decode(request1.data, (ABudget.FungiblePayload));
        assertEq(payload1.amount, 0, "Preflight with 0 reward should return 0 amount");

        // 2) 0 limit => amount=0
        bytes memory noLimit = incentive.preflight(_initPayload(address(mockAsset), 1 ether, 0));
        ABudget.Transfer memory request2 = abi.decode(noLimit, (ABudget.Transfer));
        ABudget.FungiblePayload memory payload2 = abi.decode(request2.data, (ABudget.FungiblePayload));
        assertEq(payload2.amount, 0, "Preflight with 0 limit should return 0 amount");
    }

    ////////////////////
    // Helper Functions
    ////////////////////

    /// @notice Deploys a new clone of ERC20TopupIncentive
    function _newIncentiveClone() internal returns (ERC20TopupIncentive) {
        return ERC20TopupIncentive(LibClone.clone(address(new ERC20TopupIncentive())));
    }

    /// @notice Deploys a new ManagedBudget clone
    function _newBudgetClone() internal returns (ManagedBudget newBudget) {
        address[] memory authorized = new address[](0);
        uint256[] memory roles = new uint256[](0);

        ManagedBudget.InitPayload memory initPayload = ManagedBudget.InitPayload(address(this), authorized, roles);

        newBudget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        newBudget.initialize(abi.encode(initPayload));
    }

    /// @notice Helper to initialize the incentive
    function _initialize(address asset_, uint256 reward_, uint256 limit_) internal {
        incentive.initialize(_initPayload(asset_, reward_, limit_));
    }

    /// @notice Encodes the init data payload
    function _initPayload(address asset_, uint256 reward_, uint256 limit_) internal view returns (bytes memory) {
        return abi.encode(
            ERC20TopupIncentive.InitPayload({asset: asset_, reward: reward_, limit: limit_, manager: address(this)})
        );
    }

    /// @notice Helper to create a fungible transfer payload
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
            // Just a placeholder
            transfer.data = abi.encode(ABudget.ERC1155Payload({tokenId: 1, amount: value, data: ""}));
        }

        return abi.encode(transfer);
    }
}
