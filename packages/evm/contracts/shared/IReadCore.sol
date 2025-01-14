// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostLib} from "contracts/shared/BoostLib.sol";

interface IReadCore {
    /// @notice Get a Boost by index
    /// @param index The index of the Boost
    /// @return The Boost at the specified index
    function getBoost(uint256 index) external view returns (BoostLib.Boost memory);
}
