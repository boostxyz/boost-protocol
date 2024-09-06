// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AContractAction} from "contracts/actions/AContractAction.sol";
import {AValidator} from "contracts/validators/AValidator.sol";

/// @title ERC721 Mint AAction
/// @notice A primitive action to mint and/or validate that an ERC721 token has been minted
/// @dev The action is expected to be prepared with the data payload for the minting of the token
/// @dev This a minimal generic implementation that should be extended if additional functionality or customizations are required
/// @dev It is expected that the target contract has an externally accessible mint function whose selector
abstract contract AERC721MintAction is AContractAction, AValidator {
    /// @notice The set of validated tokens
    /// @dev This is intended to prevent multiple validations against the same token ID
    mapping(uint256 => bool) public validated;

    /// @inheritdoc AContractAction
    function getComponentInterface() public pure virtual override(AContractAction, AValidator) returns (bytes4) {
        return type(AERC721MintAction).interfaceId;
    }

    /// @inheritdoc AContractAction
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AContractAction, AValidator)
        returns (bool)
    {
        return interfaceId == type(AERC721MintAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
