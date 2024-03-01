# LibStringTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testToStringZero


```solidity
function testToStringZero() public;
```

### testToStringPositiveNumber


```solidity
function testToStringPositiveNumber() public;
```

### testToStringUint256Max


```solidity
function testToStringUint256Max() public;
```

### testToStringZeroBrutalized


```solidity
function testToStringZeroBrutalized() public brutalizeMemory;
```

### testToStringPositiveNumberBrutalized


```solidity
function testToStringPositiveNumberBrutalized() public brutalizeMemory;
```

### testToStringUint256MaxBrutalized


```solidity
function testToStringUint256MaxBrutalized() public brutalizeMemory;
```

### testToStringZeroRightPadded


```solidity
function testToStringZeroRightPadded(uint256 x) public view brutalizeMemory;
```

### testToStringSignedDifferential


```solidity
function testToStringSignedDifferential(int256 x) public brutalizeMemory;
```

### testToStringSignedMemory


```solidity
function testToStringSignedMemory(int256 x) public view brutalizeMemory;
```

### testToStringSignedGas


```solidity
function testToStringSignedGas() public pure;
```

### testToStringSignedOriginalGas


```solidity
function testToStringSignedOriginalGas() public pure;
```

### _toStringSignedOriginal


```solidity
function _toStringSignedOriginal(int256 x) internal pure returns (string memory);
```

### testToHexStringZero


```solidity
function testToHexStringZero() public;
```

### testToHexStringPositiveNumber


```solidity
function testToHexStringPositiveNumber() public;
```

### testToHexStringUint256Max


```solidity
function testToHexStringUint256Max() public;
```

### testToHexStringFixedLengthPositiveNumberLong


```solidity
function testToHexStringFixedLengthPositiveNumberLong() public;
```

### testToHexStringFixedLengthPositiveNumberShort


```solidity
function testToHexStringFixedLengthPositiveNumberShort() public;
```

### testToHexStringZeroRightPadded


```solidity
function testToHexStringZeroRightPadded(uint256 x) public pure;
```

### testToHexStringFixedLengthInsufficientLength


```solidity
function testToHexStringFixedLengthInsufficientLength() public;
```

### testToHexStringFixedLengthUint256Max


```solidity
function testToHexStringFixedLengthUint256Max() public;
```

### testToHexStringFixedLengthZeroRightPadded


```solidity
function testToHexStringFixedLengthZeroRightPadded(uint256 x, uint256 randomness) public pure;
```

### testFromAddressToHexString


```solidity
function testFromAddressToHexString() public;
```

### testAddressToHexStringZeroRightPadded


```solidity
function testAddressToHexStringZeroRightPadded(address x) public pure;
```

### testFromAddressToHexStringWithLeadingZeros


```solidity
function testFromAddressToHexStringWithLeadingZeros() public;
```

### testToMinimalHexStringZero


```solidity
function testToMinimalHexStringZero() public;
```

### testToMinimalHexStringPositiveNumber


```solidity
function testToMinimalHexStringPositiveNumber() public;
```

### testToMinimalHexStringUint256Max


```solidity
function testToMinimalHexStringUint256Max() public;
```

### testToMinimalHexStringZeroRightPadded


```solidity
function testToMinimalHexStringZeroRightPadded(uint256 x) public pure;
```

### testToMinimalHexStringNoPrefixZero


```solidity
function testToMinimalHexStringNoPrefixZero() public;
```

### testToMinimalHexStringNoPrefixPositiveNumber


```solidity
function testToMinimalHexStringNoPrefixPositiveNumber() public;
```

### testToMinimalHexStringNoPrefixUint256Max


```solidity
function testToMinimalHexStringNoPrefixUint256Max() public;
```

### testToMinimalHexStringNoPrefixZeroRightPadded


```solidity
function testToMinimalHexStringNoPrefixZeroRightPadded(uint256 x) public pure;
```

### testFromAddressToHexStringChecksummed


```solidity
function testFromAddressToHexStringChecksummed() public;
```

### testFromAddressToHexStringChecksummedDifferential


```solidity
function testFromAddressToHexStringChecksummedDifferential(uint256 randomness) public brutalizeMemory;
```

### testHexStringNoPrefixVariants


```solidity
function testHexStringNoPrefixVariants(uint256 x, uint256 randomness) public brutalizeMemory;
```

### testBytesToHexStringNoPrefix


```solidity
function testBytesToHexStringNoPrefix() public;
```

### testBytesToHexStringNoPrefix


```solidity
function testBytesToHexStringNoPrefix(bytes memory raw) public brutalizeMemory;
```

### testBytesToHexString


```solidity
function testBytesToHexString() public;
```

### testBytesToHexString


```solidity
function testBytesToHexString(bytes memory raw) public brutalizeMemory;
```

### testStringIs7BitASCII


```solidity
function testStringIs7BitASCII() public;
```

### testStringIs7BitASCIIDifferential


```solidity
function testStringIs7BitASCIIDifferential(bytes memory raw) public brutalizeMemory;
```

### testStringRuneCountDifferential


```solidity
function testStringRuneCountDifferential(string memory s) public;
```

### testStringRuneCount


```solidity
function testStringRuneCount() public;
```

### testStringReplaceShort


```solidity
function testStringReplaceShort() public;
```

### testStringReplaceMedium


```solidity
function testStringReplaceMedium() public;
```

### testStringReplaceLong


```solidity
function testStringReplaceLong() public;
```

### testStringReplace


```solidity
function testStringReplace(uint256) public brutalizeMemory;
```

### testStringIndexOf


```solidity
function testStringIndexOf(uint256) public brutalizeMemory;
```

### testStringIndexOf


```solidity
function testStringIndexOf() public;
```

### testStringLastIndexOf


```solidity
function testStringLastIndexOf(uint256) public brutalizeMemory;
```

### testStringLastIndexOf


```solidity
function testStringLastIndexOf() public;
```

### testContains


```solidity
function testContains() public;
```

### testStringStartsWith


```solidity
function testStringStartsWith(uint256) public brutalizeMemory;
```

### testStringStartsWith


```solidity
function testStringStartsWith() public;
```

### testStringEndsWith


```solidity
function testStringEndsWith(uint256) public brutalizeMemory;
```

### testStringEndsWith


```solidity
function testStringEndsWith() public;
```

### testStringRepeat


```solidity
function testStringRepeat(string memory subject, uint256 times) public brutalizeMemory;
```

### testStringRepeat


```solidity
function testStringRepeat() public;
```

### testStringRepeatOriginal


```solidity
function testStringRepeatOriginal() public;
```

### testStringSlice


```solidity
function testStringSlice(uint256) public brutalizeMemory;
```

### testStringSlice


```solidity
function testStringSlice() public;
```

### testStringIndicesOf


```solidity
function testStringIndicesOf(uint256) public brutalizeMemory;
```

### testStringIndicesOf


```solidity
function testStringIndicesOf() public;
```

### testStringSplit


```solidity
function testStringSplit(uint256) public brutalizeMemory;
```

### testStringSplit


```solidity
function testStringSplit() public;
```

### testStringConcat


```solidity
function testStringConcat(string memory a, string memory b) public brutalizeMemory;
```

### testStringConcat


```solidity
function testStringConcat() public;
```

### testStringConcatOriginal


```solidity
function testStringConcatOriginal() public;
```

### testStringEscapeHTML


```solidity
function testStringEscapeHTML() public;
```

### testStringEscapeHTML


```solidity
function testStringEscapeHTML(uint256) public brutalizeMemory;
```

### testStringEscapeJSON


```solidity
function testStringEscapeJSON() public;
```

### _checkStringEscapeJSON


```solidity
function _checkStringEscapeJSON(string memory s, string memory expected) internal;
```

### testStringEscapeJSONHexEncode


```solidity
function testStringEscapeJSONHexEncode() public brutalizeMemory;
```

### testStringEq


```solidity
function testStringEq(string memory a, string memory b) public;
```

### checkIsSN


```solidity
function checkIsSN(string memory s) public pure returns (bool);
```

### testStringEqs


```solidity
function testStringEqs() public;
```

### testStringPackAndUnpackOneDifferential


```solidity
function testStringPackAndUnpackOneDifferential(string memory a) public brutalizeMemory;
```

### testStringPackAndUnpackOne


```solidity
function testStringPackAndUnpackOne(string memory a) public brutalizeMemory;
```

### testStringPackAndUnpackOne


```solidity
function testStringPackAndUnpackOne() public;
```

### testStringPackAndUnpackTwoDifferential


```solidity
function testStringPackAndUnpackTwoDifferential(string memory a, string memory b) public brutalizeMemory;
```

### testStringPackAndUnpackTwo


```solidity
function testStringPackAndUnpackTwo(string memory a, string memory b) public brutalizeMemory;
```

### testStringPackAndUnpackTwo


```solidity
function testStringPackAndUnpackTwo() public;
```

### testStringDirectReturn


```solidity
function testStringDirectReturn(string memory a) public;
```

### testStringDirectReturn


```solidity
function testStringDirectReturn() public;
```

### returnString


```solidity
function returnString(string memory a) external pure returns (string memory);
```

### testStringLowerDifferential


```solidity
function testStringLowerDifferential(string memory s) public;
```

### testStringLowerDifferential


```solidity
function testStringLowerDifferential() public;
```

### testStringLowerOriginal


```solidity
function testStringLowerOriginal() public;
```

### testStringUpperDifferential


```solidity
function testStringUpperDifferential(string memory s) public;
```

### testStringUpperDifferential


```solidity
function testStringUpperDifferential() public;
```

### testStringUpperOriginal


```solidity
function testStringUpperOriginal() public;
```

### fromSmallString


```solidity
function fromSmallString() public;
```

### testNormalizeSmallString


```solidity
function testNormalizeSmallString() public;
```

### testNormalizeSmallString


```solidity
function testNormalizeSmallString(bytes32 x) public;
```

### testToSmallString


```solidity
function testToSmallString() public;
```

### _lowerOriginal


```solidity
function _lowerOriginal(string memory subject) internal pure returns (string memory result);
```

### _upperOriginal


```solidity
function _upperOriginal(string memory subject) internal pure returns (string memory result);
```

### _is7BitASCIIOriginal


```solidity
function _is7BitASCIIOriginal(string memory s) internal pure returns (bool);
```

### _runeCountOriginal


```solidity
function _runeCountOriginal(string memory s) internal pure returns (uint256);
```

### _repeatOriginal


```solidity
function _repeatOriginal(string memory subject, uint256 times) internal pure returns (string memory);
```

### _generateFrom


```solidity
function _generateFrom(string memory subject) internal returns (uint256);
```

### _generateString


```solidity
function _generateString(string memory byteChoices) internal returns (string memory result);
```

### _randomStringLength


```solidity
function _randomStringLength() internal returns (uint256 r);
```

### _stringArraysAreSame


```solidity
function _stringArraysAreSame(string[] memory a, string[] memory b) internal pure returns (bool);
```

