// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {AllowList} from "src/allowlists/AllowList.sol";
import {BoostError} from "src/shared/BoostError.sol";

/// @title Simple AllowList
/// @notice A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
contract SimpleAllowList is AllowList {
    using LibZip for bytes;

    /// @dev An internal mapping of allowed statuses
    mapping(address => bool) private _allowed;

    /// @notice Construct a new SimpleAllowList
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the list of allowed addresses
    /// @param data_ The compressed initialization data `(address owner, address[] allowList)`
    function initialize(bytes calldata data_) external virtual override initializer {
        (address owner_, address[] memory allowList_) = abi.decode(data_.cdDecompress(), (address, address[]));

        _initializeOwner(owner_);
        for (uint256 i = 0; i < allowList_.length; i++) {
            _allowed[allowList_[i]] = true;
        }
    }

    /// @notice Check if a user is authorized
    /// @param user_ The address of the user
    /// @param - The data payload for the authorization check, not used in this implementation
    /// @return True if the user is authorized
    function isAllowed(address user_, bytes calldata /* data_ - unused */ ) external view override returns (bool) {
        return _allowed[user_];
    }

    /// @notice Set the allowed status of a user
    /// @param users_ The list of users to update
    /// @param allowed_ The allowed status of each user
    /// @dev The length of the `users_` and `allowed_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setAllowed(address[] calldata users_, bool[] calldata allowed_) external onlyOwner {
        if (users_.length != allowed_.length) revert BoostError.LengthMismatch();

        for (uint256 i = 0; i < users_.length; i++) {
            _allowed[users_[i]] = allowed_[i];
        }
    }
}
