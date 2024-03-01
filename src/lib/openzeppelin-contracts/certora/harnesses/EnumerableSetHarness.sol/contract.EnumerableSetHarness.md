# EnumerableSetHarness

## State Variables
### _set

```solidity
EnumerableSet.Bytes32Set private _set;
```


## Functions
### add


```solidity
function add(bytes32 value) public returns (bool);
```

### remove


```solidity
function remove(bytes32 value) public returns (bool);
```

### contains


```solidity
function contains(bytes32 value) public view returns (bool);
```

### length


```solidity
function length() public view returns (uint256);
```

### at_


```solidity
function at_(uint256 index) public view returns (bytes32);
```

### _positionOf


```solidity
function _positionOf(bytes32 value) public view returns (uint256);
```

