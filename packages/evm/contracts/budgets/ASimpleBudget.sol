// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {BoostError} from "contracts/shared/BoostError.sol";
import {Budget} from "contracts/budgets/Budget.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";

/// @title Abstract Simple Budget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
abstract contract ASimpleBudget is Budget, IERC1155Receiver, ReentrancyGuard {
    using SafeTransferLib for address;

    /// @dev The total amount of each fungible asset distributed from the budget
    mapping(address => uint256) private _distributedFungible;

    /// @dev The total amount of each ERC1155 asset and token ID distributed from the budget
    mapping(address => mapping(uint256 => uint256)) private _distributedERC1155;

    /// @dev The mapping of authorized addresses
    mapping(address => bool) internal _isAuthorized;

    /// @notice A modifier that allows only authorized addresses to call the function
    modifier onlyAuthorized() {
        if (!isAuthorized(msg.sender)) revert Unauthorized();
        _;
    }

    /// @inheritdoc Budget
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

    /// @inheritdoc Budget
    /// @notice Reclaims assets from the budget
    /// @param data_ The packed {Transfer} request
    /// @return True if the request was successful
    /// @dev Only the owner can directly reclaim assets from the budget
    /// @dev If the amount is zero, the entire balance of the asset will be transferred to the receiver
    /// @dev If the asset transfer fails, the reclamation will revert
    function clawback(bytes calldata data_) external virtual override onlyOwner returns (bool) {
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

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to a single recipient
    /// @param data_ The packed {Transfer} request
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(bytes calldata data_) public virtual override onlyAuthorized returns (bool) {
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

    /// @inheritdoc Budget
    /// @notice Disburses assets from the budget to multiple recipients
    /// @param data_ The packed array of {Transfer} requests
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
        if (account_.length != authorized_.length) revert BoostError.LengthMismatch();
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
        return available(asset_) + _distributedFungible[asset_];
    }

    /// @notice Get the total amount of ERC1155 assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The total amount of assets
    function total(address asset_, uint256 tokenId_) external view virtual returns (uint256) {
        return IERC1155(asset_).balanceOf(address(this), tokenId_) + _distributedERC1155[asset_][tokenId_];
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

    /// @notice Get the amount of ERC1155 assets available for distribution from the budget
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The amount of assets available
    function available(address asset_, uint256 tokenId_) public view virtual returns (uint256) {
        return IERC1155(asset_).balanceOf(address(this), tokenId_);
    }

    /// @inheritdoc Budget
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
    function distributed(address asset_, uint256 tokenId_) external view virtual returns (uint256) {
        return _distributedERC1155[asset_][tokenId_];
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

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Budget, IERC165) returns (bool) {
        return interfaceId == type(ASimpleBudget).interfaceId || interfaceId == type(IERC1155Receiver).interfaceId
            || interfaceId == type(IERC165).interfaceId || Budget.supportsInterface(interfaceId);
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(ASimpleBudget).interfaceId;
    }
}
