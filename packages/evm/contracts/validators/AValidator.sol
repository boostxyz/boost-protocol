// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ACloneable} from "contracts/shared/ACloneable.sol";

/// @title Boost Validator
/// @notice Abstract contract for a generic Validator within the Boost protocol
/// @dev Validator classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.
abstract contract AValidator is ACloneable {
    /// @notice Validate that a given user has completed an acction successfully
    /// @param boostId The Id from the available boosts
    /// @param incentiveId The Id from the available boost incentives to be claimed
    /// @param claimant The address of the user claiming the incentive
    /// @param data The encoded payload to be validated
    /// @return True if the action has been validated based on the data payload
    /// @dev The decompressed payload contains freeform bytes that are entirely implementation-specific
    function validate(uint256 boostId, uint256 incentiveId, address claimant, bytes calldata data)
        external
        payable
        virtual
        returns (bool);

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ACloneable) returns (bool) {
        return interfaceId == type(AValidator).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override(ACloneable) returns (bytes4) {
        return type(AValidator).interfaceId;
    }
}
