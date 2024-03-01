# RedBlackTreeLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### tree

```solidity
RedBlackTreeLib.Tree tree;
```


### tree2

```solidity
RedBlackTreeLib.Tree tree2;
```


## Functions
### testRedBlackTreeInsertBenchStep


```solidity
function testRedBlackTreeInsertBenchStep() public;
```

### testRedBlackTreeInsertBenchUint160


```solidity
function testRedBlackTreeInsertBenchUint160() public;
```

### testRedBlackTreeBenchUint160


```solidity
function testRedBlackTreeBenchUint160() public;
```

### testRedBlackTreeInsertBenchUint256


```solidity
function testRedBlackTreeInsertBenchUint256() public;
```

### testRedBlackTreeBenchUint256


```solidity
function testRedBlackTreeBenchUint256() public;
```

### testRedBlackTreeInsertAndRemove


```solidity
function testRedBlackTreeInsertAndRemove(uint256) public;
```

### _testRemoveAndInsertBack


```solidity
function _testRemoveAndInsertBack(uint256[] memory a, uint256 n, uint256 t) internal;
```

### _testIterateTree


```solidity
function _testIterateTree() internal;
```

### _testRedBlackTreeInsertAndRemove


```solidity
function _testRedBlackTreeInsertAndRemove() internal;
```

### testRedBlackTreeInsertAndRemove2


```solidity
function testRedBlackTreeInsertAndRemove2(uint256) public;
```

### _makeArray


```solidity
function _makeArray(uint256 size, uint256 maxCap) internal pure returns (uint256[] memory result);
```

### _makeArray


```solidity
function _makeArray(uint256 size) internal pure returns (uint256[] memory result);
```

### _addToArray


```solidity
function _addToArray(uint256[] memory a, uint256 x) internal pure;
```

### _removeFromArray


```solidity
function _removeFromArray(uint256[] memory a, uint256 x) internal pure;
```

### testRedBlackTreeInsertAndRemove3


```solidity
function testRedBlackTreeInsertAndRemove3() public;
```

### testRedBlackTreeInsertOneGas


```solidity
function testRedBlackTreeInsertOneGas() public;
```

### testRedBlackTreeInsertTwoGas


```solidity
function testRedBlackTreeInsertTwoGas() public;
```

### testRedBlackTreeInsertThreeGas


```solidity
function testRedBlackTreeInsertThreeGas() public;
```

### testRedBlackTreeInsertTenGas


```solidity
function testRedBlackTreeInsertTenGas() public;
```

### testRedBlackTreeValues


```solidity
function testRedBlackTreeValues() public;
```

### testRedBlackTreeValues


```solidity
function testRedBlackTreeValues(uint256 n) public;
```

### testRedBlackTreeRejectsEmptyValue


```solidity
function testRedBlackTreeRejectsEmptyValue() public;
```

### testRedBlackTreeRemoveViaPointer


```solidity
function testRedBlackTreeRemoveViaPointer() public;
```

### testRedBlackTreeTryInsertAndRemove


```solidity
function testRedBlackTreeTryInsertAndRemove() public;
```

### testRedBlackTreeTreeFullReverts


```solidity
function testRedBlackTreeTreeFullReverts() public;
```

### testRedBlackTreePointers


```solidity
function testRedBlackTreePointers() public;
```

### testRedBlackTreeNearest


```solidity
function testRedBlackTreeNearest(uint256) public;
```

### _nearestIndex


```solidity
function _nearestIndex(uint256[] memory a, uint256 x) internal pure returns (uint256 nearestIndex, bool found);
```

### testRedBlackTreeNearestBefore


```solidity
function testRedBlackTreeNearestBefore(uint256) public;
```

### _nearestIndexBefore


```solidity
function _nearestIndexBefore(uint256[] memory a, uint256 x) internal pure returns (uint256 nearestIndex, bool found);
```

### testRedBlackTreeNearestAfter


```solidity
function testRedBlackTreeNearestAfter(uint256) public;
```

### _nearestIndexAfter


```solidity
function _nearestIndexAfter(uint256[] memory a, uint256 x) internal pure returns (uint256 nearestIndex, bool found);
```

### _fillTree


```solidity
function _fillTree(uint256 n) internal returns (uint256[] memory a);
```

