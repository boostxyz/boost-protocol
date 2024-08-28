// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {MockERC20, MockERC721} from "contracts/shared/Mocks.sol";
import {MockAuth} from "contracts/shared/Mocks.sol"; // Add this import at the top with the others

contract MocksTest is Test {
    MockERC20 mockERC20;
    MockERC721 mockERC721;
    MockAuth mockAuth;
    address[] mockAddresses;
    address authorizedBoostCreator = makeAddr("authorizedBoostCreator");

    function setUp() public {
        mockERC20 = new MockERC20();
        mockERC721 = new MockERC721();
        mockAddresses.push(authorizedBoostCreator);
        mockAuth = new MockAuth(mockAddresses);
    }

    ///////////////
    // MockERC20 //
    ///////////////

    function testMock20Name() public {
        assertEq(mockERC20.name(), "Mock ERC20");
    }

    function testMock20Symbol() public {
        assertEq(mockERC20.symbol(), "MOCK");
    }

    function testMock20TotalSupply() public {
        assertEq(mockERC20.totalSupply(), 0);
    }

    function testMock20Mint() public {
        mockERC20.mint(address(this), 100);
        assertEq(mockERC20.totalSupply(), 100);
        assertEq(mockERC20.balanceOf(address(this)), 100);
    }

    ////////////////
    // MockERC721 //
    ////////////////

    function testMock721Name() public {
        assertEq(mockERC721.name(), "Mock ERC721");
    }

    function testMock721Symbol() public {
        assertEq(mockERC721.symbol(), "MOCK");
    }

    function testMock721TotalSupply() public {
        assertEq(mockERC721.totalSupply(), 0);
    }

    function testMock721Mint() public {
        // Mint to a valid address with enough value
        mockERC721.mint{value: 0.1 ether}(address(0xdeadbeef));
        assertEq(mockERC721.totalSupply(), 1);
        assertEq(mockERC721.ownerOf(1), address(0xdeadbeef));
    }

    function testMock721Mint_ZeroAddress() public {
        // Should revert if the address is invalid
        vm.expectRevert(bytes4(keccak256("TransferToZeroAddress()")));
        mockERC721.mint{value: 0.1 ether}(address(0));
    }

    function testMock721Mint_NoValue() public {
        // Should revert if the value is not sent
        vm.expectRevert("MockERC721: gimme more money!");
        mockERC721.mint(address(0xdeadbeef));
    }

    function testMock721Mint_Underpriced() public {
        // Should revert if the value is insufficient
        vm.expectRevert("MockERC721: gimme more money!");
        mockERC721.mint{value: 0.1 ether - 1 wei}(address(0));
    }

    function testMock721MintPrice() public {
        assertEq(mockERC721.mintPrice(), 0.1 ether);
    }

    function testMock721TokenURI() public {
        assertEq(mockERC721.tokenURI(1), "https://example.com/token/1");
        assertEq(mockERC721.tokenURI(42), "https://example.com/token/42");
        assertEq(
            mockERC721.tokenURI(type(uint256).max),
            "https://example.com/token/115792089237316195423570985008687907853269984665640564039457584007913129639935"
        );
    }

    //////////////
    // MockAuth //
    //////////////
    function testMockAuthIsAuthorized() public {
        assertTrue(mockAuth.isAuthorized(authorizedBoostCreator));
    }

    function testMockAuthIsNotAuthorized() public {
        assertFalse(mockAuth.isAuthorized(address(this)));
    }
}
