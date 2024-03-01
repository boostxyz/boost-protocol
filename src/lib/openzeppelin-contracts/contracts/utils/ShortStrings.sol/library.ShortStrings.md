# ShortStrings
*This library provides functions to convert short memory strings
into a `ShortString` type that can be used as an immutable variable.
Strings of arbitrary length can be optimized using this library if
they are short enough (up to 31 bytes) by packing them with their
length (1 byte) in a single EVM word (32 bytes). Additionally, a
fallback mechanism can be used for every other case.
Usage example:
```solidity
contract Named {
using ShortStrings for *;
ShortString private immutable _name;
string private _nameFallback;
constructor(string memory contractName) {
_name = contractName.toShortStringWithFallback(_nameFallback);
}
function name() external view returns (string memory) {
return _name.toStringWithFallback(_nameFallback);
}
}
```*


## State Variables
### FALLBACK_SENTINEL

```solidity
bytes32 private constant FALLBACK_SENTINEL = 0x00000000000000000000000000000000000000000000000000000000000000FF;
```


## Functions
### toShortString

*Encode a string of at most 31 chars into a `ShortString`.
This will trigger a `StringTooLong` error is the input string is too long.*


```solidity
function toShortString(string memory str) internal pure returns (ShortString);
```

### toString

*Decode a `ShortString` back to a "normal" string.*


```solidity
function toString(ShortString sstr) internal pure returns (string memory);
```

### byteLength

*Return the length of a `ShortString`.*


```solidity
function byteLength(ShortString sstr) internal pure returns (uint256);
```

### toShortStringWithFallback

*Encode a string into a `ShortString`, or write it to storage if it is too long.*


```solidity
function toShortStringWithFallback(string memory value, string storage store) internal returns (ShortString);
```

### toStringWithFallback

*Decode a string that was encoded to `ShortString` or written to storage using {setWithFallback}.*


```solidity
function toStringWithFallback(ShortString value, string storage store) internal pure returns (string memory);
```

### byteLengthWithFallback

*Return the length of a string that was encoded to `ShortString` or written to storage using
{setWithFallback}.
WARNING: This will return the "byte length" of the string. This may not reflect the actual length in terms of
actual characters as the UTF-8 encoding of a single character can span over multiple bytes.*


```solidity
function byteLengthWithFallback(ShortString value, string storage store) internal view returns (uint256);
```

## Errors
### StringTooLong

```solidity
error StringTooLong(string str);
```

### InvalidShortString

```solidity
error InvalidShortString();
```

