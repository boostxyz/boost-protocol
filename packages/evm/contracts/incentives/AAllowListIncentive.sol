// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

/// @title SimpleAllowList AIncentive
/// @notice An incentive implementation that grants the claimer a slot on an {SimpleAllowList}
/// @dev In order for any claim to be successful:
///     - The claimer must not already be on the allow list; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to modify the allow list
abstract contract AAllowListIncentive is AIncentive {
    /// @notice The SimpleAllowList contract
    SimpleAllowList public allowList;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(AAllowListIncentive).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(AIncentive) returns (bool) {
        return interfaceId == type(AAllowListIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
