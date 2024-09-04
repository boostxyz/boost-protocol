// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {Action} from "contracts/actions/Action.sol";

/// @title Event Action
/// @notice A primitive action to mint and/or validate that an ERC721 token has been minted
/// @dev The action is expected to be prepared with the data payload for the minting of the token
/// @dev This a minimal generic implementation that should be extended if additional functionality or customizations are required
/// @dev It is expected that the target contract has an externally accessible mint function whose selector
abstract contract AEventAction is Action {
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

    /// @notice Prepare the action for execution and return the expected payload
    /// @param data_ The ABI-encoded payload for the target contract call
    /// @return bytes_ The encoded payload to be sent to the target contract
    /// @dev Note that the mint value is NOT included in the prepared payload but must be sent with the call
    function prepare(bytes calldata data_) public view virtual override returns (bytes memory bytes_) {
        // Since this action is marshalled off-chain we don't need to prepare the payload
        revert BoostError.NotImplemented();
        //return data_;
    }

    function execute(bytes calldata data_) external payable virtual override returns (bool, bytes memory) {
        // Since this action is marshalled off-chain we don't need to execute the payload
        revert BoostError.NotImplemented();
        //return (true, data_);
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AEventAction).interfaceId;
    }

    function getActionEventsCount() public view virtual returns (uint256) {
        return actionEvents.length;
    }

    function getActionEvent(uint256 index) public view virtual returns (ActionEvent memory) {
        return actionEvents[index];
    }

    function getActionEvents() public view virtual returns (ActionEvent[] memory) {
        return actionEvents;
    }

    /// @inheritdoc Action
    function supportsInterface(bytes4 interfaceId) public view virtual override(Action) returns (bool) {
        return interfaceId == type(AEventAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
