# Uint256ArraysMock

## State Variables
### _array

```solidity
uint256[] private _array;
```


## Functions
### constructor


```solidity
constructor(uint256[] memory array);
```

### findUpperBound


```solidity
function findUpperBound(uint256 value) external view returns (uint256);
```

### lowerBound


```solidity
function lowerBound(uint256 value) external view returns (uint256);
```

### upperBound


```solidity
function upperBound(uint256 value) external view returns (uint256);
```

### lowerBoundMemory


```solidity
function lowerBoundMemory(uint256[] memory array, uint256 value) external pure returns (uint256);
```

### upperBoundMemory


```solidity
function upperBoundMemory(uint256[] memory array, uint256 value) external pure returns (uint256);
```

### unsafeAccess


```solidity
function unsafeAccess(uint256 pos) external view returns (uint256);
```

### sort


```solidity
function sort(uint256[] memory array) external pure returns (uint256[] memory);
```

### sortReverse


```solidity
function sortReverse(uint256[] memory array) external pure returns (uint256[] memory);
```

### _reverse


```solidity
function _reverse(uint256 a, uint256 b) private pure returns (bool);
```

