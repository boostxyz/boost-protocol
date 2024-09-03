// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

/// @title Managed Budget
/// @notice A minimal budget implementation with RBAC that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
contract ManagedBudget is AManagedBudget {
    /// @notice The payload for initializing a ManagedBudget
    struct InitPayload {
        address owner;
        address[] authorized;
        uint256[] roles;
    }

    /// @notice Construct a new ManagedBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @param data_ The packed init data for the budget `(address owner, address[] authorized, uint256[] roles)`
    function initialize(bytes calldata data_) public virtual override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        _initializeOwner(init_.owner);
        for (uint256 i = 0; i < init_.authorized.length; i++) {
            _setRoles(init_.authorized[i], init_.roles[i]);
        }
    }
}
