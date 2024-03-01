# MinHeapLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### heap0

```solidity
MinHeapLib.Heap heap0;
```


### heap1

```solidity
MinHeapLib.Heap heap1;
```


## Functions
### testHeapRoot


```solidity
function testHeapRoot(uint256 x) public;
```

### testHeapPushAndPop


```solidity
function testHeapPushAndPop(uint256) public;
```

### testHeapPushPop


```solidity
function testHeapPushPop(uint256) public;
```

### testHeapReplace


```solidity
function testHeapReplace(uint256) public;
```

### testHeapSmallest


```solidity
function testHeapSmallest(uint256) public brutalizeMemory;
```

### testHeapSmallestGas


```solidity
function testHeapSmallestGas() public;
```

### _smallest


```solidity
function _smallest(uint256[] memory a, uint256 n) internal view returns (uint256[] memory result);
```

### _copy


```solidity
function _copy(uint256[] memory a) private view returns (uint256[] memory b);
```

### _min


```solidity
function _min(uint256 a, uint256 b) private pure returns (uint256);
```

### testHeapPSiftTrick


```solidity
function testHeapPSiftTrick(uint256 c, uint256 h, uint256 e) public;
```

### _heapPSiftTrick


```solidity
function _heapPSiftTrick(uint256 c, uint256 h, uint256 e) internal pure returns (uint256 result);
```

### _heapPSiftTrickOriginal


```solidity
function _heapPSiftTrickOriginal(uint256 childPos, uint256 sOffset, uint256 n) internal pure returns (uint256 result);
```

### testHeapEnqueue


```solidity
function testHeapEnqueue(uint256) public;
```

### testHeapEnqueue2


```solidity
function testHeapEnqueue2(uint256) public;
```

### testHeapEnqueueGas


```solidity
function testHeapEnqueueGas() public;
```

