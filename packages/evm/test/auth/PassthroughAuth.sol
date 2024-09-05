// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";
import {PassthroughAuth} from "contracts/auth/PassthroughAuth.sol";

contract PassthroughAuthTest is Test {
    PassthroughAuth auth;

    function setUp() public {
        auth = new PassthroughAuth();
    }

    ////////////////////////////////
    // PassthroughAuth.isAuthorized //
    ////////////////////////////////

    function testIsAuthorized() public {
        assertTrue(auth.isAuthorized(address(0x0000000000000000000000000000000000000000)));
        assertTrue(auth.isAuthorized(address(0x1111111111111111111111111111111111111111)));
        assertTrue(auth.isAuthorized(address(0x2222222222222222222222222222222222222222)));
        assertTrue(auth.isAuthorized(address(0x3333333333333333333333333333333333333333)));
    }

    ////////////////////////////////
    // PassthroughAuth Deployment //
    ////////////////////////////////

    function testDeployment() public {
        assertTrue(address(auth) != address(0));
    }
}
