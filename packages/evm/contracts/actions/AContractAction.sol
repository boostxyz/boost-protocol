// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";

import {AAction} from "contracts/actions/AAction.sol";

abstract contract AContractAction is AAction {
    /// @notice The payload for initializing a ContractAction
    /// @param target The target contract address
    /// @param selector The selector for the function to be called
    /// @param value The native token value to send with the function call
    struct InitPayload {
        uint256 chainId;
        address target;
        bytes4 selector;
        uint256 value;
    }

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

    /// @inheritdoc ACloneable
    function getComponentInterface() public pure virtual override returns (bytes4) {
        return type(AContractAction).interfaceId;
    }

    /// @inheritdoc AAction
    function supportsInterface(bytes4 interfaceId) public view virtual override(AAction) returns (bool) {
        return interfaceId == type(AContractAction).interfaceId || super.supportsInterface(interfaceId);
    }
}
