# CheckpointsTrace224Test
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### _KEY_MAX_GAP

```solidity
uint8 internal constant _KEY_MAX_GAP = 64;
```


### _ckpts

```solidity
Checkpoints.Trace224 internal _ckpts;
```


## Functions
### _boundUint32


```solidity
function _boundUint32(uint32 x, uint32 min, uint32 max) internal pure returns (uint32);
```

### _prepareKeys


```solidity
function _prepareKeys(uint32[] memory keys, uint32 maxSpread) internal pure;
```

### _assertLatestCheckpoint


```solidity
function _assertLatestCheckpoint(bool exist, uint32 key, uint224 value) internal;
```

### testPush


```solidity
function testPush(uint32[] memory keys, uint224[] memory values, uint32 pastKey) public;
```

### push


```solidity
function push(uint32 key, uint224 value) external;
```

### testLookup


```solidity
function testLookup(uint32[] memory keys, uint224[] memory values, uint32 lookup) public;
```

