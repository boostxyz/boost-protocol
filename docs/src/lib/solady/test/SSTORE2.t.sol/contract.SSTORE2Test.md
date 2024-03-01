# SSTORE2Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testWriteRead


```solidity
function testWriteRead() public;
```

### testWriteReadFullStartBound


```solidity
function testWriteReadFullStartBound() public;
```

### testWriteReadCustomStartBound


```solidity
function testWriteReadCustomStartBound() public;
```

### testWriteReadFullBoundedRead


```solidity
function testWriteReadFullBoundedRead() public;
```

### testWriteReadCustomBounds


```solidity
function testWriteReadCustomBounds() public;
```

### testWriteReadEmptyBound


```solidity
function testWriteReadEmptyBound() public;
```

### testReadInvalidPointerReverts


```solidity
function testReadInvalidPointerReverts() public;
```

### testReadInvalidPointerCustomStartBoundReverts


```solidity
function testReadInvalidPointerCustomStartBoundReverts() public;
```

### testReadInvalidPointerCustomBoundsReverts


```solidity
function testReadInvalidPointerCustomBoundsReverts() public;
```

### testWriteReadOutOfStartBoundReverts


```solidity
function testWriteReadOutOfStartBoundReverts() public;
```

### testWriteReadEmptyOutOfBoundsReverts


```solidity
function testWriteReadEmptyOutOfBoundsReverts() public;
```

### testWriteReadOutOfBoundsReverts


```solidity
function testWriteReadOutOfBoundsReverts() public;
```

### testWriteRead


```solidity
function testWriteRead(bytes calldata testBytes) public brutalizeMemory;
```

### testWriteReadCustomStartBound


```solidity
function testWriteReadCustomStartBound(bytes calldata testBytes, uint256 startIndex) public brutalizeMemory;
```

### testWriteReadCustomBounds


```solidity
function testWriteReadCustomBounds(bytes calldata testBytes, uint256 startIndex, uint256 endIndex)
    public
    brutalizeMemory;
```

### testReadInvalidPointerRevert


```solidity
function testReadInvalidPointerRevert(address pointer) public brutalizeMemory;
```

### testReadInvalidPointerCustomStartBoundReverts


```solidity
function testReadInvalidPointerCustomStartBoundReverts(address pointer, uint256 startIndex) public brutalizeMemory;
```

### testReadInvalidPointerCustomBoundsReverts


```solidity
function testReadInvalidPointerCustomBoundsReverts(address pointer, uint256 startIndex, uint256 endIndex)
    public
    brutalizeMemory;
```

### testWriteReadCustomStartBoundOutOfRangeReverts


```solidity
function testWriteReadCustomStartBoundOutOfRangeReverts(bytes calldata testBytes, uint256 startIndex)
    public
    brutalizeMemory;
```

### testWriteReadCustomBoundsOutOfRangeReverts


```solidity
function testWriteReadCustomBoundsOutOfRangeReverts(bytes calldata testBytes, uint256 startIndex, uint256 endIndex)
    public
    brutalizeMemory;
```

### testWriteReadDeterministic


```solidity
function testWriteReadDeterministic(bytes calldata testBytes) public brutalizeMemory;
```

### testWriteWithTooBigDataReverts


```solidity
function testWriteWithTooBigDataReverts() public;
```

### write


```solidity
function write(bytes memory data) public returns (address);
```

### _dummyData


```solidity
function _dummyData(uint256 n) internal pure returns (bytes memory result);
```

