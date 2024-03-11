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

    /// @notice The payload for initializing a SimpleBudget
    struct InitPayload {
        address owner;
        address[] authorized;
    }

    /// @dev The total amount of each fungible asset distributed from the budget
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
        InitPayload memory init_ = abi.decode(data_.cdDecompress(), (InitPayload));
        _initializeOwner(init_.owner);
        for (uint256 i = 0; i < init_.authorized.length; i++) {
            _isAuthorized[init_.authorized[i]] = true;
        }
    }

    /// @inheritdoc Budget
    /// @notice Allocates assets to the budget
    /// @param data_ The compressed data for the {Transfer} request
    /// @return True if the allocation was successful
    /// @dev The caller must have already approved the contract to transfer the asset
    /// @dev If the asset transfer fails, the allocation will revert
    function allocate(bytes calldata data_) external payable virtual override returns (bool) {
        Transfer memory request = abi.decode(data_.cdDecompress(), (Transfer));
        if (request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            // Ensure the value received is equal to the `payload.amount`
            if (msg.value != payload.amount) revert InvalidAllocation(request.asset, payload.amount);
        } else if (request.assetType == AssetType.ERC20) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            // Transfer `payload.amount` of the token to this contract
            request.asset.safeTransferFrom(request.target, address(this), payload.amount);
            if (request.asset.balanceOf(address(this)) < payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else {
            // Unsupported asset type
            return false;
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
        Transfer memory request = abi.decode(data_.cdDecompress(), (Transfer));
        if (request.assetType == AssetType.ETH || request.assetType == AssetType.ERC20) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));
            uint256 amount = payload.amount == 0 ? available(request.asset) : payload.amount;
            _transfer(request.asset, request.target, amount);
        } else {
            return false;
        }

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to a single recipient
    /// @param data_ The compressed {Transfer} request
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(bytes calldata data_) public virtual override onlyAuthorized returns (bool) {
        Transfer memory request = abi.decode(data_.cdDecompress(), (Transfer));
        if (request.assetType == AssetType.ERC20 || request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));
            uint256 avail = available(request.asset);
            if (payload.amount > avail) revert InsufficientFunds(request.asset, avail, payload.amount);
            _transfer(request.asset, request.target, payload.amount);
        } else {
            return false;
        }

        return true;
    }

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to multiple recipients
    /// @param data_ The compressed array of {Transfer} requests
    /// @return True if all disbursements were successful
    function disburseBatch(bytes[] calldata data_) external virtual override returns (bool) {
        for (uint256 i = 0; i < data_.length; i++) {
            if (!disburse(data_[i])) return false;
        }

        return true;
    }

    /// @inheritdoc Budget
    function setAuthorized(address[] calldata account_, bool[] calldata authorized_)
        external
        virtual
        override
        onlyOwner
    {
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
    /// @dev This function is used to transfer assets from the budget to a given recipient (typically an incentive contract)
    /// @dev If the destination address is the zero address, or the transfer fails for any reason, this function will revert
    function _transfer(address asset_, address to_, uint256 amount_) internal virtual {
        // Increment the total amount of the asset distributed from the budget
        if (to_ == address(0)) revert TransferFailed(asset_, to_, amount_);
        if (amount_ > available(asset_)) revert InsufficientFunds(asset_, available(asset_), amount_);

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
