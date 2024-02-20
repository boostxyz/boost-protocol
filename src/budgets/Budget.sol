// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {Ownable} from "lib/solady/src/auth/Ownable.sol";
import {Receiver} from "lib/solady/src/accounts/Receiver.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

/// @title Boost Budget
/// @notice Abstract contract for a generic Budget within the Boost protocol
/// @dev Budget classes are expected to implement the allocation, reclamation, and disbursement of assets.
/// @dev Note that calldata is expected to be packed using [Solady's LibZip calldata compression](https://github.com/Vectorized/solady/blob/main/src/utils/LibZip.sol).
abstract contract Budget is Ownable, Receiver {
    using LibZip for bytes;
    using SafeTransferLib for address;

    error InvalidAllocation(address asset, uint256 amount);
    error InsufficientFunds(address asset, uint256 available, uint256 required);

    // TODO: Implement the following error:
    // error InvalidDataPayload(bytes data, string expectedEncoding);

    /// @notice Initialize the budget and set the owner
    /// @dev The owner is set to the contract deployer
    constructor() {
        _initializeOwner(msg.sender);
    }


    /// @notice Allocate assets to the budget
    /// @param data_ The compressed data for the allocation (amount, token address, token ID, etc.)
    /// @return True if the allocation was successful
    function allocate(bytes calldata data_) external virtual returns (bool);

    /// @notice Reclaim assets from the budget
    /// @param data_ The compressed data for the reclamation (amount, token address, token ID, etc.)
    /// @return True if the reclamation was successful
    function reclaim(bytes calldata data_) external virtual returns (bool);

    /// @notice Disburse assets from the budget to a single recipient
    /// @param recipient_ The address of the recipient
    /// @param data_ The compressed data for the disbursement (amount, token address, token ID, etc.)
    /// @return True if the disbursement was successful
    function disburse(
        address recipient_,
        bytes calldata data_
    ) external virtual returns (bool);

    /// @notice Disburse assets from the budget to multiple recipients
    /// @param recipients_ The addresses of the recipients
    /// @param data_ The compressed data for the disbursements (amount, token address, token ID, etc.)
    /// @return A failMap of disbursements statuses (1 = success, 0 = fail), represented as a base-10 integer
    /// @dev For example, if the transfer statuses are [true, false, true], the failMap value would equal 5 (which is 101 in binary)
    function disburseBatch(
        address[] calldata recipients_,
        bytes[] calldata data_
    ) external virtual returns (uint256);

    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    function total(address asset_) external view virtual returns (uint256);

    /// @notice Get the amount of assets available for distribution from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets available
    function available(address asset_) external view virtual returns (uint256);

    /// @notice Get the amount of assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets distributed
    function distributed(
        address asset_
    ) external view virtual returns (uint256);

    /// @notice Reconcile the budget to ensure the known state matches the actual state
    /// @param data_ The compressed data for the reconciliation (amount, token address, token ID, etc.)
    /// @return The amount of assets reconciled
    function reconcile(bytes calldata data_) external virtual returns (uint256);

    /// @inheritdoc Receiver
    receive() external payable virtual override {}

    /// @inheritdoc Receiver
    fallback() external payable virtual override {
        LibZip.cdFallback();
    }
}
