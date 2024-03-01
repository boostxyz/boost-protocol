# Base64
*Provides a set of functions to operate with Base64 strings.*


## State Variables
### _TABLE
*Base64 Encoding/Decoding Table
See sections 4 and 5 of https://datatracker.ietf.org/doc/html/rfc4648*


```solidity
string internal constant _TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
```


### _TABLE_URL

```solidity
string internal constant _TABLE_URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
```


## Functions
### encode

*Converts a `bytes` to its Bytes64 `string` representation.*


```solidity
function encode(bytes memory data) internal pure returns (string memory);
```

### encodeURL

*Converts a `bytes` to its Bytes64Url `string` representation.*


```solidity
function encodeURL(bytes memory data) internal pure returns (string memory);
```

### _encode

*Internal table-agnostic conversion*


```solidity
function _encode(bytes memory data, string memory table, bool withPadding) private pure returns (string memory);
```

