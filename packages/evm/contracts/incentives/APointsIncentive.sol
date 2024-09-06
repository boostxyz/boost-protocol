// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

/// @title Points AIncentive
/// @notice A simple on-chain points incentive implementation that allows claiming of soulbound tokens
/// @dev In order for any claim to be successful:
///     - The claimer must not have already claimed the incentive; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to operate the points contract's issuance function
abstract contract APointsIncentive is AIncentive {
    /// @notice The address of the points contract
    address public venue;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @notice The selector for the issuance function on the points contract
    bytes4 public selector;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(APointsIncentive).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AIncentive) returns (bool) {
        return interfaceId == type(APointsIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
