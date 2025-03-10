// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AIncentive} from "./AIncentive.sol";
import {AERC20PeggedIncentive} from "./AERC20PeggedIncentive.sol";

enum SignatureType {
    FUNC,
    EVENT
}

enum ValueType {
    RAW,
    WAD
}

/// @title AERC20PeggedIncentive
/// @notice An ERC20 incentive with pegged variable rewards
abstract contract AERC20PeggedVariableCriteriaIncentiveV2 is
    AERC20PeggedIncentive
{
    using SafeTransferLib for address;

    struct IncentiveCriteria {
        SignatureType criteriaType;
        bytes32 signature;
        uint8 fieldIndex;
        address targetContract;
        ValueType valueType;
    }

    IncentiveCriteria public incentiveCriteria;

    /// @notice Returns the incentive criteria (abstract)
    /// @return The stored IncentiveCriteria struct
    function getIncentiveCriteria()
        external
        view
        virtual
        returns (IncentiveCriteria memory);

    /// @inheritdoc ACloneable
    function getComponentInterface()
        public
        pure
        virtual
        override(AERC20PeggedIncentive)
        returns (bytes4)
    {
        return type(AERC20PeggedVariableCriteriaIncentiveV2).interfaceId;
    }

    /// @inheritdoc ACloneable
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AERC20PeggedIncentive) returns (bool) {
        return
            interfaceId ==
            type(AERC20PeggedVariableCriteriaIncentiveV2).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
