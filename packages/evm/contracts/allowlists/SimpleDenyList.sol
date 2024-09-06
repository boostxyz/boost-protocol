// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable as AOwnable} from "@solady/auth/Ownable.sol";

import {ASimpleDenyList} from "contracts/allowlists/ASimpleDenyList.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

/// @title SimpleDenyList
/// @notice A simple implementation of an AllowList that implicitly allows all addresses except those explicitly added to the deny list
contract SimpleDenyList is AOwnable, ASimpleDenyList {
    /// @dev An internal mapping of denied statuses
    mapping(address => bool) internal _denied;

    /// @notice Construct a new SimpleDenyList
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the initial list of denied addresses
    /// @param data_ The compressed initialization data `(address owner, address[] denyList)`
    function initialize(bytes calldata data_) public virtual override initializer {
        (address owner_, address[] memory denyList_) = abi.decode(data_, (address, address[]));

        _initializeOwner(owner_);
        for (uint256 i = 0; i < denyList_.length; i++) {
            _denied[denyList_[i]] = true;
        }
    }

    /// @notice Check if a user is authorized (i.e. not denied)
    /// @param user_ The address of the user
    /// @param - The data payload for the authorization check, not used in this implementation
    /// @return True if the user is authorized
    function isAllowed(address user_, bytes calldata /* data_ - unused */ ) external view override returns (bool) {
        return !_denied[user_];
    }

    /// @notice Set the denied status of a user
    /// @param users_ The list of users to update
    /// @param denied_ The denied status of each user
    /// @dev The length of the `users_` and `denied_` arrays must be the same
    /// @dev This function can only be called by the owner
    function setDenied(address[] calldata users_, bool[] calldata denied_) external override onlyOwner {
        if (users_.length != denied_.length) revert BoostError.LengthMismatch();

        for (uint256 i = 0; i < users_.length; i++) {
            _denied[users_[i]] = denied_[i];
        }
    }
}
