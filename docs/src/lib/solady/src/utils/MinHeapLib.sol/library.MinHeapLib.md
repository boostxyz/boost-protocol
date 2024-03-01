# MinHeapLib
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/MinHeapLib.sol)

Library for managing a min-heap in storage.


## Functions
### root

*Returns the minimum value of the heap.
Reverts if the heap is empty.*


```solidity
function root(Heap storage heap) internal view returns (uint256 result);
```

### smallest

*Returns an array of the `k` smallest items in the heap,
sorted in ascending order, without modifying the heap.
If the heap has less than `k` items, all items in the heap will be returned.*


```solidity
function smallest(Heap storage heap, uint256 k) internal view returns (uint256[] memory a);
```

### length

*Returns the number of items in the heap.*


```solidity
function length(Heap storage heap) internal view returns (uint256);
```

### push

*Pushes the `value` onto the min-heap.*


```solidity
function push(Heap storage heap, uint256 value) internal;
```

### pop

*Pops the minimum value from the min-heap.
Reverts if the heap is empty.*


```solidity
function pop(Heap storage heap) internal returns (uint256 popped);
```

### pushPop

*Pushes the `value` onto the min-heap, and pops the minimum value.*


```solidity
function pushPop(Heap storage heap, uint256 value) internal returns (uint256 popped);
```

### replace

*Pops the minimum value, and pushes the new `value` onto the min-heap.
Reverts if the heap is empty.*


```solidity
function replace(Heap storage heap, uint256 value) internal returns (uint256 popped);
```

### enqueue

*Pushes the `value` onto the min-heap, and pops the minimum value
if the length of the heap exceeds `maxLength`.
Reverts if `maxLength` is zero.
- If the queue is not full:
(`success` = true, `hasPopped` = false, `popped` = 0)
- If the queue is full, and `value` is not greater than the minimum value:
(`success` = false, `hasPopped` = false, `popped` = 0)
- If the queue is full, and `value` is greater than the minimum value:
(`success` = true, `hasPopped` = true, `popped` = <minimum value>)
Useful for implementing a bounded priority queue.*


```solidity
function enqueue(Heap storage heap, uint256 value, uint256 maxLength)
    internal
    returns (bool success, bool hasPopped, uint256 popped);
```

### _set

*Helper function for heap operations.
Designed for code conciseness, bytecode compactness, and decent performance.*


```solidity
function _set(Heap storage heap, uint256 value, uint256 maxLength, uint256 mode)
    private
    returns (bool success, bool hasPopped, uint256 popped);
```

## Errors
### HeapIsEmpty
*The heap is empty.*


```solidity
error HeapIsEmpty();
```

## Structs
### Heap
*A heap in storage.*


```solidity
struct Heap {
    uint256[] data;
}
```

