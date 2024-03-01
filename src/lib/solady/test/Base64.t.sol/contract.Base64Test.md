# Base64Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testBase64EncodeEmptyString


```solidity
function testBase64EncodeEmptyString() public;
```

### testBase64EncodeShortStrings


```solidity
function testBase64EncodeShortStrings() public;
```

### testBase64EncodeToStringWithDoublePadding


```solidity
function testBase64EncodeToStringWithDoublePadding() public;
```

### testBase64EncodeToStringWithSinglePadding


```solidity
function testBase64EncodeToStringWithSinglePadding() public;
```

### testBase64EncodeToStringWithNoPadding


```solidity
function testBase64EncodeToStringWithNoPadding() public;
```

### testBase64EncodeSentence


```solidity
function testBase64EncodeSentence() public;
```

### testBase64WordBoundary


```solidity
function testBase64WordBoundary() public;
```

### _testBase64Encode


```solidity
function _testBase64Encode(string memory input, string memory output) private;
```

### testBase64EncodeDecode


```solidity
function testBase64EncodeDecode(bytes memory input) public;
```

### testBase64DecodeShortStringGas


```solidity
function testBase64DecodeShortStringGas() public;
```

### testBase64DecodeSentenceGas


```solidity
function testBase64DecodeSentenceGas() public;
```

### testBase64EncodeDecodeAltModes


```solidity
function testBase64EncodeDecodeAltModes(bytes memory input) public brutalizeMemory;
```

### testBase64EncodeFileSafeAndNoPadding


```solidity
function testBase64EncodeFileSafeAndNoPadding(bytes memory input, bool fileSafe, bool noPadding) public;
```

