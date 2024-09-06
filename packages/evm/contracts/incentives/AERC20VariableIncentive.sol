// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibPRNG} from "@solady/utils/LibPRNG.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title ERC20 Incentive with Variable Rewards
/// @notice A modified ERC20 incentive implementation that allows claiming of variable token amounts with a spending limit
abstract contract AERC20VariableIncentive is AIncentive {
    using SafeTransferLib for address;

    /// @notice The address of the ERC20-like token
    address public asset;

    /// @notice The spending limit (max total claimable amount)
    uint256 public limit;

    /// @notice The total amount claimed so far
    uint256 public totalClaimed;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AERC20VariableIncentive).interfaceId;
    }

    /// @inheritdoc AIncentive
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(AERC20VariableIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
