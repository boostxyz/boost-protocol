// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Ownable} from "lib/solady/src/auth/Ownable.sol";

import {Cloneable} from "src/shared/Cloneable.sol";

/// @title Boost Incentive
/// @notice Abstract contract for a generic Incentive within the Boost protocol
/// @dev Incentive classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract Incentive is Ownable, Cloneable {
    /// @notice Emitted when an incentive is claimed
    /// @dev The `data` field contains implementation-specific context. See the implementation's `claim` function for details.
    event Claimed(address indexed recipient, bytes data);

    /// @notice Thrown when a claim fails
    error ClaimFailed();

    /// @notice Thrown when the incentive is not claimable
    error NotClaimable();

    /// @notice Initialize the contract and set the owner
    /// @dev The owner is set to the contract deployer
    constructor() {
        _initializeOwner(msg.sender);
    }

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external virtual returns (bool);

    /// @notice Check if an incentive is claimable
    /// @param data_ The data payload for the claim check (data, signature, etc.)
    /// @return True if the incentive is claimable based on the data payload
    function isClaimable(bytes calldata data_) external view virtual returns (bool);

    /// @notice Get the required allowance for the incentive
    /// @param data_ The initialization payload for the incentive
    /// @return The data payload to be passed to the {Budget} for interpretation
    /// @dev This function is called by {BoostCore} before the incentive is initialized to determine the required allowance for the incentive. If the incentive does not require any budget allowance, this function should return `(address(0), 0, bytes(""))`.
    function preflight(bytes calldata data_) external view virtual returns (bytes memory);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(Incentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
