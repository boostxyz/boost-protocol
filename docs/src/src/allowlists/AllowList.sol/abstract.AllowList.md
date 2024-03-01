# AllowList
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/allowlists/AllowList.sol)

**Inherits:**
Ownable, [Cloneable](/src/Cloneable.sol/abstract.Cloneable.md)

Abstract contract for a generic Allow List within the Boost protocol

*Allow List classes are expected to implement the authorization of users based on implementation-specific criteria, which may involve validation of a data payload. If no data is required, calldata should be empty.*


## Functions
### constructor

Constructor to initialize the owner


```solidity
constructor();
```

### isAllowed

Check if a user is authorized


```solidity
function isAllowed(address user_, bytes calldata data_) external view virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`user_`|`address`|The address of the user|
|`data_`|`bytes`|The data payload for the authorization check, if applicable|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the user is authorized|


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


