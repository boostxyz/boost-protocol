// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibClone} from "@solady/utils/LibClone.sol";
import {LibZip} from "@solady/utils/LibZip.sol";

import {AAction} from "contracts/actions/AAction.sol";
import {AAllowList} from "contracts/allowlists/AAllowList.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {AValidator} from "contracts/validators/AValidator.sol";

library BoostLib {
    using LibClone for address;
    using LibZip for bytes;

    /// @notice A struct representing a single Boost
    struct Boost {
        AAction action;
        AValidator validator;
        AAllowList allowList;
        ABudget budget;
        AIncentive[] incentives;
        uint64 protocolFee;
        uint64 referralFee;
        uint256 maxParticipants;
        address owner;
    }

    /// @notice A base struct for a contract and its initialization parameters
    /// @dev This is used to pass the base contract and its initialization parameters in an efficient manner
    struct Target {
        bool isBase;
        address instance;
        bytes parameters;
    }

    /// @notice Clone and initialize a contract with a deterministic salt
    /// @param $ The contract to clone and initialize
    /// @param salt_ The salt for the deterministic clone
    /// @param initData_ The initialization data for the contract
    /// @return _clone The cloned and initialized contract
    function cloneAndInitialize(address $, bytes32 salt_, bytes memory initData_) internal returns (address _clone) {
        _clone = $.cloneDeterministic(salt_);
        // wake-disable-next-line reentrancy (false positive)
        ACloneable(_clone).initialize(initData_);
    }
}
