# Action
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/00a29d18bb9e82e36d30703c29f8dfdef1d915df/src/actions/Action.sol)

**Inherits:**
[Cloneable](/src/Cloneable.sol/abstract.Cloneable.md)

Abstract contract for a generic Action within the Boost protocol

*Action classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.*


## State Variables
### VALIDATOR
The validator for the action (which may be the action itself where appropriate)


```solidity
Validator public immutable VALIDATOR;
```


## Functions
### execute

Execute the action


```solidity
function execute(bytes calldata data_) external payable virtual returns (bool, bytes memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the action|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|(success, data) A tuple of the success status and the returned data|
|`<none>`|`bytes`||


### prepare

Prepare the action for execution and return the expected payload


```solidity
function prepare(bytes calldata data_) external virtual returns (bytes memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the action|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes`|The prepared payload|


### validate

Validate that the action has been completed successfully

*It is the responsibility of the validator to unpack the data and perform the validation*


```solidity
function validate(bytes calldata data_) external virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the action|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the action has been validated for the user|


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


## Events
### ActionExecuted
Emitted when the action is executed by a proxy.

*The `data` field should contain the return data from the action, if any.*


```solidity
event ActionExecuted(address indexed executor, address caller, bool success, bytes data);
```

### ActionValidated
Emitted when the action is validated

*The `data` field should contain implementation-specific context, if applicable.*


```solidity
event ActionValidated(address indexed user, bool isValidated, bytes data);
```

## Errors
### ExecuteNotImplemented
Thrown when the `execute` function is not implemented


```solidity
error ExecuteNotImplemented();
```

