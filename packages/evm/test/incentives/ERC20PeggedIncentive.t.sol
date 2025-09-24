// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive, IBoostClaim} from "contracts/incentives/AIncentive.sol";
import {ERC20PeggedIncentive} from "contracts/incentives/ERC20PeggedIncentive.sol";
import {AERC20PeggedIncentive} from "contracts/incentives/AERC20PeggedIncentive.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

contract ERC20PeggedIncentiveTest is Test {
    using SafeTransferLib for address;

    ERC20PeggedIncentive public incentive;
    ManagedBudget public budget;
    MockERC20 public mockAsset = new MockERC20();
    MockERC20 public pegAsset = new MockERC20();

    function setUp() public {
        incentive = _newIncentiveClone();
        budget = _newBudgetClone();

        // Preload the budget with some mock tokens
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(budget), 100 ether);
        budget.allocate(_makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(this), 100 ether));

        // Manually handle the budget disbursement
        budget.disburse(
            _makeFungibleTransfer(ABudget.AssetType.ERC20, address(mockAsset), address(incentive), 100 ether)
        );
    }

    /////////////////////////////////////
    // ERC20PeggedIncentive.initialize //
    /////////////////////////////////////

    function testInitialize() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Check the incentive parameters
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.getPeg(), address(pegAsset));
        assertEq(incentive.reward(), 1 ether);
        assertEq(incentive.limit(), 5 ether);
    }

    function testInitialize_InsufficientFunds() public {
        // Attempt to initialize with a limit greater than available balance => revert
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InsufficientFunds.selector, address(mockAsset), 100 ether, 101 ether)
        );
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 101 ether, address(this));
    }

    function testInitialize_InvalidInitialization() public {
        // Attempt to initialize with invalid parameters => revert
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), address(pegAsset), 0, 0, address(this));
    }

    ////////////////////////////////
    // ERC20PeggedIncentive.claim //
    ////////////////////////////////

    function testClaim() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        vm.expectEmit(true, false, false, true);
        emit AIncentive.Claimed(address(this), abi.encodePacked(address(mockAsset), address(this), uint256(1 ether)));

        // Claim the incentive
        incentive.claim(address(this), _encodeBoostClaim(1 ether));

        // Check the claim status and balance
        assertEq(mockAsset.balanceOf(address(this)), 1 ether);
        assertFalse(incentive.isClaimable(address(this), _encodeBoostClaim(5 ether)));
        assertEq(incentive.totalClaimed(), 1 ether);
        assertEq(incentive.claims(), 1);
    }

    function testClaim_NotClaimable() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Claim the incentive
        incentive.claim(address(this), _encodeBoostClaim(1 ether));

        // Attempt to claim again => revert
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(address(this), _encodeBoostClaim(6 ether));
    }

    function testClaim_ExceedsLimit() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Attempt to claim more than the limit in a single claim => revert
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(address(this), _encodeBoostClaim(6 ether));
    }

    //////////////////////////////////////////////
    // ERC20PeggedIncentive.claim with referrer //
    //////////////////////////////////////////////

    function testClaim_WithReferrer() public {
        address referrer = makeAddr("referrer");
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        vm.expectEmit(true, false, false, true);
        emit AIncentive.Claimed(address(this), abi.encodePacked(address(mockAsset), address(this), uint256(1 ether)));

        // Claim the incentive
        incentive.claim(address(this), _encodeBoostClaimWithReferrer(1 ether, referrer));

        // Check the claim status and balance
        assertEq(mockAsset.balanceOf(address(this)), 1 ether);
        assertFalse(incentive.isClaimable(address(this), _encodeBoostClaimWithReferrer(5 ether, referrer)));
        assertEq(incentive.totalClaimed(), 1 ether);
        assertEq(incentive.claims(), 1);
    }

    /////////////////////////////////////
    // ERC20PeggedIncentive.preflight //
    /////////////////////////////////////

    function testPreflight() public view {
        bytes memory preflightPayload = incentive.preflight(
            abi.encode(
                ERC20PeggedIncentive.InitPayload({
                    asset: address(mockAsset),
                    peg: address(pegAsset),
                    reward: 1 ether,
                    limit: 5 ether,
                    manager: address(this)
                })
            )
        );

        ABudget.Transfer memory transfer = abi.decode(preflightPayload, (ABudget.Transfer));
        assertEq(transfer.asset, address(mockAsset));
        assertEq(transfer.target, address(incentive));
        assertEq(abi.decode(transfer.data, (ABudget.FungiblePayload)).amount, 5 ether);
    }

    ///////////////////////////////////
    // ERC20PeggedIncentive.clawback //
    ///////////////////////////////////

    function testClawback() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Clawback some tokens
        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(this), data: abi.encode(2 ether)}));
        incentive.clawback(reclaimPayload);

        // Check the balance and limit
        assertEq(mockAsset.balanceOf(address(this)), 2 ether);
        assertEq(incentive.limit(), 3 ether);
    }

    function testClawback_Unauthorized() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Attempt to call clawback from an unauthorized address
        address unauthorized = address(0x1234);
        vm.prank(unauthorized);
        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(this), data: abi.encode(2 ether)}));
        vm.expectRevert(BoostError.Unauthorized.selector);
        incentive.clawback(reclaimPayload);
    }

    function testGetPeg() public {
        // Initialize the ERC20PeggedIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Check the peg address
        assertEq(incentive.getPeg(), address(pegAsset));
    }

    ////////////////////////////////////////
    // ERC20VariablePeggedIncentive.topup //
    ////////////////////////////////////////

    function testTopup() public {
        // Initialize with reward=1 ether, limit=5 ether.
        // The contract will hold 100 ether from setUp().
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));
        assertEq(incentive.limit(), 5 ether, "Initial limit should be 5 ether");

        // Approve enough tokens so the incentive contract can pull them
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(incentive), 100 ether);

        // Top up an additional 5 ether
        incentive.topup(5 ether);

        // The limit should now be 10 ether
        assertEq(incentive.limit(), 10 ether, "Limit should increase by 5 ether");

        // The contract should now hold 105 ether total
        assertEq(mockAsset.balanceOf(address(incentive)), 105 ether, "Contract balance should now be 105 ether");
    }

    function testTopup_ZeroAmount() public {
        // Initialize with reward=1 ether, limit=5 ether
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, address(this));

        // Attempt to top up 0 => revert with InvalidInitialization
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(incentive), 100 ether);
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        incentive.topup(0);
    }

    ////////////////////////////////////////////////
    // ERC20PeggedIncentive.getComponentInterface //
    ////////////////////////////////////////////////

    function testGetComponentInterface() public view {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
        assertEq(incentive.getComponentInterface(), type(AERC20PeggedIncentive).interfaceId);
    }

    ////////////////////////////////////////////
    // ERC20PeggedIncentive.supportsInterface //
    ////////////////////////////////////////////

    function testSupportsInterface() public view {
        // Ensure the contract supports the AIncentive interface
        assertTrue(incentive.supportsInterface(type(AIncentive).interfaceId));
    }

    function testSupportsInterface_NotSupported() public view {
        // Ensure the contract does not support an unsupported interface
        assertFalse(incentive.supportsInterface(type(Test).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newIncentiveClone() internal returns (ERC20PeggedIncentive) {
        return ERC20PeggedIncentive(LibClone.clone(address(new ERC20PeggedIncentive())));
    }

    function _newBudgetClone() internal returns (ManagedBudget newBudget) {
        address[] memory authorized = new address[](0);
        uint256[] memory roles = new uint256[](0);
        ManagedBudget.InitPayload memory initPayload = ManagedBudget.InitPayload(address(this), authorized, roles);
        newBudget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        newBudget.initialize(abi.encode(initPayload));
    }

    function _initialize(address asset, address peg, uint256 reward, uint256 limit, address manager) internal {
        incentive.initialize(_initPayload(asset, peg, reward, limit, manager));
    }

    function _initPayload(address asset, address peg, uint256 reward, uint256 limit, address manager)
        internal
        pure
        returns (bytes memory)
    {
        return abi.encode(
            ERC20PeggedIncentive.InitPayload({asset: asset, peg: peg, reward: reward, limit: limit, manager: manager})
        );
    }

    function _makeFungibleTransfer(ABudget.AssetType assetType, address asset, address target, uint256 value)
        internal
        pure
        returns (bytes memory)
    {
        ABudget.Transfer memory transfer;
        transfer.assetType = assetType;
        transfer.asset = asset;
        transfer.target = target;
        transfer.data = abi.encode(ABudget.FungiblePayload({amount: value}));

        return abi.encode(transfer);
    }

    function _encodeBoostClaim(uint256 amount) internal pure returns (bytes memory data) {
        return abi.encode(IBoostClaim.BoostClaimData(hex"", abi.encode(amount)));
    }

    function _encodeBoostClaimWithReferrer(uint256 amount, address referrer)
        internal
        pure
        returns (bytes memory data)
    {
        return abi.encode(IBoostClaim.BoostClaimDataWithReferrer(hex"", abi.encode(amount), referrer));
    }
}
