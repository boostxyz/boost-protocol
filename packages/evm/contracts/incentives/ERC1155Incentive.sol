// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

import {BoostError} from "contracts/shared/BoostError.sol";

import {Budget} from "contracts/budgets/Budget.sol";
import {AERC1155Incentive} from "contracts/incentives/AERC1155Incentive.sol";
import {Incentive} from "contracts/incentives/Incentive.sol";

/// @title ERC1155Incentive
/// @notice A simple ERC1155 incentive implementation that allows claiming of tokens
contract ERC1155Incentive is AERC1155Incentive {
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

    /// @inheritdoc Incentive
    /// @notice Get the required allowance for the incentive
    /// @param data_ The initialization payload for the incentive
    /// @return budgetData The data payload to be passed to the Budget for interpretation
    function preflight(bytes calldata data_) external view override returns (bytes memory budgetData) {
        InitPayload memory init_ = abi.decode(data_, (InitPayload));
        return abi.encode(
            Budget.Transfer({
                assetType: Budget.AssetType.ERC1155,
                asset: address(init_.asset),
                target: address(this),
                data: abi.encode(
                    Budget.ERC1155Payload({tokenId: init_.tokenId, amount: init_.limit, data: init_.extraData})
                )
            })
        );
    }
}
