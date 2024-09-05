// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ASimpleBudget} from "contracts/budgets/ASimpleBudget.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

/// @title Simple Budget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
contract SimpleBudget is ASimpleBudget {
    /// @notice The payload for initializing a SimpleBudget
    struct InitPayload {
        address owner;
        address[] authorized;
    }

    /// @notice Construct a new SimpleBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @param data_ The packed init data for the budget `(address owner, address[] authorized)`
    function initialize(bytes calldata data_) public virtual override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        _initializeOwner(init_.owner);
        for (uint256 i = 0; i < init_.authorized.length; i++) {
            _isAuthorized[init_.authorized[i]] = true;
        }
    }
}
