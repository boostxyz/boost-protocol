# Strings
*String operations.*


## State Variables
### HEX_DIGITS

```solidity
bytes16 private constant HEX_DIGITS = "0123456789abcdef";
```


### ADDRESS_LENGTH

```solidity
uint8 private constant ADDRESS_LENGTH = 20;
```


## Functions
### toString

*Converts a `uint256` to its ASCII `string` decimal representation.*


```solidity
function toString(uint256 value) internal pure returns (string memory);
```

### toStringSigned

*Converts a `int256` to its ASCII `string` decimal representation.*


```solidity
function toStringSigned(int256 value) internal pure returns (string memory);
```

### toHexString

*Converts a `uint256` to its ASCII `string` hexadecimal representation.*


```solidity
function toHexString(uint256 value) internal pure returns (string memory);
```

### toHexString

*Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.*


```solidity
function toHexString(uint256 value, uint256 length) internal pure returns (string memory);
```

### toHexString

*Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal
representation.*


```solidity
function toHexString(address addr) internal pure returns (string memory);
```

### equal

*Returns true if the two strings are equal.*


```solidity
function equal(string memory a, string memory b) internal pure returns (bool);
```

## Errors
### StringsInsufficientHexLength
*The `value` string doesn't fit in the specified `length`.*


```solidity
error StringsInsufficientHexLength(uint256 value, uint256 length);
```

