// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {Initializable} from "lib/solady/src/utils/Initializable.sol";
import {ERC165} from "lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

/// @title Cloneable
/// @notice A contract that can be cloned and initialized only once
abstract contract Cloneable is Initializable, ERC165 {
    /// @notice Thrown when an inheriting contract does not implement the initializer function
    error InitializerNotImplemented();

    /// @notice Thrown when the provided initialization data is invalid
    /// @dev This error indicates that the given data is not valid for the implementation (i.e. does not decode to the expected types)
    error InvalidInitializationData();

    /// @notice Initialize the clone with the given arbitrary data
    /// @param - The compressed initialization data (if required)
    /// @dev The data is expected to be ABI encoded bytes compressed using {LibZip-cdCompress}
    /// @dev All implementations must override this function to initialize the contract
    function initialize(bytes calldata) external virtual initializer {
        revert InitializerNotImplemented();
    }

    /// @inheritdoc ERC165
    /// @notice Check if the contract supports the given interface
    /// @param interfaceId The interface identifier
    /// @return True if the contract supports the interface
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(Cloneable).interfaceId || super.supportsInterface(interfaceId);
    }
}
