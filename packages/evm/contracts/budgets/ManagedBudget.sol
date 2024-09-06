// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {AManagedBudget} from "contracts/budgets/AManagedBudget.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";

/// @title Managed ABudget
/// @notice A minimal budget implementation with RBAC that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
contract ManagedBudget is AManagedBudget, ReentrancyGuard {
    using SafeTransferLib for address;

    /// @notice The payload for initializing a ManagedBudget
    struct InitPayload {
        address owner;
        address[] authorized;
        uint256[] roles;
    }

    /// @dev The total amount of each fungible asset distributed from the budget
    mapping(address => uint256) private _distributedFungible;

    /// @dev The total amount of each ERC1155 asset and token ID distributed from the budget
    mapping(address => mapping(uint256 => uint256)) private _distributedERC1155;

    /// @notice Construct a new ManagedBudget
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc ACloneable
    /// @param data_ The packed init data for the budget `(address owner, address[] authorized, uint256[] roles)`
    function initialize(bytes calldata data_) public virtual override initializer {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        _initializeOwner(init_.owner);
        for (uint256 i = 0; i < init_.authorized.length; i++) {
            _setRoles(init_.authorized[i], init_.roles[i]);
        }
    }

    /// @inheritdoc ABudget
    /// @notice Allocates assets to the budget
    /// @param data_ The packed data for the {Transfer} request
    /// @return True if the allocation was successful
    /// @dev The caller must have already approved the contract to transfer the asset
    /// @dev If the asset transfer fails, the allocation will revert
    function allocate(bytes calldata data_) external payable virtual override returns (bool) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            // Ensure the value received is equal to the `payload.amount`
            if (msg.value != payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else if (request.assetType == AssetType.ERC20) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            // Transfer `payload.amount` of the token to this contract
            request.asset.safeTransferFrom(request.target, address(this), payload.amount);
            if (request.asset.balanceOf(address(this)) < payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(request.data, (ERC1155Payload));

            // Transfer `payload.amount` of `payload.tokenId` to this contract
            IERC1155(request.asset).safeTransferFrom(
                request.target, address(this), payload.tokenId, payload.amount, payload.data
            );
            if (IERC1155(request.asset).balanceOf(address(this), payload.tokenId) < payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        } else {
            // Unsupported asset type
            return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    /// @notice Reclaims assets from the budget if sender is owner or admin
    /// @param data_ The packed {Transfer} request
    /// @return True if the request was successful
    /// @dev Only admins can directly reclaim assets from the budget
    /// @dev If the amount is zero, the entire balance of the asset will be transferred to the receiver
    /// @dev If the asset transfer fails, the reclamation will revert
    function clawback(bytes calldata data_) external virtual override onlyOwnerOrRoles(ADMIN_ROLE) returns (bool) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ETH || request.assetType == AssetType.ERC20) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));
            _transferFungible(
                request.asset, request.target, payload.amount == 0 ? available(request.asset) : payload.amount
            );
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(request.data, (ERC1155Payload));
            _transferERC1155(
                request.asset,
                request.target,
                payload.tokenId,
                payload.amount == 0 ? IERC1155(request.asset).balanceOf(address(this), payload.tokenId) : payload.amount,
                payload.data
            );
        } else {
            return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    /// @notice Disburses assets from the budget to a single recipient if sender is owner, admin, or manager
    /// @param data_ The packed {Transfer} request
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(bytes calldata data_)
        public
        virtual
        override
        onlyOwnerOrRoles(ADMIN_ROLE | MANAGER_ROLE)
        returns (bool)
    {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ERC20 || request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));

            uint256 avail = available(request.asset);
            if (payload.amount > avail) {
                revert InsufficientFunds(request.asset, avail, payload.amount);
            }

            _transferFungible(request.asset, request.target, payload.amount);
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(request.data, (ERC1155Payload));

            uint256 avail = IERC1155(request.asset).balanceOf(address(this), payload.tokenId);
            if (payload.amount > avail) {
                revert InsufficientFunds(request.asset, avail, payload.amount);
            }

            _transferERC1155(request.asset, request.target, payload.tokenId, payload.amount, payload.data);
        } else {
            return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    /// @notice Disburses assets from the budget to multiple recipients
    /// @param data_ The packed array of {Transfer} requests
    /// @return True if all disbursements were successful
    function disburseBatch(bytes[] calldata data_) external virtual override returns (bool) {
        for (uint256 i = 0; i < data_.length; i++) {
            if (!disburse(data_[i])) return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    /// @dev Checks if account has any level of authorization
    function isAuthorized(address account_) public view virtual override returns (bool) {
        return owner() == account_ || hasAnyRole(account_, MANAGER_ROLE | ADMIN_ROLE);
    }

    /// @inheritdoc ABudget
    /// @dev If authorization is true, grant manager role, otherwise revoke manager role.
    function setAuthorized(address[] calldata accounts_, bool[] calldata authorized_)
        external
        virtual
        override
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (accounts_.length != authorized_.length) {
            revert BoostError.LengthMismatch();
        }
        for (uint256 i = 0; i < accounts_.length; i++) {
            bool authorization = authorized_[i];
            if (authorization == true) {
                _grantRoles(accounts_[i], MANAGER_ROLE);
            } else {
                _removeRoles(accounts_[i], MANAGER_ROLE);
            }
        }
    }

    /// @notice Set roles for accounts authoried to use the budget
    /// @param accounts_ The accounts to assign the corresponding role by index
    /// @param roles_ The roles to assign
    function grantRoles(address[] calldata accounts_, uint256[] calldata roles_)
        external
        virtual
        override
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (accounts_.length != roles_.length) {
            revert BoostError.LengthMismatch();
        }
        for (uint256 i = 0; i < accounts_.length; i++) {
            _grantRoles(accounts_[i], roles_[i]);
        }
    }

    /// @notice Revoke roles for accounts authoried to use the budget
    /// @param accounts_ The accounts to assign the corresponding role by index
    /// @param roles_ The roles to remove
    function revokeRoles(address[] calldata accounts_, uint256[] calldata roles_)
        external
        virtual
        override
        onlyOwnerOrRoles(ADMIN_ROLE)
    {
        if (accounts_.length != roles_.length) {
            revert BoostError.LengthMismatch();
        }
        for (uint256 i = 0; i < accounts_.length; i++) {
            _removeRoles(accounts_[i], roles_[i]);
        }
    }

    /// @inheritdoc ABudget
    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    /// @dev This is simply the sum of the current balance and the distributed amount
    function total(address asset_) external view virtual override returns (uint256) {
        return available(asset_) + _distributedFungible[asset_];
    }

    /// @notice Get the total amount of ERC1155 assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The total amount of assets
    function total(address asset_, uint256 tokenId_) external view virtual override returns (uint256) {
        return IERC1155(asset_).balanceOf(address(this), tokenId_) + _distributedERC1155[asset_][tokenId_];
    }

    /// @inheritdoc ABudget
    /// @notice Get the amount of assets available for distribution from the budget
    /// @param asset_ The address of the asset (or the zero address for native assets)
    /// @return The amount of assets available
    /// @dev This is simply the current balance held by the budget
    /// @dev If the zero address is passed, this function will return the native balance
    function available(address asset_) public view virtual override returns (uint256) {
        return asset_ == address(0) ? address(this).balance : asset_.balanceOf(address(this));
    }

    /// @notice Get the amount of ERC1155 assets available for distribution from the budget
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The amount of assets available
    function available(address asset_, uint256 tokenId_) public view virtual override returns (uint256) {
        return IERC1155(asset_).balanceOf(address(this), tokenId_);
    }

    /// @inheritdoc ABudget
    /// @notice Get the amount of assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets distributed
    function distributed(address asset_) external view virtual override returns (uint256) {
        return _distributedFungible[asset_];
    }

    /// @notice Get the amount of ERC1155 assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The amount of assets distributed
    function distributed(address asset_, uint256 tokenId_) external view virtual override returns (uint256) {
        return _distributedERC1155[asset_][tokenId_];
    }

    /// @inheritdoc ABudget
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
    function _transferFungible(address asset_, address to_, uint256 amount_) internal virtual nonReentrant {
        // Increment the total amount of the asset distributed from the budget
        if (to_ == address(0)) revert TransferFailed(asset_, to_, amount_);
        if (amount_ > available(asset_)) {
            revert InsufficientFunds(asset_, available(asset_), amount_);
        }

        _distributedFungible[asset_] += amount_;

        // Transfer the asset to the recipient
        if (asset_ == address(0)) {
            SafeTransferLib.safeTransferETH(to_, amount_);
        } else {
            asset_.safeTransfer(to_, amount_);
        }

        emit Distributed(asset_, to_, amount_);
    }

    function _transferERC1155(address asset_, address to_, uint256 tokenId_, uint256 amount_, bytes memory data_)
        internal
        virtual
        nonReentrant
    {
        // Increment the total amount of the asset distributed from the budget
        if (to_ == address(0)) revert TransferFailed(asset_, to_, amount_);
        if (amount_ > available(asset_, tokenId_)) {
            revert InsufficientFunds(asset_, available(asset_, tokenId_), amount_);
        }

        _distributedERC1155[asset_][tokenId_] += amount_;

        // Transfer the asset to the recipient
        // wake-disable-next-line reentrancy (`nonReentrant` modifier is applied to the function)
        IERC1155(asset_).safeTransferFrom(address(this), to_, tokenId_, amount_, data_);

        emit Distributed(asset_, to_, amount_);
    }

    /// @inheritdoc IERC1155Receiver
    /// @dev This contract does not care about the specifics of the inbound token, so we simply return the magic value (i.e. the selector for `onERC1155Received`)
    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        // We don't need to do anything here
        return IERC1155Receiver.onERC1155Received.selector;
    }

    /// @inheritdoc IERC1155Receiver
    /// @dev This contract does not care about the specifics of the inbound token, so we simply return the magic value (i.e. the selector for `onERC1155Received`)
    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        // We don't need to do anything here
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }
}
