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

import {Budget} from "src/budgets/Budget.sol";
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
        bytes memory claimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")})));
        incentive.claim(claimPayload);

        // Check the claim status
        assertTrue(incentive.claimed(address(1)));
    }

    function testClaim_AlreadyClaimed() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive on behalf of address(1)
        bytes memory claimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")})));
        incentive.claim(claimPayload);

        // Attempt to claim for address(1) again => revert
        vm.expectRevert(Incentive.NotClaimable.selector);
        incentive.claim(claimPayload);
    }

    ////////////////////////////
    // ERC20Incentive.reclaim //
    ////////////////////////////

    function testReclaim() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 100);
        assertEq(incentive.maxClaims(), 100);

        // Reclaim 50x the reward amount
        bytes memory reclaimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: abi.encode(50 ether)})));
        incentive.reclaim(reclaimPayload);
        assertEq(mockAsset.balanceOf(address(1)), 50 ether);

        // Check that enough assets remain to cover 50 more claims
        assertEq(mockAsset.balanceOf(address(incentive)), 50 ether);
        assertEq(incentive.maxClaims(), 50);
    }

    function testReclaim_InvalidAmount() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 100);

        // Reclaim 50.1x => not an integer multiple of the reward amount => revert
        bytes memory reclaimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: abi.encode(50.1 ether)})));
        vm.expectRevert(
            abi.encodeWithSelector(
                BoostError.ClaimFailed.selector, address(this), reclaimPayload.cdDecompress()
            )
        );
        incentive.reclaim(reclaimPayload);
    }

    ////////////////////////////////
    // ERC20Incentive.isClaimable //
    ////////////////////////////////

    function testIsClaimable() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Check if the incentive is claimable
        bytes memory claimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")})));
        assertTrue(incentive.isClaimable(claimPayload));
    }

    function testIsClaimable_AlreadyClaimed() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive on behalf of address(1)
        bytes memory claimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: bytes("")})));
        incentive.claim(claimPayload);

        // Check if the incentive is still claimable for address(1) => false
        assertFalse(incentive.isClaimable(claimPayload));
    }

    function testIsClaimable_ExceedsMaxClaims() public {
        // Initialize the ERC20Incentive
        _initialize(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5);

        // Claim the incentive for 5 different addresses
        address[] memory recipients = _randomAccounts(6);
        for (uint256 i = 0; i < 5; i++) {
            bytes memory claimPayload =
                LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: recipients[i], data: bytes("")})));
            incentive.claim(claimPayload);
        }

        // Check the claim count
        assertEq(incentive.claims(), 5);

        // Check if the incentive is claimable for the 6th address => false
        bytes memory nextClaimPayload =
            LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: recipients[5], data: bytes("")})));
        assertFalse(incentive.isClaimable(nextClaimPayload));
    }

    //////////////////////////////
    // ERC20Incentive.preflight //
    //////////////////////////////

    function testPreflight() public {
        // Check the preflight data
        bytes memory data =
            incentive.preflight(_initPayload(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 5));
        Budget.Transfer memory budgetRequest = abi.decode(data.cdDecompress(), (Budget.Transfer));

        assertEq(budgetRequest.asset, address(mockAsset));

        Budget.FungiblePayload memory payload = abi.decode(budgetRequest.data, (Budget.FungiblePayload));
        assertEq(payload.amount, 5 ether);
    }

    function testPreflight_WeirdRewards() public {
        // Preflight with no reward amount
        bytes memory noRewards =
            incentive.preflight(_initPayload(address(mockAsset), ERC20Incentive.Strategy.POOL, 0 ether, 5));
        Budget.Transfer memory request = abi.decode(noRewards.cdDecompress(), (Budget.Transfer));
        Budget.FungiblePayload memory payload = abi.decode(request.data, (Budget.FungiblePayload));
        assertEq(payload.amount, 0);

        // Preflight with zero max claims
        bytes memory noClaims =
            incentive.preflight(_initPayload(address(mockAsset), ERC20Incentive.Strategy.POOL, 1 ether, 0));
        Budget.Transfer memory request2 = abi.decode(noClaims.cdDecompress(), (Budget.Transfer));
        Budget.FungiblePayload memory payload2 = abi.decode(request2.data, (Budget.FungiblePayload));
        assertEq(payload2.amount, 0);
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newIncentiveClone() internal returns (ERC20Incentive) {
        return ERC20Incentive(LibClone.clone(address(new ERC20Incentive())));
    }

    function _initialize(address asset, ERC20Incentive.Strategy strategy, uint256 reward, uint256 maxClaims) internal {
        incentive.initialize(_initPayload(asset, strategy, reward, maxClaims));
    }

    function _initPayload(address asset, ERC20Incentive.Strategy strategy, uint256 reward, uint256 maxClaims)
        internal
        pure
        returns (bytes memory)
    {
        return LibZip.cdCompress(
            abi.encode(
                ERC20Incentive.InitPayload({asset: asset, strategy: strategy, reward: reward, maxClaims: maxClaims})
            )
        );
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

        return LibZip.cdCompress(abi.encode(transfer));
    }

    function _randomAccounts(uint256 count) internal returns (address[] memory accounts) {
        accounts = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            accounts[i] = makeAddr(string(abi.encodePacked(uint256(i))));
        }
    }
}
