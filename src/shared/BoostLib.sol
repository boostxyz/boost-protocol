// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {Action} from "src/actions/Action.sol";
import {AllowList} from "src/allowlists/AllowList.sol";
import {Budget} from "src/budgets/Budget.sol";
import {Cloneable} from "src/shared/Cloneable.sol";
import {Incentive} from "src/incentives/Incentive.sol";
import {Validator} from "src/validators/Validator.sol";

library BoostLib {
    using LibClone for address;
    using LibZip for bytes;

    /// @notice A struct representing a single Boost
    struct Boost {
        Action action;
        Validator validator;
        AllowList allowList;
        Budget budget;
        Incentive[] incentives;
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
        Cloneable(_clone).initialize(initData_);
    }
}
