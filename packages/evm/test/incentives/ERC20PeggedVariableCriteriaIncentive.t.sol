// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive, IBoostClaim} from "contracts/incentives/AIncentive.sol";
import {ERC20PeggedVariableCriteriaIncentive} from "contracts/incentives/ERC20PeggedVariableCriteriaIncentive.sol";
import {AERC20PeggedIncentive} from "contracts/incentives/AERC20PeggedIncentive.sol";
import {
    AERC20PeggedVariableCriteriaIncentive,
    SignatureType,
    ValueType
} from "contracts/incentives/AERC20PeggedVariableCriteriaIncentive.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

/// @title ERC20PeggedVariableCriteriaIncentiveTest
/// @notice Tests for the updated ERC20PeggedVariableCriteriaIncentive contract with `maxReward` support
contract ERC20PeggedVariableCriteriaIncentiveTest is Test {
    using SafeTransferLib for address;

    ERC20PeggedVariableCriteriaIncentive public incentive;
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

    /////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.initialize
    /////////////////////////////////////////////////

    function testInitialize() public {
        // Initialize the ERC20PeggedVariableCriteriaIncentive with a maxReward of 2 ether
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));

        // Check the incentive parameters
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.getPeg(), address(pegAsset));
        assertEq(incentive.reward(), 1 ether);
        assertEq(incentive.limit(), 5 ether);

        // maxReward is internal and not directly accessible, but we can test it indirectly through claims
    }

    function testInitialize_InsufficientFunds() public {
        // Attempt to initialize with a limit greater than available balance => revert
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InsufficientFunds.selector, address(mockAsset), 100 ether, 101 ether)
        );
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 101 ether, 2 ether, address(this));
    }

    function testInitialize_InvalidInitialization() public {
        // Attempt to initialize with invalid parameters => revert
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), address(pegAsset), 0, 0, 0, address(this));
    }

    /////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.claim   //
    /////////////////////////////////////////////////

    function testClaim_Simple() public {
        // Initialize with a fixed reward and a nonzero maxReward
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));

        // Expect a claim event
        vm.expectEmit(true, false, false, true);
        emit AIncentive.Claimed(address(this), abi.encodePacked(address(mockAsset), address(this), uint256(1 ether)));

        // Claim with a signedAmount that leads directly to claimAmount = reward
        // signedAmount = 1 ether * (1e18 / reward) to get exactly 1 ether claim
        incentive.claim(address(this), _encodeBoostClaim(1 ether));

        // Check balances and accounting
        assertEq(mockAsset.balanceOf(address(this)), 1 ether);
        assertFalse(incentive.isClaimable(address(this), _encodeBoostClaim(5 ether))); // already claimed
        assertEq(incentive.totalClaimed(), 1 ether);
        assertEq(incentive.claims(), 1);
    }

    function testClaim_NotClaimable() public {
        // Initialize the ERC20PeggedVariableCriteriaIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 0 ether, address(this));

        // First claim
        incentive.claim(address(this), _encodeBoostClaim(4.1 ether));

        // Attempt to claim again for an amount that should take us over limit
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(address(this), _encodeBoostClaim(1 ether));
    }

    function testClaim_ExceedsLimit() public {
        // Initialize the ERC20PeggedVariableCriteriaIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 0 ether, address(this));

        // Attempt to claim more than the limit
        // signedAmount = 6 ether => claimAmount = 1 ether * 6 ether / 1e18 = 6 ether > limit of 5 ether
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(address(this), _encodeBoostClaim(6 ether));
    }

    ///////////////////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.claim with maxReward //
    ///////////////////////////////////////////////////////////////

    function testClaim_WithMaxReward_EnforceCap() public {
        // Initialize with reward=1 ether, limit=10 ether, maxReward=2 ether
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 10 ether, 2 ether, address(this));

        // If we try to claim with signedAmount of 5 ether:
        // claimAmount = reward * signedAmount / 1e18 = 5 ether
        // maxReward = 2 ether, so claimAmount should be capped at 2 ether
        incentive.claim(address(this), _encodeBoostClaim(5 ether));

        // Check result
        assertEq(mockAsset.balanceOf(address(this)), 2 ether); // capped at 2 ether
        assertEq(incentive.totalClaimed(), 2 ether);
        assertEq(incentive.claims(), 1);
    }

    function testClaim_WithMaxReward_UnderMax() public {
        // Initialize with reward=1 ether, limit=10 ether, maxReward=2 ether
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 10 ether, 2 ether, address(this));

        // If we claim with a signedAmount of 1 ether:
        // claimAmount = 1 ether (since reward * 1 ether / 1e18 = 1 ether)
        // 1 ether <= maxReward=2 ether, so no capping needed
        incentive.claim(address(this), _encodeBoostClaim(1 ether));

        assertEq(mockAsset.balanceOf(address(this)), 1 ether);
        assertEq(incentive.totalClaimed(), 1 ether);
        assertEq(incentive.claims(), 1);
    }

    function testClaim_WithMaxReward_NoRewardOverride() public {
        // If reward=0, then claimAmount = signedAmount directly
        // Initialize with reward=0, limit=10 ether, maxReward=2 ether
        _initialize(address(mockAsset), address(pegAsset), 0, 10 ether, 2 ether, address(this));

        // signedAmount = 5 ether -> claimAmount = 5 ether but capped at maxReward=2 ether
        incentive.claim(address(this), _encodeBoostClaim(5 ether));

        // Check result
        assertEq(mockAsset.balanceOf(address(this)), 2 ether); // capped at 2 ether
        assertEq(incentive.totalClaimed(), 2 ether);
        assertEq(incentive.claims(), 1);
    }

    //////////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.preflight    //
    //////////////////////////////////////////////////////

    function testPreflight() public {
        AERC20PeggedVariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20PeggedVariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset),
            valueType: ValueType.WAD
        });
        bytes memory preflightPayload = incentive.preflight(
            abi.encode(
                ERC20PeggedVariableCriteriaIncentive.InitPayload({
                    asset: address(mockAsset),
                    peg: address(pegAsset),
                    reward: 1 ether,
                    limit: 5 ether,
                    maxReward: 2 ether,
                    manager: address(this),
                    criteria: criteria
                })
            )
        );

        ABudget.Transfer memory transfer = abi.decode(preflightPayload, (ABudget.Transfer));
        assertEq(transfer.asset, address(mockAsset));
        assertEq(transfer.target, address(incentive));
        assertEq(abi.decode(transfer.data, (ABudget.FungiblePayload)).amount, 5 ether);
    }

    //////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.clawback
    //////////////////////////////////////////////

    function testClawback() public {
        // Initialize the ERC20PeggedVariableCriteriaIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));

        // Clawback some tokens
        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(this), data: abi.encode(2 ether)}));
        incentive.clawback(reclaimPayload);

        // Check the balance and limit
        assertEq(mockAsset.balanceOf(address(this)), 2 ether);
        assertEq(incentive.limit(), 3 ether);
    }

    function testClawback_Unauthorized() public {
        // Initialize the ERC20PeggedVariableCriteriaIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));

        // Attempt to call clawback from an unauthorized address
        address unauthorized = address(0x1234);
        vm.prank(unauthorized);
        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(this), data: abi.encode(2 ether)}));
        vm.expectRevert(BoostError.Unauthorized.selector);
        incentive.clawback(reclaimPayload);
    }

    function testGetPeg() public {
        // Initialize the ERC20PeggedVariableCriteriaIncentive
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));

        // Check the peg address
        assertEq(incentive.getPeg(), address(pegAsset));
    }

    ////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.topup
    ////////////////////////////////////////////////

    function testTopup() public {
        // Initialize with reward=1 ether, limit=5 ether.
        // The contract will hold 100 ether from setUp().
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));
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
        _initialize(address(mockAsset), address(pegAsset), 1 ether, 5 ether, 2 ether, address(this));

        // Attempt to top up 0 => revert with InvalidInitialization
        mockAsset.mint(address(this), 100 ether);

        mockAsset.approve(address(incentive), 100 ether);
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        incentive.topup(0);
    }

    //////////////////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.getComponentInterface
    //////////////////////////////////////////////////////////////

    function testGetComponentInterface() public view {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
        assertEq(incentive.getComponentInterface(), type(AERC20PeggedVariableCriteriaIncentive).interfaceId);
    }

    //////////////////////////////////////////////////
    // ERC20PeggedVariableCriteriaIncentive.supportsInterface
    //////////////////////////////////////////////////

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

    function _newIncentiveClone() internal returns (ERC20PeggedVariableCriteriaIncentive) {
        return ERC20PeggedVariableCriteriaIncentive(LibClone.clone(address(new ERC20PeggedVariableCriteriaIncentive())));
    }

    function _newBudgetClone() internal returns (ManagedBudget newBudget) {
        address[] memory authorized = new address[](0);
        uint256[] memory roles = new uint256[](0);
        ManagedBudget.InitPayload memory initPayload = ManagedBudget.InitPayload(address(this), authorized, roles);
        newBudget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        newBudget.initialize(abi.encode(initPayload));
    }

    function _initialize(address asset, address peg, uint256 reward, uint256 limit, uint256 maxReward, address manager)
        internal
    {
        incentive.initialize(_initPayload(asset, peg, reward, maxReward, limit, manager));
    }

    function _initPayload(address asset, address peg, uint256 reward, uint256 maxReward, uint256 limit, address manager)
        internal
        view
        returns (bytes memory)
    {
        AERC20PeggedVariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20PeggedVariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset),
            valueType: ValueType.WAD
        });
        return abi.encode(
            ERC20PeggedVariableCriteriaIncentive.InitPayload({
                asset: asset,
                peg: peg,
                reward: reward,
                limit: limit,
                maxReward: maxReward,
                manager: manager,
                criteria: criteria
            })
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
}
