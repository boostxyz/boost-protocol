// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {ASimpleAllowList} from "contracts/allowlists/ASimpleAllowList.sol";

/// @title Simple AllowList
/// @notice A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
contract SimpleAllowList is ASimpleAllowList {
    /// @notice Construct a new SimpleAllowList
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of allowed addresses
    /// @param data_ The compressed initialization data `(address owner, address[] allowList)`
    function initialize(bytes calldata data_) public virtual override initializer {
        (address owner_, address[] memory allowList_) = abi.decode(data_, (address, address[]));
        _initializeOwner(owner_);
        _grantRoles(owner_, LIST_MANAGER_ROLE);
        for (uint256 i = 0; i < allowList_.length; i++) {
            _allowed[allowList_[i]] = true;
        }
    }
}
