// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

import {AllowList} from "contracts/allowlists/AllowList.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

/// @title Simple AllowList
/// @notice A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses
contract SimpleAllowList is AllowList, OwnableRoles {
    /// @notice The role for managing the allow list
    uint256 public constant LIST_MANAGER_ROLE = 1 << 1;

    /// @dev An internal mapping of allowed statuses
    mapping(address => bool) private _allowed;

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

    /// @notice Check if a user is authorized
    /// @param user_ The address of the user
    /// @param - The data payload for the authorization check, not used in this implementation
    /// @return True if the user is authorized
    function isAllowed(address user_, bytes calldata /* data_ - unused */ ) external view override returns (bool) {
        return _allowed[user_];
    }

    /// @inheritdoc AllowList
    function setAllowed(address[] calldata users_, bool[] calldata allowed_) external override onlyRoles(LIST_MANAGER_ROLE) {
        if (users_.length != allowed_.length) revert BoostError.LengthMismatch();

        for (uint256 i = 0; i < users_.length; i++) {
            _allowed[users_[i]] = allowed_[i];
        }
    }

    /// @inheritdoc AllowList
    /// @notice This function is not implemented in this contract
    function setDenied(address[] calldata users_, bool[] calldata denied_) external override onlyOwner {
        revert BoostError.NotImplemented();
    }
}
