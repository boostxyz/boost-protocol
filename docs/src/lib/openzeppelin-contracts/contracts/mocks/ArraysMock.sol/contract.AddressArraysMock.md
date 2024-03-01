# AddressArraysMock

## State Variables
### _array

```solidity
address[] private _array;
```


## Functions
### constructor


```solidity
constructor(address[] memory array);
```

### unsafeAccess


```solidity
function unsafeAccess(uint256 pos) external view returns (address);
```

### sort


```solidity
function sort(address[] memory array) external pure returns (address[] memory);
```

### sortReverse


```solidity
function sortReverse(address[] memory array) external pure returns (address[] memory);
```

### _reverse


```solidity
function _reverse(address a, address b) private pure returns (bool);
```

