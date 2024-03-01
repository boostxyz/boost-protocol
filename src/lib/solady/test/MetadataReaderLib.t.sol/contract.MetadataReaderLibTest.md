# MetadataReaderLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### _stringToReturn

```solidity
string internal _stringToReturn;
```


### _randomness

```solidity
uint256 internal _randomness;
```


## Functions
### returnsString


```solidity
function returnsString() public view returns (string memory);
```

### returnsEmptyString


```solidity
function returnsEmptyString() public view returns (string memory);
```

### returnsChoppedString


```solidity
function returnsChoppedString(uint256 chop) public pure returns (string memory);
```

### returnsBytes32StringA


```solidity
function returnsBytes32StringA() public pure returns (bytes32);
```

### returnsBytes32StringB


```solidity
function returnsBytes32StringB() public pure returns (bytes32);
```

### returnsNothing


```solidity
function returnsNothing() public pure;
```

### reverts


```solidity
function reverts() public pure;
```

### returnsChoppedUint


```solidity
function returnsChoppedUint(uint256 v, uint256 chop) public pure returns (uint256);
```

### name


```solidity
function name() public view returns (string memory);
```

### symbol


```solidity
function symbol() public view returns (string memory);
```

### returnsUint


```solidity
function returnsUint() public view returns (uint256);
```

### decimals


```solidity
function decimals() public view returns (uint8);
```

### testReadBytes32String


```solidity
function testReadBytes32String() public brutalizeMemory;
```

### testReadBytes32StringTruncated


```solidity
function testReadBytes32StringTruncated() public brutalizeMemory;
```

### testReadStringChopped


```solidity
function testReadStringChopped() public;
```

### _readString


```solidity
function _readString(bytes memory data, uint256 limit) internal returns (string memory);
```

### _readString


```solidity
function _readString(bytes memory data) internal returns (string memory);
```

### _readSymbol


```solidity
function _readSymbol() internal returns (string memory);
```

### _readName


```solidity
function _readName() internal returns (string memory);
```

### _readUint


```solidity
function _readUint(bytes memory data) internal returns (uint256);
```

### _readDecimals


```solidity
function _readDecimals() internal returns (uint256);
```

### testReadString


```solidity
function testReadString(uint256 r) public brutalizeMemory;
```

### testReadStringTruncated


```solidity
function testReadStringTruncated(uint256 r) public brutalizeMemory;
```

### testReadUint


```solidity
function testReadUint(uint256 r) public;
```

### testReadUint


```solidity
function testReadUint() public;
```

### testBoundsCheckDifferential


```solidity
function testBoundsCheckDifferential(uint256) public;
```

### _hash


```solidity
function _hash(uint256 i, uint256 j) internal pure returns (uint256 result);
```

### _generateString


```solidity
function _generateString() internal returns (string memory result);
```

### _randomStringLength


```solidity
function _randomStringLength() internal returns (uint256 r);
```

