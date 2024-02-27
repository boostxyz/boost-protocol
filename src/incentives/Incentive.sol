// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Cloneable} from "src/Cloneable.sol";

/// @title Boost Incentive
/// @notice Abstract contract for a generic Incentive within the Boost protocol
/// @dev Incentive classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Incentive is Cloneable {
    /// @notice Emitted when an incentive is claimed
    event Claimed(address indexed recipient, bytes data);

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external virtual returns (bool);

    /// @notice Check if an incentive is claimable
    /// @param data_ The data payload for the claim check (data, signature, etc.)
    /// @return True if the incentive is claimable based on the data payload
    function isClaimable(bytes calldata data_) external view virtual returns (bool);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(Incentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
