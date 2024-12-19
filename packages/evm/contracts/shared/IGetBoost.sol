// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BoostLib} from "./BoostLib.sol"; // Adjust the import path as needed

interface IGetBoost {
    /// @notice Get a Boost by index
    /// @param index The index of the Boost
    /// @return The Boost at the specified index
    function getBoost(uint256 index) external view returns (BoostLib.Boost memory);

    function claimIncentiveFor(
        uint256 boostId_,
        uint256 incentiveId_,
        address referrer_,
        bytes calldata data_,
        address claimant
    ) external payable;
}
