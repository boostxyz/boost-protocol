// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20} from "contracts/shared/Mocks.sol";

import {LibClone} from "@solady/utils/LibClone.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ERC20VariableCriteriaIncentive} from "contracts/incentives/ERC20VariableCriteriaIncentive.sol";
import {AERC20VariableCriteriaIncentive} from "contracts/incentives/AERC20VariableCriteriaIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive, IBoostClaim} from "contracts/incentives/AIncentive.sol";
import {SignatureType} from "contracts/incentives/AERC20VariableCriteriaIncentive.sol";

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

    ///////////////////////////////////////////////
    // ERC20VariableCriteriaIncentive.initialize //
    ///////////////////////////////////////////////

    function testInitialize() public {
        // Define the IncentiveCriteria struct
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset)
        });

        // Encode and initialize the contract
        _initialize(address(mockAsset), 1 ether, 5, 0, criteria);

        // Check the incentive parameters
        assertEq(incentive.asset(), address(mockAsset));
        assertEq(incentive.reward(), 1 ether);
        assertEq(incentive.limit(), 5);

        // Verify the stored IncentiveCriteria
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory storedCriteria = incentive.getIncentiveCriteria();
        assertEq(uint8(storedCriteria.criteriaType), uint8(SignatureType.EVENT));
        assertEq(storedCriteria.signature, keccak256("Transfer(address,address,uint256)"));
        assertEq(storedCriteria.fieldIndex, 2);
        assertEq(storedCriteria.targetContract, address(mockAsset));
    }

    function testInitialize_InsufficientAllocation() public {
        // Define criteria as in the positive case
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset)
        });

        // Attempt to initialize with a limit greater than available funds => revert
        ERC20VariableCriteriaIncentive.InitPayloadExtended memory initPayload = AERC20VariableCriteriaIncentive
            .InitPayloadExtended({
            asset: address(mockAsset),
            reward: 100 ether,
            limit: 101 ether,
            maxReward: 0,
            criteria: criteria
        });

        vm.expectRevert(abi.encodeWithSelector(BoostError.InsufficientFunds.selector, mockAsset, 100 ether, 101 ether));
        incentive.initialize(abi.encode(initPayload));
    }

    function testInitialize_InvalidInitialization() public {
        // Define criteria as in the positive case
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20VariableCriteriaIncentive
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
                AERC20VariableCriteriaIncentive.InitPayloadExtended({
                    asset: address(mockAsset),
                    reward: 1 ether,
                    limit: 0,
                    maxReward: 0,
                    criteria: criteria
                })
            )
        );
    }

    //////////////////////////////////////////
    // ERC20VariableCriteriaIncentive.claim //
    //////////////////////////////////////////

    function testClaim_LimitedByMaxReward() public {
        // Define the IncentiveCriteria struct
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.EVENT,
            signature: keccak256("Transfer(address,address,uint256)"),
            fieldIndex: 2,
            targetContract: address(mockAsset)
        });
        // Initialize the ERC20VariableIncentive with reward and maxReward constraints
        uint256 reward = 0; // set to zero to test maxReward cap
        uint256 maxReward = 1.5 ether; // Set a max reward cap
        address CLAIM_RECIPIENT = makeAddr("CLAIM_RECIPIENT");
        _initialize(address(mockAsset), reward, 2 ether, maxReward, criteria);

        // Encode a claim with signedAmount exceeding the maxReward cap
        uint256 signedAmount = 2 ether; // Exceeds maxReward
        bytes memory claimData = abi.encode(IBoostClaim.BoostClaimData(hex"", abi.encode(signedAmount)));

        // Expect the emitted event with the claim capped to maxReward
        vm.expectEmit(true, false, false, true);
        emit AIncentive.Claimed(CLAIM_RECIPIENT, abi.encodePacked(address(mockAsset), CLAIM_RECIPIENT, maxReward));

        // Attempt to claim
        incentive.claim(CLAIM_RECIPIENT, claimData);

        // Verify the balance was capped by maxReward
        assertEq(mockAsset.balanceOf(CLAIM_RECIPIENT), maxReward);
        assertTrue(incentive.isClaimable(CLAIM_RECIPIENT, claimData));
    }

    /////////////////////////////////////////////////////////
    // ERC20VariableCriteriaIncentive.getIncentiveCriteria //
    /////////////////////////////////////////////////////////

    function testGetIncentiveCriteria() public {
        // Initialize with valid data
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria = AERC20VariableCriteriaIncentive
            .IncentiveCriteria({
            criteriaType: SignatureType.FUNC,
            signature: keccak256("transfer(address,uint256)"),
            fieldIndex: 1,
            targetContract: address(mockAsset)
        });
        _initialize(address(mockAsset), 2 ether, 10, 0, criteria);

        // Retrieve and validate the incentive criteria
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory storedCriteria = incentive.getIncentiveCriteria();

        assertEq(uint8(storedCriteria.criteriaType), uint8(SignatureType.FUNC));
        assertEq(storedCriteria.signature, keccak256("transfer(address,uint256)"));
        assertEq(storedCriteria.fieldIndex, 1);
        assertEq(storedCriteria.targetContract, address(mockAsset));
    }

    //////////////////////////////////////////////////
    // ERC20VariableIncentive.getComponentInterface //
    //////////////////////////////////////////////////

    function testGetComponentInterface() public view {
        console.logBytes4(incentive.getComponentInterface());
        assertEq(incentive.getComponentInterface(), type(AERC20VariableCriteriaIncentive).interfaceId);
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
        uint256 maxReward,
        AERC20VariableCriteriaIncentive.IncentiveCriteria memory criteria
    ) internal {
        ERC20VariableCriteriaIncentive.InitPayloadExtended memory initPayload = AERC20VariableCriteriaIncentive
            .InitPayloadExtended({asset: asset, reward: reward, limit: limit, maxReward: maxReward, criteria: criteria});
        incentive.initialize(abi.encode(initPayload));
    }
}
