// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {Initializable} from "@solady/utils/Initializable.sol";

import {MockERC721} from "contracts/shared/Mocks.sol";
import {EventAction} from "contracts/actions/EventAction.sol";
import {AEventAction} from "contracts/actions/AEventAction.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

contract EventActionTest is Test {
    MockERC721 public mockAsset = new MockERC721();
    EventAction public baseAction = new EventAction();
    EventAction public action;

    function setUp() public {
        action = _newActionClone();

        // Define the InitPayload with an ActionStep
        AEventAction.ActionClaimant memory claimant;
        AEventAction.Criteria memory criteria;
        AEventAction.ActionStep memory actionStepOne;

        claimant = AEventAction.ActionClaimant({
            signatureType: AEventAction.SignatureType.EVENT,
            signature: bytes4(keccak256("Transfer(address,address,uint256)")),
            fieldIndex: 0,
            targetContract: address(mockAsset)
        });

        criteria = AEventAction.Criteria({
            filterType: AEventAction.FilterType.EQUAL,
            fieldType: AEventAction.PrimitiveType.ADDRESS,
            fieldIndex: 0, // Assume the first field in the log is the 'from' address
            filterData: abi.encode(address(this)) // The filter checks if 'from' address equals this contract's address
        });

        actionStepOne = AEventAction.ActionStep({
            signature: bytes4(keccak256("Transfer(address,address,uint256)")),
            signatureType: AEventAction.SignatureType.EVENT,
            actionType: 0,
            targetContract: address(mockAsset),
            actionParameter: criteria
        });

        EventAction.InitPayload memory payload = EventAction.InitPayload({
            actionClaimant: claimant,
            actionStepOne: actionStepOne,
            actionStepTwo: actionStepOne,
            actionStepThree: actionStepOne,
            actionStepFour: actionStepOne
        });

        // Initialize the EventAction contract
        action.initialize(abi.encode(payload));
    }

    ///////////////////////////
    // EventAction.initialize //
    ///////////////////////////

    function testInitialize() public {
        // Ensure the action was initialized correctly
        assertEq(action.getActionStepsCount(), 4);
        assertEq(action.getActionStep(0).signature, bytes4(keccak256("Transfer(address,address,uint256)")));
    }

    function testInitialize_InvalidInitialization() public {
        EventAction newbaseAction = new EventAction();
        // Ensure the initialize function reverts with NotInitializing error
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        newbaseAction.initialize("");
    }

    ///////////////////////////
    // EventAction.prepare   //
    ///////////////////////////

    function testPrepareReverts() public {
        // Ensure the prepare function reverts with BoostError.NotImplemented error
        vm.expectRevert(BoostError.NotImplemented.selector);
        action.prepare("");
    }

    ///////////////////////////
    // EventAction.execute   //
    ///////////////////////////

    function testExecuteReverts() public {
        // Ensure the execute function reverts with BoostError.NotImplemented error
        vm.expectRevert(BoostError.NotImplemented.selector);
        action.execute("");
    }

    ////////////////////////////
    // EventAction.getActionSteps //
    ////////////////////////////

    function testGetActionSteps() public {
        // Ensure the action events are retrieved correctly
        AEventAction.ActionStep[] memory retrievedEvents = action.getActionSteps();

        assertEq(retrievedEvents.length, 4);
        assertEq(retrievedEvents[0].signature, bytes4(keccak256("Transfer(address,address,uint256)")));
    }

    /////////////////////////////////
    // EventAction.getActionStep //
    /////////////////////////////////

    function testGetActionStep() public {
        // Ensure the action event is retrieved correctly
        AEventAction.ActionStep memory retrievedEvent = action.getActionStep(0);

        assertEq(retrievedEvent.signature, bytes4(keccak256("Transfer(address,address,uint256)")));
    }

    /////////////////////////////////
    // EventAction.getActionClaimant //
    /////////////////////////////////

    function testGetActionClaimant() public {
        // Ensure the action event is retrieved correctly
        AEventAction.ActionClaimant memory retrievedClaimant = action.getActionClaimant();

        assertEq(retrievedClaimant.fieldIndex, 0);
        assertEq(retrievedClaimant.signature, bytes4(keccak256("Transfer(address,address,uint256)")));
        assertEq(retrievedClaimant.targetContract, address(mockAsset));
    }

    ////////////////////////////////////
    // EventAction.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(action.getComponentInterface());
    }
    ////////////////////////////////////
    // EventAction.supportsInterface //
    ////////////////////////////////////

    function testSupportsInterface() public {
        // Check the interface support
        assertTrue(action.supportsInterface(type(AEventAction).interfaceId));
        assertTrue(action.supportsInterface(type(ACloneable).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newActionClone() internal returns (EventAction) {
        return EventAction(LibClone.clone(address(baseAction)));
    }
}
