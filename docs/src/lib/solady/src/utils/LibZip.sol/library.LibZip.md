# LibZip
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibZip.sol), Calldata compression by clabby (https://github.com/clabby/op-kompressor), FastLZ by ariya (https://github.com/ariya/FastLZ)

Library for compressing and decompressing bytes.

*Note:
The accompanying solady.js library includes implementations of
FastLZ and calldata operations for convenience.*


## Functions
### flzCompress

*Returns the compressed `data`.*


```solidity
function flzCompress(bytes memory data) internal pure returns (bytes memory result);
```

### flzDecompress

*Returns the decompressed `data`.*


```solidity
function flzDecompress(bytes memory data) internal pure returns (bytes memory result);
```

### cdCompress

*Returns the compressed `data`.*


```solidity
function cdCompress(bytes memory data) internal pure returns (bytes memory result);
```

### cdDecompress

*Returns the decompressed `data`.*


```solidity
function cdDecompress(bytes memory data) internal pure returns (bytes memory result);
```

### cdFallback

*To be called in the `fallback` function.
```
fallback() external payable { LibZip.cdFallback(); }
receive() external payable {} // Silence compiler warning to add a `receive` function.
```
For efficiency, this function will directly return the results, terminating the context.
If called internally, it must be called at the end of the function.*


```solidity
function cdFallback() internal;
```

