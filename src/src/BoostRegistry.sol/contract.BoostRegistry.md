# BoostRegistry
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/00a29d18bb9e82e36d30703c29f8dfdef1d915df/src/BoostRegistry.sol)

**Inherits:**
ERC165

A registry for base implementations and cloned instances

*This contract is used to register base implementations and deploy new instances of those implementations for use within the Boost protocol*


## State Variables
### _bases
The registry of base implementations


```solidity
mapping(bytes32 => Cloneable) private _bases;
```


### _clones
The registry of deployed clones


```solidity
mapping(bytes32 => Clone) private _clones;
```


### _deployedClones
The registry of clones created by a given deployer


```solidity
mapping(address => bytes32[]) private _deployedClones;
```


## Functions
### onlyCloneables

A modifier to ensure the given address holds a valid {Cloneable} base


```solidity
modifier onlyCloneables(address implementation_);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`implementation_`|`address`|The address of the implementation to check|


### register

Register a new base implementation of a given type

*This function will either emit a `Registered` event or revert if the identifier has already been registered*

*The given address must implement the given type interface (See [ERC165-supportsInterface](/src/incentives/Incentive.sol/abstract.Incentive.md#supportsinterface))*


```solidity
function register(RegistryType type_, string calldata name_, address implementation_)
    external
    onlyCloneables(implementation_);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The base type for the implementation|
|`name_`|`string`|A name for the implementation (must be unique within the given type)|
|`implementation_`|`address`|The address of the implementation contract|


### deployClone

Deploy a new instance of a registered base implementation

*This function will deploy a new {SimpleAllowList} for the clone if it's a {Budget} or {Incentive} type and none was provided*

*This function will either emit a `Deployed` event and return the clone or revert*


```solidity
function deployClone(
    RegistryType type_,
    address base_,
    AllowList allowList_,
    string calldata name_,
    bytes calldata data_
) external returns (Cloneable instance);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The type of base implementation to be cloned|
|`base_`|`address`|The address of the base implementation to clone|
|`allowList_`|`AllowList`|The allowList for the clone (optional for {Action}, {AllowList} and {Validator} types, required for all {Budget} and {Incentive} types)|
|`name_`|`string`|The display name for the clone|
|`data_`|`bytes`|The data payload for the cloned instance's initializer|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`instance`|`Cloneable`|The address of the deployed instance|


### getBaseImplementation

Get the address of a registered base implementation

*This function will revert if the implementation is not registered*


```solidity
function getBaseImplementation(bytes32 identifier_) public view returns (Cloneable implementation);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`identifier_`|`bytes32`|The unique identifier for the implementation (see [getIdentifier](/src/BoostRegistry.sol/contract.BoostRegistry.md#getidentifier))|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`implementation`|`Cloneable`|The address of the implementation|


### getClone

Get the address of a deployed clone by its identifier


```solidity
function getClone(bytes32 identifier_) external view returns (Clone memory clone);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`identifier_`|`bytes32`|The unique identifier for the deployed clone (see [getCloneIdentifier](/src/BoostRegistry.sol/contract.BoostRegistry.md#getcloneidentifier))|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`clone`|`Clone`|The address of the deployed clone|


### getClones

Get the list of identifiers of deployed clones for a given deployer

*WARNING: This function may return a large amount of data and is primarily intended for off-chain usage. It should be avoided in on-chain logic.*


```solidity
function getClones(address deployer_) external view returns (bytes32[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`deployer_`|`address`|The address of the deployer|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes32[]`|clones The list of deployed clones for the given deployer|


### getCloneIdentifier

Build the identifier for a clone of a base implementation


```solidity
function getCloneIdentifier(RegistryType type_, address base_, address deployer_, string calldata name_)
    public
    pure
    returns (bytes32 identifier);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The base type for the implementation|
|`base_`|`address`|The address of the base implementation|
|`deployer_`|`address`|The address of the deployer|
|`name_`|`string`|The display name of the clone|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`identifier`|`bytes32`|The unique identifier for the clone|


### getIdentifier

Build the identifier for a base implementation


```solidity
function getIdentifier(RegistryType type_, string calldata name_) public pure returns (bytes32 identifier);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The base type for the implementation|
|`name_`|`string`|The name of the implementation|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`identifier`|`bytes32`|The unique identifier for the implementation|


### _deployAllowList

Deploy a new {SimpleAllowList} clone and initialize it with the given owner


```solidity
function _deployAllowList(address owner_) internal returns (SimpleAllowList allowList);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner_`|`address`|The address of the owner for the allowList|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`allowList`|`SimpleAllowList`|The address of the deployed allowList|


### _deployAndInitialize

Deploy a new clone of a given implementation with a deterministic salt and initialization payload


```solidity
function _deployAndInitialize(address base_, bytes32 salt_, bytes memory data_) internal returns (Cloneable instance);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`base_`|`address`|The address of the base implementation to clone|
|`salt_`|`bytes32`|The salt to use for deterministic deployment|
|`data_`|`bytes`|The data payload for the cloned instance's initializer|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`instance`|`Cloneable`|The address of the deployed instance|


### _getIdentifier

Build a unique identifier for a given type and hash


```solidity
function _getIdentifier(RegistryType type_, bytes32 hash_) internal pure returns (bytes32 identifier);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The base type for the implementation|
|`hash_`|`bytes32`|The unique hash for the implementation|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`identifier`|`bytes32`|The unique identifier for the implementation|


### _getIdentifier

Build a unique identifier for a given type and name


```solidity
function _getIdentifier(RegistryType type_, string memory name_) internal pure returns (bytes32 identifier);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The base type for the implementation|
|`name_`|`string`|The name of the implementation|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`identifier`|`bytes32`|The unique identifier for the implementation|


## Events
### Registered
Emitted when a new base implementation is registered


```solidity
event Registered(RegistryType indexed registryType, bytes32 indexed identifier, address implementation);
```

### Deployed
Emitted when a new instance of a base implementation is deployed


```solidity
event Deployed(
    RegistryType indexed registryType,
    bytes32 indexed identifier,
    address baseImplementation,
    Cloneable deployedInstance
);
```

## Errors
### AlreadyRegistered
Thrown when a base implementation is already registered


```solidity
error AlreadyRegistered(RegistryType registryType, bytes32 identifier);
```

### NotRegistered
Thrown when no match is found for the given identifier


```solidity
error NotRegistered(bytes32 identifier);
```

### NotCloneable
Thrown when the implementation is not a valid {Cloneable} base


```solidity
error NotCloneable(address implementation);
```

## Structs
### Clone
The data structure for a deployed clone

*The `allowList` is used to restrict access to the clone (i.e. only the allowed addresses can leverage the clone). If it is set to `address(0)`, usage of the clone is unrestricted.*

*The `deployer` is the initial owner of the allowList and can modify it at any time, with the caveat that any in-flight Boosts using the clone will NOT be affected.*


```solidity
struct Clone {
    RegistryType baseType;
    AllowList allowList;
    Cloneable instance;
    address deployer;
    string name;
}
```

**Properties**

|Name|Type|Description|
|----|----|-----------|
|`baseType`|`RegistryType`|The type of base implementation|
|`allowList`|`AllowList`|The allowList for the clone (optional for {Action}, {AllowList} and {Validator} types, required for all {Budget} and {Incentive} types)|
|`instance`|`Cloneable`|The address of the clone|
|`deployer`|`address`|The address of the deployer|
|`name`|`string`|The display name for the clone|

## Enums
### RegistryType
The types of bases that can be registered


```solidity
enum RegistryType {
    ACTION,
    ALLOW_LIST,
    BUDGET,
    INCENTIVE,
    VALIDATOR
}
```

