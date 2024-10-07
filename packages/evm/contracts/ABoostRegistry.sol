// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {ACloneable} from "contracts/shared/ACloneable.sol";

abstract contract ABoostRegistry is ERC165 {
    /// @notice The types of bases that can be registered
    enum RegistryType {
        ACTION,
        ALLOW_LIST,
        BUDGET,
        INCENTIVE,
        VALIDATOR
    }

    /// @notice The data structure for a deployed clone
    /// @param baseType The type of base implementation
    /// @param name The display name for the clone
    /// @param instance The address of the clone
    /// @param deployer The address of the deployer
    struct Clone {
        RegistryType baseType;
        ACloneable instance;
        address deployer;
        string name;
    }

    /// @notice Emitted when a new base implementation is registered
    event Registered(RegistryType indexed registryType, bytes32 indexed identifier, address implementation);

    /// @notice Emitted when a new instance of a base implementation is deployed
    event Deployed(
        RegistryType indexed registryType,
        bytes32 indexed identifier,
        address baseImplementation,
        ACloneable deployedInstance
    );

    /// @notice Thrown when a base implementation is already registered
    error AlreadyRegistered(RegistryType registryType, bytes32 identifier);

    /// @notice Thrown when no match is found for the given identifier
    error NotRegistered(bytes32 identifier);

    /// @notice Thrown when the implementation is not a valid {ACloneable} base
    error NotACloneable(address implementation);

    /// @notice Register a new base implementation of a given type
    /// @param type_ The base type for the implementation
    /// @param name_ A name for the implementation (must be unique within the given type)
    /// @param implementation_ The address of the implementation contract
    /// @dev This function will either emit a `Registered` event or revert if the identifier has already been registered
    /// @dev The given address must implement the given type interface (See {ERC165-supportsInterface})
    function register(RegistryType type_, string calldata name_, address implementation_) external virtual;

    /// @notice Deploy a new instance of a registered base implementation
    /// @param type_ The type of base implementation to be cloned
    /// @param base_ The address of the base implementation to clone
    /// @param name_ The display name for the clone
    /// @param data_ The data payload for the cloned instance's initializer
    /// @return instance The address of the deployed instance
    /// @dev This function will either emit a `Deployed` event and return the clone or revert
    function deployClone(RegistryType type_, address base_, string calldata name_, bytes calldata data_)
        external
        virtual
        returns (ACloneable instance);

    /// @notice Get the address of a registered base implementation
    /// @param identifier_ The unique identifier for the implementation (see {getIdentifier})
    /// @return implementation The address of the implementation
    /// @dev This function will revert if the implementation is not registered
    function getBaseImplementation(bytes32 identifier_) external view virtual returns (ACloneable implementation);

    /// @notice Get the address of a deployed clone by its identifier
    /// @param identifier_ The unique identifier for the deployed clone (see {getCloneIdentifier})
    /// @return clone The address of the deployed clone
    function getClone(bytes32 identifier_) external view virtual returns (Clone memory clone);

    /// @notice Get the list of identifiers of deployed clones for a given deployer
    /// @param deployer_ The address of the deployer
    /// @return clones The list of deployed clones for the given deployer
    /// @dev WARNING: This function may return a large amount of data and is primarily intended for off-chain usage. It should be avoided in on-chain logic.
    function getClones(address deployer_) external view virtual returns (bytes32[] memory);

    /// @notice Build the identifier for a clone of a base implementation
    /// @param type_ The base type for the implementation
    /// @param base_ The address of the base implementation
    /// @param deployer_ The address of the deployer
    /// @param name_ The display name of the clone
    /// @return identifier The unique identifier for the clone
    function getCloneIdentifier(RegistryType type_, address base_, address deployer_, string calldata name_)
        external
        pure
        virtual
        returns (bytes32 identifier);

    /// @notice Build the identifier for a base implementation
    /// @param type_ The base type for the implementation
    /// @param name_ The name of the implementation
    /// @return identifier The unique identifier for the implementation
    function getIdentifier(RegistryType type_, string calldata name_)
        external
        pure
        virtual
        returns (bytes32 identifier);

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ABoostRegistry).interfaceId || super.supportsInterface(interfaceId);
    }
}
