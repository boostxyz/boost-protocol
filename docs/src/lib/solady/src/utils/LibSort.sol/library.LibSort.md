# LibSort
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/Sort.sol)

Optimized sorts and operations for sorted arrays.


## Functions
### insertionSort

*Sorts the array in-place with insertion sort.*


```solidity
function insertionSort(uint256[] memory a) internal pure;
```

### insertionSort

*Sorts the array in-place with insertion sort.*


```solidity
function insertionSort(int256[] memory a) internal pure;
```

### insertionSort

*Sorts the array in-place with insertion sort.*


```solidity
function insertionSort(address[] memory a) internal pure;
```

### sort

*Sorts the array in-place with intro-quicksort.*


```solidity
function sort(uint256[] memory a) internal pure;
```

### sort

*Sorts the array in-place with intro-quicksort.*


```solidity
function sort(int256[] memory a) internal pure;
```

### sort

*Sorts the array in-place with intro-quicksort.*


```solidity
function sort(address[] memory a) internal pure;
```

### uniquifySorted

*Removes duplicate elements from a ascendingly sorted memory array.*


```solidity
function uniquifySorted(uint256[] memory a) internal pure;
```

### uniquifySorted

*Removes duplicate elements from a ascendingly sorted memory array.*


```solidity
function uniquifySorted(int256[] memory a) internal pure;
```

### uniquifySorted

*Removes duplicate elements from a ascendingly sorted memory array.*


```solidity
function uniquifySorted(address[] memory a) internal pure;
```

### searchSorted

*Returns whether `a` contains `needle`, and the index of `needle`.
`index` precedence: equal to > nearest before > nearest after.*


```solidity
function searchSorted(uint256[] memory a, uint256 needle) internal pure returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `a` contains `needle`, and the index of `needle`.
`index` precedence: equal to > nearest before > nearest after.*


```solidity
function searchSorted(int256[] memory a, int256 needle) internal pure returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `a` contains `needle`, and the index of `needle`.
`index` precedence: equal to > nearest before > nearest after.*


```solidity
function searchSorted(address[] memory a, address needle) internal pure returns (bool found, uint256 index);
```

### reverse

*Reverses the array in-place.*


```solidity
function reverse(uint256[] memory a) internal pure;
```

### reverse

*Reverses the array in-place.*


```solidity
function reverse(int256[] memory a) internal pure;
```

### reverse

*Reverses the array in-place.*


```solidity
function reverse(address[] memory a) internal pure;
```

### copy

*Returns a copy of the array.*


```solidity
function copy(uint256[] memory a) internal pure returns (uint256[] memory result);
```

### copy

*Returns a copy of the array.*


```solidity
function copy(int256[] memory a) internal pure returns (int256[] memory result);
```

### copy

*Returns a copy of the array.*


```solidity
function copy(address[] memory a) internal pure returns (address[] memory result);
```

### isSorted

*Returns whether the array is sorted in ascending order.*


```solidity
function isSorted(uint256[] memory a) internal pure returns (bool result);
```

### isSorted

*Returns whether the array is sorted in ascending order.*


```solidity
function isSorted(int256[] memory a) internal pure returns (bool result);
```

### isSorted

*Returns whether the array is sorted in ascending order.*


```solidity
function isSorted(address[] memory a) internal pure returns (bool result);
```

### isSortedAndUniquified

*Returns whether the array is strictly ascending (sorted and uniquified).*


```solidity
function isSortedAndUniquified(uint256[] memory a) internal pure returns (bool result);
```

### isSortedAndUniquified

*Returns whether the array is strictly ascending (sorted and uniquified).*


```solidity
function isSortedAndUniquified(int256[] memory a) internal pure returns (bool result);
```

### isSortedAndUniquified

*Returns whether the array is strictly ascending (sorted and uniquified).*


```solidity
function isSortedAndUniquified(address[] memory a) internal pure returns (bool result);
```

### difference

*Returns the sorted set difference of `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function difference(uint256[] memory a, uint256[] memory b) internal pure returns (uint256[] memory c);
```

### difference

*Returns the sorted set difference between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function difference(int256[] memory a, int256[] memory b) internal pure returns (int256[] memory c);
```

### difference

*Returns the sorted set difference between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function difference(address[] memory a, address[] memory b) internal pure returns (address[] memory c);
```

### intersection

*Returns the sorted set intersection between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function intersection(uint256[] memory a, uint256[] memory b) internal pure returns (uint256[] memory c);
```

### intersection

*Returns the sorted set intersection between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function intersection(int256[] memory a, int256[] memory b) internal pure returns (int256[] memory c);
```

### intersection

*Returns the sorted set intersection between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function intersection(address[] memory a, address[] memory b) internal pure returns (address[] memory c);
```

### union

*Returns the sorted set union of `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function union(uint256[] memory a, uint256[] memory b) internal pure returns (uint256[] memory c);
```

### union

*Returns the sorted set union of `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function union(int256[] memory a, int256[] memory b) internal pure returns (int256[] memory c);
```

### union

*Returns the sorted set union between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function union(address[] memory a, address[] memory b) internal pure returns (address[] memory c);
```

### _toUints

*Reinterpret cast to an uint256 array.*


```solidity
function _toUints(int256[] memory a) private pure returns (uint256[] memory casted);
```

### _toUints

*Reinterpret cast to an uint256 array.*


```solidity
function _toUints(address[] memory a) private pure returns (uint256[] memory casted);
```

### _toInts

*Reinterpret cast to an int array.*


```solidity
function _toInts(uint256[] memory a) private pure returns (int256[] memory casted);
```

### _toAddresses

*Reinterpret cast to an address array.*


```solidity
function _toAddresses(uint256[] memory a) private pure returns (address[] memory casted);
```

### _flipSign

*Converts an array of signed integers to unsigned
integers suitable for sorting or vice versa.*


```solidity
function _flipSign(int256[] memory a) private pure;
```

### _searchSorted

*Returns whether `a` contains `needle`, and the index of `needle`.
`index` precedence: equal to > nearest before > nearest after.*


```solidity
function _searchSorted(uint256[] memory a, uint256 needle, uint256 signed)
    private
    pure
    returns (bool found, uint256 index);
```

### _difference

*Returns the sorted set difference of `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function _difference(uint256[] memory a, uint256[] memory b, uint256 signed)
    private
    pure
    returns (uint256[] memory c);
```

### _intersection

*Returns the sorted set intersection between `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function _intersection(uint256[] memory a, uint256[] memory b, uint256 signed)
    private
    pure
    returns (uint256[] memory c);
```

### _union

*Returns the sorted set union of `a` and `b`.
Note: Behaviour is undefined if inputs are not sorted and uniquified.*


```solidity
function _union(uint256[] memory a, uint256[] memory b, uint256 signed) private pure returns (uint256[] memory c);
```

