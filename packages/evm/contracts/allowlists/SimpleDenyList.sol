// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ASimpleDenyList} from "contracts/allowlists/ASimpleDenyList.sol";

/// @title SimpleDenyList
/// @notice A simple implementation of an AllowList that implicitly allows all addresses except those explicitly added to the deny list
contract SimpleDenyList is ASimpleDenyList {
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
}
