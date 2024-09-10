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
    ActionClaimant internal actionClaimant;
    ActionStep[] internal actionSteps;

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

    struct ActionStep {
        bytes4 signature;
        SignatureType signatureType;
        uint8 actionType;
        address targetContract;
        Criteria actionParameter;
    }

    enum SignatureType {
        EVENT,
        FUNC
    }

    /// @notice The payload for identifying the action's claimaint
    /// @param signatureType Whether claimaint is inferred from event or function
    /// @param signature The 4 byte signature of the event or function
    /// @param fieldIndex The index corresponding to claimant.
    /// @param targetContract The address of the target contract
    struct ActionClaimant {
        SignatureType signatureType;
        bytes4 signature;
        uint8 fieldIndex;
        address targetContract;
    }

    function getActionStepsCount() public view virtual returns (uint256);

    function getActionStep(uint256 index) public view virtual returns (ActionStep memory);

    function getActionSteps() public view virtual returns (ActionStep[] memory);

    function getActionClaimant() public view virtual returns (ActionClaimant memory);

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AEventAction).interfaceId;
    }

    /// @inheritdoc AAction
    function supportsInterface(bytes4 interfaceId) public view virtual override(AAction) returns (bool) {
        return interfaceId == type(AEventAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
