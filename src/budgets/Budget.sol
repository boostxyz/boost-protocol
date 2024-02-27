// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {Ownable} from "lib/solady/src/auth/Ownable.sol";
import {Receiver} from "lib/solady/src/accounts/Receiver.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {Cloneable} from "src/Cloneable.sol";

/// @title Boost Budget
/// @notice Abstract contract for a generic Budget within the Boost protocol
/// @dev Budget classes are expected to implement the allocation, reclamation, and disbursement of assets.
/// @dev The calldata is expected to be ABI-encoded and compressed using [Solady's LibZip calldata compression](https://github.com/Vectorized/solady/blob/main/src/utils/LibZip.sol).
/// @dev Note that Budgets *DO NOT* support ERC-721, ERC-1155, DN-404, or other non-fungible assets at this time.
abstract contract Budget is Ownable, Cloneable, Receiver {
    using LibZip for bytes;
    using SafeTransferLib for address;

    /// @notice Emitted when assets are distributed from the budget
    event Distributed(address indexed asset, address to, uint256 amount);

    /// @notice Thrown when the allocation is invalid
    error InvalidAllocation(address asset, uint256 amount);

    /// @notice Thrown when there are insufficient funds for an operation
    error InsufficientFunds(address asset, uint256 available, uint256 required);

    /// @notice Thrown when the length of two arrays are not equal
    error LengthMismatch();

    /// @notice Thrown when a transfer fails for an unknown reason
    error TransferFailed(address asset, address to, uint256 amount);

    /// @notice Initialize the budget and set the owner
    /// @dev The owner is set to the contract deployer
    constructor() {
        _initializeOwner(msg.sender);
    }

    /// @notice Allocate assets to the budget
    /// @param data_ The compressed data for the allocation (amount, token address, token ID, etc.)
    /// @return True if the allocation was successful
    function allocate(bytes calldata data_) external payable virtual returns (bool);

    /// @notice Reclaim assets from the budget
    /// @param data_ The compressed data for the reclamation (amount, token address, token ID, etc.)
    /// @return True if the reclamation was successful
    function reclaim(bytes calldata data_) external virtual returns (bool);

    /// @notice Disburse assets from the budget to a single recipient
    /// @param recipient_ The address of the recipient
    /// @param data_ The compressed data for the disbursement (amount, token address, token ID, etc.)
    /// @return True if the disbursement was successful
    function disburse(address recipient_, bytes calldata data_) external virtual returns (bool);

    /// @notice Disburse assets from the budget to multiple recipients
    /// @param recipients_ The addresses of the recipients
    /// @param data_ The compressed data for the disbursements (amount, token address, token ID, etc.)
    /// @return True if all disbursements were successful
    function disburseBatch(address[] calldata recipients_, bytes[] calldata data_) external virtual returns (bool);

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
    function distributed(address asset_) external view virtual returns (uint256);

    /// @notice Reconcile the budget to ensure the known state matches the actual state
    /// @param data_ The compressed data for the reconciliation (amount, token address, token ID, etc.)
    /// @return The amount of assets reconciled
    function reconcile(bytes calldata data_) external virtual returns (uint256);

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool) {
        return interfaceId == type(Budget).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @inheritdoc Receiver
    receive() external payable virtual override {
        // Nothing to do here, but we need the function to be implemented
    }

    /// @inheritdoc Receiver
    fallback() external payable virtual override {
        LibZip.cdFallback();
    }
}
