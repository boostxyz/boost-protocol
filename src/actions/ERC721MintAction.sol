// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {console} from "lib/forge-std/src/console.sol";

import {LibZip} from "lib/solady/src/utils/LibZip.sol";
import {ERC721} from "lib/solady/src/tokens/ERC721.sol";

import {Cloneable} from "src/Cloneable.sol";
import {Action} from "src/actions/Action.sol";
import {Validator} from "src/validators/Validator.sol";

/// @title ERC721 Mint Action
/// @notice A primitive action to mint and/or validate that an ERC721 token has been minted
/// @dev The action is expected to be prepared with the data payload for the minting of the token
/// @dev This a minimal generic implementation that should be extended if additional functionality or customizations are required
/// @dev It is expected that the target contract has an externally accessible mint function whose selector
contract ERC721MintAction is Action, Validator {
    using LibZip for bytes;

    /// @notice The target ERC721 contract
    /// @dev This is the contract against which the mint action should be executed
    address public target;

    /// @notice The selector for the mint function
    /// @dev This is expected to be the actual selector (e.g. `bytes4(keccak256("myMintFunction(address,uint256)"))`)
    bytes4 public selector;

    /// @notice The native token value to send with the mint function
    /// @dev This value is expected to be the value required for the mint function on the target contract
    uint256 public value;

    /// @notice The set of validated tokens
    /// @dev This is intended to prevent multiple validations against the same token ID
    mapping(uint256 => bool) public validated;

    /// @notice Construct the ERC721 Mint Action
    /// @dev Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the {initialize} function.
    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @notice Initialize the contract with the owner and the required mint data
    /// @param data_ The data payload for the mint action `(address target, bytes4 selector, uint256 value)`
    function initialize(bytes calldata data_) external override initializer {
        (address target_, bytes4 selector_, uint256 value_) =
            abi.decode(data_.cdDecompress(), (address, bytes4, uint256));
        target = target_;
        selector = selector_;
        value = value_;
        _initializeOwner(msg.sender);
    }

    /// @notice Execute the action (not yet implemented)
    /// @param - The data payload for the call (not used in this implementation)
    /// @return success The success status of the call
    /// @return returnData The return data from the call
    function execute(bytes calldata /* data_ */ )
        external
        payable
        override
        returns (bool success, bytes memory returnData)
    {
        revert ExecuteNotImplemented();
    }

    /// @notice Prepare the action for execution and return the expected payload
    /// @param data_ The ABI-encoded payload for the action `(address recipient)`
    /// @return The encoded payload to be sent with the call
    /// @dev Note that the mint value is NOT included in the prepared payload but must be sent with the call
    function prepare(bytes calldata data_) public view override returns (bytes memory) {
        (address recipient) = abi.decode(data_, (address));
        return abi.encodeWithSelector(selector, recipient);
    }

    /// @inheritdoc Validator
    /// @notice Validate that the action has been completed successfully
    /// @param data_ The data payload for the action `(address holder, uint256 tokenId)`
    /// @return success True if the action has been validated for the user
    function validate(bytes calldata data_) external virtual override(Action, Validator) returns (bool success) {
        (address holder, uint256 tokenId) = abi.decode(data_.cdDecompress(), (address, uint256));
        if (ERC721(target).ownerOf(tokenId) == holder && !validated[tokenId]) {
            validated[tokenId] = true;
            return true;
        } else {
            return false;
        }
    }

    /// @inheritdoc Cloneable
    function supportsInterface(bytes4 interfaceId) public view virtual override(Action, Validator) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
