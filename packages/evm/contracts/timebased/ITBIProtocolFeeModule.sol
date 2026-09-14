// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

/// @title ITBIProtocolFeeModule
/// @notice Pluggable protocol fee policy for TimeBasedIncentiveManager
/// @dev The Manager consults the module at campaign creation for the range of fees the
///      creator may pick. The Manager caps the range at its standard fee, so a module can
///      only ever lower the fee. Plain creation applies the top of the range; creation
///      with an explicit fee must fall inside it. The interface is view-only: the Manager
///      reaches the module via STATICCALL, so a module cannot record state at creation time.
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

    /// @notice Quote the range of protocol fees a campaign may be charged
    /// @param ctx The campaign's fee context
    /// @return minFeeBps Lowest fee the creator may pick, in basis points
    /// @return maxFeeBps Fee applied when the creator does not pick one, in basis points.
    ///         Return type(uint64).max for either bound to defer to the Manager's standard
    ///         fee: the Manager caps both bounds at it, so a module never needs to know the
    ///         standard fee's value
    function quoteProtocolFeeRange(FeeContext calldata ctx) external view returns (uint64 minFeeBps, uint64 maxFeeBps);
}
