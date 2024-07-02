// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC721} from "@solady/tokens/ERC721.sol";

import {Cloneable} from "contracts/shared/Cloneable.sol";
import {Action} from "contracts/actions/Action.sol";

contract ContractAction is Action {
    /// @notice Thrown when execution on a given chain is not supported
    error TargetChainUnsupported(uint256 targetChainId);

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

    /// @notice The target chain ID
    uint256 public chainId;

    /// @notice The target contract
    address public target;

    /// @notice The selector for the function to be called
    bytes4 public selector;

    /// @notice The native token value to send with the function call
    uint256 public value;

    constructor() {
        _disableInitializers();
    }

    /// @inheritdoc Cloneable
    /// @notice Initialize the contract with the owner and the required data
    function initialize(bytes calldata data_) public virtual override initializer {
        _initialize(abi.decode(data_, (InitPayload)));
    }

    function execute(bytes calldata data_) external payable virtual override returns (bool, bytes memory) {
        if (chainId != block.chainid) revert TargetChainUnsupported(chainId);
        (bool success, bytes memory returnData) = target.call{value: value}(_buildPayload(selector, data_));
        return (success, returnData);
    }

    function prepare(bytes calldata data_) public view virtual override returns (bytes memory bytes_) {
        return _buildPayload(selector, data_);
    }

    function _initialize(InitPayload memory init_) internal virtual onlyInitializing {
        chainId = init_.chainId;
        target = init_.target;
        selector = init_.selector;
        value = init_.value;
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

    /// @notice Convenience method to differentiate ContractAction from other Actions
    /// @return "ContractAction"
    function interfaceName() public pure virtual override returns (string memory) {
        return "ContractAction";
    }
}
