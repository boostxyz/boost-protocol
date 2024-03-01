# LibString
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibString.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/LibString.sol)

Library for converting numbers into strings and other string operations.

*Note:
For performance and bytecode compactness, most of the string operations are restricted to
byte strings (7-bit ASCII), except where otherwise specified.
Usage of byte string operations on charsets with runes spanning two or more bytes
can lead to undefined behavior.*


## State Variables
### NOT_FOUND
*The constant returned when the `search` is not found in the string.*


```solidity
uint256 internal constant NOT_FOUND = type(uint256).max;
```


## Functions
### toString

*Returns the base 10 decimal representation of `value`.*


```solidity
function toString(uint256 value) internal pure returns (string memory str);
```

### toString

*Returns the base 10 decimal representation of `value`.*


```solidity
function toString(int256 value) internal pure returns (string memory str);
```

### toHexString

*Returns the hexadecimal representation of `value`,
left-padded to an input length of `length` bytes.
The output is prefixed with "0x" encoded using 2 hexadecimal digits per byte,
giving a total length of `length * 2 + 2` bytes.
Reverts if `length` is too small for the output to contain all the digits.*


```solidity
function toHexString(uint256 value, uint256 length) internal pure returns (string memory str);
```

### toHexStringNoPrefix

*Returns the hexadecimal representation of `value`,
left-padded to an input length of `length` bytes.
The output is prefixed with "0x" encoded using 2 hexadecimal digits per byte,
giving a total length of `length * 2` bytes.
Reverts if `length` is too small for the output to contain all the digits.*


```solidity
function toHexStringNoPrefix(uint256 value, uint256 length) internal pure returns (string memory str);
```

### toHexString

*Returns the hexadecimal representation of `value`.
The output is prefixed with "0x" and encoded using 2 hexadecimal digits per byte.
As address are 20 bytes long, the output will left-padded to have
a length of `20 * 2 + 2` bytes.*


```solidity
function toHexString(uint256 value) internal pure returns (string memory str);
```

### toMinimalHexString

*Returns the hexadecimal representation of `value`.
The output is prefixed with "0x".
The output excludes leading "0" from the `toHexString` output.
`0x00: "0x0", 0x01: "0x1", 0x12: "0x12", 0x123: "0x123"`.*


```solidity
function toMinimalHexString(uint256 value) internal pure returns (string memory str);
```

### toMinimalHexStringNoPrefix

*Returns the hexadecimal representation of `value`.
The output excludes leading "0" from the `toHexStringNoPrefix` output.
`0x00: "0", 0x01: "1", 0x12: "12", 0x123: "123"`.*


```solidity
function toMinimalHexStringNoPrefix(uint256 value) internal pure returns (string memory str);
```

### toHexStringNoPrefix

*Returns the hexadecimal representation of `value`.
The output is encoded using 2 hexadecimal digits per byte.
As address are 20 bytes long, the output will left-padded to have
a length of `20 * 2` bytes.*


```solidity
function toHexStringNoPrefix(uint256 value) internal pure returns (string memory str);
```

### toHexStringChecksummed

*Returns the hexadecimal representation of `value`.
The output is prefixed with "0x", encoded using 2 hexadecimal digits per byte,
and the alphabets are capitalized conditionally according to
https://eips.ethereum.org/EIPS/eip-55*


```solidity
function toHexStringChecksummed(address value) internal pure returns (string memory str);
```

### toHexString

*Returns the hexadecimal representation of `value`.
The output is prefixed with "0x" and encoded using 2 hexadecimal digits per byte.*


```solidity
function toHexString(address value) internal pure returns (string memory str);
```

### toHexStringNoPrefix

*Returns the hexadecimal representation of `value`.
The output is encoded using 2 hexadecimal digits per byte.*


```solidity
function toHexStringNoPrefix(address value) internal pure returns (string memory str);
```

### toHexString

*Returns the hex encoded string from the raw bytes.
The output is encoded using 2 hexadecimal digits per byte.*


```solidity
function toHexString(bytes memory raw) internal pure returns (string memory str);
```

### toHexStringNoPrefix

*Returns the hex encoded string from the raw bytes.
The output is encoded using 2 hexadecimal digits per byte.*


```solidity
function toHexStringNoPrefix(bytes memory raw) internal pure returns (string memory str);
```

### runeCount

*Returns the number of UTF characters in the string.*


```solidity
function runeCount(string memory s) internal pure returns (uint256 result);
```

### is7BitASCII

*Returns if this string is a 7-bit ASCII string.
(i.e. all characters codes are in [0..127])*


```solidity
function is7BitASCII(string memory s) internal pure returns (bool result);
```

### replace

*Returns `subject` all occurrences of `search` replaced with `replacement`.*


```solidity
function replace(string memory subject, string memory search, string memory replacement)
    internal
    pure
    returns (string memory result);
```

### indexOf

*Returns the byte index of the first location of `search` in `subject`,
searching from left to right, starting from `from`.
Returns `NOT_FOUND` (i.e. `type(uint256).max`) if the `search` is not found.*


```solidity
function indexOf(string memory subject, string memory search, uint256 from) internal pure returns (uint256 result);
```

### indexOf

*Returns the byte index of the first location of `search` in `subject`,
searching from left to right.
Returns `NOT_FOUND` (i.e. `type(uint256).max`) if the `search` is not found.*


```solidity
function indexOf(string memory subject, string memory search) internal pure returns (uint256 result);
```

### lastIndexOf

*Returns the byte index of the first location of `search` in `subject`,
searching from right to left, starting from `from`.
Returns `NOT_FOUND` (i.e. `type(uint256).max`) if the `search` is not found.*


```solidity
function lastIndexOf(string memory subject, string memory search, uint256 from)
    internal
    pure
    returns (uint256 result);
```

### lastIndexOf

*Returns the byte index of the first location of `search` in `subject`,
searching from right to left.
Returns `NOT_FOUND` (i.e. `type(uint256).max`) if the `search` is not found.*


```solidity
function lastIndexOf(string memory subject, string memory search) internal pure returns (uint256 result);
```

### contains

*Returns true if `search` is found in `subject`, false otherwise.*


```solidity
function contains(string memory subject, string memory search) internal pure returns (bool);
```

### startsWith

*Returns whether `subject` starts with `search`.*


```solidity
function startsWith(string memory subject, string memory search) internal pure returns (bool result);
```

### endsWith

*Returns whether `subject` ends with `search`.*


```solidity
function endsWith(string memory subject, string memory search) internal pure returns (bool result);
```

### repeat

*Returns `subject` repeated `times`.*


```solidity
function repeat(string memory subject, uint256 times) internal pure returns (string memory result);
```

### slice

*Returns a copy of `subject` sliced from `start` to `end` (exclusive).
`start` and `end` are byte offsets.*


```solidity
function slice(string memory subject, uint256 start, uint256 end) internal pure returns (string memory result);
```

### slice

*Returns a copy of `subject` sliced from `start` to the end of the string.
`start` is a byte offset.*


```solidity
function slice(string memory subject, uint256 start) internal pure returns (string memory result);
```

### indicesOf

*Returns all the indices of `search` in `subject`.
The indices are byte offsets.*


```solidity
function indicesOf(string memory subject, string memory search) internal pure returns (uint256[] memory result);
```

### split

*Returns a arrays of strings based on the `delimiter` inside of the `subject` string.*


```solidity
function split(string memory subject, string memory delimiter) internal pure returns (string[] memory result);
```

### concat

*Returns a concatenated string of `a` and `b`.
Cheaper than `string.concat()` and does not de-align the free memory pointer.*


```solidity
function concat(string memory a, string memory b) internal pure returns (string memory result);
```

### toCase

*Returns a copy of the string in either lowercase or UPPERCASE.
WARNING! This function is only compatible with 7-bit ASCII strings.*


```solidity
function toCase(string memory subject, bool toUpper) internal pure returns (string memory result);
```

### fromSmallString

*Returns a string from a small bytes32 string.
`s` must be null-terminated, or behavior will be undefined.*


```solidity
function fromSmallString(bytes32 s) internal pure returns (string memory result);
```

### normalizeSmallString

*Returns the small string, with all bytes after the first null byte zeroized.*


```solidity
function normalizeSmallString(bytes32 s) internal pure returns (bytes32 result);
```

### toSmallString

*Returns the string as a normalized null-terminated small string.*


```solidity
function toSmallString(string memory s) internal pure returns (bytes32 result);
```

### lower

*Returns a lowercased copy of the string.
WARNING! This function is only compatible with 7-bit ASCII strings.*


```solidity
function lower(string memory subject) internal pure returns (string memory result);
```

### upper

*Returns an UPPERCASED copy of the string.
WARNING! This function is only compatible with 7-bit ASCII strings.*


```solidity
function upper(string memory subject) internal pure returns (string memory result);
```

### escapeHTML

*Escapes the string to be used within HTML tags.*


```solidity
function escapeHTML(string memory s) internal pure returns (string memory result);
```

### escapeJSON

*Escapes the string to be used within double-quotes in a JSON.
If `addDoubleQuotes` is true, the result will be enclosed in double-quotes.*


```solidity
function escapeJSON(string memory s, bool addDoubleQuotes) internal pure returns (string memory result);
```

### escapeJSON

*Escapes the string to be used within double-quotes in a JSON.*


```solidity
function escapeJSON(string memory s) internal pure returns (string memory result);
```

### eq

*Returns whether `a` equals `b`.*


```solidity
function eq(string memory a, string memory b) internal pure returns (bool result);
```

### eqs

*Returns whether `a` equals `b`, where `b` is a null-terminated small string.*


```solidity
function eqs(string memory a, bytes32 b) internal pure returns (bool result);
```

### packOne

*Packs a single string with its length into a single word.
Returns `bytes32(0)` if the length is zero or greater than 31.*


```solidity
function packOne(string memory a) internal pure returns (bytes32 result);
```

### unpackOne

*Unpacks a string packed using [packOne](/lib/solady/src/utils/LibString.sol/library.LibString.md#packone).
Returns the empty string if `packed` is `bytes32(0)`.
If `packed` is not an output of {packOne}, the output behavior is undefined.*


```solidity
function unpackOne(bytes32 packed) internal pure returns (string memory result);
```

### packTwo

*Packs two strings with their lengths into a single word.
Returns `bytes32(0)` if combined length is zero or greater than 30.*


```solidity
function packTwo(string memory a, string memory b) internal pure returns (bytes32 result);
```

### unpackTwo

*Unpacks strings packed using [packTwo](/lib/solady/src/utils/LibString.sol/library.LibString.md#packtwo).
Returns the empty strings if `packed` is `bytes32(0)`.
If `packed` is not an output of {packTwo}, the output behavior is undefined.*


```solidity
function unpackTwo(bytes32 packed) internal pure returns (string memory resultA, string memory resultB);
```

### directReturn

*Directly returns `a` without copying.*


```solidity
function directReturn(string memory a) internal pure;
```

## Errors
### HexLengthInsufficient
*The length of the output is too small to contain all the hex digits.*


```solidity
error HexLengthInsufficient();
```

### TooBigForSmallString
*The length of the string is more than 32 bytes.*


```solidity
error TooBigForSmallString();
```

