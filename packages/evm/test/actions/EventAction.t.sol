// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {Initializable} from "@solady/utils/Initializable.sol";

import {MockERC721} from "contracts/shared/Mocks.sol";
import {EventAction} from "contracts/actions/EventAction.sol";
import {AEventAction} from "contracts/actions/AEventAction.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

contract EventActionTest is Test {
    MockERC721 public mockAsset = new MockERC721();
    EventAction public baseAction = new EventAction();
    EventAction public action;

    function setUp() public {
        action = _newActionClone();

        // Define the InitPayload with an ActionEvent
        AEventAction.Criteria memory criteria;
        AEventAction.ActionEvent memory actionEventOne;

        criteria = AEventAction.Criteria({
            filterType: AEventAction.FilterType.EQUAL,
            fieldType: AEventAction.PrimitiveType.ADDRESS,
            fieldIndex: 0, // Assume the first field in the log is the 'from' address
            filterData: abi.encode(address(this)) // The filter checks if 'from' address equals this contract's address
        });

        actionEventOne = AEventAction.ActionEvent({
            eventSignature: bytes4(keccak256("Transfer(address,address,uint256)")),
            actionType: 0,
            targetContract: address(mockAsset),
            actionParameter: criteria
        });

        EventAction.InitPayload memory payload = EventAction.InitPayload({
            actionEventOne: actionEventOne,
            actionEventTwo: actionEventOne,
            actionEventThree: actionEventOne,
            actionEventFour: actionEventOne
        });

        // Initialize the EventAction contract
        action.initialize(abi.encode(payload));
    }

    ///////////////////////////
    // EventAction.initialize //
    ///////////////////////////

    function testInitialize() public {
        // Ensure the action was initialized correctly
        assertEq(action.getActionEventsCount(), 4);
        assertEq(action.getActionEvent(0).eventSignature, bytes4(keccak256("Transfer(address,address,uint256)")));
    }

    function testInitialize_InvalidInitialization() public {
        // Ensure the initialize function reverts with NotInitializing error
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        baseAction.initialize("");
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
    // EventAction.getActionEvents //
    ////////////////////////////

    function testGetActionEvents() public {
        // Ensure the action events are retrieved correctly
        AEventAction.ActionEvent[] memory retrievedEvents = action.getActionEvents();

        assertEq(retrievedEvents.length, 4);
        assertEq(retrievedEvents[0].eventSignature, bytes4(keccak256("Transfer(address,address,uint256)")));
    }

    /////////////////////////////////
    // EventAction.getActionEvent //
    /////////////////////////////////

    function testGetActionEvent() public {
        // Ensure the action event is retrieved correctly
        AEventAction.ActionEvent memory retrievedEvent = action.getActionEvent(0);

        assertEq(retrievedEvent.eventSignature, bytes4(keccak256("Transfer(address,address,uint256)")));
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
        assertTrue(action.supportsInterface(type(Cloneable).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newActionClone() internal returns (EventAction) {
        return EventAction(LibClone.clone(address(baseAction)));
    }
}
