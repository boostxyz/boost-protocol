# MetadataReaderLib
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/MetadataReaderLib.sol)

Library for reading contract metadata robustly.


## State Variables
### GAS_STIPEND_NO_GRIEF
*Default gas stipend for contract reads. High enough for most practical use cases
(able to SLOAD about 1000 bytes of data), but low enough to prevent griefing.*


```solidity
uint256 internal constant GAS_STIPEND_NO_GRIEF = 100000;
```


### STRING_LIMIT_DEFAULT
*Default string byte length limit.*


```solidity
uint256 internal constant STRING_LIMIT_DEFAULT = 1000;
```


## Functions
### readName

*Equivalent to `readString(abi.encodeWithSignature("name()"))`.*


```solidity
function readName(address target) internal view returns (string memory);
```

### readName

*Equivalent to `readString(abi.encodeWithSignature("name()"), limit)`.*


```solidity
function readName(address target, uint256 limit) internal view returns (string memory);
```

### readName

*Equivalent to `readString(abi.encodeWithSignature("name()"), limit, gasStipend)`.*


```solidity
function readName(address target, uint256 limit, uint256 gasStipend) internal view returns (string memory);
```

### readSymbol

*Equivalent to `readString(abi.encodeWithSignature("symbol()"))`.*


```solidity
function readSymbol(address target) internal view returns (string memory);
```

### readSymbol

*Equivalent to `readString(abi.encodeWithSignature("symbol()"), limit)`.*


```solidity
function readSymbol(address target, uint256 limit) internal view returns (string memory);
```

### readSymbol

*Equivalent to `readString(abi.encodeWithSignature("symbol()"), limit, gasStipend)`.*


```solidity
function readSymbol(address target, uint256 limit, uint256 gasStipend) internal view returns (string memory);
```

### readString

*Performs a best-effort string query on `target` with `data` as the calldata.
The string will be truncated to `STRING_LIMIT_DEFAULT` (1000) bytes.*


```solidity
function readString(address target, bytes memory data) internal view returns (string memory);
```

### readString

*Performs a best-effort string query on `target` with `data` as the calldata.
The string will be truncated to `limit` bytes.*


```solidity
function readString(address target, bytes memory data, uint256 limit) internal view returns (string memory);
```

### readString

*Performs a best-effort string query on `target` with `data` as the calldata.
The string will be truncated to `limit` bytes.*


```solidity
function readString(address target, bytes memory data, uint256 limit, uint256 gasStipend)
    internal
    view
    returns (string memory);
```

### readDecimals

*Equivalent to `uint8(readUint(abi.encodeWithSignature("decimal()")))`.*


```solidity
function readDecimals(address target) internal view returns (uint8);
```

### readDecimals

*Equivalent to `uint8(readUint(abi.encodeWithSignature("decimal()"), gasStipend))`.*


```solidity
function readDecimals(address target, uint256 gasStipend) internal view returns (uint8);
```

### readUint

*Performs a best-effort uint query on `target` with `data` as the calldata.*


```solidity
function readUint(address target, bytes memory data) internal view returns (uint256);
```

### readUint

*Performs a best-effort uint query on `target` with `data` as the calldata.*


```solidity
function readUint(address target, bytes memory data, uint256 gasStipend) internal view returns (uint256);
```

### _string

*Attempts to read and return a string at `target`.*


```solidity
function _string(address target, bytes32 ptr, uint256 limit, uint256 gasStipend)
    private
    view
    returns (string memory result);
```

### _uint

*Attempts to read and return a uint at `target`.*


```solidity
function _uint(address target, bytes32 ptr, uint256 gasStipend) private view returns (uint256 result);
```

### _ptr

*Casts the function selector `s` into a pointer.*


```solidity
function _ptr(uint256 s) private pure returns (bytes32 result);
```

### _ptr

*Casts the `data` into a pointer.*


```solidity
function _ptr(bytes memory data) private pure returns (bytes32 result);
```

