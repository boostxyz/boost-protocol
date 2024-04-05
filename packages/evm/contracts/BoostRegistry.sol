// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {LibClone} from "@solady/utils/LibClone.sol";
import {ReentrancyGuard} from "@solady/utils/ReentrancyGuard.sol";

import {BoostLib} from "contracts/shared/BoostLib.sol";
import {Cloneable} from "contracts/shared/Cloneable.sol";
import {AllowList} from "contracts/allowlists/AllowList.sol";

/// @title Boost Registry
/// @notice A registry for base implementations and cloned instances
/// @dev This contract is used to register base implementations and deploy new instances of those implementations for use within the Boost protocol
contract BoostRegistry is ERC165, ReentrancyGuard {
    using BoostLib for address;

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
        Cloneable instance;
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
        Cloneable deployedInstance
    );

    /// @notice Thrown when a base implementation is already registered
    error AlreadyRegistered(RegistryType registryType, bytes32 identifier);

    /// @notice Thrown when no match is found for the given identifier
    error NotRegistered(bytes32 identifier);

    /// @notice Thrown when the implementation is not a valid {Cloneable} base
    error NotCloneable(address implementation);

    /// @notice The registry of base implementations
    mapping(bytes32 => Cloneable) private _bases;

    /// @notice The registry of deployed clones
    mapping(bytes32 => Clone) private _clones;

    /// @notice The registry of clones created by a given deployer
    mapping(address => bytes32[]) private _deployedClones;

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
        bytes32 identifier = getIdentifier(type_, name_);

        if (address(_bases[identifier]) != address(0)) revert AlreadyRegistered(type_, identifier);
        _bases[identifier] = Cloneable(implementation_);

        emit Registered(type_, identifier, implementation_);
    }

    /// @notice Deploy a new instance of a registered base implementation
    /// @param type_ The type of base implementation to be cloned
    /// @param base_ The address of the base implementation to clone
    /// @param name_ The display name for the clone
    /// @param data_ The data payload for the cloned instance's initializer
    /// @return instance The address of the deployed instance
    /// @dev This function will either emit a `Deployed` event and return the clone or revert
    function deployClone(RegistryType type_, address base_, string calldata name_, bytes calldata data_)
        external
        nonReentrant
        returns (Cloneable instance)
    {
        // Deploy and initialize the clone
        instance =
            Cloneable(base_.cloneAndInitialize(keccak256(abi.encodePacked(type_, base_, name_, msg.sender)), data_));

        // Ensure the clone's identifier is unique
        bytes32 identifier = getCloneIdentifier(type_, base_, msg.sender, name_);
        if (address(_clones[identifier].instance) != address(0)) revert AlreadyRegistered(type_, identifier);

        // Register and report the newly deployed clone
        _deployedClones[msg.sender].push(identifier);
        _clones[identifier] = Clone({baseType: type_, instance: instance, deployer: msg.sender, name: name_});

        emit Deployed(type_, identifier, base_, instance);
    }

    /// @notice Get the address of a registered base implementation
    /// @param identifier_ The unique identifier for the implementation (see {getIdentifier})
    /// @return implementation The address of the implementation
    /// @dev This function will revert if the implementation is not registered
    function getBaseImplementation(bytes32 identifier_) public view returns (Cloneable implementation) {
        implementation = _bases[identifier_];
        if (address(implementation) == address(0)) revert NotRegistered(identifier_);
    }

    /// @notice Get the address of a deployed clone by its identifier
    /// @param identifier_ The unique identifier for the deployed clone (see {getCloneIdentifier})
    /// @return clone The address of the deployed clone
    function getClone(bytes32 identifier_) external view returns (Clone memory clone) {
        clone = _clones[identifier_];
        if (address(clone.instance) == address(0)) revert NotRegistered(identifier_);
    }

    /// @notice Get the list of identifiers of deployed clones for a given deployer
    /// @param deployer_ The address of the deployer
    /// @return clones The list of deployed clones for the given deployer
    /// @dev WARNING: This function may return a large amount of data and is primarily intended for off-chain usage. It should be avoided in on-chain logic.
    function getClones(address deployer_) external view returns (bytes32[] memory) {
        return _deployedClones[deployer_];
    }

    /// @notice Build the identifier for a clone of a base implementation
    /// @param type_ The base type for the implementation
    /// @param base_ The address of the base implementation
    /// @param deployer_ The address of the deployer
    /// @param name_ The display name of the clone
    /// @return identifier The unique identifier for the clone
    function getCloneIdentifier(RegistryType type_, address base_, address deployer_, string calldata name_)
        public
        pure
        returns (bytes32 identifier)
    {
        return _getIdentifier(type_, keccak256(abi.encodePacked(base_, deployer_, name_)));
    }

    /// @notice Build the identifier for a base implementation
    /// @param type_ The base type for the implementation
    /// @param name_ The name of the implementation
    /// @return identifier The unique identifier for the implementation
    function getIdentifier(RegistryType type_, string calldata name_) public pure returns (bytes32 identifier) {
        return _getIdentifier(type_, keccak256(abi.encodePacked(name_)));
    }

    /// @notice Build a unique identifier for a given type and hash
    /// @param type_ The base type for the implementation
    /// @param hash_ The unique hash for the implementation
    /// @return identifier The unique identifier for the implementation
    function _getIdentifier(RegistryType type_, bytes32 hash_) internal pure returns (bytes32 identifier) {
        return keccak256(abi.encodePacked(type_, hash_));
    }
}
