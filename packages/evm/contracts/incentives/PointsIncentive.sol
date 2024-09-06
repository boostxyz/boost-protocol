// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {APointsIncentive} from "contracts/incentives/APointsIncentive.sol";
import {OwnableRoles} from "@solady/auth/OwnableRoles.sol";

/// @title Points AIncentive
/// @notice A simple on-chain points incentive implementation that allows claiming of soulbound tokens
/// @dev In order for any claim to be successful:
///     - The claimer must not have already claimed the incentive; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to operate the points contract's issuance function
contract PointsIncentive is OwnableRoles, APointsIncentive {
    /// @notice The payload for initializing a PointsIncentive
    struct InitPayload {
        address venue;
        bytes4 selector;
        uint256 reward;
        uint256 limit;
    }

    /// @notice Construct a new PointsIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address points, uint256 reward, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        if (init_.reward == 0 || init_.limit == 0) revert BoostError.InvalidInitialization();

        venue = init_.venue;
        selector = init_.selector;
        reward = init_.reward;
        limit = init_.limit;
        _initializeOwner(msg.sender);
    }

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

    /// @inheritdoc AIncentive
    /// @dev Not a valid operation for this type of incentive
    function clawback(bytes calldata) external pure override returns (bool) {
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc AIncentive
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
}
