// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {SafeTransferLib} from "lib/solady/src/utils/SafeTransferLib.sol";

import {Budget} from "src/budgets/Budget.sol";
import {Cloneable} from "src/shared/Cloneable.sol";

/// @title Simple Budget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget does NOT support NFTs (ERC-721, ERC-1155, etc.)
contract SimpleBudget is Budget {
    using LibZip for bytes;
    using SafeTransferLib for address;

    /// @dev The total amount of each asset distributed from the budget
    mapping(address => uint256) private _distributed;

    /// @dev The mapping of authorized addresses
    mapping(address => bool) private _isAuthorized;


    /// @notice A modifier that allows only authorized addresses to call the function
    modifier onlyAuthorized() {
        if (!isAuthorized(msg.sender)) revert Unauthorized();
        _;
    }

    /// @notice Construct a new SimpleBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @param data_ The compressed init data for the budget `(address owner, address[] authorized)`
    function initialize(bytes calldata data_) external virtual override initializer {
        (address owner_, address[] memory authorized_) = abi.decode(data_.cdDecompress(), (address, address[]));
        _initializeOwner(owner_);
        for (uint256 i = 0; i < authorized_.length; i++) {
            _isAuthorized[authorized_[i]] = true;
        }
    }

    /// @inheritdoc Budget
    /// @notice Allocates assets to the budget
    /// @param data_ The compressed data for the allocation `(address asset, uint256 amount)`
    /// @return True if the allocation was successful
    /// @dev The caller must have already approved the contract to transfer the asset
    /// @dev If the asset transfer fails, the allocation will revert
    function allocate(bytes calldata data_) external payable virtual override returns (bool) {
        (address asset, uint256 amount) = abi.decode(data_.cdDecompress(), (address, uint256));

        if (asset == address(0)) {
            // Ensure the value received is equal to the `amount`
            if (msg.value != amount) revert InvalidAllocation(asset, amount);
        } else {
            // Transfer the asset to the budget
            asset.safeTransferFrom(msg.sender, address(this), amount);
            if (asset.balanceOf(address(this)) < amount) revert InvalidAllocation(asset, amount);
        }

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Reclaims assets from the budget
    /// @param data_ The compressed data for the reclamation `(address asset, uint256 amount, address receiver)`
    /// @return True if the reclamation was successful
    /// @dev Only the owner can directly reclaim assets from the budget
    /// @dev If the amount is zero, the entire balance of the asset will be transferred to the receiver
    /// @dev If the asset transfer fails, the reclamation will revert
    function reclaim(bytes calldata data_) external virtual override onlyOwner returns (bool) {
        (address asset, uint256 amount, address receiver) =
            abi.decode(data_.cdDecompress(), (address, uint256, address));

        // Ensure the amount is available to reclaim
        uint256 avail = available(asset);
        if (amount > avail) revert InsufficientFunds(asset, avail, amount);
        if (receiver == address(0)) revert SafeTransferLib.TransferFailed();

        // If the amount is zero, use the entire balance
        if (amount == 0) amount = avail;
        _transfer(asset, receiver, amount);

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to a single recipient
    /// @param recipient_ The address of the recipient
    /// @param data_ The compressed data for the disbursement `(address asset, uint256 amount)`
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(address recipient_, bytes calldata data_)
        public
        virtual
        override
        onlyAuthorized
        returns (bool)
    {
        (address asset, uint256 amount) = abi.decode(data_.cdDecompress(), (address, uint256));

        // Ensure the amount is available for disbursement
        if (amount > available(asset)) {
            revert InsufficientFunds(asset, available(asset), amount);
        }

        // Transfer the asset to the recipient
        _transfer(asset, recipient_, amount);

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to multiple recipients
    /// @param recipients_ The addresses of the recipients
    /// @param data_ The compressed data for the disbursements `(address assets, uint256 amounts)[]`
    /// @return True if all disbursements were successful
    function disburseBatch(address[] calldata recipients_, bytes[] calldata data_)
        external
        virtual
        override
        returns (bool)
    {
        if (recipients_.length != data_.length) revert LengthMismatch();

        for (uint256 i = 0; i < recipients_.length; i++) {
            if (!disburse(recipients_[i], data_[i])) return false;
        }

        return true;
    }

    /// @inheritdoc Budget
    function setAuthorized(address[] calldata account_, bool[] calldata authorized_) external virtual override onlyOwner {
        if (account_.length != authorized_.length) revert LengthMismatch();
        for (uint256 i = 0; i < account_.length; i++) {
            _isAuthorized[account_[i]] = authorized_[i];
        }
    }

    /// @inheritdoc Budget
    function isAuthorized(address account_) public view virtual override returns (bool) {
        return _isAuthorized[account_] || account_ == owner();
    }

    /// @inheritdoc Budget
    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    /// @dev This is simply the sum of the current balance and the distributed amount
    function total(address asset_) external view virtual override returns (uint256) {
        return available(asset_) + _distributed[asset_];
    }

    /// @inheritdoc Budget
    /// @notice Get the amount of assets available for distribution from the budget
    /// @param asset_ The address of the asset (or the zero address for native assets)
    /// @return The amount of assets available
    /// @dev This is simply the current balance held by the budget
    /// @dev If the zero address is passed, this function will return the native balance
    function available(address asset_) public view virtual override returns (uint256) {
        return asset_ == address(0) ? address(this).balance : asset_.balanceOf(address(this));
    }

    /// @inheritdoc Budget
    /// @notice Get the amount of assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets distributed
    function distributed(address asset_) external view virtual override returns (uint256) {
        return _distributed[asset_];
    }

    /// @inheritdoc Budget
    /// @dev This is a no-op as there is no local balance to reconcile
    function reconcile(bytes calldata) external virtual override returns (uint256) {
        return 0;
    }

    /// @notice Transfer assets to the recipient
    /// @param asset_ The address of the asset
    /// @param to_ The address of the recipient
    /// @param amount_ The amount of the asset to transfer
    /// @dev This function is used to transfer assets from the budget to the recipient
    function _transfer(address asset_, address to_, uint256 amount_) internal virtual {
        // Increment the total amount of the asset distributed from the budget
        _distributed[asset_] += amount_;

        // Transfer the asset to the recipient
        if (asset_ == address(0)) {
            SafeTransferLib.safeTransferETH(to_, amount_);
        } else {
            asset_.safeTransfer(to_, amount_);
        }

        emit Distributed(asset_, to_, amount_);
    }
}
