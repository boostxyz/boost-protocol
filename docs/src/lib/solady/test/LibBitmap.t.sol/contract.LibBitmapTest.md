# LibBitmapTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### bitmap

```solidity
LibBitmap.Bitmap bitmap;
```


## Functions
### get


```solidity
function get(uint256 index) public view returns (bool result);
```

### set


```solidity
function set(uint256 index) public;
```

### unset


```solidity
function unset(uint256 index) public;
```

### toggle


```solidity
function toggle(uint256 index) public;
```

### setTo


```solidity
function setTo(uint256 index, bool shouldSet) public;
```

### claimWithGetSet


```solidity
function claimWithGetSet(uint256 index) public;
```

### claimWithToggle


```solidity
function claimWithToggle(uint256 index) public;
```

### testBitmapGet


```solidity
function testBitmapGet() public;
```

### testBitmapGet


```solidity
function testBitmapGet(uint256 index) public;
```

### testBitmapSetAndGet


```solidity
function testBitmapSetAndGet(uint256 index) public;
```

### testBitmapSet


```solidity
function testBitmapSet() public;
```

### testBitmapSet


```solidity
function testBitmapSet(uint256 index) public;
```

### testBitmapUnset


```solidity
function testBitmapUnset() public;
```

### testBitmapUnset


```solidity
function testBitmapUnset(uint256 index) public;
```

### testBitmapSetTo


```solidity
function testBitmapSetTo() public;
```

### testBitmapSetTo


```solidity
function testBitmapSetTo(uint256 index, bool shouldSet, uint256 randomness) public;
```

### testBitmapSetTo


```solidity
function testBitmapSetTo(uint256 index, uint256 randomness) public;
```

### testBitmapToggle


```solidity
function testBitmapToggle() public;
```

### testBitmapToggle


```solidity
function testBitmapToggle(uint256 index, bool initialValue) public;
```

### testBitmapClaimWithGetSet


```solidity
function testBitmapClaimWithGetSet() public;
```

### testBitmapClaimWithToggle


```solidity
function testBitmapClaimWithToggle() public;
```

### testBitmapSetBatchWithinSingleBucket


```solidity
function testBitmapSetBatchWithinSingleBucket() public;
```

### testBitmapSetBatchAcrossMultipleBuckets


```solidity
function testBitmapSetBatchAcrossMultipleBuckets() public;
```

### testBitmapSetBatch


```solidity
function testBitmapSetBatch() public;
```

### testBitmapUnsetBatchWithinSingleBucket


```solidity
function testBitmapUnsetBatchWithinSingleBucket() public;
```

### testBitmapUnsetBatchAcrossMultipleBuckets


```solidity
function testBitmapUnsetBatchAcrossMultipleBuckets() public;
```

### testBitmapUnsetBatch


```solidity
function testBitmapUnsetBatch() public;
```

### testBitmapPopCountWithinSingleBucket


```solidity
function testBitmapPopCountWithinSingleBucket() public;
```

### testBitmapPopCountAcrossMultipleBuckets


```solidity
function testBitmapPopCountAcrossMultipleBuckets() public;
```

### testBitmapPopCount


```solidity
function testBitmapPopCount(uint256, uint256 start, uint256 amount) public;
```

### testBitmapPopCount


```solidity
function testBitmapPopCount() public;
```

### testBitmapFindLastSet


```solidity
function testBitmapFindLastSet() public;
```

### testBitmapFindLastSet


```solidity
function testBitmapFindLastSet(uint256 before, uint256 randomness) public;
```

### _testBitmapSetBatch


```solidity
function _testBitmapSetBatch(uint256 start, uint256 amount) internal;
```

### _testBitmapUnsetBatch


```solidity
function _testBitmapUnsetBatch(uint256 start, uint256 amount) internal;
```

### _testBitmapPopCount


```solidity
function _testBitmapPopCount(uint256 start, uint256 amount) internal;
```

### _boundStartAndAmount


```solidity
function _boundStartAndAmount(uint256 start, uint256 amount, uint256 n)
    private
    pure
    returns (uint256 boundedStart, uint256 boundedAmount);
```

### _resetBitmap


```solidity
function _resetBitmap(uint256 bucketValue, uint256 bucketEnd) private;
```

## Errors
### AlreadyClaimed

```solidity
error AlreadyClaimed();
```

