// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {BoostError} from "contracts/shared/BoostError.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";

/// @title ERC1155Incentive
/// @notice A simple ERC1155 incentive implementation that allows claiming of tokens
abstract contract AERC1155Incentive is Incentive, IERC1155Receiver {
    /// @notice The strategy for the incentive
    /// @dev The strategy determines how the incentive is disbursed:
    ///     - POOL: Transfer tokens from the pool to the recipient
    ///     - MINT: Mint tokens to the recipient directly (not yet implemented)
    enum Strategy {
        POOL,
        MINT
    }

    /// @notice The address of the ERC1155-compliant contract
    IERC1155 public asset;

    /// @notice The strategy for the incentive (MINT or POOL)
    Strategy public strategy;

    /// @notice The maximum number of claims that can be made (one per address)
    uint256 public limit;

    /// @notice The ERC1155 token ID for the incentive
    uint256 public tokenId;

    /// @notice Extra data to be passed to the ERC1155 contract
    bytes public extraData;

    /// @notice Claim the incentive
    /// @param data_ The data payload for the incentive claim `(address recipient, bytes data)`
    /// @return True if the incentive was successfully claimed
    function claim(bytes calldata data_) external override onlyOwner returns (bool) {
        // Disburse the incentive based on the strategy (POOL only for now)
        if (strategy == Strategy.POOL) {
            ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
            if (!_isClaimable(claim_.target)) revert NotClaimable();

            claims++;
            claimed[claim_.target] = true;

            // wake-disable-next-line reentrancy (not a risk here)
            asset.safeTransferFrom(address(this), claim_.target, tokenId, 1, claim_.data);
            emit Claimed(claim_.target, abi.encodePacked(asset, claim_.target, tokenId, uint256(1), claim_.data));

            return true;
        }

        return false;
    }

    /// @inheritdoc Incentive
    function reclaim(bytes calldata data_) external override onlyOwner returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
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
    /// @param data_ The data payload for the claim check `(address recipient, bytes data)`
    /// @return True if the incentive is claimable based on the data payload
    /// @dev For the POOL strategy, the `bytes data` portion of the payload ignored
    /// @dev The recipient must not have already claimed the incentive
    function isClaimable(bytes calldata data_) public view override returns (bool) {
        ClaimPayload memory claim_ = abi.decode(data_, (ClaimPayload));
        return _isClaimable(claim_.target);
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

    /// @inheritdoc Cloneable
    function getComponentInterface() public pure virtual override(Cloneable) returns (bytes4) {
        return type(AERC1155Incentive).interfaceId;
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Incentive, IERC165) returns (bool) {
        return interfaceId == type(AERC1155Incentive).interfaceId || interfaceId == type(IERC1155Receiver).interfaceId
            || super.supportsInterface(interfaceId);
    }
}
