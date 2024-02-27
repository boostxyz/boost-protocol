// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {AllowList} from "src/allowlists/AllowList.sol";
import {SimpleAllowList} from "src/allowlists/SimpleAllowList.sol";

contract SimpleAllowListTest is Test {
    SimpleAllowList allowList;

    function setUp() public {
        allowList = new SimpleAllowList();

        address[] memory users = new address[](3);
        bool[] memory allowed = new bool[](3);

        // address(1) is allowed
        users[0] = address(1);
        allowed[0] = true;

        // address(2) is not allowed
        users[1] = address(2);
        allowed[1] = false;

        // address(3) is allowed
        users[2] = address(3);
        allowed[2] = true;

        // Set the allow list
        allowList.setAllowed(users, allowed);
    }

    ///////////////////////////////
    // SimpleAllowList.isAllowed //
    ///////////////////////////////

    function testIsAllowed() public {
        // Ensure the allow list is correct
        assertTrue(allowList.isAllowed(address(1), ""));
        assertFalse(allowList.isAllowed(address(2), ""));
        assertTrue(allowList.isAllowed(address(3), ""));
    }

    function testIsAllowed_UnnecessaryData() public {
        // Ensure the allow list is correct
        assertTrue(allowList.isAllowed(address(1), unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool*"));
        assertFalse(allowList.isAllowed(address(2), abi.encodePacked(uint8(42), keccak256("unexpected"), "data")));
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
        // Ensure the length mismatch is caught
        vm.expectRevert(SimpleAllowList.LengthMismatch.selector);
        allowList.setAllowed(new address[](1), new bool[](2));
    }

    ///////////////////////////////////////
    // SimpleAllowList.supportsInterface //
    ///////////////////////////////////////

    function testSupportsInterface() public {
        // Ensure the interface is supported
        assertTrue(allowList.supportsInterface(type(AllowList).interfaceId));
    }

    function testSupportsInterface_Unsupported() public {
        // Ensure the interface is not supported
        assertFalse(allowList.supportsInterface(type(Test).interfaceId));
    }
}
