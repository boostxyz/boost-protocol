# LibMapTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### bigUint8ArrayMap

```solidity
uint8[0xffffffffffffffff] bigUint8ArrayMap;
```


### uint8s

```solidity
LibMap.Uint8Map[2] uint8s;
```


### uint16s

```solidity
LibMap.Uint16Map[2] uint16s;
```


### uint32s

```solidity
LibMap.Uint32Map[2] uint32s;
```


### uint40s

```solidity
LibMap.Uint40Map[2] uint40s;
```


### uint64s

```solidity
LibMap.Uint64Map[2] uint64s;
```


### uint128s

```solidity
LibMap.Uint128Map[2] uint128s;
```


### uint32Maps

```solidity
mapping(uint256 => LibMap.Uint32Map) uint32Maps;
```


### generalMaps

```solidity
mapping(uint256 => mapping(uint256 => uint256)) generalMaps;
```


### filled

```solidity
mapping(uint256 => uint256) filled;
```


## Functions
### _testTemps


```solidity
function _testTemps() internal returns (_TestTemps memory t);
```

### getUint8


```solidity
function getUint8(uint256 index) public view returns (uint8 result);
```

### setUint8


```solidity
function setUint8(uint256 index, uint8 value) public;
```

### getUint8FromBigArray


```solidity
function getUint8FromBigArray(uint256 index) public view returns (uint8 result);
```

### setUint8FromBigArray


```solidity
function setUint8FromBigArray(uint256 index, uint8 value) public;
```

### testMapSetUint8


```solidity
function testMapSetUint8() public;
```

### testMapGetUint8


```solidity
function testMapGetUint8() public;
```

### testMapSetUint8FromBigArray


```solidity
function testMapSetUint8FromBigArray() public;
```

### testMapGetFromBigArray


```solidity
function testMapGetFromBigArray() public;
```

### testUint8MapSetAndGet


```solidity
function testUint8MapSetAndGet(uint256) public;
```

### testUint8MapSetAndGet


```solidity
function testUint8MapSetAndGet() public;
```

### testUint8MapSetAndGet2


```solidity
function testUint8MapSetAndGet2(uint256) public;
```

### testUint16MapSetAndGet


```solidity
function testUint16MapSetAndGet(uint256) public;
```

### testUint16MapSetAndGet


```solidity
function testUint16MapSetAndGet() public;
```

### testUint16MapSetAndGet2


```solidity
function testUint16MapSetAndGet2(uint256) public;
```

### testUint32MapSetAndGet


```solidity
function testUint32MapSetAndGet(uint256) public;
```

### testUint32MapSetAndGet


```solidity
function testUint32MapSetAndGet() public;
```

### testUint32MapSetAndGet2


```solidity
function testUint32MapSetAndGet2(uint256) public;
```

### testUint40MapSetAndGet


```solidity
function testUint40MapSetAndGet(uint256) public;
```

### testUint40MapSetAndGet


```solidity
function testUint40MapSetAndGet() public;
```

### testUint40MapSetAndGet2


```solidity
function testUint40MapSetAndGet2(uint256) public;
```

### testUint64MapSetAndGet


```solidity
function testUint64MapSetAndGet(uint256) public;
```

### testUint64MapSetAndGet


```solidity
function testUint64MapSetAndGet() public;
```

### testUint64MapSetAndGet2


```solidity
function testUint64MapSetAndGet2(uint256) public;
```

### testUint128MapSetAndGet


```solidity
function testUint128MapSetAndGet(uint256) public;
```

### testUint128MapSetAndGet


```solidity
function testUint128MapSetAndGet() public;
```

### testUint128MapSetAndGet2


```solidity
function testUint128MapSetAndGet2(uint256) public;
```

### testUint32Maps


```solidity
function testUint32Maps(uint256) public;
```

### _searchSortedTestVars


```solidity
function _searchSortedTestVars(mapping(uint256 => uint256) storage map, uint256 bitWidth)
    internal
    returns (_SearchSortedTestVars memory t);
```

### _generateNotFoundValue


```solidity
function _generateNotFoundValue(uint256 o) internal returns (uint256 notFoundValue);
```

### _nearestIndexBefore


```solidity
function _nearestIndexBefore(mapping(uint256 => uint256) storage map, uint256 x, uint256 o, uint256 n, uint256 bitWidth)
    internal
    view
    returns (uint256 nearestIndex);
```

### testUint8MapSearchSorted


```solidity
function testUint8MapSearchSorted(uint256) public;
```

### testUint16MapSearchSorted


```solidity
function testUint16MapSearchSorted(uint256) public;
```

### testUint32MapSearchSorted


```solidity
function testUint32MapSearchSorted(uint256) public;
```

### testUint40MapSearchSorted


```solidity
function testUint40MapSearchSorted(uint256) public;
```

### testUint64MapSearchSorted


```solidity
function testUint64MapSearchSorted(uint256) public;
```

### testUint128MapSearchSorted


```solidity
function testUint128MapSearchSorted(uint256) public;
```

### testGeneralMapSearchSorted


```solidity
function testGeneralMapSearchSorted(uint256) public;
```

### testGeneralMapFunctionsWithSmallBitWidths


```solidity
function testGeneralMapFunctionsWithSmallBitWidths(uint256) public;
```

### _hash


```solidity
function _hash(uint256 x) internal pure returns (uint256 result);
```

### testGeneralMapFunctionsWithZeroBitWidth


```solidity
function testGeneralMapFunctionsWithZeroBitWidth() public;
```

### testGeneralMapFunctionsGas


```solidity
function testGeneralMapFunctionsGas() public;
```

### testFoundStatementDifferential


```solidity
function testFoundStatementDifferential(uint256 t, uint256 needle, uint256 index) public;
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    uint256 i0;
    uint256 i1;
    uint256 v0;
    uint256 v1;
}
```

### _SearchSortedTestVars

```solidity
struct _SearchSortedTestVars {
    uint256 o;
    uint256 n;
    uint256 end;
    bool found;
    uint256 index;
    uint256 randomIndex;
    uint256 randomIndexValue;
    uint256[] values;
}
```

