# CheckpointsTrace160Test
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### _KEY_MAX_GAP

```solidity
uint8 internal constant _KEY_MAX_GAP = 64;
```


### _ckpts

```solidity
Checkpoints.Trace160 internal _ckpts;
```


## Functions
### _boundUint96


```solidity
function _boundUint96(uint96 x, uint96 min, uint96 max) internal pure returns (uint96);
```

### _prepareKeys


```solidity
function _prepareKeys(uint96[] memory keys, uint96 maxSpread) internal pure;
```

### _assertLatestCheckpoint


```solidity
function _assertLatestCheckpoint(bool exist, uint96 key, uint160 value) internal;
```

### testPush


```solidity
function testPush(uint96[] memory keys, uint160[] memory values, uint96 pastKey) public;
```

### push


```solidity
function push(uint96 key, uint160 value) external;
```

### testLookup


```solidity
function testLookup(uint96[] memory keys, uint160[] memory values, uint96 lookup) public;
```

