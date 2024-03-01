# DynamicBufferLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testClear


```solidity
function testClear(uint256) public;
```

### testDynamicBufferReserveFromEmpty


```solidity
function testDynamicBufferReserveFromEmpty() public;
```

### testDynamicBufferReserveFromEmpty2


```solidity
function testDynamicBufferReserveFromEmpty2() public;
```

### testDynamicBufferReserveFromEmpty3


```solidity
function testDynamicBufferReserveFromEmpty3(bytes calldata b, uint256 t) public;
```

### _incrementFreeMemoryPointer


```solidity
function _incrementFreeMemoryPointer() internal pure;
```

### _freeMemoryPointer


```solidity
function _freeMemoryPointer() internal pure returns (uint256 m);
```

### _bufferLocation


```solidity
function _bufferLocation(DynamicBufferLib.DynamicBuffer memory buffer) internal pure returns (uint256 result);
```

### testDynamicBuffer


```solidity
function testDynamicBuffer(uint256) public brutalizeMemory;
```

### _generateRandomBytes


```solidity
function _generateRandomBytes(uint256 n, uint256 seed) internal pure returns (bytes memory result);
```

### testDynamicBuffer


```solidity
function testDynamicBuffer(bytes[] memory inputs, uint256 t) public brutalizeMemory;
```

### testJoinWithConcat


```solidity
function testJoinWithConcat() public;
```

### testJoinWithDynamicBuffer


```solidity
function testJoinWithDynamicBuffer() public;
```

### testDynamicBufferChaining


```solidity
function testDynamicBufferChaining() public;
```

### _checkSamePointers


```solidity
function _checkSamePointers(DynamicBufferLib.DynamicBuffer memory a, DynamicBufferLib.DynamicBuffer memory b)
    internal;
```

### _getChunks


```solidity
function _getChunks() internal pure returns (bytes[] memory chunks, bytes32 joinedHash);
```

### _boundInputs


```solidity
function _boundInputs(bytes[] memory inputs) internal pure;
```

