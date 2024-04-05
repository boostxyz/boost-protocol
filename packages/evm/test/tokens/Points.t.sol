// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {Points} from "contracts/tokens/Points.sol";

contract PointsTest is Test {
    Points public points;

    function setUp() public {
        points = new Points();
        points.initialize("Points", "PTS", address(this));
    }

    ////////////////////
    // Initialization //
    ////////////////////

    function test_initialize() public {
        assertEq(points.name(), "Points");
        assertEq(points.symbol(), "PTS");
        assertEq(points.owner(), address(this));
        assertTrue(points.hasAnyRole(address(this), points.ISSUER_ROLE()));
    }

    function test_initialize_twice() public {
        vm.expectRevert(bytes4(keccak256("InvalidInitialization()")));
        points.initialize("Points", "PTS", address(this));
    }

    //////////////////
    // Points.issue //
    //////////////////

    function test_issue() public {
        points.issue(address(1), 100);
        assertEq(points.balanceOf(address(1)), 100);

        points.issue(address(1), 100);
        assertEq(points.balanceOf(address(1)), 200);

        points.issue(address(2), 100);
        assertEq(points.balanceOf(address(2)), 100);
        assertEq(points.totalSupply(), 300);
    }

    function test_issue_not_issuer() public {
        vm.prank(address(0xdeadbeef));
        vm.expectRevert(bytes4(keccak256("Unauthorized()")));
        points.issue(address(1), 100);
    }

    /////////////////////
    // Points.transfer //
    /////////////////////

    function test_transfer() public {
        points.issue(address(1), 100);

        vm.prank(address(1));
        vm.expectRevert(bytes4(keccak256("NonTransferable()")));
        points.transfer(address(2), 100);

        assertEq(points.balanceOf(address(1)), 100);
        assertEq(points.balanceOf(address(2)), 0);
    }

    function test_transfer_zero_address() public {
        points.issue(address(1), 100);

        vm.prank(address(1));
        points.transfer(address(0), 100);

        assertEq(points.balanceOf(address(1)), 0);
    }

    function test_transferFrom() public {
        points.issue(address(1), 100);

        vm.prank(address(1));
        points.approve(address(2), type(uint256).max);

        vm.prank(address(2));
        vm.expectRevert(bytes4(keccak256("NonTransferable()")));
        points.transferFrom(address(1), address(2), 100);

        assertEq(points.balanceOf(address(1)), 100);
        assertEq(points.balanceOf(address(2)), 0);
    }
}
