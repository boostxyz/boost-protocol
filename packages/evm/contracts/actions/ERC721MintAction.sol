// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";

import {AERC721MintAction} from "contracts/actions/AERC721MintAction.sol";
import {ContractAction} from "contracts/actions/ContractAction.sol";

/// @title ERC721 Mint Action
/// @notice A primitive action to mint and/or validate that an ERC721 token has been minted
/// @dev The action is expected to be prepared with the data payload for the minting of the token
/// @dev This a minimal generic implementation that should be extended if additional functionality or customizations are required
/// @dev It is expected that the target contract has an externally accessible mint function whose selector
contract ERC721MintAction is AERC721MintAction {
    /// @notice Construct the ERC721 Mint Action
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }
    /// @inheritdoc Cloneable
    /// @notice Initialize the contract with the owner and the required mint data
    /// @param data_ The data payload for the mint action `(address target, bytes4 selector, uint256 value)`

    function initialize(bytes calldata data_) public virtual override initializer {
        _initialize(abi.decode(data_, (InitPayload)));
    }

    function _initialize(InitPayload memory init_) internal override onlyInitializing {
        chainId = init_.chainId;
        target = init_.target;
        selector = init_.selector;
        value = init_.value;
        _initializeOwner(msg.sender);
    }
}
