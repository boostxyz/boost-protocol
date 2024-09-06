// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

/// @title Vesting ABudget
/// @notice A vesting-based budget implementation that allows for the distribution of assets over time
/// @dev Take note of the following when making use of this budget type:
///     - The budget is designed to manage native and ERC20 token balances only. Using rebasing tokens or other non-standard token types may result in unexpected behavior.
///     - Any assets allocated to this type of budget will follow the vesting schedule as if they were locked from the beginning, which is to say that, if the vesting has already started, some portion of the assets will be immediately available for distribution.
///     - A vesting budget can also act as a time-lock, unlocking all assets at a specified point in time. To release assets at a specific time rather than vesting them over time, set the `start` to the desired time and the `duration` to zero.
///     - This contract is {Ownable} to enable the owner to allocate to the budget, reclaim and disburse assets from the budget, and to set authorized addresses. Additionally, the owner can transfer ownership of the budget to another address. Doing so has no effect on the vesting schedule.
abstract contract AVestingBudget is ABudget {
    /// @notice The timestamp at which the vesting schedule begins
    uint64 public start;

    /// @notice The duration of the vesting schedule (in seconds)
    uint64 public duration;

    /// @notice The duration of the cliff period (in seconds)
    uint64 public cliff;

    /// @notice Get the end time of the vesting schedule
    /// @return The end time of the vesting schedule
    function end() external virtual returns (uint256);

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(AVestingBudget).interfaceId || ABudget.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AVestingBudget).interfaceId;
    }
}
