# RedBlackTreeLib
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/RedBlackTreeLib.sol), Modified from BokkyPooBahsRedBlackTreeLibrary (https://github.com/bokkypoobah/BokkyPooBahsRedBlackTreeLibrary)

Library for managing a red-black-tree in storage.

*This implementation does not support the zero (i.e. empty) value.
This implementation supports up to 2147483647 values.*


## State Variables
### ERROR_VALUE_ALREADY_EXISTS
*`bytes4(keccak256(bytes("ValueAlreadyExists()")))`.*


```solidity
uint256 internal constant ERROR_VALUE_ALREADY_EXISTS = 0xbb33e6ac;
```


### ERROR_VALUE_DOES_NOT_EXISTS
*`bytes4(keccak256(bytes("ValueDoesNotExist()")))`.*


```solidity
uint256 internal constant ERROR_VALUE_DOES_NOT_EXISTS = 0xb113638a;
```


### ERROR_POINTER_OUT_OF_BOUNDS
*`bytes4(keccak256(bytes("PointerOutOfBounds()")))`.*


```solidity
uint256 internal constant ERROR_POINTER_OUT_OF_BOUNDS = 0xccd52fbc;
```


### ERROR_TREE_IS_FULL
*`bytes4(keccak256(bytes("TreeIsFull()")))`.*


```solidity
uint256 internal constant ERROR_TREE_IS_FULL = 0xed732d0c;
```


### _NODES_SLOT_SEED

```solidity
uint256 private constant _NODES_SLOT_SEED = 0x1dc27bb5462fdadcb;
```


### _NODES_SLOT_SHIFT

```solidity
uint256 private constant _NODES_SLOT_SHIFT = 32;
```


### _BITMASK_KEY

```solidity
uint256 private constant _BITMASK_KEY = (1 << 31) - 1;
```


### _BITPOS_LEFT

```solidity
uint256 private constant _BITPOS_LEFT = 0;
```


### _BITPOS_RIGHT

```solidity
uint256 private constant _BITPOS_RIGHT = 31;
```


### _BITPOS_PARENT

```solidity
uint256 private constant _BITPOS_PARENT = 31 * 2;
```


### _BITPOS_RED

```solidity
uint256 private constant _BITPOS_RED = 31 * 3;
```


### _BITMASK_RED

```solidity
uint256 private constant _BITMASK_RED = 1 << (31 * 3);
```


### _BITPOS_PACKED_VALUE

```solidity
uint256 private constant _BITPOS_PACKED_VALUE = 96;
```


### _BITMASK_PACKED_VALUE

```solidity
uint256 private constant _BITMASK_PACKED_VALUE = (1 << 160) - 1;
```


### _BIT_FULL_VALUE_SLOT

```solidity
uint256 private constant _BIT_FULL_VALUE_SLOT = 1 << 31;
```


## Functions
### size

*Returns the number of unique values in the tree.*


```solidity
function size(Tree storage tree) internal view returns (uint256 result);
```

### values

*Returns an array of all the values in the tree in ascending sorted order.
WARNING! This function can exhaust the block gas limit if the tree is big.
It is intended for usage in off-chain view functions.*


```solidity
function values(Tree storage tree) internal view returns (uint256[] memory result);
```

### find

*Returns a pointer to the value `x`.
If the value `x` is not in the tree, the returned pointer will be empty.*


```solidity
function find(Tree storage tree, uint256 x) internal view returns (bytes32 result);
```

### nearest

*Returns a pointer to the nearest value to `x`.
In a tie-breaker, the returned pointer will point to the smaller value.
If the tree is empty, the returned pointer will be empty.*


```solidity
function nearest(Tree storage tree, uint256 x) internal view returns (bytes32 result);
```

### nearestBefore

*Returns a pointer to the nearest value lesser or equal to `x`.
If there is no value lesser or equal to `x`, the returned pointer will be empty.*


```solidity
function nearestBefore(Tree storage tree, uint256 x) internal view returns (bytes32 result);
```

### nearestAfter

*Returns a pointer to the nearest value greater or equal to `x`.
If there is no value greater or equal to `x`, the returned pointer will be empty.*


```solidity
function nearestAfter(Tree storage tree, uint256 x) internal view returns (bytes32 result);
```

### exists

*Returns whether the value `x` exists.*


```solidity
function exists(Tree storage tree, uint256 x) internal view returns (bool result);
```

### insert

*Inserts the value `x` into the tree.
Reverts if the value `x` already exists.*


```solidity
function insert(Tree storage tree, uint256 x) internal;
```

### tryInsert

*Inserts the value `x` into the tree.
Returns a non-zero error code upon failure instead of reverting
(except for reverting if `x` is an empty value).*


```solidity
function tryInsert(Tree storage tree, uint256 x) internal returns (uint256 err);
```

### remove

*Removes the value `x` from the tree.
Reverts if the value does not exist.*


```solidity
function remove(Tree storage tree, uint256 x) internal;
```

### tryRemove

*Removes the value `x` from the tree.
Returns a non-zero error code upon failure instead of reverting
(except for reverting if `x` is an empty value).*


```solidity
function tryRemove(Tree storage tree, uint256 x) internal returns (uint256 err);
```

### remove

*Removes the value at pointer `ptr` from the tree.
Reverts if `ptr` is empty (i.e. value does not exist),
or if `ptr` is out of bounds.
After removal, `ptr` may point to another existing value.
For safety, do not reuse `ptr` after calling remove on it.*


```solidity
function remove(bytes32 ptr) internal;
```

### tryRemove

*Removes the value at pointer `ptr` from the tree.
Returns a non-zero error code upon failure instead of reverting.*


```solidity
function tryRemove(bytes32 ptr) internal returns (uint256 err);
```

### value

*Returns the value at pointer `ptr`.
If `ptr` is empty, the result will be zero.*


```solidity
function value(bytes32 ptr) internal view returns (uint256 result);
```

### first

*Returns a pointer to the smallest value in the tree.
If the tree is empty, the returned pointer will be empty.*


```solidity
function first(Tree storage tree) internal view returns (bytes32 result);
```

### last

*Returns a pointer to the largest value in the tree.
If the tree is empty, the returned pointer will be empty.*


```solidity
function last(Tree storage tree) internal view returns (bytes32 result);
```

### next

*Returns the pointer to the next largest value.
If there is no next value, or if `ptr` is empty,
the returned pointer will be empty.*


```solidity
function next(bytes32 ptr) internal view returns (bytes32 result);
```

### prev

*Returns the pointer to the next smallest value.
If there is no previous value, or if `ptr` is empty,
the returned pointer will be empty.*


```solidity
function prev(bytes32 ptr) internal view returns (bytes32 result);
```

### isEmpty

*Returns whether the pointer is empty.*


```solidity
function isEmpty(bytes32 ptr) internal pure returns (bool result);
```

### _unpack

*Unpacks the pointer `ptr` to its components.*


```solidity
function _unpack(bytes32 ptr) private pure returns (uint256 nodes, uint256 key);
```

### _pack

*Packs `nodes` and `key` into a single pointer.*


```solidity
function _pack(uint256 nodes, uint256 key) private pure returns (bytes32 result);
```

### _end

*Returns the pointer to either end of the tree.*


```solidity
function _end(Tree storage tree, uint256 L) private view returns (bytes32 result);
```

### _step

*Step the pointer `ptr` forwards or backwards.*


```solidity
function _step(bytes32 ptr, uint256 L, uint256 R) private view returns (bytes32 result);
```

### _update

*Inserts or delete the value `x` from the tree.*


```solidity
function _update(uint256 nodes, uint256 cursor, uint256 key, uint256 x, uint256 mode) private returns (uint256 err);
```

### _nodes

*Returns the pointer to the `nodes` for the tree.*


```solidity
function _nodes(Tree storage tree) private pure returns (uint256 nodes);
```

### _find

*Finds `x` in `tree`. The `key` will be zero if `x` is not found.*


```solidity
function _find(Tree storage tree, uint256 x) private view returns (uint256 nodes, uint256 cursor, uint256 key);
```

### _revert

*Helper to revert `err` efficiently.*


```solidity
function _revert(uint256 err) private pure;
```

## Errors
### ValueIsEmpty
*The value cannot be zero.*


```solidity
error ValueIsEmpty();
```

### ValueAlreadyExists
*Cannot insert a value that already exists.*


```solidity
error ValueAlreadyExists();
```

### ValueDoesNotExist
*Cannot remove a value that does not exist.*


```solidity
error ValueDoesNotExist();
```

### PointerOutOfBounds
*The pointer is out of bounds.*


```solidity
error PointerOutOfBounds();
```

### TreeIsFull
*The tree is full.*


```solidity
error TreeIsFull();
```

## Structs
### Tree
*A red-black-tree in storage.*


```solidity
struct Tree {
    uint256 _spacer;
}
```

