// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IClaw {
    /// @notice Reclaim assets from the incentive
    /// @param data_ The data payload for the reclaim
    /// @return True if the assets were successfully reclaimed
    function clawback(bytes calldata data_) external returns (bool);
}
