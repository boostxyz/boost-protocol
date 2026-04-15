// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "@solady/auth/Ownable.sol";
import {Initializable} from "@solady/utils/Initializable.sol";
import {UUPSUpgradeable} from "@solady/utils/UUPSUpgradeable.sol";

import {TBIForwarderAdapters} from "contracts/timebased/TBIForwarderAdapters.sol";

/// @title TBIForwarder
/// @notice Stateless deposit router that forwards user funds into DeFi pools.
/// Emits a Deposit event the backend indexer uses as an opt-in signal for reward eligibility.
/// @dev UUPS upgradeable. New protocol adapters are added in TBIForwarderAdapters and
/// picked up by upgrading the implementation.
contract TBIForwarder is Initializable, UUPSUpgradeable, Ownable, TBIForwarderAdapters {
    /// @notice Allocated gap space for future storage variables
    uint256[50] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the TBIForwarder
    /// @param owner_ The owner of the contract
    function initialize(address owner_) external initializer {
        _initializeOwner(owner_);
    }

    // --- Upgrades ---

    /// @notice Authorize an upgrade to a new implementation
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
