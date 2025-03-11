// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {DynamicArrayLib} from "@solady/utils/DynamicArrayLib.sol";
import {LibTransient} from "@solady/utils/LibTransient.sol";

import {Ownable} from "@solady/auth/Ownable.sol";
import {SafeTransferLib} from "@solady/utils/SafeTransferLib.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {BoostCore} from "contracts/BoostCore.sol";
import {BoostError} from "contracts/shared/BoostError.sol";
import {BoostLib} from "contracts/shared/BoostLib.sol";
import {ABudget} from "contracts/budgets/ABudget.sol";
import {ACloneable} from "contracts/shared/ACloneable.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";
import {ATransparentBudget} from "contracts/budgets/ATransparentBudget.sol";
import {IClaw} from "contracts/shared/IClaw.sol";
import {IPermit2} from "contracts/shared/IPermit2.sol";

/// @title Simple ABudget
/// @notice A minimal budget implementation that simply holds and distributes tokens (ERC20-like and native)
/// @dev This type of budget supports ETH, ERC20, and ERC1155 assets only
contract TransparentBudget is ATransparentBudget, ReentrancyGuard {
    using SafeTransferLib for address;
    using DynamicArrayLib for *;
    using LibTransient for *;

    IPermit2 public constant PERMIT2 =
        IPermit2(0x000000000022D473030F116dDEE9F6B43aC78BA3);

    /// @dev The total amount of each fungible asset distributed from the budget
    mapping(address => uint256) private _distributedFungible;

    /// @dev The total amount of each ERC1155 asset and token ID distributed from the budget
    mapping(address => mapping(uint256 => uint256)) private _distributedERC1155;

    /// @inheritdoc ABudget
    /// @notice This is unused. Call `createBoost` with a deposit payload
    function allocate(
        bytes calldata
    ) external payable virtual override returns (bool) {
        revert BoostError.NotImplemented();
    }

    function createBoost(
        bytes[] calldata _allocations,
        BoostCore core,
        bytes calldata _boostPayload
    ) public payable {
        DynamicArrayLib.DynamicArray memory allocationKeys;
        allocationKeys.resize(_allocations.length);

        for (uint256 i = 0; i < _allocations.length; i++) {
            bytes32 key = _allocate(_allocations[i]);
            allocationKeys.set(i, key);
        }

        core.createBoost(_boostPayload);

        // bytes32[] memory keys = allocationKeys.asBytes32Array();
        // for (uint256 i = 0; i < keys.length; i++) {
        //     LibTransient.TUint256 storage p = LibTransient.tUint256(keys[i]);
        //     if (p.get() != 0) revert BoostError.Unauthorized();
        // }
    }

    function createBoostWithPermit2(
        bytes[] calldata _allocations,
        BoostCore core,
        bytes calldata _boostPayload,
        bytes calldata _permit2Signature,
        uint256 nonce,
        uint256 deadline
    ) external payable {
        DynamicArrayLib.DynamicArray memory allocationKeys;
        allocationKeys.resize(_allocations.length);

        IPermit2.SignatureTransferDetails[]
            memory transferDetails = new IPermit2.SignatureTransferDetails[](
                _allocations.length
            );
        IPermit2.TokenPermissions[]
            memory permissions = new IPermit2.TokenPermissions[](
                _allocations.length
            );
        bytes32 key;
        for (uint256 i = 0; i < _allocations.length; i++) {
            Transfer memory request = abi.decode(_allocations[i], (Transfer));
            if (request.assetType == AssetType.ERC20) {
                (address asset, uint256 amount, bytes32 tKey) = _allocateERC20(
                    request,
                    false
                );
                key = tKey;
                transferDetails[i] = IPermit2.SignatureTransferDetails({
                    to: address(this),
                    requestedAmount: amount
                });
                permissions[i] = IPermit2.TokenPermissions({
                    token: IERC20(asset),
                    amount: amount
                });
            } else {
                key = _allocate(_allocations[i]);
            }
            allocationKeys.set(i, key);
        }

        PERMIT2.permitTransferFrom(
            // The permit message. Spender will be inferred as the caller (us).
            IPermit2.PermitBatchTransferFrom({
                permitted: permissions,
                nonce: nonce,
                deadline: deadline
            }),
            // The transfer recipients and amounts.
            transferDetails,
            // The owner of the tokens, which must also be
            // the signer of the message, otherwise this call
            // will fail.
            msg.sender,
            // The packed signature that was the result of signing
            // the EIP712 hash of `permit`.
            _permit2Signature
        );

        // Transfer `payload.amount` of the token to this contract

        core.createBoost(_boostPayload);
        bytes32[] memory keys = allocationKeys.asBytes32Array();
        for (uint256 i = 0; i < keys.length; i++) {
            LibTransient.TUint256 storage p = LibTransient.tUint256(keys[i]);
            if (p.get() != 0) revert BoostError.Unauthorized();
        }
    }

    /// @notice Allocates assets to be distributed in the boost
    /// @param data_ The packed data for the {Transfer} request
    /// @return key The key of the amount allocated
    /// @dev The caller must have already approved the contract to transfer the asset
    /// @dev If the asset transfer fails, the allocation will revert
    function _allocate(
        bytes calldata data_
    ) internal virtual returns (bytes32 key) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (request.assetType == AssetType.ETH) {
            FungiblePayload memory payload = abi.decode(
                request.data,
                (FungiblePayload)
            );

            // Ensure the value received is equal to the `payload.amount`
            if (msg.value != payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
            (
                LibTransient.TUint256 storage p,
                bytes32 tKey
            ) = getFungibleAmountAndKey(address(0));
            p.inc(payload.amount);
            key = tKey;
        } else if (request.assetType == AssetType.ERC20) {
            (, , bytes32 tKey) = _allocateERC20(request, true);
            key = tKey;
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(
                request.data,
                (ERC1155Payload)
            );

            // Transfer `payload.amount` of `payload.tokenId` to this contract
            IERC1155(request.asset).safeTransferFrom(
                request.target,
                address(this),
                payload.tokenId,
                payload.amount,
                payload.data
            );
            if (
                IERC1155(request.asset).balanceOf(
                    address(this),
                    payload.tokenId
                ) < payload.amount
            ) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
            (
                LibTransient.TUint256 storage p,
                bytes32 tKey
            ) = getERC1155AmountAndKey(request.asset, payload.amount);
            p.inc(payload.amount);
            key = tKey;
        } else {
            // Unsupported asset type
            revert BoostError.NotImplemented();
        }
    }

    function _allocateERC20(
        Transfer memory request,
        bool transfer
    ) internal returns (address asset, uint256 amount, bytes32 key) {
        FungiblePayload memory payload = abi.decode(
            request.data,
            (FungiblePayload)
        );
        if (transfer) {
            request.asset.safeTransferFrom(
                request.target,
                address(this),
                payload.amount
            );
            if (request.asset.balanceOf(address(this)) < payload.amount) {
                revert InvalidAllocation(request.asset, payload.amount);
            }
        }
        (
            LibTransient.TUint256 storage p,
            bytes32 tKey
        ) = getFungibleAmountAndKey(request.asset);
        p.inc(payload.amount);
        amount = payload.amount;
        asset = request.asset;
        key = tKey;
    }

    function isAuthorized(
        address account_
    ) public view virtual override returns (bool) {
        if (account_ == address(this)) return true;
        return false;
    }

    function getFungibleAmountAndKey(
        address asset
    ) internal pure returns (LibTransient.TUint256 storage p, bytes32 key) {
        key = bytes32(uint256(uint160(asset)));
        p = LibTransient.tUint256(key);
    }

    function getERC1155AmountAndKey(
        address asset,
        uint256 tokenId
    ) internal pure returns (LibTransient.TUint256 storage p, bytes32 key) {
        key = keccak256(abi.encodePacked(asset, tokenId));
        p = LibTransient.tUint256(key);
    }

    /// @inheritdoc ABudget
    /// @notice Reclaims assets from the budget
    /// @dev Only the owner can directly reclaim assets from the budget
    /// @dev If the amount is zero, the entire balance of the asset will be transferred to the receiver
    /// @dev If the asset transfer fails, the reclamation will revert
    function clawback(
        bytes calldata
    ) external virtual override onlyOwner returns (uint256) {
        revert BoostError.NotImplemented();
    }

    function clawbackFromTarget(
        address target,
        bytes calldata data_,
        uint256 boostId,
        uint256 incentiveId
    ) external virtual override returns (uint256, address) {
        BoostLib.Boost memory boost = BoostCore(target).getBoost(boostId);
        if (msg.sender != boost.owner) revert BoostError.Unauthorized();
        AIncentive.ClawbackPayload memory payload = AIncentive.ClawbackPayload({
            target: address(msg.sender),
            data: data_
        });
        IClaw incentive = IClaw(target);
        (uint256 amount, address asset) = incentive.clawback(
            abi.encode(payload),
            boostId,
            incentiveId
        );
        return (amount, asset);
    }

    /// @inheritdoc ABudget
    /// @notice Disburses assets from the budget to a single recipient
    /// @param data_ The packed {Transfer} request
    /// @return True if the disbursement was successful
    /// @dev If the asset transfer fails, the disbursement will revert
    function disburse(
        bytes calldata data_
    ) public virtual override returns (bool) {
        Transfer memory request = abi.decode(data_, (Transfer));
        if (
            request.assetType == AssetType.ERC20 ||
            request.assetType == AssetType.ETH
        ) {
            FungiblePayload memory payload = abi.decode(
                request.data,
                (FungiblePayload)
            );

            (LibTransient.TUint256 storage p, ) = getFungibleAmountAndKey(
                request.asset
            );
            uint256 avail = p.get();
            if (payload.amount > avail) {
                revert InsufficientFunds(request.asset, avail, payload.amount);
            }

            _transferFungible(request.asset, request.target, payload.amount);
        } else if (request.assetType == AssetType.ERC1155) {
            ERC1155Payload memory payload = abi.decode(
                request.data,
                (ERC1155Payload)
            );

            (LibTransient.TUint256 storage p, ) = getERC1155AmountAndKey(
                request.asset,
                payload.amount
            );
            uint256 avail = p.get();
            if (payload.amount > avail) {
                revert InsufficientFunds(request.asset, avail, payload.amount);
            }

            p.dec(payload.amount);

            _transferERC1155(
                request.asset,
                request.target,
                payload.tokenId,
                payload.amount,
                payload.data
            );
        } else {
            return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    /// @notice Disburses assets from the budget to multiple recipients
    /// @param data_ The packed array of {Transfer} requests
    /// @return True if all disbursements were successful
    function disburseBatch(
        bytes[] calldata data_
    ) external virtual override returns (bool) {
        for (uint256 i = 0; i < data_.length; i++) {
            if (!disburse(data_[i])) return false;
        }

        return true;
    }

    /// @inheritdoc ABudget
    /// @notice Get the total amount of assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @return The total amount of assets
    /// @dev This is simply the sum of the current balance and the distributed amount
    function total(
        address asset_
    ) external view virtual override returns (uint256) {
        return _distributedFungible[asset_];
    }

    /// @notice Get the total amount of ERC1155 assets allocated to the budget, including any that have been distributed
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The total amount of assets
    function total(
        address asset_,
        uint256 tokenId_
    ) external view virtual returns (uint256) {
        return _distributedERC1155[asset_][tokenId_];
    }

    /// @inheritdoc ABudget
    /// @notice Get the amount of assets available for distribution from the budget
    /// @return The amount of assets available
    /// @dev This is simply the current balance held by the budget
    /// @dev If the zero address is passed, this function will return the native balance
    function available(address) public view virtual override returns (uint256) {
        return 0;
    }

    /// @notice Get the amount of ERC1155 assets available for distribution from the budget
    /// @return The amount of assets available
    function available(address, uint256) public view virtual returns (uint256) {
        return 0;
    }

    /// @inheritdoc ABudget
    /// @notice Get the amount of assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @return The amount of assets distributed
    function distributed(
        address asset_
    ) external view virtual override returns (uint256) {
        return _distributedFungible[asset_];
    }

    /// @notice Get the amount of ERC1155 assets that have been distributed from the budget
    /// @param asset_ The address of the asset
    /// @param tokenId_ The ID of the token
    /// @return The amount of assets distributed
    function distributed(
        address asset_,
        uint256 tokenId_
    ) external view virtual returns (uint256) {
        return _distributedERC1155[asset_][tokenId_];
    }

    /// @inheritdoc ABudget
    /// @dev This is a no-op as there is no local balance to reconcile
    function reconcile(
        bytes calldata
    ) external virtual override returns (uint256) {
        return 0;
    }

    /// @notice Transfer assets to the recipient
    /// @param asset_ The address of the asset
    /// @param to_ The address of the recipient
    /// @param amount_ The amount of the asset to transfer
    /// @dev This function is used to transfer assets from the budget to a given recipient (typically an incentive contract)
    /// @dev If the destination address is the zero address, or the transfer fails for any reason, this function will revert
    function _transferFungible(
        address asset_,
        address to_,
        uint256 amount_
    ) internal virtual nonReentrant {
        (LibTransient.TUint256 storage p, ) = getFungibleAmountAndKey(asset_);
        uint256 avail = p.get();
        // Increment the total amount of the asset distributed from the budget
        if (to_ == address(0)) revert TransferFailed(asset_, to_, amount_);
        if (amount_ > avail) {
            revert InsufficientFunds(asset_, avail, amount_);
        }
        p.dec(amount_);

        _distributedFungible[asset_] += amount_;

        // Transfer the asset to the recipient
        if (asset_ == address(0)) {
            SafeTransferLib.safeTransferETH(to_, amount_);
        } else {
            asset_.safeTransfer(to_, amount_);
        }

        emit Distributed(asset_, to_, amount_);
    }

    function _transferERC1155(
        address asset_,
        address to_,
        uint256 tokenId_,
        uint256 amount_,
        bytes memory data_
    ) internal virtual nonReentrant {
        // Increment the total amount of the asset distributed from the budget
        if (to_ == address(0)) revert TransferFailed(asset_, to_, amount_);
        if (amount_ > available(asset_, tokenId_)) {
            revert InsufficientFunds(
                asset_,
                available(asset_, tokenId_),
                amount_
            );
        }

        _distributedERC1155[asset_][tokenId_] += amount_;

        // Transfer the asset to the recipient
        // wake-disable-next-line reentrancy (`nonReentrant` modifier is applied to the function)
        IERC1155(asset_).safeTransferFrom(
            address(this),
            to_,
            tokenId_,
            amount_,
            data_
        );

        emit Distributed(asset_, to_, amount_);
    }

    /// @inheritdoc IERC1155Receiver
    /// @dev This contract does not care about the specifics of the inbound token, so we simply return the magic value (i.e. the selector for `onERC1155Received`)
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        // We don't need to do anything here
        return IERC1155Receiver.onERC1155Received.selector;
    }

    /// @inheritdoc IERC1155Receiver
    /// @dev This contract does not care about the specifics of the inbound token, so we simply return the magic value (i.e. the selector for `onERC1155Received`)
    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bytes4) {
        // We don't need to do anything here
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }
}
