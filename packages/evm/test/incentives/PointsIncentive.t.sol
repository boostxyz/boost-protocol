// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {Incentive} from "contracts/incentives/Incentive.sol";
import {PointsIncentive} from "contracts/incentives/PointsIncentive.sol";
import {Points} from "contracts/tokens/Points.sol";

contract PointsIncentiveTest is Test {
    PointsIncentive public incentive;
    Points public points;

    function setUp() public {
        points = new Points();
        incentive = PointsIncentive(LibClone.clone(address(new PointsIncentive())));

        points.initialize("Points", "PTS", address(incentive));
        incentive.initialize(
            abi.encode(
                PointsIncentive.InitPayload({
                    venue: address(points),
                    selector: bytes4(keccak256("issue(address,uint256)")),
                    reward: 100,
                    limit: 10
                })
            )
        );
    }

    ////////////////////
    // Initialization //
    ////////////////////

    function test_initialize() public {
        assertEq(address(incentive.venue()), address(points));
        assertEq(incentive.selector(), bytes4(keccak256("issue(address,uint256)")));
        assertEq(incentive.currentReward(), 100);
        assertEq(incentive.limit(), 10);
        assertEq(incentive.owner(), address(this));
    }

    function test_initialize_twice() public {
        vm.expectRevert(bytes4(keccak256("InvalidInitialization()")));
        incentive.initialize(
            abi.encode(
                PointsIncentive.InitPayload({
                    venue: address(points),
                    selector: bytes4(keccak256("mint(address,uint256)")),
                    reward: 100,
                    limit: 10
                })
            )
        );
    }

    ///////////////////////////
    // PointsIncentive.claim //
    ///////////////////////////

    function test_claim() public {
        vm.expectCall(address(points), abi.encodeCall(points.issue, (address(1), 100)), 1);
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
        assertEq(points.balanceOf(address(1)), 100);
    }

    function test_claim_twice() public {
        vm.expectCall(address(points), abi.encodeCall(points.issue, (address(1), 100)), 1);
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
        vm.expectRevert(bytes4(keccak256("NotClaimable()")));
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
    }

    function test_claim_notOwner() public {
        vm.prank(address(0xdeadbeef));
        vm.expectRevert(bytes4(keccak256("Unauthorized()")));
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
    }

    function test_claimAuthorized() public {
        vm.expectCall(address(points), abi.encodeCall(points.issue, (address(1), 100)), 1);
        points.grantRoles(address(0xdeadbeef), points.ISSUER_ROLE());

        vm.prank(address(0xdeadbeef));
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
        assertEq(points.balanceOf(address(1)), 100);
    }

    ////////////////////////////////////
    // PointsIncentive.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
    }

    /////////////////////////////////////
    // PointsIncentive.supportsInterface //
    /////////////////////////////////////

    function testSupportsInterface() public {
        // Ensure the contract supports the Budget interface
        assertTrue(incentive.supportsInterface(type(Incentive).interfaceId));
    }

    function testSupportsInterface_NotSupported() public {
        // Ensure the contract does not support an unsupported interface
        assertFalse(incentive.supportsInterface(type(Test).interfaceId));
    }
}
