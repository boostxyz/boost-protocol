# CheckpointsTrace208Test
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### _KEY_MAX_GAP

```solidity
uint8 internal constant _KEY_MAX_GAP = 64;
```


### _ckpts

```solidity
Checkpoints.Trace208 internal _ckpts;
```


## Functions
### _boundUint48


```solidity
function _boundUint48(uint48 x, uint48 min, uint48 max) internal pure returns (uint48);
```

### _prepareKeys


```solidity
function _prepareKeys(uint48[] memory keys, uint48 maxSpread) internal pure;
```

### _assertLatestCheckpoint


```solidity
function _assertLatestCheckpoint(bool exist, uint48 key, uint208 value) internal;
```

### testPush


```solidity
function testPush(uint48[] memory keys, uint208[] memory values, uint48 pastKey) public;
```

### push


```solidity
function push(uint48 key, uint208 value) external;
```

### testLookup


```solidity
function testLookup(uint48[] memory keys, uint208[] memory values, uint48 lookup) public;
```

