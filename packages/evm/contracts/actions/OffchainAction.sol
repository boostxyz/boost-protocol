// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {AAction} from "contracts/actions/AAction.sol";
import {AOffchainAction} from "contracts/actions/AOffchainAction.sol";

/// @title Offchain Action
/// @notice A concrete implementation for validating generalized offchain actions
/// @dev This action validates offchain activities through configurable proof mechanisms
contract OffchainAction is AOffchainAction {
    /// @notice The payload for initializing an OffchainAction
    struct InitPayload {
        OffchainConfig config;
    }

    /// @notice Emitted when the action is initialized
    event OffchainActionInitialized(string actionType);

    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ACloneable
    function initialize(bytes calldata data_) public virtual override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        _initialize(init_);
    }

    function prepare(bytes calldata) public view virtual override returns (bytes memory) {
        // Since this action is marshalled off-chain we don't need to prepare the payload
        revert BoostError.NotImplemented();
    }

    function execute(bytes calldata) external payable virtual override returns (bool, bytes memory) {
        // Since this action is marshalled off-chain we don't need to execute the payload
        revert BoostError.NotImplemented();
    }

    /// @notice Internal initialization function
    /// @param init_ The initialization payload
    function _initialize(InitPayload memory init_) internal virtual onlyInitializing {
        config = init_.config;

        emit OffchainActionInitialized(init_.config.actionType);
    }
}
