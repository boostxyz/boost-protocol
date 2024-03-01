# Bytes32ArraysMock

## State Variables
### _array

```solidity
bytes32[] private _array;
```


## Functions
### constructor


```solidity
constructor(bytes32[] memory array);
```

### unsafeAccess


```solidity
function unsafeAccess(uint256 pos) external view returns (bytes32);
```

### sort


```solidity
function sort(bytes32[] memory array) external pure returns (bytes32[] memory);
```

### sortReverse


```solidity
function sortReverse(bytes32[] memory array) external pure returns (bytes32[] memory);
```

### _reverse


```solidity
function _reverse(bytes32 a, bytes32 b) private pure returns (bool);
```

