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
        require(owner_ != address(0), "Zero address owner");
        _initializeOwner(owner_);
    }

    /// @notice Accept native ETH so the zap adapter can receive swap output from a whitelisted
    /// aggregator router. Plain `Deposit`/V4 paths never leave ETH here.
    receive() external payable {}

    // --- Zap router whitelist ---

    /// @notice Allow or disallow `router` as a `depositUniswapV4LPWithSwap` swap target. The
    /// whitelist is the trust boundary for the zap's arbitrary external call, so only the owner
    /// (expected to be a multisig) may change it.
    /// @param router The aggregator router address (e.g. the KyberSwap MetaAggregationRouter)
    /// @param allowed Whether the router may be used as a zap swap target
    function setSwapRouterAllowed(address router, bool allowed) external onlyOwner {
        _setSwapRouterAllowed(router, allowed);
    }

    /// @notice Whether `router` is currently permitted as a zap swap target.
    function isSwapRouterAllowed(address router) external view returns (bool) {
        return _isSwapRouterAllowed(router);
    }

    // --- Upgrades ---

    /// @notice Authorize an upgrade to a new implementation
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
