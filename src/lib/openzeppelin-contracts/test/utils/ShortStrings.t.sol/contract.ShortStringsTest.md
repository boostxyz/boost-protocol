# ShortStringsTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### _fallback

```solidity
string _fallback;
```


## Functions
### testRoundtripShort


```solidity
function testRoundtripShort(string memory input) external;
```

### testRoundtripWithFallback


```solidity
function testRoundtripWithFallback(string memory input, string memory fallbackInitial) external;
```

### testRevertLong


```solidity
function testRevertLong(string memory input) external;
```

### testLengthShort


```solidity
function testLengthShort(string memory input) external;
```

### testLengthWithFallback


```solidity
function testLengthWithFallback(string memory input, string memory fallbackInitial) external;
```

### toShortString


```solidity
function toShortString(string memory input) external pure returns (ShortString);
```

### _isShort


```solidity
function _isShort(string memory input) internal pure returns (bool);
```

