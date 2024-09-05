// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {CGDAIncentive} from "contracts/incentives/CGDAIncentive.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {SimpleBudget} from "contracts/budgets/SimpleBudget.sol";

contract CGDAIncentiveTest is Test {
    using SafeTransferLib for address;

    MockERC20 public asset = new MockERC20();
    SimpleBudget public budget;
    CGDAIncentive public incentive;

    function setUp() public {
        incentive = CGDAIncentive(LibClone.clone(address(new CGDAIncentive())));
        asset.mint(address(incentive), 10 ether);
        incentive.initialize(
            abi.encode(
                CGDAIncentive.InitPayload({
                    asset: address(asset),
                    initialReward: 1 ether,
                    rewardDecay: 0.05 ether,
                    rewardBoost: 0.1 ether,
                    totalBudget: 10 ether
                })
            )
        );
    }

    ////////////////////
    // Initialization //
    ////////////////////

    function test_initialize() public {
        incentive = CGDAIncentive(LibClone.clone(address(new CGDAIncentive())));
        asset.mint(address(incentive), 10 ether);
        incentive.initialize(
            abi.encode(
                CGDAIncentive.InitPayload({
                    asset: address(asset),
                    initialReward: 1 ether,
                    rewardDecay: 0.05 ether,
                    rewardBoost: 0.1 ether,
                    totalBudget: 10 ether
                })
            )
        );

        (uint256 rewardDecay, uint256 rewardBoost, uint256 lastClaimTime, uint256 currentReward) =
            incentive.cgdaParams();

        assertEq(incentive.asset(), address(asset));
        assertEq(rewardDecay, 0.05 ether);
        assertEq(rewardBoost, 0.1 ether);
        assertEq(lastClaimTime, 1);
        assertEq(currentReward, 1 ether);
        assertEq(incentive.totalBudget(), 10 ether);
        assertEq(incentive.owner(), address(this));
    }

    function test_initialize_InsufficientFunds() public {
        incentive = CGDAIncentive(LibClone.clone(address(new CGDAIncentive())));
        asset.mint(address(incentive), 5 ether); // Mint less than totalBudget

        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InsufficientFunds.selector, address(asset), 5 ether, 10 ether)
        );
        incentive.initialize(
            abi.encode(
                CGDAIncentive.InitPayload({
                    asset: address(asset),
                    initialReward: 1 ether,
                    rewardDecay: 0.05 ether,
                    rewardBoost: 0.1 ether,
                    totalBudget: 10 ether
                })
            )
        );
    }

    function test_initialize_InvalidInitialization_ZeroInitialReward() public {
        incentive = CGDAIncentive(LibClone.clone(address(new CGDAIncentive())));
        asset.mint(address(incentive), 10 ether);

        vm.expectRevert(BoostError.InvalidInitialization.selector);
        incentive.initialize(
            abi.encode(
                CGDAIncentive.InitPayload({
                    asset: address(asset),
                    initialReward: 0, // Invalid initialReward
                    rewardDecay: 0.05 ether,
                    rewardBoost: 0.1 ether,
                    totalBudget: 10 ether
                })
            )
        );
    }

    function test_initialize_InvalidInitialization_TotalBudgetLessThanInitialReward() public {
        incentive = CGDAIncentive(LibClone.clone(address(new CGDAIncentive())));
        asset.mint(address(incentive), 10 ether);

        vm.expectRevert(BoostError.InvalidInitialization.selector);
        incentive.initialize(
            abi.encode(
                CGDAIncentive.InitPayload({
                    asset: address(asset),
                    initialReward: 11 ether, // initialReward greater than totalBudget
                    rewardDecay: 0.05 ether,
                    rewardBoost: 0.1 ether,
                    totalBudget: 10 ether
                })
            )
        );
    }

    /////////////////////////
    // CGDAIncentive.claim //
    /////////////////////////

    function test_claim() public {
        assertEq(incentive.currentReward(), 1 ether);

        address[] memory accounts = _randomAccounts(15);
        for (uint256 i = 0; i < accounts.length; i++) {
            incentive.claim(accounts[i], hex"");
        }

        assertEq(incentive.currentReward(), 0.25 ether);
        assertEq(asset.balanceOf(address(incentive)), 0.25 ether);

        incentive.claim(makeAddr("zach zebra's zootopia"), hex"");

        assertEq(incentive.currentReward(), 0 ether);
        assertEq(asset.balanceOf(address(incentive)), 0 ether);
    }

    function test_claim_OutOfBudget() public {
        incentive.clawback(
            abi.encode(
                AIncentive.ClawbackPayload({
                    target: makeAddr("weird al's wonky waffle house"),
                    data: abi.encode(10 ether)
                })
            )
        );

        assertEq(incentive.currentReward(), 0 ether);
        assertEq(asset.balanceOf(address(incentive)), 0 ether);

        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(makeAddr("sam's soggy sandwich & soup shack"), hex"");

        assertEq(incentive.currentReward(), 0 ether);
        assertEq(asset.balanceOf(address(incentive)), 0 ether);
    }

    /////////////////////////////////
    // CGDAIncentive.currentReward //
    /////////////////////////////////

    function test_currentReward() public {
        (uint256 rewardDecay, uint256 rewardBoost, uint256 lastClaimTime, uint256 currentReward) =
            incentive.cgdaParams();

        assertEq(lastClaimTime, 1);
        assertEq(rewardDecay, 0.05 ether);
        assertEq(rewardBoost, 0.1 ether);
        assertEq(currentReward, 1 ether);

        skip(1 hours + 30 minutes);
        assertEq(incentive.currentReward(), 1.15 ether);

        skip(3 days + 16 hours + 29 minutes + 59 seconds);
        assertEq(incentive.currentReward(), 9.999972222222222222 ether);

        skip(1 seconds);
        assertEq(incentive.currentReward(), 10 ether);

        skip(42 weeks);
        assertEq(incentive.currentReward(), 10 ether);
    }

    function test_currentReward_WithClaims() public {
        // No claims for 1.5 hours, reward should increase to 1.15 eth
        skip(1 hours + 30 minutes);
        assertEq(incentive.currentReward(), 1.15 ether);

        // Make 2 claims in the first hour, reward should decrease to 1.05 eth
        _makeClaim(makeAddr("alice unchained"));
        _makeClaim(makeAddr("bob barker's burgers"));
        assertEq(incentive.currentReward(), 1.05 ether);

        // No claims for 2 hours, reward should increase by 2x rewardBoost to 1.25 eth
        skip(2 hours);
        assertEq(incentive.currentReward(), 1.25 ether);
        _makeClaim(makeAddr("charlie sheen's angels"));
        assertEq(incentive.currentReward(), 1.2 ether);

        // No claims for 2 hours, reward should increase by 2x rewardBoost to 1.4 eth
        skip(2 hours);
        assertEq(incentive.currentReward(), 1.4 ether);
        _makeClaim(makeAddr("dennis 'the menace' rodman"));
        _makeClaim(makeAddr("eli and/or peyton manning"));
        _makeClaim(makeAddr("freddie mercury and friends"));
        _makeClaim(makeAddr("gary busey in the sky with diamonds"));

        // That leaves enough for exactly 1 claim in the budget
        assertEq(incentive.currentReward(), 1.2 ether);
        assertEq(asset.balanceOf(address(incentive)), 1.2 ether);

        // No amount of time will increase the reward
        skip(10_000 hours);
        assertEq(incentive.currentReward(), 1.2 ether);

        // Make the last claim, show's over folks
        _makeClaim(makeAddr("howie mandel's deal or no deal"));
        assertEq(asset.balanceOf(address(incentive)), 0);
        assertEq(incentive.currentReward(), 0);
    }

    ///////////////////////////
    // CGDAIncentive.reclaim //
    ///////////////////////////

    function test_clawback() public {
        address[] memory accounts = _randomAccounts(10);
        for (uint256 i = 0; i < accounts.length; i++) {
            incentive.claim(accounts[i], hex"");
        }

        assertEq(incentive.currentReward(), 0.5 ether);
        assertEq(asset.balanceOf(address(incentive)), 2.25 ether);

        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(0xdeadbeef), data: abi.encode(2 ether)}));
        incentive.clawback(reclaimPayload);

        assertEq(incentive.currentReward(), 0.25 ether);
        assertEq(asset.balanceOf(address(incentive)), 0.25 ether);
    }

    ///////////////////////////////
    // CGDAIncentive.isClaimable //
    ///////////////////////////////

    function test_isClaimable() public {
        address[] memory accounts = _randomAccounts(15);
        for (uint256 i = 0; i < accounts.length; i++) {
            incentive.claim(accounts[i], hex"");
        }

        assertEq(incentive.isClaimable(address(1), hex""), true);

        incentive.claim(address(1), hex"");

        assertEq(incentive.isClaimable(address(2), hex""), false);
    }

    /////////////////////////////
    // CGDAIncentive.preflight //
    /////////////////////////////

    function test_preflight() public view {
        bytes memory preflightPayload = incentive.preflight(
            abi.encode(
                CGDAIncentive.InitPayload({
                    asset: address(asset),
                    initialReward: 1 ether,
                    rewardDecay: 0.05 ether,
                    rewardBoost: 0.1 ether,
                    totalBudget: 10 ether
                })
            )
        );
        ABudget.Transfer memory transfer = abi.decode(preflightPayload, (ABudget.Transfer));

        assertTrue(transfer.assetType == ABudget.AssetType.ERC20);
        assertEq(transfer.asset, address(asset));
        assertEq(transfer.target, address(incentive));
        assertEq(abi.decode(transfer.data, (uint256)), 10 ether);
    }

    ////////////////////////////////////
    // CGDAIncentive.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public view {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
    }

    /////////////////////////////////////
    // CGDAIncentive.supportsInterface //
    /////////////////////////////////////

    function testSupportsInterface() public view {
        // Ensure the contract supports the ABudget interface
        assertTrue(incentive.supportsInterface(type(AIncentive).interfaceId));
    }

    function testSupportsInterface_NotSupported() public view {
        // Ensure the contract does not support an unsupported interface
        assertFalse(incentive.supportsInterface(type(Test).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _makeClaim(address target_) internal {
        incentive.claim(target_, hex"");
    }

    function _makeFungibleTransfer(ABudget.AssetType assetType_, address asset_, address target_, uint256 value_)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer = ABudget.Transfer({
            assetType: assetType_,
            asset: asset_,
            target: target_,
            data: abi.encode(ABudget.FungiblePayload({amount: value_}))
        });

        return abi.encode(transfer);
    }

    function _randomAccounts(uint256 count) internal returns (address[] memory accounts) {
        accounts = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            accounts[i] = makeAddr(string(abi.encodePacked(uint256(i))));
        }
    }
}
