// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";

import {AEventAction} from "contracts/actions/AEventAction.sol";

contract EventAction is AEventAction {
    /// @notice The payload for initializing a ContractAction
    /// @param target The target contract address
    /// @param selector The selector for the function to be called
    /// @param value The native token value to send with the function call
    struct InitPayload {
        ActionEvent actionEventOne;
        ActionEvent actionEventTwo;
        ActionEvent actionEventThree;
        ActionEvent actionEventFour;
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
        actionEvents.push(init_.actionEventOne);
        actionEvents.push(init_.actionEventTwo);
        actionEvents.push(init_.actionEventThree);
        actionEvents.push(init_.actionEventFour);
    }
}
