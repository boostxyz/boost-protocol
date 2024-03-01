# SimpleAllowList
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/allowlists/SimpleAllowList.sol)

**Inherits:**
[AllowList](/src/allowlists/AllowList.sol/abstract.AllowList.md)

A simple implementation of an AllowList that checks if a user is authorized based on a list of allowed addresses


## State Variables
### _allowed
*An internal mapping of allowed statuses*


```solidity
mapping(address => bool) private _allowed;
```


## Functions
### constructor

Construct a new SimpleAllowList

*Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the [initialize](/src/allowlists/SimpleAllowList.sol/contract.SimpleAllowList.md#initialize) function.*


```solidity
constructor();
```

### initialize

Initialize the contract with the list of authorized signers


```solidity
function initialize(bytes calldata data_) external virtual override initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed initialization data `(address owner, address[] allowList, bool[] allowed)`|


### isAllowed

Check if a user is authorized


```solidity
function isAllowed(address user_, bytes calldata) external view override returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user_`|`address`|The address of the user|
|`<none>`|`bytes`||

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the user is authorized|


### setAllowed

Set the allowed status of a user

*The length of the `users_` and `allowed_` arrays must be the same*

*This function can only be called by the owner*


```solidity
function setAllowed(address[] calldata users_, bool[] calldata allowed_) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`users_`|`address[]`|The list of users to update|
|`allowed_`|`bool[]`|The allowed status of each user|


