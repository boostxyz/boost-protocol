// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {Budget} from "./Budget.sol";

/// @title Simple Budget
/// @notice A minimal budget implementation that simply holds and distributes assets.
contract SimpleBudget is Budget {
    using LibZip for bytes;
    using SafeTransferLib for address;

    /// @dev The total amount of each asset distributed from the budget
    mapping(address => uint256) private _distributed;

    /// @inheritdoc Budget
    /// @notice Allocates assets to the budget
    /// @param data_ The compressed data for the allocation `(address asset, uint256 amount)`
    /// @return True if the allocation was successful
    /// @dev The caller must have already approved the contract to transfer the asset
    /// @dev If the asset transfer fails, the allocation will revert
    function allocate(
        bytes calldata data_
    ) external virtual override returns (bool) {
        bytes memory unpackedCalldata = data_.cdDecompress();
        (address asset, uint256 amount) = abi.decode(
            unpackedCalldata,
            (address, uint256)
        );

        // Ensure the `asset` address has some code (indicating it is a contract) and the amount is non-zero
        // This is a simple (if not foolproof) way to ensure the compressed calldata wasn't encoded incorrectly
        if (asset.code.length == 0 || amount == 0) {
            revert InvalidAllocation(asset, amount);
        }

        // Transfer the asset to the budget
        asset.safeTransferFrom(msg.sender, address(this), amount);

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Reclaims assets from the budget
    /// @param data_ The compressed data for the reclamation `(address asset, uint256 amount, address receiver)`
    /// @return True if the reclamation was successful
    /// @dev If the amount is zero, the entire balance of the asset will be transferred to the receiver
    /// @dev If the asset transfer fails, the reclamation will revert
    function reclaim(
        bytes calldata data_
    ) external virtual override onlyOwner returns (bool) {
        bytes memory unpackedCalldata = data_.cdDecompress();
        (address asset, uint256 amount, address receiver) = abi.decode(
            unpackedCalldata,
            (address, uint256, address)
        );

        // Ensure the amount is available to reclaim
        if (amount > asset.balanceOf(address(this))) {
            revert InsufficientFunds(
                asset,
                asset.balanceOf(address(this)) - _distributed[asset],
                amount
            );
        }

        // If the amount is zero, transfer the entire balance of the asset to the receiver
        if (amount == 0) {
            asset.safeTransferAll(receiver);
        } else {
            asset.safeTransfer(receiver, amount);
        }

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to a single recipient
    /// @param recipient_ The address of the recipient
    /// @param data_ The compressed data for the disbursement `(address asset, uint256 amount)`
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(
        address recipient_,
        bytes calldata data_
    ) public virtual override onlyOwner returns (bool) {
        bytes memory unpackedCalldata = data_.cdDecompress();
        (address asset, uint256 amount) = abi.decode(
            unpackedCalldata,
            (address, uint256)
        );

        // Ensure the amount is available for disbursement
        if (amount > available(asset)) {
            revert InsufficientFunds(asset, available(asset), amount);
        }

        // Increment the total amount of the asset distributed from the budget
        _distributed[asset] += amount;

        // Transfer the asset to the recipient
        asset.safeTransfer(recipient_, amount);

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to multiple recipients
    /// @param recipients_ The addresses of the recipients
    /// @param data_ The compressed data for the disbursements `(address assets, uint256 amounts)[]`
    /// @return failMap A failMap of disbursements statuses (1 = success, 0 = fail), represented as a base-10 integer
    function disburseBatch(
        address[] calldata recipients_,
        bytes[] calldata data_
    ) external virtual override returns (uint256 failMap) {
        for (uint256 i = 0; i < recipients_.length; i++) {
            if (!disburse(recipients_[i], data_[i])) {
                failMap |= (1 << i);
            }
        }

        return failMap;
    }

    /// @inheritdoc Budget
    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    /// @dev This is simply the sum of the current balance and the distributed amount
    function total(
        address asset_
    ) external view virtual override returns (uint256) {
        return asset_.balanceOf(address(this)) + _distributed[asset_];
    }

    /// @inheritdoc Budget
    /// @notice Get the amount of assets available for distribution from the budget
    /// @param asset_ The address of the asset (or the zero address for native assets)
    /// @return The amount of assets available
    /// @dev This is simply the current balance held by the budget
    /// @dev If the zero address is passed, this function will return the native balance
    function available(
        address asset_
    ) public view virtual override returns (uint256) {
        if (asset_ == address(0)) {
            return address(this).balance;
        } else {
            return asset_.balanceOf(address(this));
        }
    }

    /// @inheritdoc Budget
    /// @notice Get the amount of assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets distributed
    function distributed(
        address asset_
    ) external view virtual override returns (uint256) {
        return _distributed[asset_];
    }

    /// @inheritdoc Budget
    /// @dev This is a no-op as there is no local balance to reconcile
    function reconcile(
        bytes calldata
    ) external virtual override returns (uint256) {
        return 0;
    }
}
