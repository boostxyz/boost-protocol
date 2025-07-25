// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";

import {LibClone} from "@solady/utils/LibClone.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {AOffchainAccessList} from "contracts/allowlists/AOffchainAccessList.sol";
import {OffchainAccessList} from "contracts/allowlists/OffchainAccessList.sol";
import {RBAC} from "contracts/shared/RBAC.sol";

contract OffchainAccessListTest is Test {
    OffchainAccessList baseAccessList = new OffchainAccessList();
    OffchainAccessList accessList;

    address admin = address(0x1);
    address nonAdmin = address(0x2);
    address user1 = address(0x3);
    address user2 = address(0x4);

    function setUp() public {
        accessList = OffchainAccessList(LibClone.clone(address(baseAccessList)));

        string[] memory allowlistIds = new string[](2);
        allowlistIds[0] = "allowlist-1";
        allowlistIds[1] = "allowlist-2";

        string[] memory denylistIds = new string[](1);
        denylistIds[0] = "denylist-1";

        // Initialize with this contract as owner
        bytes memory data = abi.encode(address(this), allowlistIds, denylistIds);
        accessList.initialize(data);

        // Grant admin role to admin address
        accessList.grantRoles(admin, accessList.ADMIN_ROLE());
    }

    ////////////////////////////////////
    // OffchainAccessList.initialize //
    ////////////////////////////////////

    function testInitialize() public {
        OffchainAccessList freshClone = OffchainAccessList(LibClone.clone(address(baseAccessList)));

        string[] memory allowlistIds = new string[](1);
        allowlistIds[0] = "test-allowlist";

        string[] memory denylistIds = new string[](2);
        denylistIds[0] = "test-denylist-1";
        denylistIds[1] = "test-denylist-2";

        // Ensure the fresh clone is not initialized
        assertEq(freshClone.owner(), address(0));
        assertEq(freshClone.getAllowListIds().length, 0);
        assertEq(freshClone.getDenyListIds().length, 0);

        // Initialize the fresh clone
        bytes memory data = abi.encode(address(this), allowlistIds, denylistIds);
        freshClone.initialize(data);

        // Verify initialization
        assertEq(freshClone.owner(), address(this));
        assertEq(freshClone.getAllowListIds().length, 1);
        assertEq(freshClone.getAllowListIds()[0], "test-allowlist");
        assertEq(freshClone.getDenyListIds().length, 2);
        assertEq(freshClone.getDenyListIds()[0], "test-denylist-1");
        assertEq(freshClone.getDenyListIds()[1], "test-denylist-2");
    }

    function testInitializeAlreadyInitialized() public {
        string[] memory allowlistIds = new string[](0);
        string[] memory denylistIds = new string[](0);
        bytes memory data = abi.encode(address(this), allowlistIds, denylistIds);

        // Should revert when trying to initialize again
        vm.expectRevert();
        accessList.initialize(data);
    }

    function testInitializeEmptyLists() public {
        OffchainAccessList freshClone = OffchainAccessList(LibClone.clone(address(baseAccessList)));

        string[] memory allowlistIds = new string[](0);
        string[] memory denylistIds = new string[](0);

        bytes memory data = abi.encode(address(this), allowlistIds, denylistIds);
        freshClone.initialize(data);

        // Verify empty initialization
        assertEq(freshClone.getAllowListIds().length, 0);
        assertEq(freshClone.getDenyListIds().length, 0);
    }

    //////////////////////////////////
    // OffchainAccessList.isAllowed //
    //////////////////////////////////

    function testIsAllowed() public view {
        // Should always return true regardless of user or data
        assertTrue(accessList.isAllowed(user1, ""));
        assertTrue(accessList.isAllowed(user2, "some data"));
        assertTrue(accessList.isAllowed(address(0), ""));
        assertTrue(accessList.isAllowed(address(this), abi.encode(1, 2, 3)));
    }

    /////////////////////////////////////////
    // OffchainAccessList.getAllowlistIds //
    /////////////////////////////////////////

    function testGetAllowlistIds() public view {
        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 2);
        assertEq(ids[0], "allowlist-1");
        assertEq(ids[1], "allowlist-2");
    }

    ////////////////////////////////////////
    // OffchainAccessList.getDenylistIds //
    ////////////////////////////////////////

    function testGetDenylistIds() public view {
        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 1);
        assertEq(ids[0], "denylist-1");
    }

    /////////////////////////////////////////
    // OffchainAccessList.setAllowlistIds //
    /////////////////////////////////////////

    function testSetAllowlistIds() public {
        string[] memory newIds = new string[](3);
        newIds[0] = "new-allowlist-1";
        newIds[1] = "new-allowlist-2";
        newIds[2] = "new-allowlist-3";

        accessList.setAllowListIds(newIds);

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 3);
        assertEq(ids[0], "new-allowlist-1");
        assertEq(ids[1], "new-allowlist-2");
        assertEq(ids[2], "new-allowlist-3");
    }

    function testSetAllowlistIdsAsAdmin() public {
        string[] memory newIds = new string[](1);
        newIds[0] = "admin-allowlist";

        vm.prank(admin);
        accessList.setAllowListIds(newIds);

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 1);
        assertEq(ids[0], "admin-allowlist");
    }

    function testSetAllowlistIdsUnauthorized() public {
        string[] memory newIds = new string[](1);
        newIds[0] = "unauthorized-allowlist";

        vm.prank(nonAdmin);
        vm.expectRevert();
        accessList.setAllowListIds(newIds);
    }

    function testSetAllowlistIdsEmpty() public {
        string[] memory newIds = new string[](0);

        accessList.setAllowListIds(newIds);

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 0);
    }

    ////////////////////////////////////////
    // OffchainAccessList.setDenylistIds //
    ////////////////////////////////////////

    function testSetDenylistIds() public {
        string[] memory newIds = new string[](2);
        newIds[0] = "new-denylist-1";
        newIds[1] = "new-denylist-2";

        accessList.setDenyListIds(newIds);

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 2);
        assertEq(ids[0], "new-denylist-1");
        assertEq(ids[1], "new-denylist-2");
    }

    function testSetDenylistIdsAsAdmin() public {
        string[] memory newIds = new string[](1);
        newIds[0] = "admin-denylist";

        vm.prank(admin);
        accessList.setDenyListIds(newIds);

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 1);
        assertEq(ids[0], "admin-denylist");
    }

    function testSetDenylistIdsUnauthorized() public {
        string[] memory newIds = new string[](1);
        newIds[0] = "unauthorized-denylist";

        vm.prank(nonAdmin);
        vm.expectRevert();
        accessList.setDenyListIds(newIds);
    }

    function testSetDenylistIdsEmpty() public {
        string[] memory newIds = new string[](0);

        accessList.setDenyListIds(newIds);

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 0);
    }

    ////////////////////////////////////
    // Interface and component tests //
    ////////////////////////////////////

    function testGetComponentInterface() public view {
        bytes4 interfaceId = accessList.getComponentInterface();
        assertEq(interfaceId, type(AOffchainAccessList).interfaceId);
    }

    function testSupportsInterface() public view {
        assertTrue(accessList.supportsInterface(type(AOffchainAccessList).interfaceId));
        assertTrue(accessList.supportsInterface(type(AAllowList).interfaceId));
        assertTrue(accessList.supportsInterface(type(ACloneable).interfaceId));
    }

    ////////////////////////////////////////
    // OffchainAccessList.addAllowlistId //
    ////////////////////////////////////////

    function testAddAllowlistId() public {
        string memory newId = "new-allowlist-id";

        // Verify initial state
        string[] memory initialIds = accessList.getAllowListIds();
        assertEq(initialIds.length, 2);

        accessList.addAllowListId(newId);

        string[] memory updatedIds = accessList.getAllowListIds();
        assertEq(updatedIds.length, 3);
        assertEq(updatedIds[2], newId);
        // Ensure original IDs are still there
        assertEq(updatedIds[0], "allowlist-1");
        assertEq(updatedIds[1], "allowlist-2");
    }

    function testAddAllowlistIdAsAdmin() public {
        string memory newId = "admin-allowlist-id";

        vm.prank(admin);
        accessList.addAllowListId(newId);

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 3);
        assertEq(ids[2], newId);
    }

    function testAddAllowlistIdUnauthorized() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        accessList.addAllowListId("unauthorized-id");
    }

    function testAddAllowlistIdDuplicate() public {
        // Should revert when adding duplicates
        vm.expectRevert("Allowlist ID already exists");
        accessList.addAllowListId("allowlist-1");
    }

    ///////////////////////////////////////
    // OffchainAccessList.addDenylistId //
    ///////////////////////////////////////

    function testAddDenylistId() public {
        string memory newId = "new-denylist-id";

        // Verify initial state
        string[] memory initialIds = accessList.getDenyListIds();
        assertEq(initialIds.length, 1);

        accessList.addDenyListId(newId);

        string[] memory updatedIds = accessList.getDenyListIds();
        assertEq(updatedIds.length, 2);
        assertEq(updatedIds[1], newId);
        // Ensure original ID is still there
        assertEq(updatedIds[0], "denylist-1");
    }

    function testAddDenylistIdAsAdmin() public {
        string memory newId = "admin-denylist-id";

        vm.prank(admin);
        accessList.addDenyListId(newId);

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 2);
        assertEq(ids[1], newId);
    }

    function testAddDenylistIdUnauthorized() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        accessList.addDenyListId("unauthorized-id");
    }

    function testAddDenylistIdDuplicate() public {
        // Should revert when adding duplicates
        vm.expectRevert("Denylist ID already exists");
        accessList.addDenyListId("denylist-1");
    }

    ///////////////////////////////////////////
    // OffchainAccessList.removeAllowlistId //
    ///////////////////////////////////////////

    function testRemoveAllowlistId() public {
        // Remove existing ID
        accessList.removeAllowListId("allowlist-1");

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 1);
        assertEq(ids[0], "allowlist-2"); // Should be moved to position 0
    }

    function testRemoveAllowlistIdAsAdmin() public {
        vm.prank(admin);
        accessList.removeAllowListId("allowlist-2");

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, 1);
        assertEq(ids[0], "allowlist-1");
    }

    function testRemoveAllowlistIdUnauthorized() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        accessList.removeAllowListId("allowlist-1");
    }

    function testRemoveAllowlistIdNotFound() public {
        vm.expectRevert(abi.encodeWithSelector(OffchainAccessList.AccessListIdNotFound.selector, "non-existent-id"));
        accessList.removeAllowListId("non-existent-id");
    }

    function testRemoveAllowlistIdFromEmptyList() public {
        // First clear the list
        string[] memory emptyIds = new string[](0);
        accessList.setAllowListIds(emptyIds);

        // Try to remove from empty list
        vm.expectRevert(abi.encodeWithSelector(OffchainAccessList.AccessListIdNotFound.selector, "any-id"));
        accessList.removeAllowListId("any-id");
    }

    function testRemoveAllowlistIdWithDuplicates() public {
        // Since we now prevent duplicates, we need to test this differently
        // First, add the ID using the setter which allows duplicates
        string[] memory idsWithDuplicates = new string[](3);
        idsWithDuplicates[0] = "allowlist-1";
        idsWithDuplicates[1] = "allowlist-2";
        idsWithDuplicates[2] = "allowlist-1"; // duplicate

        accessList.setAllowListIds(idsWithDuplicates);

        // Verify we have duplicates
        string[] memory beforeIds = accessList.getAllowListIds();
        assertEq(beforeIds.length, 3);
        assertEq(beforeIds[0], "allowlist-1");
        assertEq(beforeIds[2], "allowlist-1");

        // Remove one occurrence
        accessList.removeAllowListId("allowlist-1");

        // Should remove first occurrence
        string[] memory afterIds = accessList.getAllowListIds();
        assertEq(afterIds.length, 2);
        // The last element should have moved to position 0
        assertEq(afterIds[0], "allowlist-1"); // This was the duplicate at the end
        assertEq(afterIds[1], "allowlist-2");
    }

    //////////////////////////////////////////
    // OffchainAccessList.removeDenylistId //
    //////////////////////////////////////////

    function testRemoveDenylistId() public {
        // Remove existing ID
        accessList.removeDenyListId("denylist-1");

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 0);
    }

    function testRemoveDenylistIdAsAdmin() public {
        // First add another denylist ID so we have something to remove
        accessList.addDenyListId("denylist-2");

        vm.prank(admin);
        accessList.removeDenyListId("denylist-1");

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, 1);
        assertEq(ids[0], "denylist-2");
    }

    function testRemoveDenylistIdUnauthorized() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        accessList.removeDenyListId("denylist-1");
    }

    function testRemoveDenylistIdNotFound() public {
        vm.expectRevert(abi.encodeWithSelector(OffchainAccessList.AccessListIdNotFound.selector, "non-existent-id"));
        accessList.removeDenyListId("non-existent-id");
    }

    ////////////////////////////////////////
    // OffchainAccessList.hasAllowlistId //
    ////////////////////////////////////////

    function testHasAllowlistId() public view {
        // Should find existing IDs
        assertTrue(accessList.hasAllowListId("allowlist-1"));
        assertTrue(accessList.hasAllowListId("allowlist-2"));

        // Should not find non-existent ID
        assertFalse(accessList.hasAllowListId("non-existent"));
    }

    function testHasAllowlistIdEmptyList() public {
        // Clear the list first
        string[] memory emptyIds = new string[](0);
        accessList.setAllowListIds(emptyIds);

        // Should not find any ID in empty list
        assertFalse(accessList.hasAllowListId("any-id"));
    }

    ///////////////////////////////////////
    // OffchainAccessList.hasDenylistId //
    ///////////////////////////////////////

    function testHasDenylistId() public view {
        // Should find existing ID
        assertTrue(accessList.hasDenyListId("denylist-1"));

        // Should not find non-existent ID
        assertFalse(accessList.hasDenyListId("non-existent"));
    }

    function testHasDenylistIdEmptyList() public {
        // Clear the list first
        string[] memory emptyIds = new string[](0);
        accessList.setDenyListIds(emptyIds);

        // Should not find any ID in empty list
        assertFalse(accessList.hasDenyListId("any-id"));
    }

    ////////////////////////////
    // Fuzz tests //
    ////////////////////////////

    function testFuzzIsAllowed(address user, bytes calldata data) public view {
        // Should always return true for any input
        assertTrue(accessList.isAllowed(user, data));
    }

    function testFuzzSetAllowlistIds(uint8 numIds) public {
        // Limit array size for gas reasons
        vm.assume(numIds <= 10);

        string[] memory newIds = new string[](numIds);
        for (uint256 i = 0; i < numIds; i++) {
            newIds[i] = string(abi.encodePacked("fuzz-allowlist-", vm.toString(i)));
        }

        accessList.setAllowListIds(newIds);

        string[] memory ids = accessList.getAllowListIds();
        assertEq(ids.length, newIds.length);

        for (uint256 i = 0; i < newIds.length; i++) {
            assertEq(ids[i], newIds[i]);
        }
    }

    function testFuzzSetDenylistIds(uint8 numIds) public {
        // Limit array size for gas reasons
        vm.assume(numIds <= 10);

        string[] memory newIds = new string[](numIds);
        for (uint256 i = 0; i < numIds; i++) {
            newIds[i] = string(abi.encodePacked("fuzz-denylist-", vm.toString(i)));
        }

        accessList.setDenyListIds(newIds);

        string[] memory ids = accessList.getDenyListIds();
        assertEq(ids.length, newIds.length);

        for (uint256 i = 0; i < newIds.length; i++) {
            assertEq(ids[i], newIds[i]);
        }
    }
}
