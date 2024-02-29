// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibClone} from "lib/solady/src/utils/LibClone.sol";
import {LibZip} from "lib/solady/src/utils/LibZip.sol";

import {Action} from "src/actions/Action.sol";
import {AllowList} from "src/allowlists/AllowList.sol";
import {Budget} from "src/budgets/Budget.sol";
import {Incentive} from "src/incentives/Incentive.sol";
import {Validator} from "src/validators/Validator.sol";

library BoostLib {
    using LibClone for address;
    using LibZip for bytes;

    struct Boost {
        Action action;
        AllowList allowList;
        Budget budget;
        Incentive[] incentives;
        Validator validator;
        uint256 protocolFee;
        uint256 referralFee;
        uint256 rewardAmount;
        uint256 maxParticipants;
    }

    struct BaseWithArgs {
        address base;
        bytes parameters;
    }

    function initialize(Boost storage boost_, bytes calldata data_) internal {
        (
            BaseWithArgs memory action_,
            BaseWithArgs memory allowList_,
            BaseWithArgs memory budget_,
            BaseWithArgs[] memory incentives_,
            BaseWithArgs memory validator_,
            uint256 protocolFee_,
            uint256 referralFee_,
            uint256 maxParticipants_
        ) = abi.decode(
            data_.cdDecompress(),
            (BaseWithArgs, BaseWithArgs, BaseWithArgs, BaseWithArgs[], BaseWithArgs, uint256, uint256, uint256)
        );

        boost_.action = Action(action_.base.clone(action_.parameters));
        boost_.allowList = AllowList(allowList_.base.clone(allowList_.parameters));
        boost_.budget = Budget(payable(budget_.base.clone(budget_.parameters)));
        boost_.validator = Validator(validator_.base.clone(validator_.parameters));
        boost_.protocolFee = protocolFee_;
        boost_.referralFee = referralFee_;
        boost_.maxParticipants = maxParticipants_;

        for (uint256 i = 0; i < incentives_.length; i++) {
            boost_.incentives.push(Incentive(incentives_[i].base.clone(incentives_[i].parameters)));
        }
    }
}
