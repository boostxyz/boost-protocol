// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {RBAC} from "contracts/shared/RBAC.sol";

contract TestRBAC is RBAC {
    constructor(address owner) {
        _initializeOwner(owner);
    }
}

contract RBACTest is Test {
    RBAC rbac;

    function setUp() public {
        // Deploy a new RBAC contract
        rbac = new TestRBAC(address(this));
    }

    ////////////////////////////////
    // RBAC.grantRoles //
    ////////////////////////////////

    function testGrantRoles() public {
        // Ensure the contract authorizes an account
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = rbac.MANAGER_ROLE();
        accounts[1] = address(0xaaaa);
        authorized[1] = rbac.ADMIN_ROLE();
        rbac.grantRoles(accounts, authorized);
        assertTrue(rbac.hasAllRoles(address(0xc0ffee), rbac.MANAGER_ROLE()));
        assertTrue(rbac.hasAllRoles(address(0xaaaa), rbac.MANAGER_ROLE() & rbac.ADMIN_ROLE()));
        assertFalse(rbac.isAuthorized(address(0xdeadbeef)));
    }

    function testGrantRoles_NotOwner() public {
        // Ensure the contract does not authorize an account if not called by the owner
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = rbac.MANAGER_ROLE();
        vm.prank(address(0xdeadbeef));

        vm.expectRevert(BoostError.Unauthorized.selector);
        rbac.grantRoles(accounts, authorized);
    }

    function testGrantRoles_Manager() public {
        // Ensure the contract does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = rbac.MANAGER_ROLE();
        rbac.grantRoles(accounts, authorized);

        address[] memory accounts_ = new address[](1);
        uint256[] memory authorized_ = new uint256[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = rbac.MANAGER_ROLE();

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        rbac.grantRoles(accounts_, authorized_);
    }

    function testGrantRoles_Admin() public {
        // Ensure the contract does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = rbac.ADMIN_ROLE();
        rbac.grantRoles(accounts, authorized);

        address[] memory accounts_ = new address[](1);
        uint256[] memory authorized_ = new uint256[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = 1;

        vm.prank(address(0xdeadbeef));
        rbac.grantRoles(accounts_, authorized_);
    }

    function testGrantRoles_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        rbac.grantRoles(accounts, authorized);
    }

    ////////////////////////////////
    // RBAC.revokeRoles //
    ////////////////////////////////

    function testRevokeRoles() public {
        // Ensure the contract authorizes an account
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = rbac.MANAGER_ROLE();
        accounts[1] = address(0xaaaa);
        authorized[1] = rbac.ADMIN_ROLE();
        rbac.grantRoles(accounts, authorized);
        assertTrue(rbac.hasAllRoles(address(0xc0ffee), rbac.MANAGER_ROLE()));
        assertTrue(rbac.hasAllRoles(address(0xaaaa), rbac.MANAGER_ROLE() & rbac.ADMIN_ROLE()));
        assertFalse(rbac.isAuthorized(address(0xdeadbeef)));
        rbac.revokeRoles(accounts, authorized);
        assertFalse(rbac.hasAllRoles(address(0xc0ffee), rbac.MANAGER_ROLE()));
        assertFalse(rbac.hasAnyRole(address(0xaaaa), rbac.ADMIN_ROLE() | rbac.MANAGER_ROLE()));
    }

    function testRevokeRoles_NotOwner() public {
        // Ensure the contract does not authorize an account if not called by the owner
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = rbac.MANAGER_ROLE();

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        rbac.revokeRoles(accounts, authorized);
    }

    function testRevokeRoles_Manager() public {
        // Ensure the contract does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = rbac.MANAGER_ROLE();
        rbac.grantRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));
        vm.expectRevert(BoostError.Unauthorized.selector);
        rbac.revokeRoles(accounts, authorized);
    }

    function testRevokeRoles_Admin() public {
        // Ensure the contract does authorizes revocation when called by an admin
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = rbac.ADMIN_ROLE();
        rbac.grantRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));
        rbac.revokeRoles(accounts, authorized);
    }

    function testRevokeRoles_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        rbac.revokeRoles(accounts, authorized);
    }

    ////////////////////////////////
    // RBAC.setAuthorized //
    ////////////////////////////////

    function testSetAuthorized() public {
        // Ensure the contract authorizes an account
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;
        rbac.setAuthorized(accounts, authorized);
        assertTrue(rbac.isAuthorized(address(0xc0ffee)));
        assertFalse(rbac.isAuthorized(address(0xdeadbeef)));
    }

    function testSetAuthorized_NotOwner() public {
        // Ensure the contract does not authorize an account if not called by the owner
        vm.prank(address(0xdeadbeef));

        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xc0ffee);
        authorized[0] = true;

        vm.expectRevert(BoostError.Unauthorized.selector);
        rbac.setAuthorized(accounts, authorized);
    }

    function testSetAuthorized_Manager() public {
        // Ensure the contract does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = true;
        rbac.setAuthorized(accounts, authorized);

        vm.prank(address(0xdeadbeef));

        address[] memory accounts_ = new address[](1);
        bool[] memory authorized_ = new bool[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = true;

        vm.expectRevert(BoostError.Unauthorized.selector);
        rbac.setAuthorized(accounts_, authorized_);
    }

    function testSetAuthorized_Admin() public {
        // Ensure the contract does not authorize accounts when called by a manager
        address[] memory accounts = new address[](1);
        uint256[] memory authorized = new uint256[](1);
        accounts[0] = address(0xdeadbeef);
        authorized[0] = rbac.ADMIN_ROLE();
        rbac.grantRoles(accounts, authorized);

        vm.prank(address(0xdeadbeef));

        address[] memory accounts_ = new address[](1);
        bool[] memory authorized_ = new bool[](1);
        accounts_[0] = address(0xc0ffee);
        authorized_[0] = true;

        rbac.setAuthorized(accounts_, authorized_);
    }

    function testSetAuthorized_LengthMismatch() public {
        address[] memory accounts = new address[](1);
        bool[] memory authorized = new bool[](2);

        vm.expectRevert(BoostError.LengthMismatch.selector);
        rbac.setAuthorized(accounts, authorized);
    }

    function testSetAuthorized_RemoveRole() public {
        // Grant authorization to the user
        address user = address(0xc0ffee);
        address[] memory accounts = new address[](1);
        accounts[0] = user;
        bool[] memory authorizations = new bool[](1);
        authorizations[0] = true;
        rbac.setAuthorized(accounts, authorizations);

        // Verify that the user is authorized
        assertTrue(rbac.isAuthorized(user), "User should be authorized");

        // Remove authorization from the user
        authorizations[0] = false;
        rbac.setAuthorized(accounts, authorizations);

        // Verify that the user is no longer authorized
        assertFalse(rbac.isAuthorized(user), "User should not be authorized");
    }

    ///////////////////////////////
    // RBAC.isAuthorized //
    ///////////////////////////////

    function testIsAuthorized() public {
        // Ensure the contract indicates that owners, managers, and admins are authorized
        address[] memory accounts = new address[](2);
        uint256[] memory authorized = new uint256[](2);
        accounts[0] = address(0xc0ffee);
        authorized[0] = 1;
        accounts[1] = address(0xb33f);
        authorized[1] = 2;

        rbac.grantRoles(accounts, authorized);

        assertTrue(rbac.isAuthorized(address(0xc0ffee)));
        assertTrue(rbac.isAuthorized(address(0xb33f)));
        assertFalse(rbac.isAuthorized(address(0xdeadbeef)));
    }

    function testIsAuthorized_Owner() public view {
        assertTrue(rbac.isAuthorized(address(this)));
    }
}
