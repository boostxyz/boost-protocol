// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ABudget} from "contracts/budgets/ABudget.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";

interface IProtocolFeeModule {
    // NOTE: should we include this here and/or should we migrate it into BoostLib??
    struct InitPayload {
        ABudget budget;
        BoostLib.Target action;
        BoostLib.Target validator;
        BoostLib.Target allowList;
        BoostLib.Target[] incentives;
        uint64 protocolFee;
        uint256 maxParticipants;
        address owner;
    }

    /// @notice Returns the protocol fee
    /// @return The protocol fee as a uint256
    function getProtocolFee(bytes calldata data_) external view returns (uint64);
}
