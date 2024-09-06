// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import {Ownable as AOwnable} from "@solady/auth/Ownable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {ABudget} from "contracts/budgets/ABudget.sol";
import {AERC1155Incentive} from "contracts/incentives/AERC1155Incentive.sol";
import {AIncentive} from "contracts/incentives/AIncentive.sol";

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";

/// @title ERC1155Incentive
/// @notice A simple ERC1155 incentive implementation that allows claiming of tokens
contract ERC1155Incentive is AOwnable, AERC1155Incentive {
    /// @notice The payload for initializing an ERC1155Incentive
    struct InitPayload {
        IERC1155 asset;
        Strategy strategy;
        uint256 tokenId;
        uint256 limit;
        bytes extraData;
    }

    /// @notice Construct a new ERC1155Incentive
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        reward = 1;
        _disableInitializers();
    }

    /// @notice Initialize the contract with the incentive parameters
    /// @param data_ The compressed initialization payload
    function initialize(bytes calldata data_) public override initializer {
        _initializeOwner(msg.sender);
        InitPayload memory init_ = abi.decode(data_, (InitPayload));

        // Ensure the strategy is valid (MINT is not yet supported)
        if (init_.strategy == Strategy.MINT) revert BoostError.NotImplemented();
        if (init_.limit == 0) revert BoostError.InvalidInitialization();

        // Ensure the maximum reward amount has been allocated
        uint256 available = init_.asset.balanceOf(address(this), init_.tokenId);
        if (available < init_.limit) {
            revert BoostError.InsufficientFunds(address(init_.asset), available, init_.limit);
        }

        asset = init_.asset;
        strategy = init_.strategy;
        tokenId = init_.tokenId;
        limit = init_.limit;
        extraData = init_.extraData;

        _initializeOwner(msg.sender);
    }

    /// @inheritdoc AIncentive
    /// @notice Get the required allowance for the incentive
    /// @param data_ The initialization payload for the incentive
    /// @return budgetData The data payload to be passed to the ABudget for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        return abi.encode(
            ABudget.Transfer({
                assetType: ABudget.AssetType.ERC1155,
                asset: address(init_.asset),
                target: address(this),
                data: abi.encode(
                    ABudget.ERC1155Payload({tokenId: init_.tokenId, amount: init_.limit, data: init_.extraData})
                )
            })
        );
    }

    /// @notice Claim the incentive
    /// @param claimTarget the recipient of the payout
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(address claimTarget, bytes calldata data_) external override onlyOwner returns (bool) {
        // Disburse the incentive based on the strategy (POOL only for now)
        if (strategy == Strategy.POOL) {
            if (!_isClaimable(claimTarget)) revert NotClaimable();

            claims++;
            claimed[claimTarget] = true;

            // wake-disable-next-line reentrancy (not a risk here)
            asset.safeTransferFrom(address(this), claimTarget, tokenId, 1, data_);
            emit Claimed(claimTarget, abi.encodePacked(asset, claimTarget, tokenId, uint256(1), data_));

            return true;
        }

        return false;
    }

    /// @inheritdoc AIncentive
    function clawback(bytes calldata data_) external override onlyOwner returns (bool) {
        ClawbackPayload memory claim_ = abi.decode(data_, (ClawbackPayload));
        (uint256 amount) = abi.decode(claim_.data, (uint256));

        // Ensure the amount is valid and reduce the max claims accordingly
        if (amount > limit) revert BoostError.ClaimFailed(msg.sender, abi.encode(claim_));
        limit -= amount;

        // Reclaim the incentive to the intended recipient
        // wake-disable-next-line reentrancy (not a risk here)
        asset.safeTransferFrom(address(this), claim_.target, tokenId, amount, claim_.data);
        emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, tokenId, amount, claim_.data));

        return true;
    }

    /// @notice Check if an incentive is claimable
    /// @param claimTarget the potential recipient of the payout
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(address claimTarget, bytes calldata) public view override returns (bool) {
        return _isClaimable(claimTarget);
    }

    /// @notice Check if an incentive is claimable for a specific recipient
    /// @param recipient_ The address of the recipient
    /// @return True if the incentive is claimable for the recipient
    function _isClaimable(address recipient_) internal view returns (bool) {
        return !claimed[recipient_] && claims < limit;
    }

    /// @inheritdoc IERC1155Receiver
    /// @dev This contract does not check the token ID and will accept all tokens
    function onERC1155Received(address, address, uint256, uint256, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155Received.selector;
    }

    /// @inheritdoc IERC1155Receiver
    /// @dev This contract does not check the token ID and will accept all batches
    function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
        external
        pure
        override
        returns (bytes4)
    {
        return this.onERC1155BatchReceived.selector;
    }
}
