# Checkpoints
*This library defines the `Trace*` struct, for checkpointing values as they change at different points in
time, and later looking up past values by block number. See {Votes} as an example.
To create a history of checkpoints define a variable type `Checkpoints.Trace*` in your contract, and store a new
checkpoint for the current transaction block using the {push} function.*


## Functions
### push

*Pushes a (`key`, `value`) pair into a Trace224 so that it is stored as the checkpoint.
Returns previous value and new value.
IMPORTANT: Never accept `key` as a user input, since an arbitrary `type(uint32).max` key set will disable the
library.*


```solidity
function push(Trace224 storage self, uint32 key, uint224 value) internal returns (uint224, uint224);
```

### lowerLookup

*Returns the value in the first (oldest) checkpoint with key greater or equal than the search key, or zero if
there is none.*


```solidity
function lowerLookup(Trace224 storage self, uint32 key) internal view returns (uint224);
```

### upperLookup

*Returns the value in the last (most recent) checkpoint with key lower or equal than the search key, or zero
if there is none.*


```solidity
function upperLookup(Trace224 storage self, uint32 key) internal view returns (uint224);
```

### upperLookupRecent

*Returns the value in the last (most recent) checkpoint with key lower or equal than the search key, or zero
if there is none.
NOTE: This is a variant of [upperLookup](/lib/openzeppelin-contracts/contracts/utils/structs/Checkpoints.sol/library.Checkpoints.md#upperlookup) that is optimised to find "recent" checkpoint (checkpoints with high
keys).*


```solidity
function upperLookupRecent(Trace224 storage self, uint32 key) internal view returns (uint224);
```

### latest

*Returns the value in the most recent checkpoint, or zero if there are no checkpoints.*


```solidity
function latest(Trace224 storage self) internal view returns (uint224);
```

### latestCheckpoint

*Returns whether there is a checkpoint in the structure (i.e. it is not empty), and if so the key and value
in the most recent checkpoint.*


```solidity
function latestCheckpoint(Trace224 storage self) internal view returns (bool exists, uint32 _key, uint224 _value);
```

### length

*Returns the number of checkpoint.*


```solidity
function length(Trace224 storage self) internal view returns (uint256);
```

### at

*Returns checkpoint at given position.*


```solidity
function at(Trace224 storage self, uint32 pos) internal view returns (Checkpoint224 memory);
```

### _insert

*Pushes a (`key`, `value`) pair into an ordered list of checkpoints, either by inserting a new checkpoint,
or by updating the last one.*


```solidity
function _insert(Checkpoint224[] storage self, uint32 key, uint224 value) private returns (uint224, uint224);
```

### _upperBinaryLookup

*Return the index of the last (most recent) checkpoint with key lower or equal than the search key, or `high`
if there is none. `low` and `high` define a section where to do the search, with inclusive `low` and exclusive
`high`.
WARNING: `high` should not be greater than the array's length.*


```solidity
function _upperBinaryLookup(Checkpoint224[] storage self, uint32 key, uint256 low, uint256 high)
    private
    view
    returns (uint256);
```

### _lowerBinaryLookup

*Return the index of the first (oldest) checkpoint with key is greater or equal than the search key, or
`high` if there is none. `low` and `high` define a section where to do the search, with inclusive `low` and
exclusive `high`.
WARNING: `high` should not be greater than the array's length.*


```solidity
function _lowerBinaryLookup(Checkpoint224[] storage self, uint32 key, uint256 low, uint256 high)
    private
    view
    returns (uint256);
```

### _unsafeAccess

*Access an element of the array without performing bounds check. The position is assumed to be within bounds.*


```solidity
function _unsafeAccess(Checkpoint224[] storage self, uint256 pos) private pure returns (Checkpoint224 storage result);
```

### push

*Pushes a (`key`, `value`) pair into a Trace208 so that it is stored as the checkpoint.
Returns previous value and new value.
IMPORTANT: Never accept `key` as a user input, since an arbitrary `type(uint48).max` key set will disable the
library.*


```solidity
function push(Trace208 storage self, uint48 key, uint208 value) internal returns (uint208, uint208);
```

### lowerLookup

*Returns the value in the first (oldest) checkpoint with key greater or equal than the search key, or zero if
there is none.*


```solidity
function lowerLookup(Trace208 storage self, uint48 key) internal view returns (uint208);
```

### upperLookup

*Returns the value in the last (most recent) checkpoint with key lower or equal than the search key, or zero
if there is none.*


```solidity
function upperLookup(Trace208 storage self, uint48 key) internal view returns (uint208);
```

### upperLookupRecent

*Returns the value in the last (most recent) checkpoint with key lower or equal than the search key, or zero
if there is none.
NOTE: This is a variant of [upperLookup](/lib/openzeppelin-contracts/contracts/utils/structs/Checkpoints.sol/library.Checkpoints.md#upperlookup) that is optimised to find "recent" checkpoint (checkpoints with high
keys).*


```solidity
function upperLookupRecent(Trace208 storage self, uint48 key) internal view returns (uint208);
```

### latest

*Returns the value in the most recent checkpoint, or zero if there are no checkpoints.*


```solidity
function latest(Trace208 storage self) internal view returns (uint208);
```

### latestCheckpoint

*Returns whether there is a checkpoint in the structure (i.e. it is not empty), and if so the key and value
in the most recent checkpoint.*


```solidity
function latestCheckpoint(Trace208 storage self) internal view returns (bool exists, uint48 _key, uint208 _value);
```

### length

*Returns the number of checkpoint.*


```solidity
function length(Trace208 storage self) internal view returns (uint256);
```

### at

*Returns checkpoint at given position.*


```solidity
function at(Trace208 storage self, uint32 pos) internal view returns (Checkpoint208 memory);
```

### _insert

*Pushes a (`key`, `value`) pair into an ordered list of checkpoints, either by inserting a new checkpoint,
or by updating the last one.*


```solidity
function _insert(Checkpoint208[] storage self, uint48 key, uint208 value) private returns (uint208, uint208);
```

### _upperBinaryLookup

*Return the index of the last (most recent) checkpoint with key lower or equal than the search key, or `high`
if there is none. `low` and `high` define a section where to do the search, with inclusive `low` and exclusive
`high`.
WARNING: `high` should not be greater than the array's length.*


```solidity
function _upperBinaryLookup(Checkpoint208[] storage self, uint48 key, uint256 low, uint256 high)
    private
    view
    returns (uint256);
```

### _lowerBinaryLookup

*Return the index of the first (oldest) checkpoint with key is greater or equal than the search key, or
`high` if there is none. `low` and `high` define a section where to do the search, with inclusive `low` and
exclusive `high`.
WARNING: `high` should not be greater than the array's length.*


```solidity
function _lowerBinaryLookup(Checkpoint208[] storage self, uint48 key, uint256 low, uint256 high)
    private
    view
    returns (uint256);
```

### _unsafeAccess

*Access an element of the array without performing bounds check. The position is assumed to be within bounds.*


```solidity
function _unsafeAccess(Checkpoint208[] storage self, uint256 pos) private pure returns (Checkpoint208 storage result);
```

### push

*Pushes a (`key`, `value`) pair into a Trace160 so that it is stored as the checkpoint.
Returns previous value and new value.
IMPORTANT: Never accept `key` as a user input, since an arbitrary `type(uint96).max` key set will disable the
library.*


```solidity
function push(Trace160 storage self, uint96 key, uint160 value) internal returns (uint160, uint160);
```

### lowerLookup

*Returns the value in the first (oldest) checkpoint with key greater or equal than the search key, or zero if
there is none.*


```solidity
function lowerLookup(Trace160 storage self, uint96 key) internal view returns (uint160);
```

### upperLookup

*Returns the value in the last (most recent) checkpoint with key lower or equal than the search key, or zero
if there is none.*


```solidity
function upperLookup(Trace160 storage self, uint96 key) internal view returns (uint160);
```

### upperLookupRecent

*Returns the value in the last (most recent) checkpoint with key lower or equal than the search key, or zero
if there is none.
NOTE: This is a variant of [upperLookup](/lib/openzeppelin-contracts/contracts/utils/structs/Checkpoints.sol/library.Checkpoints.md#upperlookup) that is optimised to find "recent" checkpoint (checkpoints with high
keys).*


```solidity
function upperLookupRecent(Trace160 storage self, uint96 key) internal view returns (uint160);
```

### latest

*Returns the value in the most recent checkpoint, or zero if there are no checkpoints.*


```solidity
function latest(Trace160 storage self) internal view returns (uint160);
```

### latestCheckpoint

*Returns whether there is a checkpoint in the structure (i.e. it is not empty), and if so the key and value
in the most recent checkpoint.*


```solidity
function latestCheckpoint(Trace160 storage self) internal view returns (bool exists, uint96 _key, uint160 _value);
```

### length

*Returns the number of checkpoint.*


```solidity
function length(Trace160 storage self) internal view returns (uint256);
```

### at

*Returns checkpoint at given position.*


```solidity
function at(Trace160 storage self, uint32 pos) internal view returns (Checkpoint160 memory);
```

### _insert

*Pushes a (`key`, `value`) pair into an ordered list of checkpoints, either by inserting a new checkpoint,
or by updating the last one.*


```solidity
function _insert(Checkpoint160[] storage self, uint96 key, uint160 value) private returns (uint160, uint160);
```

### _upperBinaryLookup

*Return the index of the last (most recent) checkpoint with key lower or equal than the search key, or `high`
if there is none. `low` and `high` define a section where to do the search, with inclusive `low` and exclusive
`high`.
WARNING: `high` should not be greater than the array's length.*


```solidity
function _upperBinaryLookup(Checkpoint160[] storage self, uint96 key, uint256 low, uint256 high)
    private
    view
    returns (uint256);
```

### _lowerBinaryLookup

*Return the index of the first (oldest) checkpoint with key is greater or equal than the search key, or
`high` if there is none. `low` and `high` define a section where to do the search, with inclusive `low` and
exclusive `high`.
WARNING: `high` should not be greater than the array's length.*


```solidity
function _lowerBinaryLookup(Checkpoint160[] storage self, uint96 key, uint256 low, uint256 high)
    private
    view
    returns (uint256);
```

### _unsafeAccess

*Access an element of the array without performing bounds check. The position is assumed to be within bounds.*


```solidity
function _unsafeAccess(Checkpoint160[] storage self, uint256 pos) private pure returns (Checkpoint160 storage result);
```

## Errors
### CheckpointUnorderedInsertion
*A value was attempted to be inserted on a past checkpoint.*


```solidity
error CheckpointUnorderedInsertion();
```

## Structs
### Trace224

```solidity
struct Trace224 {
    Checkpoint224[] _checkpoints;
}
```

### Checkpoint224

```solidity
struct Checkpoint224 {
    uint32 _key;
    uint224 _value;
}
```

### Trace208

```solidity
struct Trace208 {
    Checkpoint208[] _checkpoints;
}
```

### Checkpoint208

```solidity
struct Checkpoint208 {
    uint48 _key;
    uint208 _value;
}
```

### Trace160

```solidity
struct Trace160 {
    Checkpoint160[] _checkpoints;
}
```

### Checkpoint160

```solidity
struct Checkpoint160 {
    uint96 _key;
    uint160 _value;
}
```

