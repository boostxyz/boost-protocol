// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ABudget} from "contracts/budgets/ABudget.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";

interface IProtocolFeeModule {
    /// @notice Returns the protocol fee
    /// @return The protocol fee as a uint64
    function getProtocolFee(bytes calldata data_) external view returns (uint64);
}