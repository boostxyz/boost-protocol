# DoubleEndedQueue
*A sequence of items with the ability to efficiently push and pop items (i.e. insert and remove) on both ends of
the sequence (called front and back). Among other access patterns, it can be used to implement efficient LIFO and
FIFO queues. Storage use is optimized, and all operations are O(1) constant time. This includes [clear](/lib/openzeppelin-contracts/contracts/utils/structs/DoubleEndedQueue.sol/library.DoubleEndedQueue.md#clear), given that
the existing queue contents are left in storage.
The struct is called `Bytes32Deque`. Other types can be cast to and from `bytes32`. This data structure can only be
used in storage, and not in memory.
```solidity
DoubleEndedQueue.Bytes32Deque queue;
```*


## Functions
### pushBack

*Inserts an item at the end of the queue.
Reverts with {Panic-RESOURCE_ERROR} if the queue is full.*


```solidity
function pushBack(Bytes32Deque storage deque, bytes32 value) internal;
```

### popBack

*Removes the item at the end of the queue and returns it.
Reverts with {Panic-EMPTY_ARRAY_POP} if the queue is empty.*


```solidity
function popBack(Bytes32Deque storage deque) internal returns (bytes32 value);
```

### pushFront

*Inserts an item at the beginning of the queue.
Reverts with {Panic-RESOURCE_ERROR} if the queue is full.*


```solidity
function pushFront(Bytes32Deque storage deque, bytes32 value) internal;
```

### popFront

*Removes the item at the beginning of the queue and returns it.
Reverts with {Panic-EMPTY_ARRAY_POP} if the queue is empty.*


```solidity
function popFront(Bytes32Deque storage deque) internal returns (bytes32 value);
```

### front

*Returns the item at the beginning of the queue.
Reverts with {Panic-ARRAY_OUT_OF_BOUNDS} if the queue is empty.*


```solidity
function front(Bytes32Deque storage deque) internal view returns (bytes32 value);
```

### back

*Returns the item at the end of the queue.
Reverts with {Panic-ARRAY_OUT_OF_BOUNDS} if the queue is empty.*


```solidity
function back(Bytes32Deque storage deque) internal view returns (bytes32 value);
```

### at

*Return the item at a position in the queue given by `index`, with the first item at 0 and last item at
`length(deque) - 1`.
Reverts with {Panic-ARRAY_OUT_OF_BOUNDS} if the index is out of bounds.*


```solidity
function at(Bytes32Deque storage deque, uint256 index) internal view returns (bytes32 value);
```

### clear

*Resets the queue back to being empty.
NOTE: The current items are left behind in storage. This does not affect the functioning of the queue, but misses
out on potential gas refunds.*


```solidity
function clear(Bytes32Deque storage deque) internal;
```

### length

*Returns the number of items in the queue.*


```solidity
function length(Bytes32Deque storage deque) internal view returns (uint256);
```

### empty

*Returns true if the queue is empty.*


```solidity
function empty(Bytes32Deque storage deque) internal view returns (bool);
```

## Structs
### Bytes32Deque
*Indices are 128 bits so begin and end are packed in a single storage slot for efficient access.
Struct members have an underscore prefix indicating that they are "private" and should not be read or written to
directly. Use the functions provided below instead. Modifying the struct manually may violate assumptions and
lead to unexpected behavior.
The first item is at data[begin] and the last item is at data[end - 1]. This range can wrap around.*


```solidity
struct Bytes32Deque {
    uint128 _begin;
    uint128 _end;
    mapping(uint128 index => bytes32) _data;
}
```

