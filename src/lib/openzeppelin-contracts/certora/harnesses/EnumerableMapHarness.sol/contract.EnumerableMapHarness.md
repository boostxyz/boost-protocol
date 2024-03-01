# EnumerableMapHarness

## State Variables
### _map

```solidity
EnumerableMap.Bytes32ToBytes32Map private _map;
```


## Functions
### set


```solidity
function set(bytes32 key, bytes32 value) public returns (bool);
```

### remove


```solidity
function remove(bytes32 key) public returns (bool);
```

### contains


```solidity
function contains(bytes32 key) public view returns (bool);
```

### length


```solidity
function length() public view returns (uint256);
```

### key_at


```solidity
function key_at(uint256 index) public view returns (bytes32);
```

### value_at


```solidity
function value_at(uint256 index) public view returns (bytes32);
```

### tryGet_contains


```solidity
function tryGet_contains(bytes32 key) public view returns (bool);
```

### tryGet_value


```solidity
function tryGet_value(bytes32 key) public view returns (bytes32);
```

### get


```solidity
function get(bytes32 key) public view returns (bytes32);
```

### _positionOf


```solidity
function _positionOf(bytes32 key) public view returns (uint256);
```

