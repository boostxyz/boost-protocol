// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {BoostError} from "src/shared/BoostError.sol";
import {Cloneable} from "src/Cloneable.sol";
import {AllowList} from "src/allowlists/AllowList.sol";
import {SimpleAllowList} from "src/allowlists/SimpleAllowList.sol";

contract SimpleAllowListTest is Test {
    SimpleAllowList baseAllowList = new SimpleAllowList();
    SimpleAllowList allowList;

    function setUp() public {
        allowList = SimpleAllowList(LibClone.clone(address(baseAllowList)));

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
        bytes memory data = LibZip.cdCompress(abi.encode(address(this), users, allowed));
        allowList.initialize(data);
    }

    ////////////////////////////////
    // SimpleAllowList.initialize //
    ////////////////////////////////

    function testInitialize() public {
        SimpleAllowList freshClone = SimpleAllowList(LibClone.clone(address(baseAllowList)));
        address[] memory users = new address[](1);
        bool[] memory allowed = new bool[](1);
        users[0] = address(1);
        allowed[0] = true;

        // Ensure the fresh clone is not initialized (no owner or allowlist set)
        assertEq(freshClone.owner(), address(0));
        assertFalse(freshClone.isAllowed(address(1), ""));

        // Initialize the fresh clone
        bytes memory data = LibZip.cdCompress(abi.encode(address(this), users, allowed));
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

    function testInitialize_LengthMismatch() public {
        SimpleAllowList freshClone = SimpleAllowList(LibClone.clone(address(baseAllowList)));
        address[] memory users = new address[](1);
        bool[] memory allowed = new bool[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        freshClone.initialize(LibZip.cdCompress(abi.encode(address(this), users, allowed)));
    }

    function testInitializer_AlreadyInitialized() public {
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        allowList.initialize(LibZip.cdCompress(abi.encode(address(this), new address[](0), new bool[](0))));
    }

    ///////////////////////////////
    // SimpleAllowList.isAllowed //
    ///////////////////////////////

    function testIsAllowed() public {
        assertTrue(allowList.isAllowed(address(1), ""));
        assertFalse(allowList.isAllowed(address(2), ""));
        assertTrue(allowList.isAllowed(address(3), ""));
        assertFalse(allowList.isAllowed(address(42), ""));
    }

    function testIsAllowed_UnnecessaryData() public {
        // Extra data should have no effect on the result because it is ignored in this implementation
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
        vm.expectRevert(BoostError.LengthMismatch.selector);
        allowList.setAllowed(new address[](1), new bool[](2));
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
