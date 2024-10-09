// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Receiver} from "@solady/accounts/Receiver.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {RBAC} from "contracts/shared/RBAC.sol";

/// @title Boost ABudget
/// @notice Abstract contract for a generic ABudget within the Boost protocol
/// @dev ABudget classes are expected to implement the allocation, reclamation, and disbursement of assets.
/// @dev WARNING: Budgets currently support only ETH, ERC20, and ERC1155 assets. Other asset types may be added in the future.
abstract contract ABudget is ACloneable, Receiver, RBAC {
    enum AssetType {
        ETH,
        ERC20,
        ERC1155
    }

    /// @notice A struct representing the inputs for an allocation
    /// @param assetType The type of asset to allocate
    /// @param asset The address of the asset to allocate
    /// @param target The address of the payee or payer (from or to, depending on the operation)
    /// @param data The implementation-specific data for the allocation (amount, token ID, etc.)
    struct Transfer {
        AssetType assetType;
        address asset;
        address target;
        bytes data;
    }

    /// @notice The payload for an ETH or ERC20 transfer
    /// @param amount The amount of the asset to transfer
    struct FungiblePayload {
        uint256 amount;
    }

    /// @notice The payload for an ERC1155 transfer
    /// @param tokenId The ID of the token to transfer
    /// @param amount The amount of the token to transfer
    /// @param data Any additional data to forward to the ERC1155 contract
    struct ERC1155Payload {
        uint256 tokenId;
        uint256 amount;
        bytes data;
    }

    /// @notice Emitted when assets are distributed from the budget
    event Distributed(address indexed asset, address to, uint256 amount);

    /// @notice Thrown when the allocation is invalid
    error InvalidAllocation(address asset, uint256 amount);

    /// @notice Thrown when there are insufficient funds for an operation
    error InsufficientFunds(address asset, uint256 available, uint256 required);

    /// @notice Thrown when a transfer fails for an unknown reason
    error TransferFailed(address asset, address to, uint256 amount);

    /// @notice Allocate assets to the budget
    /// @param data_ The compressed data for the allocation (amount, token address, token ID, etc.)
    /// @return True if the allocation was successful
    function allocate(bytes calldata data_) external payable virtual returns (bool);

    /// @notice Reclaim assets from the budget
    /// @param data_ The compressed data for the reclamation (amount, token address, token ID, etc.)
    /// @return True if the reclamation was successful
    function clawback(bytes calldata data_) external virtual returns (bool);

    /// @notice Pull assets from an Incentive back into a budget
    /// @param data_ The packed {AIncentive.ClawbackPayload.data} request
    /// @return True if the reclamation was successful
    /// @dev admins and managers can directly reclaim assets from an incentive
    /// @dev the budget can only clawback funds from incentives it originally funded
    /// @dev If the asset transfer fails, the reclamation will revert
    function clawbackFromIncentive(AIncentive incentive, bytes calldata data_)
        external
        virtual
        onlyAuthorized
        returns (bool)
    {
        AIncentive.ClawbackPayload memory payload = AIncentive.ClawbackPayload({target: address(this), data: data_});
        return incentive.clawback(abi.encode(payload));
    }

    /// @notice Disburse assets from the budget to a single recipient
    /// @param data_ The compressed {Transfer} request
    /// @return True if the disbursement was successful
    function disburse(bytes calldata data_) external virtual returns (bool);

    /// @notice Disburse assets from the budget to multiple recipients
    /// @param data_ The array of compressed {Transfer} requests
    /// @return True if all disbursements were successful
    function disburseBatch(bytes[] calldata data_) external virtual returns (bool);

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

    /// @inheritdoc ACloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(ACloneable) returns (bool) {
        return interfaceId == type(ABudget).interfaceId || super.supportsInterface(interfaceId);
    }

    /// @inheritdoc Receiver
    receive() external payable virtual override {
        return;
    }

    /// @inheritdoc Receiver
    fallback() external payable virtual override {
        revert BoostError.NotImplemented();
    }
}
