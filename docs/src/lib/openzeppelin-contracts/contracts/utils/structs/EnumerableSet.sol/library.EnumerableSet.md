# EnumerableSet
*Library for managing
https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
types.
Sets have the following properties:
- Elements are added, removed, and checked for existence in constant time
(O(1)).
- Elements are enumerated in O(n). No guarantees are made on the ordering.
```solidity
contract Example {
// Add the library methods
using EnumerableSet for EnumerableSet.AddressSet;
// Declare a set state variable
EnumerableSet.AddressSet private mySet;
}
```
As of v3.3.0, sets of type `bytes32` (`Bytes32Set`), `address` (`AddressSet`)
and `uint256` (`UintSet`) are supported.
[WARNING]
====
Trying to delete such a structure from storage will likely result in data corruption, rendering the structure
unusable.
See https://github.com/ethereum/solidity/pull/11843[ethereum/solidity#11843] for more info.
In order to clean an EnumerableSet, you can either remove all elements one by one or create a fresh instance using an
array of EnumerableSet.
====*


## Functions
### _add

*Add a value to a set. O(1).
Returns true if the value was added to the set, that is if it was not
already present.*


```solidity
function _add(Set storage set, bytes32 value) private returns (bool);
```

### _remove

*Removes a value from a set. O(1).
Returns true if the value was removed from the set, that is if it was
present.*


```solidity
function _remove(Set storage set, bytes32 value) private returns (bool);
```

### _contains

*Returns true if the value is in the set. O(1).*


```solidity
function _contains(Set storage set, bytes32 value) private view returns (bool);
```

### _length

*Returns the number of values on the set. O(1).*


```solidity
function _length(Set storage set) private view returns (uint256);
```

### _at

*Returns the value stored at position `index` in the set. O(1).
Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.
Requirements:
- `index` must be strictly less than [length](/lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol/library.EnumerableSet.md#length).*


```solidity
function _at(Set storage set, uint256 index) private view returns (bytes32);
```

### _values

*Return the entire set in an array
WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.*


```solidity
function _values(Set storage set) private view returns (bytes32[] memory);
```

### add

*Add a value to a set. O(1).
Returns true if the value was added to the set, that is if it was not
already present.*


```solidity
function add(Bytes32Set storage set, bytes32 value) internal returns (bool);
```

### remove

*Removes a value from a set. O(1).
Returns true if the value was removed from the set, that is if it was
present.*


```solidity
function remove(Bytes32Set storage set, bytes32 value) internal returns (bool);
```

### contains

*Returns true if the value is in the set. O(1).*


```solidity
function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool);
```

### length

*Returns the number of values in the set. O(1).*


```solidity
function length(Bytes32Set storage set) internal view returns (uint256);
```

### at

*Returns the value stored at position `index` in the set. O(1).
Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.
Requirements:
- `index` must be strictly less than [length](/lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol/library.EnumerableSet.md#length).*


```solidity
function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32);
```

### values

*Return the entire set in an array
WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.*


```solidity
function values(Bytes32Set storage set) internal view returns (bytes32[] memory);
```

### add

*Add a value to a set. O(1).
Returns true if the value was added to the set, that is if it was not
already present.*


```solidity
function add(AddressSet storage set, address value) internal returns (bool);
```

### remove

*Removes a value from a set. O(1).
Returns true if the value was removed from the set, that is if it was
present.*


```solidity
function remove(AddressSet storage set, address value) internal returns (bool);
```

### contains

*Returns true if the value is in the set. O(1).*


```solidity
function contains(AddressSet storage set, address value) internal view returns (bool);
```

### length

*Returns the number of values in the set. O(1).*


```solidity
function length(AddressSet storage set) internal view returns (uint256);
```

### at

*Returns the value stored at position `index` in the set. O(1).
Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.
Requirements:
- `index` must be strictly less than [length](/lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol/library.EnumerableSet.md#length).*


```solidity
function at(AddressSet storage set, uint256 index) internal view returns (address);
```

### values

*Return the entire set in an array
WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.*


```solidity
function values(AddressSet storage set) internal view returns (address[] memory);
```

### add

*Add a value to a set. O(1).
Returns true if the value was added to the set, that is if it was not
already present.*


```solidity
function add(UintSet storage set, uint256 value) internal returns (bool);
```

### remove

*Removes a value from a set. O(1).
Returns true if the value was removed from the set, that is if it was
present.*


```solidity
function remove(UintSet storage set, uint256 value) internal returns (bool);
```

### contains

*Returns true if the value is in the set. O(1).*


```solidity
function contains(UintSet storage set, uint256 value) internal view returns (bool);
```

### length

*Returns the number of values in the set. O(1).*


```solidity
function length(UintSet storage set) internal view returns (uint256);
```

### at

*Returns the value stored at position `index` in the set. O(1).
Note that there are no guarantees on the ordering of values inside the
array, and it may change when more values are added or removed.
Requirements:
- `index` must be strictly less than [length](/lib/openzeppelin-contracts/contracts/utils/structs/EnumerableSet.sol/library.EnumerableSet.md#length).*


```solidity
function at(UintSet storage set, uint256 index) internal view returns (uint256);
```

### values

*Return the entire set in an array
WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.*


```solidity
function values(UintSet storage set) internal view returns (uint256[] memory);
```

## Structs
### Set

```solidity
struct Set {
    bytes32[] _values;
    mapping(bytes32 value => uint256) _positions;
}
```

### Bytes32Set

```solidity
struct Bytes32Set {
    Set _inner;
}
```

### AddressSet

```solidity
struct AddressSet {
    Set _inner;
}
```

### UintSet

```solidity
struct UintSet {
    Set _inner;
}
```

