# SignedMath
*Standard signed math utilities missing in the Solidity language.*


## Functions
### max

*Returns the largest of two signed numbers.*


```solidity
function max(int256 a, int256 b) internal pure returns (int256);
```

### min

*Returns the smallest of two signed numbers.*


```solidity
function min(int256 a, int256 b) internal pure returns (int256);
```

### average

*Returns the average of two signed numbers without overflow.
The result is rounded towards zero.*


```solidity
function average(int256 a, int256 b) internal pure returns (int256);
```

### abs

*Returns the absolute unsigned value of a signed value.*


```solidity
function abs(int256 n) internal pure returns (uint256);
```

