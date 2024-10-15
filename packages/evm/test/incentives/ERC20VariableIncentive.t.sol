// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive, IBoostClaim} from "contracts/incentives/AIncentive.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {AERC20VariableIncentive} from "contracts/incentives/AERC20VariableIncentive.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ManagedBudget} from "contracts/budgets/ManagedBudget.sol";

contract ERC20VariableIncentiveTest is Test {
    using SafeTransferLib for address;

    // Declare test accounts as constants
    address CLAIM_RECIPIENT = makeAddr("CLAIM_RECIPIENT");
    address EXCEEDS_LIMIT_CLAIM = makeAddr("EXCEEDS_LIMIT_CLAIM");
    address VARIABLE_REWARD_CLAIM = makeAddr("VARIABLE_REWARD_CLAIM");

    ERC20VariableIncentive public incentive;
    ManagedBudget public budget;
    MockERC20 public mockAsset = new MockERC20();

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

    ///////////////////////////////////////
    // ERC20VariableIncentive.initialize //
    ///////////////////////////////////////

    function testInitialize() public {
        // Initialize the ERC20VariableIncentive
        _initialize(address(mockAsset), 1 ether, 5 ether);

        // Check the incentive parameters
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.reward(), 1 ether);
        assertEq(incentive.limit(), 5 ether);
    }

    function testInitialize_InsufficientFunds() public {
        // Attempt to initialize with a limit greater than available balance => revert
        vm.expectRevert(
            abi.encodeWithSelector(BoostError.InsufficientFunds.selector, address(mockAsset), 100 ether, 101 ether)
        );
        _initialize(address(mockAsset), 1 ether, 101 ether);
    }

    function testInitialize_InvalidInitialization() public {
        // Attempt to initialize with invalid parameters => revert
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        _initialize(address(mockAsset), 0, 0);
    }

    //////////////////////////////////
    // ERC20VariableIncentive.claim //
    //////////////////////////////////

    function testClaim() public {
        // Initialize the ERC20VariableIncentive
        _initialize(address(mockAsset), 1 ether, 5 ether);

        vm.expectEmit(true, false, false, true);
        emit AIncentive.Claimed(
            CLAIM_RECIPIENT, abi.encodePacked(address(mockAsset), CLAIM_RECIPIENT, uint256(1 ether))
        );

        // Claim the incentive
        incentive.claim(CLAIM_RECIPIENT, _encodeBoostClaim(1 ether));

        // Check the claim status and balance
        assertEq(mockAsset.balanceOf(CLAIM_RECIPIENT), 1 ether);
        assertTrue(incentive.isClaimable(CLAIM_RECIPIENT, abi.encode(1 ether)));
    }

    function testClaim_ClaimFailed() public {
        // Initialize the ERC20VariableIncentive
        _initialize(address(mockAsset), 1 ether, 2 ether);

        // Attempt to claim more than the limit => revert
        vm.expectRevert(AIncentive.ClaimFailed.selector);
        incentive.claim(CLAIM_RECIPIENT, abi.encode(IBoostClaim.BoostClaimData(hex"", abi.encode(2 ether + 1))));
    }

    function testClaim_VariableReward() public {
        // Initialize the ERC20VariableIncentive with zero reward, meaning signed amount will be used directly
        _initialize(address(mockAsset), 0, 5 ether);

        // Claim with variable reward
        incentive.claim(VARIABLE_REWARD_CLAIM, _encodeBoostClaim(2 ether));

        // Check the claim status and balance
        assertEq(mockAsset.balanceOf(VARIABLE_REWARD_CLAIM), 2 ether);
        assertTrue(incentive.isClaimable(VARIABLE_REWARD_CLAIM, _encodeBoostClaim(2 ether)));
    }

    function testClaim_NotClaimable() public {
        // Initialize the ERC20VariableIncentive
        _initialize(address(mockAsset), 1 ether, 1 ether);

        // Claim the incentive
        incentive.claim(CLAIM_RECIPIENT, _encodeBoostClaim(1 ether));

        // Attempt to claim again => revert
        vm.expectRevert(AIncentive.NotClaimable.selector);
        incentive.claim(CLAIM_RECIPIENT, _encodeBoostClaim(1 ether));
    }

    //////////////////////////////////////
    // ERC20VariableIncentive.preflight //
    //////////////////////////////////////

    function testPreflight() public view {
        bytes memory preflightPayload = incentive.preflight(
            abi.encode(
                ERC20VariableIncentive.InitPayload({
                    asset: address(mockAsset),
                    reward: 1 ether,
                    limit: 5 ether,
                    manager: address(budget)
                })
            )
        );

        ABudget.Transfer memory transfer = abi.decode(preflightPayload, (ABudget.Transfer));
        assertEq(transfer.asset, address(mockAsset));
        assertEq(transfer.target, address(incentive));
        assertEq(abi.decode(transfer.data, (ABudget.FungiblePayload)).amount, 5 ether);
    }

    ////////////////////////////////////
    // ERC20VariableIncentive.reclaim //
    ////////////////////////////////////

    function testReclaim() public {
        // Initialize the ERC20VariableIncentive
        _initialize(address(mockAsset), 1 ether, 5 ether);

        // Reclaim some tokens
        bytes memory reclaimPayload =
            abi.encode(AIncentive.ClawbackPayload({target: address(this), data: abi.encode(2 ether)}));
        hoax(address(budget));
        incentive.clawback(reclaimPayload);

        // Check the balance and limit
        assertEq(mockAsset.balanceOf(address(this)), 2 ether);
        assertEq(incentive.limit(), 3 ether);
    }

    //////////////////////////////////////////////////
    // ERC20VariableIncentive.getComponentInterface //
    //////////////////////////////////////////////////

    function testGetComponentInterface() public view {
        console.logBytes4(incentive.getComponentInterface());
        assertEq(incentive.getComponentInterface(), type(AERC20VariableIncentive).interfaceId);
    }

    //////////////////////////////////////////////
    // ERC20VariableIncentive.supportsInterface //
    //////////////////////////////////////////////

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

    function _encodeBoostClaim(uint256 amount) internal pure returns (bytes memory data) {
        return abi.encode(IBoostClaim.BoostClaimData(hex"", abi.encode(amount)));
    }

    function _newIncentiveClone() internal returns (ERC20VariableIncentive) {
        return ERC20VariableIncentive(LibClone.clone(address(new ERC20VariableIncentive())));
    }

    function _newBudgetClone() internal returns (ManagedBudget newBudget) {
        address[] memory authorized = new address[](0);
        uint256[] memory roles = new uint256[](0);
        ManagedBudget.InitPayload memory initPayload = ManagedBudget.InitPayload(address(this), authorized, roles);
        newBudget = ManagedBudget(payable(LibClone.clone(address(new ManagedBudget()))));
        newBudget.initialize(abi.encode(initPayload));
    }

    function _initialize(address asset, uint256 reward, uint256 limit) internal {
        incentive.initialize(_initPayload(asset, reward, limit));
    }

    function _initPayload(address asset, uint256 reward, uint256 limit) internal view returns (bytes memory) {
        return abi.encode(
            ERC20VariableIncentive.InitPayload({asset: asset, reward: reward, limit: limit, manager: address(budget)})
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
}
