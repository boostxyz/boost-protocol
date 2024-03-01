# DoubleEndedQueueHarness

## State Variables
### _deque

```solidity
DoubleEndedQueue.Bytes32Deque private _deque;
```


## Functions
### pushFront


```solidity
function pushFront(bytes32 value) external;
```

### pushBack


```solidity
function pushBack(bytes32 value) external;
```

### popFront


```solidity
function popFront() external returns (bytes32 value);
```

### popBack


```solidity
function popBack() external returns (bytes32 value);
```

### clear


```solidity
function clear() external;
```

### begin


```solidity
function begin() external view returns (uint128);
```

### end


```solidity
function end() external view returns (uint128);
```

### length


```solidity
function length() external view returns (uint256);
```

### empty


```solidity
function empty() external view returns (bool);
```

### front


```solidity
function front() external view returns (bytes32 value);
```

### back


```solidity
function back() external view returns (bytes32 value);
```

### at_


```solidity
function at_(uint256 index) external view returns (bytes32 value);
```

