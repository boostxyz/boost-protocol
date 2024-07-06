// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {AllowList} from "contracts/allowlists/AllowList.sol";
import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";

contract SimpleAllowListTest is Test {
    SimpleAllowList baseAllowList = new SimpleAllowList();
    SimpleAllowList allowList;

    function setUp() public {
        allowList = SimpleAllowList(LibClone.clone(address(baseAllowList)));

        address[] memory users = new address[](2);

        // address(1) and address(3) are allowed
        users[0] = address(1);
        users[1] = address(3);

        // Set the allow list
        bytes memory data = abi.encode(address(this), users);
        allowList.initialize(data);
    }

    ////////////////////////////////
    // SimpleAllowList.initialize //
    ////////////////////////////////

    function testInitialize() public {
        SimpleAllowList freshClone = SimpleAllowList(LibClone.clone(address(baseAllowList)));
        address[] memory users = new address[](1);
        users[0] = address(1);

        // Ensure the fresh clone is not initialized (no owner or allowlist set)
        assertEq(freshClone.owner(), address(0));
        assertFalse(freshClone.isAllowed(address(1), ""));

        // Initialize the fresh clone
        bytes memory data = abi.encode(address(this), users);
        freshClone.initialize(data);

        // Ensure the fresh clone is initialized
        assertEq(freshClone.owner(), address(this));
        assertTrue(freshClone.isAllowed(address(1), ""));
    }

    function test_InitializerDisabled() public {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot = vm.load(address(allowList), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    function testInitializer_AlreadyInitialized() public {
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        allowList.initialize(abi.encode(address(this), new address[](0)));
    }

    ///////////////////////////////
    // SimpleAllowList.isAllowed //
    ///////////////////////////////

    function testIsAllowed() public {
        assertTrue(allowList.isAllowed(address(1), ""));
        assertFalse(allowList.isAllowed(address(2), ""));
        assertTrue(allowList.isAllowed(address(3), ""));
    }

    function testIsAllowed_UnnecessaryData() public {
        // Extra data should have no effect on the result because it is ignored in this implementation
        assertTrue(allowList.isAllowed(address(1), unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool*"));
        assertFalse(
            allowList.isAllowed(address(2), abi.encodePacked(uint8(42), keccak256("unexpected"), "data!!1!one1!"))
        );
    }

    ////////////////////////////////
    // SimpleAllowList.setAllowed //
    ////////////////////////////////

    function testSetAllowed() public {
        // Ensure the allow list is correct
        assertTrue(allowList.isAllowed(address(1), ""));
        assertFalse(allowList.isAllowed(address(2), ""));
        assertTrue(allowList.isAllowed(address(3), ""));

        // Modify the list to set address(2) as allowed
        address[] memory users = new address[](1);
        bool[] memory allowed = new bool[](1);
        users[0] = address(2);
        allowed[0] = true;
        allowList.setAllowed(users, allowed);

        // Ensure the allow list is correct
        assertTrue(allowList.isAllowed(address(1), ""));
        assertTrue(allowList.isAllowed(address(2), ""));
        assertTrue(allowList.isAllowed(address(3), ""));
    }

    function testSetAllowed_LengthMismatch() public {
        vm.expectRevert(BoostError.LengthMismatch.selector);
        allowList.setAllowed(new address[](1), new bool[](2));
    }

    ////////////////////////////////////
    // SimpleAllowList.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(allowList.getComponentInterface());
    }

    ///////////////////////////////////////
    // SimpleAllowList.supportsInterface //
    ///////////////////////////////////////

    function testSupportsInterface() public {
        assertTrue(allowList.supportsInterface(type(Cloneable).interfaceId));
        assertTrue(allowList.supportsInterface(type(AllowList).interfaceId));
    }

    function testSupportsInterface_Unsupported() public {
        assertFalse(allowList.supportsInterface(type(Test).interfaceId));
    }
}
