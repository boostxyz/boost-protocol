// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {Incentive} from "./Incentive.sol";
import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

/// @title Points Incentive
/// @notice A simple on-chain points incentive implementation that allows claiming of soulbound tokens
/// @dev In order for any claim to be successful:
///     - The claimer must not have already claimed the incentive; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to operate the points contract's issuance function
abstract contract APointsIncentive is Incentive {
    /// @notice The address of the points contract
    address public venue;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @notice The selector for the issuance function on the points contract
    bytes4 public selector;

    /// @notice Claim the incentive
    /// @param claimTarget the address receiving the claim funds
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata) external override onlyOwner returns (bool) {
        // check ownership
        OwnableRoles points = OwnableRoles(venue);
        if (points.owner() != address(this) && points.hasAnyRole(address(this), 1 << 1) != true) {
            revert BoostError.Unauthorized();
        }

        if (!_isClaimable(claimTarget)) revert NotClaimable();

        claims++;
        claimed[claimTarget] = true;

        (bool success,) = venue.call(abi.encodeWithSelector(selector, claimTarget, reward));
        if (!success) revert ClaimFailed();

        emit Claimed(claimTarget, abi.encodePacked(venue, claimTarget, reward));
        return true;
    }

    /// @inheritdoc Incentive
    /// @dev Not a valid operation for this type of incentive
    function clawback(bytes calldata) external pure override returns (bool) {
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc Incentive
    /// @notice No token approvals are required for this incentive
    function preflight(bytes calldata) external pure override returns (bytes memory budgetData) {
        return new bytes(0);
    }

    /// @notice Check if an incentive is claimable
    /// @param claimTarget The address receiving the claim
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(address claimTarget, bytes calldata) public view override returns (bool) {
        return _isClaimable(claimTarget);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < limit;
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Cloneable) returns (bytes4) {
        return type(APointsIncentive).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Incentive) returns (bool) {
        return interfaceId == type(APointsIncentive).interfaceId || super.supportsInterface(interfaceId);
    }
}
