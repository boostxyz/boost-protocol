// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Budget} from "contracts/budgets/Budget.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {AVestingBudget} from "contracts/budgets/AVestingBudget.sol";

/// @title Vesting Budget
/// @notice A vesting-based budget implementation that allows for the distribution of assets over time
/// @dev Take note of the following when making use of this budget type:
///     - The budget is designed to manage native and ERC20 token balances only. Using rebasing tokens or other non-standard token types may result in unexpected behavior.
///     - Any assets allocated to this type of budget will follow the vesting schedule as if they were locked from the beginning, which is to say that, if the vesting has already started, some portion of the assets will be immediately available for distribution.
///     - A vesting budget can also act as a time-lock, unlocking all assets at a specified point in time. To release assets at a specific time rather than vesting them over time, set the `start` to the desired time and the `duration` to zero.
///     - This contract is {Ownable} to enable the owner to allocate to the budget, reclaim and disburse assets from the budget, and to set authorized addresses. Additionally, the owner can transfer ownership of the budget to another address. Doing so has no effect on the vesting schedule.
contract VestingBudget is AVestingBudget {
    /// @notice The payload for initializing a VestingBudget
    struct InitPayload {
        address owner;
        address[] authorized;
        uint64 start;
        uint64 duration;
        uint64 cliff;
    }

    /// @notice Construct a new SimpleBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @param data_ The packed init data for the budget (see {InitPayload})
    function initialize(bytes calldata data_) public virtual override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        start = init_.start;
        duration = init_.duration;
        cliff = init_.cliff;

        _initializeOwner(init_.owner);
        for (uint256 i = 0; i < init_.authorized.length; i++) {
            _isAuthorized[init_.authorized[i]] = true;
        }
    }
}
