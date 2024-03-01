# Base64
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/Base64.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/Base64.sol), Modified from (https://github.com/Brechtpd/base64/blob/main/base64.sol) by Brecht Devos - <brecht@loopring.org>.

Library to encode strings in Base64.


## Functions
### encode

*Encodes `data` using the base64 encoding described in RFC 4648.
See: https://datatracker.ietf.org/doc/html/rfc4648*


```solidity
function encode(bytes memory data, bool fileSafe, bool noPadding) internal pure returns (string memory result);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data`|`bytes`||
|`fileSafe`|`bool`| Whether to replace '+' with '-' and '/' with '_'.|
|`noPadding`|`bool`|Whether to strip away the padding.|


### encode

*Encodes `data` using the base64 encoding described in RFC 4648.
Equivalent to `encode(data, false, false)`.*


```solidity
function encode(bytes memory data) internal pure returns (string memory result);
```

### encode

*Encodes `data` using the base64 encoding described in RFC 4648.
Equivalent to `encode(data, fileSafe, false)`.*


```solidity
function encode(bytes memory data, bool fileSafe) internal pure returns (string memory result);
```

### decode

*Decodes base64 encoded `data`.
Supports:
- RFC 4648 (both standard and file-safe mode).
- RFC 3501 (63: ',').
Does not support:
- Line breaks.
Note: For performance reasons,
this function will NOT revert on invalid `data` inputs.
Outputs for invalid inputs will simply be undefined behaviour.
It is the user's responsibility to ensure that the `data`
is a valid base64 encoded string.*


```solidity
function decode(string memory data) internal pure returns (bytes memory result);
```

