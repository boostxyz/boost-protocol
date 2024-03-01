# JSONParserLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testParseInvalidReverts


```solidity
function testParseInvalidReverts() public;
```

### testParseInvalidNumberReverts


```solidity
function testParseInvalidNumberReverts() public;
```

### _checkParseReverts


```solidity
function _checkParseReverts(string memory trimmed) internal;
```

### parsedValue


```solidity
function parsedValue(string memory s) public view miniBrutalizeMemory returns (string memory);
```

### testParseNumber


```solidity
function testParseNumber() public;
```

### _checkParseNumber


```solidity
function _checkParseNumber(string memory trimmed) internal;
```

### _checkSoloNumber


```solidity
function _checkSoloNumber(JSONParserLib.Item memory item, string memory trimmed) internal;
```

### testParseEmptyArrays


```solidity
function testParseEmptyArrays() public;
```

### _checkParseEmptyArray


```solidity
function _checkParseEmptyArray(string memory trimmed) internal;
```

### _checkSoloEmptyArray


```solidity
function _checkSoloEmptyArray(JSONParserLib.Item memory item, string memory trimmed) internal;
```

### testParseEmptyObjects


```solidity
function testParseEmptyObjects() public;
```

### _checkParseEmptyObject


```solidity
function _checkParseEmptyObject(string memory trimmed) internal;
```

### _checkSoloEmptyObject


```solidity
function _checkSoloEmptyObject(JSONParserLib.Item memory item, string memory trimmed) internal;
```

### _padWhiteSpace


```solidity
function _padWhiteSpace(string memory s, uint256 r) internal pure returns (string memory);
```

### testParseSimpleUintArray


```solidity
function testParseSimpleUintArray() public;
```

### testEmptyItem


```solidity
function testEmptyItem() public;
```

### testParseSimpleArray


```solidity
function testParseSimpleArray() public;
```

### testParseSpecials


```solidity
function testParseSpecials() public miniBrutalizeMemory;
```

### testParseObject


```solidity
function testParseObject() public;
```

### testParseValidObjectDoesNotRevert


```solidity
function testParseValidObjectDoesNotRevert(string memory key, string memory value) public;
```

### testParseRecursiveObject


```solidity
function testParseRecursiveObject() public miniBrutalizeMemory;
```

### testParseString


```solidity
function testParseString() public;
```

### _checkParseString


```solidity
function _checkParseString(string memory s) internal;
```

### testParseInvalidStringReverts


```solidity
function testParseInvalidStringReverts() public;
```

### _checkItemIsSolo


```solidity
function _checkItemIsSolo(JSONParserLib.Item memory item) internal;
```

### _checkItemHasNoParent


```solidity
function _checkItemHasNoParent(JSONParserLib.Item memory item) internal;
```

### testParseGas


```solidity
function testParseGas() public;
```

### testParseUintFromHex


```solidity
function testParseUintFromHex() public;
```

### _checkParseUintFromHex


```solidity
function _checkParseUintFromHex(string memory s, uint256 x) internal;
```

### _checkParseUintFromHexSub


```solidity
function _checkParseUintFromHexSub(string memory s, uint256 x) internal;
```

### parseUintFromHex


```solidity
function parseUintFromHex(string memory s) public pure returns (uint256);
```

### testParseInvalidUintFromHexReverts


```solidity
function testParseInvalidUintFromHexReverts() public;
```

### _checkParseInvalidUintFromHexReverts


```solidity
function _checkParseInvalidUintFromHexReverts(string memory s) internal;
```

### testParseUint


```solidity
function testParseUint() public;
```

### testParseInvalidUintReverts


```solidity
function testParseInvalidUintReverts() public;
```

### _checkParseInvalidUintReverts


```solidity
function _checkParseInvalidUintReverts(string memory s) internal;
```

### parseUint


```solidity
function parseUint(string memory s) public view miniBrutalizeMemory returns (uint256);
```

### testParseInt


```solidity
function testParseInt() public;
```

### testParseInt


```solidity
function testParseInt(int256 val) public;
```

### testParseIntTrick


```solidity
function testParseIntTrick(uint256 x, bool isNegative) public;
```

### testParseInvalidIntReverts


```solidity
function testParseInvalidIntReverts() public;
```

### testParseIntReverts


```solidity
function testParseIntReverts(uint256 val) public;
```

### _checkParseInt


```solidity
function _checkParseInt(string memory s, int256 x) internal;
```

### _checkParseInvalidIntReverts


```solidity
function _checkParseInvalidIntReverts(string memory s) internal;
```

### parseInt


```solidity
function parseInt(string memory s) public view miniBrutalizeMemory returns (int256);
```

### testDecodeString


```solidity
function testDecodeString() public;
```

### testDecodeEncodedStringDoesNotRevert


```solidity
function testDecodeEncodedStringDoesNotRevert(string memory s) public;
```

### _limitStringLength


```solidity
function _limitStringLength(string memory s) internal;
```

### testDecodeInvalidStringReverts


```solidity
function testDecodeInvalidStringReverts() public;
```

### _checkDecodeInvalidStringReverts


```solidity
function _checkDecodeInvalidStringReverts(string memory s) internal;
```

### decodeString


```solidity
function decodeString(string memory s) public view miniBrutalizeMemory returns (string memory);
```

### testParseUint


```solidity
function testParseUint(uint256 x) public;
```

### testParseJWTGas


```solidity
function testParseJWTGas() public;
```

### miniBrutalizeMemory


```solidity
modifier miniBrutalizeMemory();
```

