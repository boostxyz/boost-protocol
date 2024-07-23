// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {AllowListIncentive} from "contracts/incentives/AllowListIncentive.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";

contract AllowListIncentiveTest is Test {
    SimpleAllowList public allowList;
    AllowListIncentive public incentive;

    function setUp() public {
        allowList = SimpleAllowList(LibClone.clone(address(new SimpleAllowList())));
        allowList.initialize(abi.encode(address(this), new address[](0)));

        incentive = AllowListIncentive(LibClone.clone(address(new AllowListIncentive())));
        incentive.initialize(abi.encode(AllowListIncentive.InitPayload({allowList: allowList, limit: 10})));

        allowList.grantRoles(address(incentive), 1 << 1);
    }

    ////////////////////
    // Initialization //
    ////////////////////

    function test_initialize() public {
        assertEq(address(incentive.allowList()), address(allowList));
        assertEq(incentive.limit(), 10);
        assertEq(incentive.owner(), address(this));
    }

    function test_initialize_twice() public {
        vm.expectRevert(bytes4(keccak256("InvalidInitialization()")));
        incentive.initialize(abi.encode(AllowListIncentive.InitPayload({allowList: allowList, limit: 10})));
    }

    //////////////////////////////
    // AllowListIncentive.claim //
    //////////////////////////////

    function test_claim() public {
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
        assertEq(allowList.isAllowed(address(1), new bytes(0)), true);
    }

    function test_claim_twice() public {
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));

        vm.expectRevert(bytes4(keccak256("NotClaimable()")));
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
    }

    function test_claim_notOwner() public {
        vm.prank(address(0xdeadbeef));
        vm.expectRevert(bytes4(keccak256("Unauthorized()")));
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));
    }

    function test_claim_maxClaims() public {
        for (uint8 i = 0; i < 10; i++) {
            incentive.claim(
                abi.encode(
                    Incentive.ClaimPayload({target: makeAddr(string(abi.encodePacked("rando", i))), data: new bytes(0)})
                )
            );
        }
        assertEq(incentive.claims(), 10);

        vm.expectRevert(bytes4(keccak256("NotClaimable()")));
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(11), data: new bytes(0)})));
    }

    ////////////////////////////////////
    // AllowListIncentive.isClaimable //
    ////////////////////////////////////

    function test_isClaimable() public {
        assertEq(
            incentive.isClaimable(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)}))), true
        );
    }

    function test_isClaimable_claimed() public {
        incentive.claim(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)})));

        assertEq(
            incentive.isClaimable(abi.encode(Incentive.ClaimPayload({target: address(1), data: new bytes(0)}))), false
        );
    }

    ////////////////////////////////
    // AllowListIncentive.reclaim //
    ////////////////////////////////

    function test_reclaim() public {
        vm.expectRevert(bytes4(keccak256("NotImplemented()")));
        incentive.reclaim(new bytes(0));
    }

    //////////////////////////////////
    // AllowListIncentive.preflight //
    //////////////////////////////////

    function test_preflight() public {
        assertEq(new bytes(0), incentive.preflight(new bytes(0)));
    }

    ////////////////////////////////////
    // AllowListIncentive.getComponentInterface //
    ////////////////////////////////////

    function testGetComponentInterface() public {
        // Retrieve the component interface
        console.logBytes4(incentive.getComponentInterface());
    }

    /////////////////////////////////////
    // AllowListIncentive.supportsInterface //
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
