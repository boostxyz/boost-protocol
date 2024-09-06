// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AIncentive} from "contracts/incentives/AIncentive.sol";

/// @title ERC1155Incentive
/// @notice A simple ERC1155 incentive implementation that allows claiming of tokens
abstract contract AERC1155Incentive is AIncentive, IERC1155Receiver {
    /// @notice The strategy for the incentive
    /// @dev The strategy determines how the incentive is disbursed:
    ///     - POOL: Transfer tokens from the pool to the recipient
    ///     - MINT: Mint tokens to the recipient directly (not yet implemented)
    enum Strategy {
        POOL,
        MINT
    }

    /// @notice The address of the ERC1155-compliant contract
    IERC1155 public asset;

    /// @notice The strategy for the incentive (MINT or POOL)
    Strategy public strategy;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @notice The ERC1155 token ID for the incentive
    uint256 public tokenId;

    /// @notice Extra data to be passed to the ERC1155 contract
    bytes public extraData;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(AERC1155Incentive).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AIncentive, IERC165) returns (bool) {
        return interfaceId == type(AERC1155Incentive).interfaceId || interfaceId == type(IERC1155Receiver).interfaceId
            || super.supportsInterface(interfaceId);
    }
}
