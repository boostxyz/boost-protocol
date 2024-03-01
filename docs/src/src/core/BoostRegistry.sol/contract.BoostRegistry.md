# BoostRegistry
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/357ec05564a0bb8b723d586652aabcd486962f72/src/core/BoostRegistry.sol)

A registry for base implementations and cloned instances

*This contract is used to register base implementations and deploy new instances of those implementations for use within the Boost protocol*

*TODO: implement ERC-165 `supportsInterface` to validate base implementation interfaces*


## State Variables
### _bases
*The registry of base implementations*


```solidity
EnumerableMap.Bytes32ToAddressMap private _bases;
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

*The given address must implement the given type interface (TODO: enforce this using ERC-165 `supportsInterface`)*


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

*This function will either emit a `Deployed` event and return the instance, or revert the implementation is not registered*


```solidity
function deployClone(RegistryType type_, bytes32 identifier_, bytes32 salt_, bytes calldata data_)
    external
    returns (address instance);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`type_`|`RegistryType`|The type of registry to deploy the instance from|
|`identifier_`|`bytes32`|The unique identifier for the implementation (see `BoostRegistry.getIdentifier`)|
|`salt_`|`bytes32`|The salt to use for deterministic deployment|
|`data_`|`bytes`|The data payload for the deployment|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`instance`|`address`|The address of the deployed instance|


### getBaseImplementation

Get the address of a registered base implementation

*This function will revert if the implementation is not registered*


```solidity
function getBaseImplementation(bytes32 identifier_) public view returns (address implementation);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`identifier_`|`bytes32`|The unique identifier for the implementation (see `BoostRegistry.getIdentifier`)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`implementation`|`address`|The address of the implementation|


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


## Events
### Registered
*Emitted when a new base implementation is registered*


```solidity
event Registered(RegistryType indexed registryType, bytes32 indexed identifier, address implementation);
```

### Deployed
*Emitted when a new instance of a base implementation is deployed*


```solidity
event Deployed(
    RegistryType indexed registryType, bytes32 indexed identifier, address baseImplementation, address deployedInstance
);
```

## Errors
### AlreadyRegistered
*Thrown when a base implementation is already registered*


```solidity
error AlreadyRegistered(RegistryType registryType, bytes32 id);
```

### NotRegistered
*Thrown when no matching base implementation exists*


```solidity
error NotRegistered(bytes32 id);
```

### NotCloneable
*Thrown when the implementation is not a valid {Cloneable} base*


```solidity
error NotCloneable(address implementation);
```

## Enums
### RegistryType
*The types of bases that can be registered*


```solidity
enum RegistryType {
    ACTION,
    ALLOW_LIST,
    BUDGET,
    INCENTIVE,
    VALIDATOR
}
```

