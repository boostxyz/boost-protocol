// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {BoostError} from "contracts/shared/BoostError.sol";
import {Budget} from "contracts/budgets/Budget.sol";
import {Incentive} from "./Incentive.sol";

/// @title Points Incentive
/// @notice A simple on-chain points incentive implementation that allows claiming of soulbound tokens
/// @dev In order for any claim to be successful:
///     - The claimer must not have already claimed the incentive; and
///     - The maximum number of claims must not have been reached; and
///     - This contract must be authorized to operate the points contract's issuance function
contract PointsIncentive is Incentive {
    /// @notice The payload for initializing a PointsIncentive
    struct InitPayload {
        address venue;
        bytes4 selector;
        uint256 quantity;
        uint256 limit;
    }

    /// @notice The address of the points contract
    address public venue;

    /// @notice The quantity amount issued for each claim
    uint256 public quantity;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @notice The selector for the issuance function on the points contract
    bytes4 public selector;

    /// @notice Construct a new PointsIncentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed incentive parameters `(address points, uint256 quantity, uint256 limit)`
    function initialize(bytes calldata data_) public override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        if (init_.quantity == 0 || init_.limit == 0) revert BoostError.InvalidInitialization();

        venue = init_.venue;
        selector = init_.selector;
        quantity = init_.quantity;
        limit = init_.limit;
        _initializeOwner(msg.sender);
    }

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        if (!_isClaimable(claim_.target)) revert NotClaimable();

        claims++;
        claimed[claim_.target] = true;

        (bool success,) = venue.call(abi.encodeWithSelector(selector, claim_.target, quantity));
        if (!success) revert ClaimFailed();

        emit Claimed(claim_.target, abi.encodePacked(venue, claim_.target, quantity));
        return true;
    }

    /// @inheritdoc Incentive
    /// @dev Not a valid operation for this type of incentive
    function reclaim(bytes calldata) external pure override returns (bool) {
        revert BoostError.NotImplemented();
    }

    /// @inheritdoc Incentive
    /// @notice No token approvals are required for this incentive
    function preflight(bytes calldata) external pure override returns (bytes memory budgetData) {
        return new bytes(0);
    }

    /// @notice Check if an incentive is claimable
    /// @param data_ The data payload for the claim check `(address recipient, bytes data)`
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(bytes calldata data_) public view override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        return _isClaimable(claim_.target);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < limit;
    }
}
