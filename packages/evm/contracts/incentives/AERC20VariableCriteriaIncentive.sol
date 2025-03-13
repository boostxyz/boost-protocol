// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {ERC20VariableIncentive} from "contracts/incentives/ERC20VariableIncentive.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

enum SignatureType {
    FUNC,
    EVENT
}

/// @title Abstract ERC20 Incentive with Variable Criteria-Based Rewards
/// @notice Defines the structure for ERC20VariableIncentive with incentive variability criteria, without implementations
/// @notice DEPRECATED, USE v2 INSTEAD
abstract contract AERC20VariableCriteriaIncentive is ERC20VariableIncentive {
    using SafeTransferLib for address;

    uint256 public maxReward;

    struct IncentiveCriteria {
        SignatureType criteriaType;
        bytes32 signature;
        uint8 fieldIndex;
        address targetContract;
    }

    IncentiveCriteria public incentiveCriteria;

    struct InitPayloadExtended {
        address asset;
        uint256 reward;
        uint256 limit;
        uint256 maxReward;
        IncentiveCriteria criteria;
    }

    /// @notice Returns the incentive criteria (abstract)
    /// @return The stored IncentiveCriteria struct
    function getIncentiveCriteria()
        external
        view
        virtual
        returns (IncentiveCriteria memory);

    function getMaxReward() external view virtual returns (uint256) {
        return maxReward;
    }

    /// @notice Checks if a specific interface is supported
    /// @param interfaceId The ID of the interface to check
    /// @return True if the interface is supported, false otherwise
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override returns (bool) {
        return
            interfaceId == type(AERC20VariableCriteriaIncentive).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /// @notice Abstract function to get the component interface ID
    /// @return bytes4 The interface ID of the component
    function getComponentInterface()
        public
        pure
        virtual
        override
        returns (bytes4)
    {
        return type(AERC20VariableCriteriaIncentive).interfaceId;
    }
}
