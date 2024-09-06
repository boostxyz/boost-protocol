// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AContractAction} from "contracts/actions/AContractAction.sol";

contract ContractAction is AContractAction {
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ACloneable
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
