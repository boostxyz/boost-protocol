# Validator
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/00a29d18bb9e82e36d30703c29f8dfdef1d915df/src/validators/Validator.sol)

**Inherits:**
Ownable, [Cloneable](/src/Cloneable.sol/abstract.Cloneable.md)

Abstract contract for a generic Validator within the Boost protocol

*Validator classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.*


## Functions
### constructor

Initialize the contract and set the owner

*The owner is set to the contract deployer*


```solidity
constructor();
```

### validate

Validate that the action has been completed successfully


```solidity
function validate(bytes calldata data_) external virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the validation check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the action has been validated based on the data payload|


### supportsInterface

Check if the contract supports the given interface


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`interfaceId`|`bytes4`|The interface identifier|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the contract supports the interface|


