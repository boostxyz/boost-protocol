// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";

import {AContractAction} from "contracts/actions/AContractAction.sol";

contract ContractAction is AContractAction {
    /// @notice The payload for initializing a ContractAction
    /// @param target The target contract address
    /// @param selector The selector for the function to be called
    /// @param value The native token value to send with the function call
    struct InitPayload {
        uint256 chainId;
        address target;
        bytes4 selector;
        uint256 value;
    }

    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @notice Initialize the contract with the owner and the required data
    function initialize(bytes calldata data_) public virtual override initializer {
        _initialize(abi.decode(data_, (InitPayload)));
    }

    function _initialize(InitPayload memory init_) internal virtual onlyInitializing {
        chainId = init_.chainId;
        target = init_.target;
        selector = init_.selector;
        value = init_.value;
    }
}
