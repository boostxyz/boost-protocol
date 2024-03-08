// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "src/shared/Mocks.sol";

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {Incentive} from "src/incentives/Incentive.sol";
import {ERC20Incentive} from "src/incentives/ERC20Incentive.sol";

import {SimpleBudget} from "src/budgets/SimpleBudget.sol";

contract ERC20IncentiveTest is Test {
    using LibZip for bytes;
    using SafeTransferLib for address;

    ERC20Incentive public incentive;
    SimpleBudget public budget = new SimpleBudget();
    MockERC20 public mockAsset = new MockERC20();

    function setUp() public {
        incentive = _newIncentiveClone();

        // Preload the budget with some mock tokens
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(budget), 100 ether);
        budget.allocate(LibZip.cdCompress(abi.encode(address(mockAsset), 100 ether)));

        // NOTE: This would normally be handled by BoostCore during the setup
        //   process, but we do it manually here to test without spinning up
        //   the entire protocol stack. This is a _unit_ test, after all.
        budget.disburse(address(incentive), LibZip.cdCompress(abi.encode(address(mockAsset), 100 ether)));
    }

    ///////////////////////////////
    // ERC20Incentive.initialize //
    ///////////////////////////////

    function testInitialize() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Check the incentive parameters
        assertTrue(incentive.strategy() == ERC20Incentive.Strategy.POOL);
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.reward(), 1 ether);
        assertEq(incentive.maxClaims(), 5);
    }

    function testInitialize_InsufficientAllocation() public {
        // Initialize with maxReward > allocation => revert
        vm.expectRevert(abi.encodeWithSelector(BoostError.InsufficientFunds.selector, mockAsset, 100 ether, 101 ether));
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 101);
    }

    function testInitialize_UnsupportedStrategy() public {
        // Initialize with MINT (not yet supported) => revert
        vm.expectRevert(BoostError.NotImplemented.selector);
        _initialize(address(mockAsset), ERC20Incentive.Strategy.MINT, 1 ether, 5);
    }

    function testInitialize_InvalidInitialization() public {
        // Initialize with no reward amount
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 0 ether, 5);

        // Initialize with zero max claims
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 0);
    }

    //////////////////////////
    // ERC20Incentive.claim //
    //////////////////////////

    function testClaim() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        vm.expectEmit(true, false, false, true);
        emit Incentive.Claimed(address(1), abi.encodePacked(address(mockAsset), address(1), uint256(1 ether)));

        // Claim the incentive
        incentive.claim(LibZip.cdCompress(abi.encode(address(1), bytes(""))));

        // Check the claim status
        assertTrue(incentive.claimed(address(1)));
    }

    function testClaim_AlreadyClaimed() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive on behalf of address(1)
        incentive.claim(LibZip.cdCompress(abi.encode(address(1), bytes(""))));

        // Attempt to claim for address(1) again => revert
        vm.expectRevert(Incentive.NotClaimable.selector);
        incentive.claim(LibZip.cdCompress(abi.encode(address(1), bytes(""))));
    }

    ////////////////////////////////
    // ERC20Incentive.isClaimable //
    ////////////////////////////////

    function testIsClaimable() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Check if the incentive is claimable
        assertTrue(incentive.isClaimable(LibZip.cdCompress(abi.encode(address(1), bytes("")))));
    }

    function testIsClaimable_AlreadyClaimed() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive on behalf of address(1)
        incentive.claim(LibZip.cdCompress(abi.encode(address(1), bytes(""))));

        // Check if the incentive is claimable for address(1) => false
        assertFalse(incentive.isClaimable(LibZip.cdCompress(abi.encode(address(1), bytes("")))));
    }

    function testIsClaimable_ExceedsMaxClaims() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive for 5 different addresses
        address[] memory recipients = _randomAccounts(6);
        for (uint256 i = 0; i < 5; i++) {
            incentive.claim(LibZip.cdCompress(abi.encode(recipients[i], bytes(""))));
        }

        // Check the claim count
        assertEq(incentive.claims(), 5);

        // Check if the incentive is claimable for the 6th address => false
        assertFalse(incentive.isClaimable(LibZip.cdCompress(abi.encode(recipients[5], bytes("")))));
    }

    //////////////////////////////
    // ERC20Incentive.preflight //
    //////////////////////////////

    function testPreflight() public {
        // Check the preflight data
        bytes memory data = incentive.preflight(LibZip.cdCompress(abi.encode(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5)));
        (address asset, uint256 amount) = abi.decode(data, (address, uint256));

        assertEq(asset, address(mockAsset));
        assertEq(amount, 5 ether);
    }

    function testPreflight_WeirdRewards() public {
        // Preflight with no reward amount
        bytes memory noRewards = incentive.preflight(LibZip.cdCompress(abi.encode(address(mockAsset), ERC20Incentive.Strategy.POOL, 0 ether, 5)));
        (, uint256 shouldBeZero) = abi.decode(noRewards, (address, uint256));
        assertEq(shouldBeZero, 0);

        // Preflight with zero max claims
        bytes memory noClaims = incentive.preflight(LibZip.cdCompress(abi.encode(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 0)));
        (, uint256 shouldAlsoBeZero) = abi.decode(noClaims, (address, uint256));
        assertEq(shouldAlsoBeZero, 0);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newIncentiveClone() internal returns (ERC20Incentive) {
        return ERC20Incentive(LibClone.clone(address(new ERC20Incentive())));
    }

    function _initialize(address asset, ERC20Incentive.Strategy strategy, uint256 reward, uint256 maxClaims) internal {
        incentive.initialize(LibZip.cdCompress(abi.encode(asset, strategy, reward, maxClaims)));
    }

    function _randomAccounts(uint256 count) internal returns (address[] memory accounts) {
        accounts = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            accounts[i] = makeAddr(string(abi.encodePacked(uint256(i))));
        }
    }
}
