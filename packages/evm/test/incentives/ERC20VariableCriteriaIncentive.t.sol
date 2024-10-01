// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ERC20VariableCriteriaIncentive} from "contracts/incentives/ERC20VariableCriteriaIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {SignatureType} from "contracts/incentives/ERC20VariableCriteriaIncentive.sol";

contract ERC20VariableCriteriaIncentiveTest is Test {
    using SafeTransferLib for address;

    ERC20VariableCriteriaIncentive public incentive;
    MockERC20 public mockAsset = new MockERC20();

    function setUp() public {
        incentive = _newIncentiveClone();

        // Preload mock tokens into the contract
        mockAsset.mint(address(this), 100 ether);
        mockAsset.approve(address(incentive), 100 ether);

        // Transfer mock tokens into the incentive contract for testing
        mockAsset.transfer(address(incentive), 100 ether);
    }

    ///////////////////////////////////////
    // ERC20VariableCriteriaIncentive.initialize //
    ///////////////////////////////////////

    function testInitialize() public {
        // Define the IncentiveCriteria struct
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = ERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset)
        });

        // Encode and initialize the contract
        _initialize(address(mockAsset), 1 ether, 5, criteria);

        // Check the incentive parameters
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.reward(), 1 ether);
        assertEq(incentive.limit(), 5);

        // Verify the stored IncentiveCriteria
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory storedCriteria = incentive.getIncentiveCriteria();
        assertEq(uint8(storedCriteria.criteriaType), uint8(SignatureType.EVENT));
        assertEq(storedCriteria.signature, keccak256("Transfer(address,address,uint256)"));
        assertEq(storedCriteria.fieldIndex, 2);
        assertEq(storedCriteria.targetContract, address(mockAsset));
    }

    function testInitialize_InsufficientAllocation() public {
        // Define criteria as in the positive case
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = ERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset)
        });

        // Attempt to initialize with a limit greater than available funds => revert
        ERC20VariableCriteriaIncentive.InitPayloadExtended memory initPayload = ERC20VariableCriteriaIncentive
            .InitPayloadExtended({asset: address(mockAsset), reward: 100 ether, limit: 101 ether, criteria: criteria});

        vm.expectRevert(abi.encodeWithSelector(BoostError.InsufficientFunds.selector, mockAsset, 100 ether, 101 ether));
        incentive.initialize(abi.encode(initPayload));
    }

    function testInitialize_InvalidInitialization() public {
        // Define criteria as in the positive case
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = ERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset)
        });

        // Initialize with limit = zero
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        incentive.initialize(
            abi.encode(
                ERC20VariableCriteriaIncentive.InitPayloadExtended({
                    asset: address(mockAsset),
                    reward: 1 ether,
                    limit: 0,
                    criteria: criteria
                })
            )
        );
    }

    /////////////////////////////////////////////////
    // ERC20VariableCriteriaIncentive.getIncentiveCriteria //
    /////////////////////////////////////////////////

    function testGetIncentiveCriteria() public {
        // Initialize with valid data
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = ERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.FUNC,
            signature: keccak256("transfer(address,uint256)"),
            fieldIndex: 1,
            targetContract: address(mockAsset)
        });
        _initialize(address(mockAsset), 2 ether, 10, criteria);

        // Retrieve and validate the incentive criteria
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory storedCriteria = incentive.getIncentiveCriteria();

        assertEq(uint8(storedCriteria.criteriaType), uint8(SignatureType.FUNC));
        assertEq(storedCriteria.signature, keccak256("transfer(address,uint256)"));
        assertEq(storedCriteria.fieldIndex, 1);
        assertEq(storedCriteria.targetContract, address(mockAsset));
    }

    ///////////////////////////////////////
    // Test Helper Functions            //
    ///////////////////////////////////////

    function _newIncentiveClone() internal returns (ERC20VariableCriteriaIncentive) {
        return ERC20VariableCriteriaIncentive(LibClone.clone(address(new ERC20VariableCriteriaIncentive())));
    }

    function _initialize(
        address asset,
        uint256 reward,
        uint256 limit,
        ERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria
    ) internal {
        ERC20VariableCriteriaIncentive.InitPayloadExtended memory initPayload = ERC20VariableCriteriaIncentive
            .InitPayloadExtended({asset: asset, reward: reward, limit: limit, criteria: criteria});
        incentive.initialize(abi.encode(initPayload));
    }
}
