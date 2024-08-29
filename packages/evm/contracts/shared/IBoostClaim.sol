// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

interface IBoostClaim {
    /// @notice A higher order struct for encoding and decoding arbitrary claims
    struct BoostClaimData {
        bytes validatorData;
        bytes incentiveData;
    }
}
