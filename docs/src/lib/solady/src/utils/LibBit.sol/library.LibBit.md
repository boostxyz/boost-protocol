# LibBit
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibBit.sol), Inspired by (https://graphics.stanford.edu/~seander/bithacks.html)

Library for bit twiddling and boolean operations.


## Functions
### fls

*Find last set.
Returns the index of the most significant bit of `x`,
counting from the least significant bit position.
If `x` is zero, returns 256.*


```solidity
function fls(uint256 x) internal pure returns (uint256 r);
```

### clz

*Count leading zeros.
Returns the number of zeros preceding the most significant one bit.
If `x` is zero, returns 256.*


```solidity
function clz(uint256 x) internal pure returns (uint256 r);
```

### ffs

*Find first set.
Returns the index of the least significant bit of `x`,
counting from the least significant bit position.
If `x` is zero, returns 256.
Equivalent to `ctz` (count trailing zeros), which gives
the number of zeros following the least significant one bit.*


```solidity
function ffs(uint256 x) internal pure returns (uint256 r);
```

### popCount

*Returns the number of set bits in `x`.*


```solidity
function popCount(uint256 x) internal pure returns (uint256 c);
```

### isPo2

*Returns whether `x` is a power of 2.*


```solidity
function isPo2(uint256 x) internal pure returns (bool result);
```

### reverseBits

*Returns `x` reversed at the bit level.*


```solidity
function reverseBits(uint256 x) internal pure returns (uint256 r);
```

### reverseBytes

*Returns `x` reversed at the byte level.*


```solidity
function reverseBytes(uint256 x) internal pure returns (uint256 r);
```

### rawAnd

*Returns `x & y`. Inputs must be clean.*


```solidity
function rawAnd(bool x, bool y) internal pure returns (bool z);
```

### and

*Returns `x & y`.*


```solidity
function and(bool x, bool y) internal pure returns (bool z);
```

### rawOr

*Returns `x | y`. Inputs must be clean.*


```solidity
function rawOr(bool x, bool y) internal pure returns (bool z);
```

### or

*Returns `x | y`.*


```solidity
function or(bool x, bool y) internal pure returns (bool z);
```

### rawToUint

*Returns 1 if `b` is true, else 0. Input must be clean.*


```solidity
function rawToUint(bool b) internal pure returns (uint256 z);
```

### toUint

*Returns 1 if `b` is true, else 0.*


```solidity
function toUint(bool b) internal pure returns (uint256 z);
```

