// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {Initializable} from "@solady/utils/Initializable.sol";

import {OffchainAction} from "contracts/actions/OffchainAction.sol";
import {AOffchainAction} from "contracts/actions/AOffchainAction.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AAction} from "contracts/actions/AAction.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

contract OffchainActionTest is Test {
    OffchainAction public baseAction = new OffchainAction();
    OffchainAction public action;

    // Test configuration data
    AOffchainAction.OffchainConfig public testConfig;
    string[] public requiredFields;

    function setUp() public {
        action = _newActionClone();

        // Set up test configuration
        requiredFields.push("userId");
        requiredFields.push("actionId");
        requiredFields.push("timestamp");

        testConfig = AOffchainAction.OffchainConfig({
            actionType: "twitter_follow",
            requiredFields: requiredFields,
            validationSchema: '{"type":"object","properties":{"userId":{"type":"string"},"actionId":{"type":"string"},"timestamp":{"type":"number"}}}'
        });

        // Initialize the OffchainAction contract
        OffchainAction.InitPayload memory payload = OffchainAction.InitPayload({config: testConfig});

        action.initialize(abi.encode(payload));
    }

    ///////////////////////////
    // OffchainAction.initialize //
    ///////////////////////////

    function testInitialize() public view {
        // Ensure the action was initialized correctly
        AOffchainAction.OffchainConfig memory retrievedConfig = action.getConfig();

        assertEq(retrievedConfig.actionType, testConfig.actionType);
        assertEq(retrievedConfig.requiredFields.length, testConfig.requiredFields.length);
        assertEq(retrievedConfig.requiredFields[0], testConfig.requiredFields[0]);
        assertEq(retrievedConfig.requiredFields[1], testConfig.requiredFields[1]);
        assertEq(retrievedConfig.requiredFields[2], testConfig.requiredFields[2]);
        assertEq(retrievedConfig.validationSchema, testConfig.validationSchema);
    }

    function testInitialize_EmitsEvent() public {
        // Create a new action to test event emission
        OffchainAction newAction = _newActionClone();

        OffchainAction.InitPayload memory payload = OffchainAction.InitPayload({config: testConfig});

        // Expect the initialization event to be emitted
        vm.expectEmit(true, true, true, true);
        emit OffchainAction.OffchainActionInitialized(testConfig.actionType);

        newAction.initialize(abi.encode(payload));
    }

    function testInitialize_InvalidInitialization() public {
        OffchainAction newAction = new OffchainAction();

        // Ensure the initialize function reverts with InvalidInitialization error
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        newAction.initialize("");
    }

    function testInitialize_CannotReinitialize() public {
        // Try to initialize again - should revert
        OffchainAction.InitPayload memory payload = OffchainAction.InitPayload({config: testConfig});

        vm.expectRevert(Initializable.InvalidInitialization.selector);
        action.initialize(abi.encode(payload));
    }

    function testInitialize_WithEmptyFields() public {
        OffchainAction newAction = _newActionClone();

        string[] memory emptyFields = new string[](0);
        AOffchainAction.OffchainConfig memory emptyConfig =
            AOffchainAction.OffchainConfig({actionType: "", requiredFields: emptyFields, validationSchema: ""});

        OffchainAction.InitPayload memory payload = OffchainAction.InitPayload({config: emptyConfig});

        // Should not revert with empty fields
        newAction.initialize(abi.encode(payload));

        AOffchainAction.OffchainConfig memory retrievedConfig = newAction.getConfig();
        assertEq(retrievedConfig.actionType, "");
        assertEq(retrievedConfig.requiredFields.length, 0);
        assertEq(retrievedConfig.validationSchema, "");
    }

    ///////////////////////////
    // OffchainAction.getConfig //
    ///////////////////////////

    function testGetConfig() public view {
        AOffchainAction.OffchainConfig memory retrievedConfig = action.getConfig();

        assertEq(retrievedConfig.actionType, testConfig.actionType);
        assertEq(retrievedConfig.requiredFields.length, testConfig.requiredFields.length);
        assertEq(retrievedConfig.validationSchema, testConfig.validationSchema);
    }

    ///////////////////////////
    // OffchainAction.prepare //
    ///////////////////////////

    function testPrepareReverts() public {
        // Ensure the prepare function reverts with BoostError.NotImplemented error
        vm.expectRevert(BoostError.NotImplemented.selector);
        action.prepare("");
    }

    function testPrepareRevertsWithData() public {
        // Ensure the prepare function reverts with BoostError.NotImplemented error even with data
        vm.expectRevert(BoostError.NotImplemented.selector);
        action.prepare(abi.encode("some data"));
    }

    ///////////////////////////
    // OffchainAction.execute //
    ///////////////////////////

    function testExecuteReverts() public {
        // Ensure the execute function reverts with BoostError.NotImplemented error
        vm.expectRevert(BoostError.NotImplemented.selector);
        action.execute("");
    }

    function testExecuteRevertsWithData() public {
        // Ensure the execute function reverts with BoostError.NotImplemented error even with data
        vm.expectRevert(BoostError.NotImplemented.selector);
        action.execute(abi.encode("some data"));
    }

    ////////////////////////////////////
    // OffchainAction.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public view {
        // Retrieve the component interface
        bytes4 interfaceId = action.getComponentInterface();
        assertEq(interfaceId, type(AOffchainAction).interfaceId);
        console.logBytes4(interfaceId);
    }

    ////////////////////////////////////
    // OffchainAction.supportsInterface //
    ////////////////////////////////////

    function testSupportsInterface() public view {
        // Check the interface support
        assertTrue(action.supportsInterface(type(AOffchainAction).interfaceId));
        assertTrue(action.supportsInterface(type(AAction).interfaceId));
        assertTrue(action.supportsInterface(type(ACloneable).interfaceId));
    }

    function testSupportsInterface_InvalidInterface() public view {
        // Check that invalid interfaces are not supported
        assertFalse(action.supportsInterface(bytes4(0x12345678)));
        assertFalse(action.supportsInterface(bytes4(0x00000000)));
    }

    ///////////////////////////
    // Complex Configuration Tests //
    ///////////////////////////

    function testInitializeWithComplexConfig() public {
        OffchainAction newAction = _newActionClone();

        // Create a complex configuration
        string[] memory complexFields = new string[](5);
        complexFields[0] = "userId";
        complexFields[1] = "actionId";
        complexFields[2] = "timestamp";
        complexFields[3] = "signature";
        complexFields[4] = "metadata";

        AOffchainAction.OffchainConfig memory complexConfig = AOffchainAction.OffchainConfig({
            actionType: "github_star_with_verification",
            requiredFields: complexFields,
            validationSchema: '{"type":"object","properties":{"userId":{"type":"string","minLength":1},"actionId":{"type":"string","pattern":"^[a-zA-Z0-9_-]+$"},"timestamp":{"type":"number","minimum":0},"signature":{"type":"string","minLength":64},"metadata":{"type":"object"}},"required":["userId","actionId","timestamp","signature"]}'
        });

        OffchainAction.InitPayload memory payload = OffchainAction.InitPayload({config: complexConfig});

        newAction.initialize(abi.encode(payload));

        AOffchainAction.OffchainConfig memory retrievedConfig = newAction.getConfig();
        assertEq(retrievedConfig.actionType, complexConfig.actionType);
        assertEq(retrievedConfig.requiredFields.length, 5);
        assertEq(retrievedConfig.requiredFields[3], "signature");
        assertEq(retrievedConfig.requiredFields[4], "metadata");
    }

    function testInitializeWithLongStrings() public {
        OffchainAction newAction = _newActionClone();

        // Create configuration with very long strings
        string memory longActionType =
            "this_is_a_very_long_action_type_that_might_be_used_in_some_complex_scenarios_where_detailed_naming_is_required";
        string memory longSchema =
            '{"type":"object","properties":{"userId":{"type":"string","description":"A very long description that explains in detail what this field represents and how it should be used in the context of this particular offchain action validation system"}}}';

        string[] memory singleField = new string[](1);
        singleField[0] = "userId";

        AOffchainAction.OffchainConfig memory longConfig = AOffchainAction.OffchainConfig({
            actionType: longActionType,
            requiredFields: singleField,
            validationSchema: longSchema
        });

        OffchainAction.InitPayload memory payload = OffchainAction.InitPayload({config: longConfig});

        newAction.initialize(abi.encode(payload));

        AOffchainAction.OffchainConfig memory retrievedConfig = newAction.getConfig();
        assertEq(retrievedConfig.actionType, longActionType);
        assertEq(retrievedConfig.validationSchema, longSchema);
    }

    ///////////////////////////
    // Edge Cases and Error Handling //
    ///////////////////////////

    function testInitializeWithMalformedData() public {
        OffchainAction newAction = _newActionClone();

        // Try to initialize with malformed data
        vm.expectRevert();
        newAction.initialize(abi.encode("invalid data"));
    }

    function testCloneability() public {
        // Test that the action can be cloned multiple times
        OffchainAction clone1 = _newActionClone();
        OffchainAction clone2 = _newActionClone();
        OffchainAction clone3 = _newActionClone();

        // Each clone should be a different address
        assertTrue(address(clone1) != address(clone2));
        assertTrue(address(clone2) != address(clone3));
        assertTrue(address(clone1) != address(clone3));

        // Each clone should support the same interfaces
        assertTrue(clone1.supportsInterface(type(AOffchainAction).interfaceId));
        assertTrue(clone2.supportsInterface(type(AOffchainAction).interfaceId));
        assertTrue(clone3.supportsInterface(type(AOffchainAction).interfaceId));
    }

    ///////////////////////////
    // Test Helper Functions //
    ///////////////////////////

    function _newActionClone() internal returns (OffchainAction) {
        return OffchainAction(LibClone.clone(address(baseAction)));
    }
}
