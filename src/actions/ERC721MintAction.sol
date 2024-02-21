// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Action} from "./Action.sol";
import {Validator} from "../validators/Validator.sol";

/// @title ERC721 Mint Action
/// @notice A primitive action to mint an ERC721 token
/// @dev The action is expected to be prepared with the data payload for the minting of the token
/// @dev This a minimal generic implementation that should be extended if additional functionality or customizations are required
/// @dev It is expected that the target contract has an externally accessible mint function whose selector
contract ERC721MintAction is Action {
    error MintFailed();

    /// @notice The target ERC721 contract
    /// @dev This is the contract against which the mint action should be executed
    address public immutable MINT_TARGET;

    /// @notice The selector for the mint function
    /// @dev This is expected to be `bytes4(keccak256(functionSignature))`
    bytes4 public immutable MINT_SELECTOR;

    /// @notice The value to send with the mint function
    /// @dev This value is expected to be the value required for the mint function on the target contract
    uint256 public immutable MINT_VALUE;

    /// @notice Construct the ERC721 Mint Action
    /// @param validator_ The address of the validator contract
    /// @param target_ The address of the ERC721 contract
    /// @param mintSelector_ The selector for the mint function
    /// @param mintValue_ The value to send with the mint function
    /// @dev The `mintSelector_` and `mintValue_` are expected to be the selector and value required for the mint function on the target contract
    constructor(
        Validator validator_,
        address target_,
        bytes4 mintSelector_,
        uint256 mintValue_
    ) {
        VALIDATOR = validator_;
        MINT_TARGET = target_;
        MINT_SELECTOR = mintSelector_;
        MINT_VALUE = mintValue_;
    }

    /// @notice Execute the action (not yet implemented)
    /// @param - The data payload for the call
    /// @return (success, returnData) The success status of the call
    function execute(
        bytes calldata /* data_ */
    ) external payable override returns (bool, bytes memory) {
        revert ExecuteNotImplemented();
    }

    /// @notice Prepare the action for execution and return the expected payload
    /// @param data_ The data payload for the action
    /// @return The encoded payload for the mint function
    /// @dev Note that the mint value is NOT included in the prepared payload but must be sent with the call
    function prepare(
        bytes calldata data_
    ) public view override returns (bytes memory) {
        return abi.encodeWithSelector(MINT_SELECTOR, data_);
    }

    /// @inheritdoc Action
    /// @notice Validate that the action has been completed successfully
    /// @param data_ The data payload for the action
    /// @return True if the action has been validated for the user
    function validate(
        bytes calldata data_
    ) external virtual override returns (bool) {
        return VALIDATOR.validate(data_);
    }
}
