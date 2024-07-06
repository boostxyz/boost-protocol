// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {APointsIncentive} from "contracts/incentives/APointsIncentive.sol";

/// @title Points Incentive
/// @notice A simple on-chain points incentive implementation that allows claiming of soulbound tokens
/// @dev In order for any claim to be successful:
///     - The claimer must not have already claimed the incentive; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to operate the points contract's issuance function
contract PointsIncentive is APointsIncentive {
    /// @notice The payload for initializing a PointsIncentive
    struct InitPayload {
        address venue;
        bytes4 selector;
        uint256 reward;
        uint256 limit;
    }

    /// @notice Construct a new PointsIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address points, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        if (init_.reward == 0 || init_.limit == 0) revert BoostError.InvalidInitialization();

        venue = init_.venue;
        selector = init_.selector;
        reward = init_.reward;
        limit = init_.limit;
        _initializeOwner(msg.sender);
    }
}
