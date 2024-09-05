// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";
import {ERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";
import {AERC20Incentive} from "contracts/incentives/ERC20Incentive.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {SimpleBudget} from "contracts/budgets/SimpleBudget.sol";

contract ERC20IncentiveTest is Test {
    using SafeTransferLib for address;

    ERC20Incentive public incentive;
    SimpleBudget public budget = new SimpleBudget();
    MockERC20 public mockAsset = new MockERC20();

    function setUp() public {
        incentive = _newIncentiveClone();

        // Preload the budget with some mock tokens
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(budget), 100 ether);
        budget.allocate(_makeFungibleTransfer(Budget.AssetType.ERC20, address(mockAsset), address(this), 100 ether));

        // NOTE: This would normally be handled by BoostCore during the setup
        //   process, but we do it manually here to test without spinning up
        //   the entire protocol stack. This is a _unit_ test, after all.
        budget.disburse(
            _makeFungibleTransfer(Budget.AssetType.ERC20, address(mockAsset), address(incentive), 100 ether)
        );
    }

    ///////////////////////////////
    // ERC20Incentive.initialize //
    ///////////////////////////////

    function testInitialize() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Check the incentive parameters
        assertTrue(incentive.strategy() == AERC20Incentive.Strategy.POOL);
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.currentReward(), 1 ether);
        assertEq(incentive.limit(), 5);
    }

    function testInitialize_InsufficientAllocation() public {
        // Initialize with maxReward > allocation => revert
        vm.expectRevert(abi.encodeWithSelector(BoostError.InsufficientFunds.selector, mockAsset, 100 ether, 101 ether));
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 101);
    }

    function testInitialize_InvalidInitialization() public {
        // Initialize with no reward amount
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 0 ether, 5);

        // Initialize with zero max claims
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 0);
    }

    //////////////////////////
    // ERC20Incentive.claim //
    //////////////////////////

    function testClaim() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        vm.expectEmit(true, false, false, true);
        emit Incentive.Claimed(address(1), abi.encodePacked(address(mockAsset), address(1), uint256(1 ether)));

        // Claim the incentive
        incentive.claim(address(1), hex"");

        // Check the claim status
        assertTrue(incentive.claimed(address(1)));
    }

    function testClaim_AlreadyClaimed() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive on behalf of address(1)
        incentive.claim(address(1), hex"");

        // Attempt to claim for address(1) again => revert
        vm.expectRevert(Incentive.NotClaimable.selector);
        incentive.claim(address(1), hex"");
    }

    function testClaim_RaffleStrategy() public {
        // Initialize the ERC20Incentive raffling 100 eth to 1 of 5 entrants
        _initialize(address(mockAsset), AERC20Incentive.Strategy.RAFFLE, 100 ether, 5);

        // Claim the incentive, which means adding the address to the entries list
        incentive.claim(address(1), hex"");

        // Check that the entry was added and no tokens were transferred
        assertTrue(incentive.claimed(address(1)));
        assertEq(incentive.entries(0), address(1));
        assertEq(mockAsset.balanceOf(address(incentive)), 100 ether);
    }

    ////////////////////////////
    // ERC20Incentive.reclaim //
    ////////////////////////////

    function testReclaim() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 100);
        assertEq(incentive.limit(), 100);

        // Reclaim 50x the reward amount
        bytes memory reclaimPayload =
            abi.encode(Incentive.ClawbackPayload({target: address(1), data: abi.encode(50 ether)}));
        incentive.clawback(reclaimPayload);
        assertEq(mockAsset.balanceOf(address(1)), 50 ether);

        // Check that enough assets remain to cover 50 more claims
        assertEq(mockAsset.balanceOf(address(incentive)), 50 ether);
        assertEq(incentive.limit(), 50);
    }

    function testReclaim_InvalidAmount() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 100);

        // Reclaim 50.1x => not an integer multiple of the reward amount => revert
        bytes memory reclaimPayload =
            abi.encode(Incentive.ClawbackPayload({target: address(1), data: abi.encode(50.1 ether)}));
        vm.expectRevert(abi.encodeWithSelector(BoostError.ClaimFailed.selector, address(this), reclaimPayload));
        incentive.clawback(reclaimPayload);
    }

    function testReclaim_RaffleStrategy() public {
        // Initialize the ERC20Incentive raffling 100 eth to 1 of 5 entrants
        _initialize(address(mockAsset), AERC20Incentive.Strategy.RAFFLE, 100 ether, 5);

        // Claim the incentive for 1 address, adding it to the raffle entries
        // and locking in the reward since there's at least 1 potential winner
        incentive.claim(address(1), hex"");
        assertEq(incentive.entries(0), address(1));
        assertEq(incentive.limit(), 5);

        // Attempt to reclaim the reward => revert (because the reward is now locked)
        bytes memory reclaimPayload =
            abi.encode(Incentive.ClawbackPayload({target: address(1), data: abi.encode(100 ether)}));

        vm.expectRevert(abi.encodeWithSelector(BoostError.ClaimFailed.selector, address(this), reclaimPayload));
        incentive.clawback(reclaimPayload);
        assertEq(incentive.limit(), 5);
    }

    function testReclaim_RaffleStrategy_LimitZero() public {
        // Initialize the AERC20Incentive with RAFFLE strategy
        _initialize(address(mockAsset), AERC20Incentive.Strategy.RAFFLE, 100 ether, 5);

        // Reclaim the full reward amount
        bytes memory reclaimPayload =
            abi.encode(Incentive.ClawbackPayload({target: address(this), data: abi.encode(100 ether)}));
        incentive.clawback(reclaimPayload);

        // Check that the limit is set to 0
        assertEq(incentive.limit(), 0);
    }

    ////////////////////////////////
    // ERC20Incentive.isClaimable //
    ////////////////////////////////

    function testIsClaimable() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Check if the incentive is claimable
        assertTrue(incentive.isClaimable(address(1), hex""));
    }

    function testIsClaimable_AlreadyClaimed() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive on behalf of address(1)
        incentive.claim(address(1), hex"");

        // Check if the incentive is still claimable for address(1) => false
        assertFalse(incentive.isClaimable(address(1), hex""));
    }

    function testIsClaimable_ExceedsMaxClaims() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive for 5 different addresses
        address[] memory recipients = _randomAccounts(6);
        for (uint256 i = 0; i < 5; i++) {
            incentive.claim(recipients[i], hex"");
        }

        // Check the claim count
        assertEq(incentive.claims(), 5);

        // Check if the incentive is claimable for the 6th address => false
        assertFalse(incentive.isClaimable(address(1), hex""));
    }

    //////////////////////////////
    // ERC20Incentive.preflight //
    //////////////////////////////

    function testPreflight() public view {
        // Check the preflight data
        bytes memory data =
            incentive.preflight(_initPayload(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5));
        Budget.Transfer memory budgetRequest = abi.decode(data, (Budget.Transfer));

        assertEq(budgetRequest.asset, address(mockAsset));

        Budget.FungiblePayload memory payload = abi.decode(budgetRequest.data, (Budget.FungiblePayload));
        assertEq(payload.amount, 5 ether);
    }

    function testPreflight_WeirdRewards() public view {
        // Preflight with no reward amount
        bytes memory noRewards =
            incentive.preflight(_initPayload(address(mockAsset), AERC20Incentive.Strategy.POOL, 0 ether, 5));
        Budget.Transfer memory request = abi.decode(noRewards, (Budget.Transfer));
        Budget.FungiblePayload memory payload = abi.decode(request.data, (Budget.FungiblePayload));
        assertEq(payload.amount, 0);

        // Preflight with zero max claims
        bytes memory noClaims =
            incentive.preflight(_initPayload(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 0));
        Budget.Transfer memory request2 = abi.decode(noClaims, (Budget.Transfer));
        Budget.FungiblePayload memory payload2 = abi.decode(request2.data, (Budget.FungiblePayload));
        assertEq(payload2.amount, 0);
    }

    function testPreflight_RaffleStrategy() public view {
        // Check the preflight data for a raffle
        bytes memory data =
            incentive.preflight(_initPayload(address(mockAsset), AERC20Incentive.Strategy.RAFFLE, 1 ether, 5));
        Budget.Transfer memory budgetRequest = abi.decode(data, (Budget.Transfer));

        assertEq(budgetRequest.asset, address(mockAsset));

        Budget.FungiblePayload memory payload = abi.decode(budgetRequest.data, (Budget.FungiblePayload));
        assertEq(payload.amount, 1 ether);
    }

    /////////////////////////////////
    // ERC20Incentive.drawRaffle   //
    /////////////////////////////////

    function testDrawRaffle() public {
        // Initialize the ERC20Incentive raffling 100 eth to 1 of 5 entrants
        _initialize(address(mockAsset), AERC20Incentive.Strategy.RAFFLE, 100 ether, 5);

        // Claim the incentive for 5 different addresses
        address[] memory recipients = _randomAccounts(5);
        for (uint256 i = 0; i < 5; i++) {
            incentive.claim(recipients[i], hex"");
        }

        // Mock the environment so our PRNG is easily predictable
        vm.prevrandao(bytes32(uint256(42)));
        vm.warp(100);

        // Draw the raffle, the winner should be the address at index 3 because the
        // PRNG is seeded with `142` which means the first random value will be:
        // 64619794903595674682953496420467953339178421197965090540722661986171627552023
        // and we apply modulo 5 to get 3, which is the index of the winner.
        incentive.drawRaffle();

        // Check that the winner was selected and rewarded
        assertEq(mockAsset.balanceOf(address(recipients[3])), 100 ether);
    }

    function testDrawRaffle_NotRaffleStrategy() public {
        // Initialize the ERC20Incentive with a POOL strategy
        _initialize(address(mockAsset), AERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Attempt to draw the raffle => revert
        vm.expectRevert(BoostError.Unauthorized.selector);
        incentive.drawRaffle();
    }

    ////////////////////////////////////
    // ERC20Incentive.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public view {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
    }

    /////////////////////////////////////
    // ERC20Incentive.supportsInterface //
    /////////////////////////////////////

    function testSupportsInterface() public view {
        // Ensure the contract supports the Budget interface
        assertTrue(incentive.supportsInterface(type(Incentive).interfaceId));
    }

    function testSupportsInterface_NotSupported() public view {
        // Ensure the contract does not support an unsupported interface
        assertFalse(incentive.supportsInterface(type(Test).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newIncentiveClone() internal returns (ERC20Incentive) {
        return ERC20Incentive(LibClone.clone(address(new ERC20Incentive())));
    }

    function _initialize(address asset, AERC20Incentive.Strategy strategy, uint256 reward, uint256 limit) internal {
        incentive.initialize(_initPayload(asset, strategy, reward, limit));
    }

    function _initPayload(address asset, AERC20Incentive.Strategy strategy, uint256 reward, uint256 limit)
        internal
        pure
        returns (bytes memory)
    {
        return abi.encode(ERC20Incentive.InitPayload({asset: asset, strategy: strategy, reward: reward, limit: limit}));
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
        } else if (assetType == Budget.AssetType.ERC1155) {
            // we're not actually handling this case yet, so hardcoded token ID of 1 is fine
            transfer.data = abi.encode(Budget.ERC1155Payload({tokenId: 1, amount: value, data: ""}));
        }

        return abi.encode(transfer);
    }

    function _randomAccounts(uint256 count) internal returns (address[] memory accounts) {
        accounts = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            accounts[i] = makeAddr(string(abi.encodePacked(uint256(i))));
        }
    }
}
