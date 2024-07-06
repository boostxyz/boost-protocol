// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";

import {Action} from "contracts/actions/Action.sol";

abstract contract AContractAction is Action {
    /// @notice Thrown when execution on a given chain is not supported
    error TargetChainUnsupported(uint256 targetChainId);

    /// @notice The target chain ID
    uint256 public chainId;

    /// @notice The target contract
    address public target;

    /// @notice The selector for the function to be called
    bytes4 public selector;

    /// @notice The native token value to send with the function call
    uint256 public value;

    /// @inheritdoc Cloneable
    /// @param data_ The packed init data for the budget `(address owner, address[] authorized)`
    function initialize(bytes calldata data_) public virtual override {
        revert NotInitializing();
    }

    function execute(bytes calldata data_) external payable virtual override returns (bool, bytes memory) {
        if (chainId != block.chainid) revert TargetChainUnsupported(chainId);
        (bool success, bytes memory returnData) = target.call{value: value}(_buildPayload(selector, data_));
        return (success, returnData);
    }

    function prepare(bytes calldata data_) public view virtual override returns (bytes memory bytes_) {
        return _buildPayload(selector, data_);
    }

    function _buildPayload(bytes4 selector_, bytes calldata calldata_) internal pure returns (bytes memory payload) {
        assembly {
            // Allocate space for the payload
            let size := add(4, calldata_.length)
            payload := mload(0x40)
            mstore(payload, size)
            mstore(0x40, add(payload, add(size, 0x20)))

            // Place the selector and calldata in the payload buffer
            mstore(add(payload, 0x20), selector_)
            calldatacopy(add(payload, 0x24), calldata_.offset, calldata_.length)
        }
    }

    /// @inheritdoc Action
    function getComponentInterface() public pure virtual override(Action) returns (bytes4) {
        return type(AContractAction).interfaceId;
    }

    /// @inheritdoc Action
    function supportsInterface(bytes4 interfaceId) public view virtual override(Action) returns (bool) {
        return interfaceId == type(AContractAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
