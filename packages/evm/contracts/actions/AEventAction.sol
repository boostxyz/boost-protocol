// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAction} from "contracts/actions/AAction.sol";

/// @title Event AAction
/// @notice A primitive action to mint and/or validate that an ERC721 token has been minted
/// @dev The action is expected to be prepared with the data payload for the minting of the token
/// @dev This a minimal generic implementation that should be extended if additional functionality or customizations are required
/// @dev It is expected that the target contract has an externally accessible mint function whose selector
abstract contract AEventAction is AAction {
    ActionEvent[] internal actionEvents;

    // Define Enums
    enum FilterType {
        EQUAL,
        NOT_EQUAL,
        GREATER_THAN,
        LESS_THAN,
        CONTAINS
    }

    enum PrimitiveType {
        UINT,
        ADDRESS,
        BYTES,
        STRING
    }

    // Define Structs
    struct Criteria {
        FilterType filterType;
        PrimitiveType fieldType;
        uint8 fieldIndex; // Where in the logs arg array the field is located
        bytes filterData; // data fiels in case we need more complex filtering in the future - initially unused
    }

    struct ActionEvent {
        bytes4 eventSignature;
        uint8 actionType;
        address targetContract;
        Criteria actionParameter;
    }

    function getActionEventsCount() public view virtual returns (uint256);

    function getActionEvent(uint256 index) public view virtual returns (ActionEvent memory);

    function getActionEvents() public view virtual returns (ActionEvent[] memory);

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AEventAction).interfaceId;
    }

    /// @inheritdoc AAction
    function supportsInterface(bytes4 interfaceId) public view virtual override(AAction) returns (bool) {
        return interfaceId == type(AEventAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
