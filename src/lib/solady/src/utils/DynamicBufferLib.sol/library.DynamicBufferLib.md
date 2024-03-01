# DynamicBufferLib
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/DynamicBuffer.sol), Modified from cozyco (https://github.com/samkingco/cozyco/blob/main/contracts/utils/DynamicBuffer.sol)

Library for buffers with automatic capacity resizing.


## Functions
### reserve

*Reserves at least `minimum` amount of contiguous memory.*


```solidity
function reserve(DynamicBuffer memory buffer, uint256 minimum) internal pure returns (DynamicBuffer memory result);
```

### clear

*Clears the buffer without deallocating the memory.*


```solidity
function clear(DynamicBuffer memory buffer) internal pure returns (DynamicBuffer memory result);
```

### s

*Returns a string pointing to the underlying bytes data.
Note: The string WILL change if the buffer is updated.*


```solidity
function s(DynamicBuffer memory buffer) internal pure returns (string memory);
```

### p

*Appends `data` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(DynamicBuffer memory buffer, bytes memory data) internal pure returns (DynamicBuffer memory result);
```

### p

*Appends `data0`, `data1` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(DynamicBuffer memory buffer, bytes memory data0, bytes memory data1)
    internal
    pure
    returns (DynamicBuffer memory result);
```

### p

*Appends `data0` .. `data2` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(DynamicBuffer memory buffer, bytes memory data0, bytes memory data1, bytes memory data2)
    internal
    pure
    returns (DynamicBuffer memory result);
```

### p

*Appends `data0` .. `data3` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(DynamicBuffer memory buffer, bytes memory data0, bytes memory data1, bytes memory data2, bytes memory data3)
    internal
    pure
    returns (DynamicBuffer memory result);
```

### p

*Appends `data0` .. `data4` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(
    DynamicBuffer memory buffer,
    bytes memory data0,
    bytes memory data1,
    bytes memory data2,
    bytes memory data3,
    bytes memory data4
) internal pure returns (DynamicBuffer memory result);
```

### p

*Appends `data0` .. `data5` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(
    DynamicBuffer memory buffer,
    bytes memory data0,
    bytes memory data1,
    bytes memory data2,
    bytes memory data3,
    bytes memory data4,
    bytes memory data5
) internal pure returns (DynamicBuffer memory result);
```

### p

*Appends `data0` .. `data6` to `buffer`.
Returns the same buffer, so that it can be used for function chaining.*


```solidity
function p(
    DynamicBuffer memory buffer,
    bytes memory data0,
    bytes memory data1,
    bytes memory data2,
    bytes memory data3,
    bytes memory data4,
    bytes memory data5,
    bytes memory data6
) internal pure returns (DynamicBuffer memory result);
```

### _deallocate

*Helper for deallocating a automatically allocated `buffer` pointer.*


```solidity
function _deallocate(DynamicBuffer memory result) private pure;
```

## Structs
### DynamicBuffer
*Type to represent a dynamic buffer in memory.
You can directly assign to `data`, and the `p` function will
take care of the memory allocation.*


```solidity
struct DynamicBuffer {
    bytes data;
}
```

