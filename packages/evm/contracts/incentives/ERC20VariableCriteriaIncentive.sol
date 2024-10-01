// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

enum SignatureType {
    FUNC,
    EVENT
}

/// @title ERC20 Incentive with Variable Criteria-Based Rewards
/// @notice Extends the ERC20VariableIncentive to include incentive variability criteria on-chain
contract ERC20VariableCriteriaIncentive is ERC20VariableIncentive {
    using SafeTransferLib for address;

    struct IncentiveCriteria {
        SignatureType criteriaType;
        bytes32 signature;
        uint8 fieldIndex; // The field index from where to extract the scalar value
        address targetContract; // Contract where this event/function should be called/emitted
    }

    IncentiveCriteria public incentiveCriteria;

    struct InitPayloadExtended {
        address asset;
        uint256 reward;
        uint256 limit;
        IncentiveCriteria criteria;
    }

    /// @notice Initialize the ERC20VariableCriteriaIncentive with IncentiveCriteria
    /// @param data_ The encoded initialization data `(address asset, uint256 reward, uint256 limit, IncentiveCriteria criteria)`
    function initialize(bytes calldata data_) public override initializer {
        _initializeOwner(msg.sender);
        InitPayloadExtended memory init_ = abi.decode(data_, (InitPayloadExtended));

        address asset_ = init_.asset;
        uint256 reward_ = init_.reward;
        uint256 limit_ = init_.limit;
        IncentiveCriteria memory criteria_ = init_.criteria;

        if (limit_ == 0) revert BoostError.InvalidInitialization();

        uint256 available = asset_.balanceOf(address(this));
        if (available < limit_) {
            revert BoostError.InsufficientFunds(init_.asset, available, limit_);
        }

        asset = asset_;
        reward = reward_;
        limit = limit_;
        totalClaimed = 0;
        incentiveCriteria = criteria_;

        _initializeOwner(msg.sender);
    }

    /// @notice Returns the incentive criteria
    /// @return The stored IncentiveCriteria struct
    function getIncentiveCriteria() external view returns (IncentiveCriteria memory) {
        return incentiveCriteria;
    }
}
