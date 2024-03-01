# Incentive
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/f2d086cc13d3f2fcf119a54e6ed3b32a354cf098/src/incentives/Incentive.sol)

**Inherits:**
Ownable, [Cloneable](/src/Cloneable.sol/abstract.Cloneable.md)

Abstract contract for a generic Incentive within the Boost protocol

*Incentive classes are expected to decode the calldata for implementation-specific handling. If no data is required, calldata should be empty.*


## Functions
### constructor

Initialize the contract and set the owner

*The owner is set to the contract deployer*


```solidity
constructor();
```

### claim

Claim the incentive


```solidity
function claim(bytes calldata data_) external virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the incentive claim|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the incentive was successfully claimed|


### isClaimable

Check if an incentive is claimable


```solidity
function isClaimable(bytes calldata data_) external view virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the claim check (data, signature, etc.)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the incentive is claimable based on the data payload|


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
### Claimed
Emitted when an incentive is claimed

*The `data` field contains implementation-specific context. See the implementation's `claim` function for details.*


```solidity
event Claimed(address indexed recipient, bytes data);
```

## Errors
### ClaimFailed
Thrown when a claim fails


```solidity
error ClaimFailed();
```

### NotClaimable
Thrown when the incentive is not claimable


```solidity
error NotClaimable();
```

