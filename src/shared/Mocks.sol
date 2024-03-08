// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibString} from "lib/solady/src/utils/LibString.sol";
import {ERC20} from "lib/solady/src/tokens/ERC20.sol";
import {ERC721} from "lib/solady/src/tokens/ERC721.sol";

/**
 * 🚨 WARNING: The mocks in this file are for testing purposes only. DO NOT use
 * ANY of this code in production, ever, or you will lose all of your money,
 * friends, and credibility. Also, your cat might run away for fear of being
 * associated with someone who makes such poor life choices.
 */

/// @notice A mock ERC721 token
contract MockERC721 is ERC721 {
    uint256 public totalSupply;
    uint256 public mintPrice = 0.1 ether;

    function name() public pure override returns (string memory) {
        return "Mock ERC721";
    }

    function symbol() public pure override returns (string memory) {
        return "MOCK";
    }

    function mint(address to) public payable {
        require(msg.value >= mintPrice, "MockERC721: gimme more money!");
        // pre-increment so IDs start at 1
        _mint(to, ++totalSupply);
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        return string(abi.encodePacked("https://example.com/token/", LibString.toString(id)));
    }
}

contract MockERC20 is ERC20 {
    function name() public pure override returns (string memory) {
        return "Mock ERC20";
    }

    function symbol() public pure override returns (string memory) {
        return "MOCK";
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
