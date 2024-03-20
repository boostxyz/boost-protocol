// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {Incentive} from "src/incentives/Incentive.sol";
import {PointsIncentive} from "src/incentives/PointsIncentive.sol";
import {Points} from "src/tokens/Points.sol";

contract PointsIncentiveTest is Test {
    PointsIncentive public incentive;
    Points public points;

    function setUp() public {
        points = new Points();
        incentive = PointsIncentive(LibClone.clone(address(new PointsIncentive())));

        points.initialize("Points", "PTS", address(incentive));
        incentive.initialize(
            LibZip.cdCompress(
                abi.encode(
                    PointsIncentive.InitPayload({
                        venue: address(points),
                        selector: bytes4(keccak256("issue(address,uint256)")),
                        quantity: 100,
                        maxClaims: 10
                    })
                )
            )
        );
    }

    ////////////////////
    // Initialization //
    ////////////////////

    function test_initialize() public {
        assertEq(address(incentive.venue()), address(points));
        assertEq(incentive.selector(), bytes4(keccak256("issue(address,uint256)")));
        assertEq(incentive.quantity(), 100);
        assertEq(incentive.maxClaims(), 10);
        assertEq(incentive.owner(), address(this));
    }

    function test_initialize_twice() public {
        vm.expectRevert(bytes4(keccak256("InvalidInitialization()")));
        incentive.initialize(
            LibZip.cdCompress(
                abi.encode(
                    PointsIncentive.InitPayload({
                        venue: address(points),
                        selector: bytes4(keccak256("mint(address,uint256)")),
                        quantity: 100,
                        maxClaims: 10
                    })
                )
            )
        );
    }

    ///////////////////////////
    // PointsIncentive.claim //
    ///////////////////////////

    function test_claim() public {
        vm.expectCall(address(points), abi.encodeCall(points.issue, (address(1), 100)), 1);
        incentive.claim(LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)}))));
        assertEq(points.balanceOf(address(1)), 100);
    }

    function test_claim_twice() public {
        vm.expectCall(address(points), abi.encodeCall(points.issue, (address(1), 100)), 1);
        incentive.claim(LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)}))));
        vm.expectRevert(bytes4(keccak256("NotClaimable()")));
        incentive.claim(LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)}))));
    }

    function test_claim_notOwner() public {
        vm.prank(address(0xdeadbeef));
        vm.expectRevert(bytes4(keccak256("Unauthorized()")));
        incentive.claim(LibZip.cdCompress(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)}))));
    }
}
