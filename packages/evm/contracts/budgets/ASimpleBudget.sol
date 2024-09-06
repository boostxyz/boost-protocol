// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

/// @title Abstract Simple ABudget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
abstract contract ASimpleBudget is ABudget, IERC1155Receiver {
    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ABudget, IERC165) returns (bool) {
        return interfaceId == type(ASimpleBudget).interfaceId || interfaceId == type(IERC1155Receiver).interfaceId
            || interfaceId == type(IERC165).interfaceId || ABudget.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ASimpleBudget).interfaceId;
    }
}
