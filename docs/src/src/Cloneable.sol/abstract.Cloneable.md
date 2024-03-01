# Cloneable
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/f2d086cc13d3f2fcf119a54e6ed3b32a354cf098/src/Cloneable.sol)

**Inherits:**
Initializable, ERC165

A contract that can be cloned and initialized only once


## Functions
### initialize

Initialize the clone with the given arbitrary data

*The data is expected to be ABI encoded bytes compressed using [LibZip-cdCompress](/lib/solady/src/utils/LibZip.sol/library.LibZip.md#cdcompress)*

*All implementations must override this function to initialize the contract*


```solidity
function initialize(bytes calldata) external virtual initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes`||


### supportsInterface

Check if the contract supports the given interface

*See {IERC165-supportsInterface}.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`interfaceId`|`bytes4`|The interface identifier|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the contract supports the interface|


## Errors
### InitializerNotImplemented
Thrown when an inheriting contract does not implement the initializer function


```solidity
error InitializerNotImplemented();
```

### InvalidInitializationData
Thrown when the provided initialization data is invalid

*This error indicates that the given data is not valid for the implementation (i.e. does not decode to the expected types)*


```solidity
error InvalidInitializationData();
```

