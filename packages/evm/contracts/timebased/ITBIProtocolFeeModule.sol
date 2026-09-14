// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

/// @title ITBIProtocolFeeModule
/// @notice Pluggable protocol fee policy for TimeBasedIncentiveManager
/// @dev The Manager consults the module at campaign creation and applies
///      `min(moduleFee, protocolFee)`, so a module can only ever lower the fee below the
///      Manager's standard fee. The interface is view-only: the Manager reaches the module
///      via STATICCALL, so a module cannot record state at creation time.
interface ITBIProtocolFeeModule {
    /// @notice Everything the Manager knows about a campaign at fee-resolution time
    /// @param creator The account creating the campaign (msg.sender on the Manager)
    /// @param budget The funding budget, or address(0) for direct-funded campaigns
    /// @param rewardToken The ERC20 reward token
    /// @param totalAmount Gross reward amount, before the protocol fee is deducted
    struct FeeContext {
        address creator;
        address budget;
        address rewardToken;
        uint256 totalAmount;
    }

    /// @notice Quote the protocol fee for a campaign
    /// @param ctx The campaign's fee context
    /// @return Protocol fee in basis points. Return type(uint64).max to defer to the
    ///         Manager's standard fee: the Manager's min() reduces it with no special
    ///         casing, so a module never needs to know the standard fee's value
    function quoteProtocolFee(FeeContext calldata ctx) external view returns (uint64);
}
