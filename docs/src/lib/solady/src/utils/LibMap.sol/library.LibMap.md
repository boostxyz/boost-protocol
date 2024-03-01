# LibMap
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibMap.sol)

Library for storage of packed unsigned integers.


## Functions
### get

*Returns the uint8 value at `index` in `map`.*


```solidity
function get(Uint8Map storage map, uint256 index) internal view returns (uint8 result);
```

### set

*Updates the uint8 value at `index` in `map`.*


```solidity
function set(Uint8Map storage map, uint256 index, uint8 value) internal;
```

### get

*Returns the uint16 value at `index` in `map`.*


```solidity
function get(Uint16Map storage map, uint256 index) internal view returns (uint16 result);
```

### set

*Updates the uint16 value at `index` in `map`.*


```solidity
function set(Uint16Map storage map, uint256 index, uint16 value) internal;
```

### get

*Returns the uint32 value at `index` in `map`.*


```solidity
function get(Uint32Map storage map, uint256 index) internal view returns (uint32 result);
```

### set

*Updates the uint32 value at `index` in `map`.*


```solidity
function set(Uint32Map storage map, uint256 index, uint32 value) internal;
```

### get

*Returns the uint40 value at `index` in `map`.*


```solidity
function get(Uint40Map storage map, uint256 index) internal view returns (uint40 result);
```

### set

*Updates the uint40 value at `index` in `map`.*


```solidity
function set(Uint40Map storage map, uint256 index, uint40 value) internal;
```

### get

*Returns the uint64 value at `index` in `map`.*


```solidity
function get(Uint64Map storage map, uint256 index) internal view returns (uint64 result);
```

### set

*Updates the uint64 value at `index` in `map`.*


```solidity
function set(Uint64Map storage map, uint256 index, uint64 value) internal;
```

### get

*Returns the uint128 value at `index` in `map`.*


```solidity
function get(Uint128Map storage map, uint256 index) internal view returns (uint128 result);
```

### set

*Updates the uint128 value at `index` in `map`.*


```solidity
function set(Uint128Map storage map, uint256 index, uint128 value) internal;
```

### get

*Returns the value at `index` in `map`.*


```solidity
function get(mapping(uint256 => uint256) storage map, uint256 index, uint256 bitWidth)
    internal
    view
    returns (uint256 result);
```

### set

*Updates the value at `index` in `map`.*


```solidity
function set(mapping(uint256 => uint256) storage map, uint256 index, uint256 value, uint256 bitWidth) internal;
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(Uint8Map storage map, uint8 needle, uint256 start, uint256 end)
    internal
    view
    returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(Uint16Map storage map, uint16 needle, uint256 start, uint256 end)
    internal
    view
    returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(Uint32Map storage map, uint32 needle, uint256 start, uint256 end)
    internal
    view
    returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(Uint40Map storage map, uint40 needle, uint256 start, uint256 end)
    internal
    view
    returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(Uint64Map storage map, uint64 needle, uint256 start, uint256 end)
    internal
    view
    returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(Uint128Map storage map, uint128 needle, uint256 start, uint256 end)
    internal
    view
    returns (bool found, uint256 index);
```

### searchSorted

*Returns whether `map` contains `needle`, and the index of `needle`.*


```solidity
function searchSorted(
    mapping(uint256 => uint256) storage map,
    uint256 needle,
    uint256 start,
    uint256 end,
    uint256 bitWidth
) internal view returns (bool found, uint256 index);
```

### _rawDiv

*Returns `x / y`, returning 0 if `y` is zero.*


```solidity
function _rawDiv(uint256 x, uint256 y) private pure returns (uint256 z);
```

### _rawMod

*Returns `x % y`, returning 0 if `y` is zero.*


```solidity
function _rawMod(uint256 x, uint256 y) private pure returns (uint256 z);
```

## Structs
### Uint8Map
*A uint8 map in storage.*


```solidity
struct Uint8Map {
    mapping(uint256 => uint256) map;
}
```

### Uint16Map
*A uint16 map in storage.*


```solidity
struct Uint16Map {
    mapping(uint256 => uint256) map;
}
```

### Uint32Map
*A uint32 map in storage.*


```solidity
struct Uint32Map {
    mapping(uint256 => uint256) map;
}
```

### Uint40Map
*A uint40 map in storage. Useful for storing timestamps up to 34841 A.D.*


```solidity
struct Uint40Map {
    mapping(uint256 => uint256) map;
}
```

### Uint64Map
*A uint64 map in storage.*


```solidity
struct Uint64Map {
    mapping(uint256 => uint256) map;
}
```

### Uint128Map
*A uint128 map in storage.*


```solidity
struct Uint128Map {
    mapping(uint256 => uint256) map;
}
```

