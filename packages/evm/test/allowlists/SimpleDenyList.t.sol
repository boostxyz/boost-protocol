// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {AllowList} from "contracts/allowlists/AllowList.sol";
import {SimpleDenyList} from "contracts/allowlists/SimpleDenyList.sol";

contract SimpleDenyListTest is Test {
    SimpleDenyList baseDenyList = new SimpleDenyList();
    SimpleDenyList denyList;

    function setUp() public {
        denyList = SimpleDenyList(LibClone.clone(address(baseDenyList)));

        address[] memory users = new address[](2);

        // address(1) and address(3) are denied (all others are allowed)
        users[0] = address(1);
        users[1] = address(3);

        // Set the deny list
        bytes memory data = abi.encode(address(this), users);
        denyList.initialize(data);
    }

    ////////////////////////////////
    // SimpleDenyList.initialize //
    ////////////////////////////////

    function testInitialize() public {
        SimpleDenyList freshClone = SimpleDenyList(LibClone.clone(address(baseDenyList)));
        address[] memory users = new address[](1);
        users[0] = address(1);

        // Ensure the fresh clone is not initialized (no owner or allowlist set)
        assertEq(freshClone.owner(), address(0));
        assertTrue(freshClone.isAllowed(address(1), ""));

        // Initialize the fresh clone
        bytes memory data = abi.encode(address(this), users);
        freshClone.initialize(data);

        // Ensure the fresh clone is initialized
        assertEq(freshClone.owner(), address(this));
        assertFalse(freshClone.isAllowed(address(1), ""));
    }

    function test_InitializerDisabled() public {
        // Because the slot is private, we use `vm.load` to access it then parse out the bits:
        //   - [0] is the `initializing` flag (which should be 0 == false)
        //   - [1..64] hold the `initializedVersion` (which should be 1)
        bytes32 slot = vm.load(address(denyList), 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132);

        uint64 version;
        assembly {
            version := shr(1, slot)
        }

        assertNotEq(version, 0, "Version should not be 0");
    }

    function testInitializer_AlreadyInitialized() public {
        vm.expectRevert(BoostError.InvalidInitialization.selector);
        denyList.initialize(abi.encode(address(this), new address[](0)));
    }

    ///////////////////////////////
    // SimpleDenyList.isAllowed //
    ///////////////////////////////

    function testIsAllowed() public {
        assertFalse(denyList.isAllowed(address(1), ""));
        assertTrue(denyList.isAllowed(address(2), ""));
        assertFalse(denyList.isAllowed(address(3), ""));
    }

    function testIsAllowed_UnnecessaryData() public {
        // Extra data should have no effect on the result because it is ignored in this implementation
        assertFalse(denyList.isAllowed(address(1), unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool*"));
        assertTrue(
            denyList.isAllowed(address(2), abi.encodePacked(uint8(42), keccak256("unexpected"), "data!!1!one1!"))
        );
    }

    //////////////////////////////
    // SimpleDenyList.setDenied //
    //////////////////////////////

    function testSetDenied() public {
        // Ensure the initially denied addresses are correct
        assertFalse(denyList.isAllowed(address(1), ""));
        assertTrue(denyList.isAllowed(address(2), ""));
        assertFalse(denyList.isAllowed(address(3), ""));

        // Modify the list to set address(2) as denied
        address[] memory users = new address[](1);
        bool[] memory denied = new bool[](1);
        users[0] = address(2);
        denied[0] = true;
        denyList.setDenied(users, denied);

        // Ensure the updated deny list is correct
        assertFalse(denyList.isAllowed(address(1), ""));
        assertFalse(denyList.isAllowed(address(2), ""));
        assertFalse(denyList.isAllowed(address(3), ""));
    }

    function testSetDenied_LengthMismatch() public {
        vm.expectRevert(BoostError.LengthMismatch.selector);
        denyList.setDenied(new address[](1), new bool[](2));
    }

    ////////////////////////////////////
    // SimpleDenyList.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(denyList.getComponentInterface());
    }

    ///////////////////////////////////////
    // SimpleDenyList.supportsInterface //
    ///////////////////////////////////////

    function testSupportsInterface() public {
        assertTrue(denyList.supportsInterface(type(Cloneable).interfaceId));
        assertTrue(denyList.supportsInterface(type(AllowList).interfaceId));
    }

    function testSupportsInterface_Unsupported() public {
        assertFalse(denyList.supportsInterface(type(Test).interfaceId));
    }
}
