// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

contract ACloneableImpl is ACloneable {
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ACloneable).interfaceId;
    }
}

contract ACloneableImpl2 is ACloneable {
    uint256 private something;

    function initialize(bytes calldata data_) public override initializer {
        (something) = abi.decode(data_, (uint256));
    }

    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ACloneable).interfaceId;
    }

    function getSomething() external view returns (uint256) {
        return something;
    }
}

contract ACloneableTest is Test {
    ACloneableImpl cloneable;
    ACloneableImpl2 cloneable2;

    function setUp() public {
        cloneable = new ACloneableImpl();
        cloneable2 = new ACloneableImpl2();
    }

    /////////////////////////////////
    // ACloneable.supportsInterface //
    /////////////////////////////////

    function testSupportsInterface() public {
        assertTrue(cloneable.supportsInterface(type(ACloneable).interfaceId));
    }

    function testSupportsInterface_NotSupported() public {
        assertFalse(cloneable.supportsInterface(type(Test).interfaceId));
    }

    //////////////////////////
    // ACloneable.initialize //
    //////////////////////////

    function testInitialize() public {
        cloneable2.initialize(abi.encode(type(uint256).max));
        assertEq(cloneable2.getSomething(), type(uint256).max);
    }

    function testInitialize_NotImplemented() public {
        vm.expectRevert(ACloneable.InitializerNotImplemented.selector);
        cloneable.initialize(unicode"🦄 unicorns (and 🌈 rainbows!) are *so cool*");
    }

    //////////////////////////////////////
    // ACloneable.getComponentInterface //
    //////////////////////////////////////

    function testGetComponentInterface_ACloneableImpl() public {
        bytes4 expectedInterfaceId = type(ACloneable).interfaceId;
        assertEq(cloneable.getComponentInterface(), expectedInterfaceId);
    }

    function testGetComponentInterface_ACloneableImpl2() public {
        bytes4 expectedInterfaceId = type(ACloneable).interfaceId;
        assertEq(cloneable2.getComponentInterface(), expectedInterfaceId);
    }
}
