// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";

library IncentiveBits {
    /// @dev The set of used claimed incentives for a given hash (for replay protection)
    struct IncentiveMap {
        mapping(bytes32 => uint8) map;
    }

    /// @notice an internal helper that manages the incentive bitmask
    /// @dev this supports a maximum of 8 incentives for a given boost
    /// @param bitmap the bitmap struct to operate on
    /// @param hash the claim hash used to key on the incentive bitmap
    /// @param incentive the incentive id to set in the bitmap
    function setOrThrow(IncentiveMap storage bitmap, bytes32 hash, uint256 incentive) internal {
        bytes4 invalidSelector = BoostError.IncentiveToBig.selector;
        bytes4 claimedSelector = BoostError.IncentiveClaimed.selector;

        /// @solidity memory-safe-assembly
        assembly {
            if gt(incentive, 7) {
                // if the incentive is larger the 7 (the highest bit index)
                // we revert
                mstore(0, invalidSelector)
                mstore(4, incentive)
                revert(0x00, 0x24)
            }
            mstore(0x20, bitmap.slot)
            mstore(0x00, hash)
            let storageSlot := keccak256(0x00, 0x40)
            // toggle the value that was stored inline on stack with xor
            let updatedStorageValue := xor(sload(storageSlot), shl(incentive, 1))
            // isolate the toggled bit and see if it's been unset back to zero
            let alreadySet := xor(1, and(1, shr(incentive, updatedStorageValue)))
            if alreadySet {
                // revert if the stored value was unset
                mstore(0, claimedSelector)
                mstore(4, incentive)
                revert(0x00, 0x24)
            }
            // otherwise store the newly set value
            sstore(storageSlot, updatedStorageValue)
        }
    }
}
