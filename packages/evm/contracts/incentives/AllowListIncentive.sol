// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {SimpleAllowList} from "contracts/allowlists/SimpleAllowList.sol";
import {AAllowListIncentive} from "contracts/incentives/AAllowListIncentive.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";

/// @title SimpleAllowList Incentive
/// @notice An incentive implementation that grants the claimer a slot on an {SimpleAllowList}
/// @dev In order for any claim to be successful:
///     - The claimer must not already be on the allow list; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to modify the allow list
contract AllowListIncentive is AAllowListIncentive {
    /// @notice The payload for initializing an AllowListIncentive
    struct InitPayload {
        SimpleAllowList allowList;
        uint256 limit;
    }

    /// @notice Construct a new AllowListIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The packed initialization data `(SimpleAllowList allowList, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        _initializeOwner(msg.sender);
        allowList = init_.allowList;
        limit = init_.limit;
    }
}
