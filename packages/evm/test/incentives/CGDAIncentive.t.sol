// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";
import {CGDAIncentive} from "contracts/incentives/CGDAIncentive.sol";

import {Budget} from "contracts/budgets/Budget.sol";
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
            bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: accounts[i], data: bytes("")}));
            incentive.claim(claimPayload);
        }

        assertEq(incentive.currentReward(), 0.25 ether);
        assertEq(asset.balanceOf(address(incentive)), 0.25 ether);

        incentive.claim(
            abi.encode(Incentive.ClaimPayload({target: makeAddr("zach zebra's zootopia"), data: bytes("")}))
        );

        assertEq(incentive.currentReward(), 0 ether);
        assertEq(asset.balanceOf(address(incentive)), 0 ether);
    }

    function test_claim_OutOfBudget() public {
        incentive.reclaim(
            abi.encode(
                Incentive.ClaimPayload({target: makeAddr("weird al's wonky waffle house"), data: abi.encode(10 ether)})
            )
        );

        assertEq(incentive.currentReward(), 0 ether);
        assertEq(asset.balanceOf(address(incentive)), 0 ether);

        vm.expectRevert(Incentive.NotClaimable.selector);
        incentive.claim(
            abi.encode(Incentive.ClaimPayload({target: makeAddr("sam's soggy sandwich & soup shack"), data: bytes("")}))
        );

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

    function test_reclaim() public {
        address[] memory accounts = _randomAccounts(10);
        for (uint256 i = 0; i < accounts.length; i++) {
            bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: accounts[i], data: bytes("")}));
            incentive.claim(claimPayload);
        }

        assertEq(incentive.currentReward(), 0.5 ether);
        assertEq(asset.balanceOf(address(incentive)), 2.25 ether);

        bytes memory reclaimPayload =
            abi.encode(Incentive.ClaimPayload({target: address(0xdeadbeef), data: abi.encode(2 ether)}));
        incentive.reclaim(reclaimPayload);

        assertEq(incentive.currentReward(), 0.25 ether);
        assertEq(asset.balanceOf(address(incentive)), 0.25 ether);
    }

    ///////////////////////////////
    // CGDAIncentive.isClaimable //
    ///////////////////////////////

    function test_isClaimable() public {
        address[] memory accounts = _randomAccounts(15);
        for (uint256 i = 0; i < accounts.length; i++) {
            bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: accounts[i], data: bytes("")}));
            incentive.claim(claimPayload);
        }

        assertEq(incentive.isClaimable(abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")}))), true);

        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")})));

        assertEq(
            incentive.isClaimable(abi.encode(Incentive.ClaimPayload({target: address(2), data: bytes("")}))), false
        );
    }

    /////////////////////////////
    // CGDAIncentive.preflight //
    /////////////////////////////

    function test_preflight() public {
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
        Budget.Transfer memory transfer = abi.decode(preflightPayload, (Budget.Transfer));

        assertTrue(transfer.assetType == Budget.AssetType.ERC20);
        assertEq(transfer.asset, address(asset));
        assertEq(transfer.target, address(incentive));
        assertEq(abi.decode(transfer.data, (uint256)), 10 ether);
    }

    ////////////////////////////////////
    // CGDAIncentive.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
    }

    /////////////////////////////////////
    // CGDAIncentive.supportsInterface //
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

    function _makeClaim(address target_) internal {
        bytes memory claimPayload = abi.encode(Incentive.ClaimPayload({target: target_, data: bytes("")}));
        incentive.claim(claimPayload);
    }

    function _makeFungibleTransfer(Budget.AssetType assetType_, address asset_, address target_, uint256 value_)
        internal
        pure
        returns (bytes memory)
    {
        Budget.Transfer memory transfer = Budget.Transfer({
            assetType: assetType_,
            asset: asset_,
            target: target_,
            data: abi.encode(Budget.FungiblePayload({amount: value_}))
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
