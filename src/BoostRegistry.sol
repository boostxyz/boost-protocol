// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {EnumerableMap} from "lib/openzeppelin-contracts/contracts/utils/structs/EnumerableMap.sol";
import {ERC165} from "lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import {LibClone} from "lib/solady/src/utils/LibClone.sol";

import {Cloneable} from "src/Cloneable.sol";

/// @title Boost Registry
/// @notice A registry for base implementations and cloned instances
/// @dev This contract is used to register base implementations and deploy new instances of those implementations for use within the Boost protocol
contract BoostRegistry is ERC165 {
    using EnumerableMap for EnumerableMap.Bytes32ToAddressMap;
    using LibClone for address;

    /// @dev The types of bases that can be registered
    enum RegistryType {
        ACTION,
        ALLOW_LIST,
        BUDGET,
        INCENTIVE,
        VALIDATOR
    }

    /// @dev Emitted when a new base implementation is registered
    event Registered(RegistryType indexed registryType, bytes32 indexed identifier, address implementation);

    /// @dev Emitted when a new instance of a base implementation is deployed
    event Deployed(
        RegistryType indexed registryType,
        bytes32 indexed identifier,
        address baseImplementation,
        address deployedInstance
    );

    /// @dev Thrown when a base implementation is already registered
    error AlreadyRegistered(RegistryType registryType, bytes32 id);

    /// @dev Thrown when no matching base implementation exists
    error NotRegistered(bytes32 id);

    /// @dev Thrown when the implementation is not a valid {Cloneable} base
    error NotCloneable(address implementation);

    /// @dev The registry of base implementations
    EnumerableMap.Bytes32ToAddressMap private _bases;

    /// @notice A modifier to ensure the given address holds a valid {Cloneable} base
    /// @param implementation_ The address of the implementation to check
    modifier onlyCloneables(address implementation_) {
        if (!Cloneable(implementation_).supportsInterface(type(Cloneable).interfaceId)) {
            revert NotCloneable(implementation_);
        }
        _;
    }

    /// @notice Register a new base implementation of a given type
    /// @param type_ The base type for the implementation
    /// @param name_ A name for the implementation (must be unique within the given type)
    /// @param implementation_ The address of the implementation contract
    /// @dev This function will either emit a `Registered` event or revert if the identifier has already been registered
    /// @dev The given address must implement the given type interface (See {ERC165-supportsInterface})
    function register(RegistryType type_, string calldata name_, address implementation_)
        external
        onlyCloneables(implementation_)
    {
        bytes32 identifier_ = getIdentifier(type_, name_);

        if (!_bases.set(identifier_, implementation_)) {
            revert AlreadyRegistered(type_, identifier_);
        }

        emit Registered(type_, identifier_, implementation_);
    }

    /// @notice Deploy a new instance of a registered base implementation
    /// @param type_ The type of registry to deploy the instance from
    /// @param identifier_ The unique identifier for the implementation (see `BoostRegistry.getIdentifier`)
    /// @param salt_ The salt to use for deterministic deployment
    /// @param data_ The data payload for the deployment
    /// @return instance The address of the deployed instance
    /// @dev This function will either emit a `Deployed` event and return the instance, or revert the implementation is not registered
    function deployClone(RegistryType type_, bytes32 identifier_, bytes32 salt_, bytes calldata data_)
        external
        returns (address instance)
    {
        address implementation = getBaseImplementation(identifier_);

        // Deploy a new instance using the Clones With Immutable Args (CWIA) pattern:
        // - `data_` is the encoded payload passed to the implementation's constructor
        // - `salt_` is used to seed the CREATE2 call for deterministic deployment
        instance = implementation.cloneDeterministic(salt_);
        Cloneable(instance).initialize(data_);

        // Report the deployed instance
        emit Deployed(type_, identifier_, implementation, instance);
    }

    /// @notice Get the address of a registered base implementation
    /// @param identifier_ The unique identifier for the implementation (see `BoostRegistry.getIdentifier`)
    /// @return implementation The address of the implementation
    /// @dev This function will revert if the implementation is not registered
    function getBaseImplementation(bytes32 identifier_) public view returns (address implementation) {
        (, implementation) = _bases.tryGet(identifier_);
        if (implementation == address(0)) revert NotRegistered(identifier_);
    }

    /// @notice Build the identifier for a base implementation
    /// @param type_ The base type for the implementation
    /// @param name_ The name of the implementation
    /// @return identifier The unique identifier for the implementation
    function getIdentifier(RegistryType type_, string calldata name_) public pure returns (bytes32 identifier) {
        return keccak256(abi.encodePacked(type_, name_));
    }
}
