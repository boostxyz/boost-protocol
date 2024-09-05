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

/// @title Vesting Budget
/// @notice A vesting-based budget implementation that allows for the distribution of assets over time
/// @dev Take note of the following when making use of this budget type:
///     - The budget is designed to manage native and ERC20 token balances only. Using rebasing tokens or other non-standard token types may result in unexpected behavior.
///     - Any assets allocated to this type of budget will follow the vesting schedule as if they were locked from the beginning, which is to say that, if the vesting has already started, some portion of the assets will be immediately available for distribution.
///     - A vesting budget can also act as a time-lock, unlocking all assets at a specified point in time. To release assets at a specific time rather than vesting them over time, set the `start` to the desired time and the `duration` to zero.
///     - This contract is {Ownable} to enable the owner to allocate to the budget, reclaim and disburse assets from the budget, and to set authorized addresses. Additionally, the owner can transfer ownership of the budget to another address. Doing so has no effect on the vesting schedule.
abstract contract AVestingBudget is Budget, ReentrancyGuard {
    using SafeTransferLib for address;

    /// @dev The total amount of each fungible asset distributed from the budget
    mapping(address => uint256) private _distributedFungible;

    /// @dev The mapping of authorized addresses
    mapping(address => bool) internal _isAuthorized;

    /// @notice The timestamp at which the vesting schedule begins
    uint64 public start;

    /// @notice The duration of the vesting schedule (in seconds)
    uint64 public duration;

    /// @notice The duration of the cliff period (in seconds)
    uint64 public cliff;

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
    /// @dev Only the owner can directly reclaim assets from the budget, and this action is not subject to the vesting schedule
    /// @dev If the amount is zero, the entire available balance of the asset will be transferred to the receiver
    /// @dev If the asset transfer fails for any reason, the function will revert
    function clawback(bytes calldata data_) external virtual override onlyOwner returns (bool) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ETH || request.assetType == AssetType.ERC20) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));
            _transferFungible(
                request.asset, request.target, payload.amount == 0 ? available(request.asset) : payload.amount
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
    /// @dev The maximum amount that can be disbursed is the {available} amount
    function disburse(bytes calldata data_) public virtual override onlyAuthorized returns (bool) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ERC20 || request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(request.data, (FungiblePayload));
            _transferFungible(request.asset, request.target, payload.amount);
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

    /// @notice Get the end time of the vesting schedule
    /// @return The end time of the vesting schedule
    function end() external view virtual returns (uint256) {
        return start + duration;
    }

    /// @inheritdoc Budget
    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    /// @dev This is equal to the sum of the total current balance and the total distributed amount
    function total(address asset_) external view virtual override returns (uint256) {
        uint256 balance = asset_ == address(0) ? address(this).balance : asset_.balanceOf(address(this));
        return _distributedFungible[asset_] + balance;
    }

    /// @inheritdoc Budget
    /// @notice Get the amount of assets available for distribution from the budget as of the current block timestamp
    /// @param asset_ The address of the asset (or the zero address for native assets)
    /// @return The amount of assets currently available for distribution
    /// @dev This is equal to the total vested amount minus any already distributed
    function available(address asset_) public view virtual override returns (uint256) {
        return _vestedAllocation(asset_, uint64(block.timestamp)) - _distributedFungible[asset_];
    }

    /// @inheritdoc Budget
    /// @notice Get the amount of assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets distributed
    function distributed(address asset_) external view virtual override returns (uint256) {
        return _distributedFungible[asset_];
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

    /// @notice Calculate the portion of allocated assets vested at a given timestamp
    /// @param asset_ The address of the asset
    /// @param timestamp_ The timestamp used to calculate the vested amount
    /// @return The amount of assets vested at that point in time
    function _vestedAllocation(address asset_, uint64 timestamp_) internal view virtual returns (uint256) {
        uint256 balance = asset_ == address(0) ? address(this).balance : asset_.balanceOf(address(this));
        return _linearVestedAmount(balance + _distributedFungible[asset_], timestamp_);
    }

    /// @notice Calculate the amount of assets vested at a given timestamp using a linear vesting schedule
    /// @param totalAllocation The total amount of the asset allocated to the budget (including prior distributions)
    /// @param timestamp The timestamp used to calculate the vested amount
    /// @return The amount of assets vested at that point in time
    function _linearVestedAmount(uint256 totalAllocation, uint64 timestamp) internal view virtual returns (uint256) {
        if (timestamp < start + cliff) {
            return 0;
        } else if (timestamp >= start + duration) {
            return totalAllocation;
        } else {
            return totalAllocation * (timestamp - start) / duration;
        }
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(AVestingBudget).interfaceId || Budget.supportsInterface(interfaceId);
    }

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AVestingBudget).interfaceId;
    }
}
