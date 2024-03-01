# FixedPointMathLib
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/FixedPointMathLib.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/FixedPointMathLib.sol)

Arithmetic library with operations for fixed-point numbers.


## State Variables
### WAD
*The scalar of ETH and most ERC20s.*


```solidity
uint256 internal constant WAD = 1e18;
```


## Functions
### mulWad

*Equivalent to `(x * y) / WAD` rounded down.*


```solidity
function mulWad(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### sMulWad

*Equivalent to `(x * y) / WAD` rounded down.*


```solidity
function sMulWad(int256 x, int256 y) internal pure returns (int256 z);
```

### rawMulWad

*Equivalent to `(x * y) / WAD` rounded down, but without overflow checks.*


```solidity
function rawMulWad(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawSMulWad

*Equivalent to `(x * y) / WAD` rounded down, but without overflow checks.*


```solidity
function rawSMulWad(int256 x, int256 y) internal pure returns (int256 z);
```

### mulWadUp

*Equivalent to `(x * y) / WAD` rounded up.*


```solidity
function mulWadUp(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawMulWadUp

*Equivalent to `(x * y) / WAD` rounded up, but without overflow checks.*


```solidity
function rawMulWadUp(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### divWad

*Equivalent to `(x * WAD) / y` rounded down.*


```solidity
function divWad(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### sDivWad

*Equivalent to `(x * WAD) / y` rounded down.*


```solidity
function sDivWad(int256 x, int256 y) internal pure returns (int256 z);
```

### rawDivWad

*Equivalent to `(x * WAD) / y` rounded down, but without overflow and divide by zero checks.*


```solidity
function rawDivWad(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawSDivWad

*Equivalent to `(x * WAD) / y` rounded down, but without overflow and divide by zero checks.*


```solidity
function rawSDivWad(int256 x, int256 y) internal pure returns (int256 z);
```

### divWadUp

*Equivalent to `(x * WAD) / y` rounded up.*


```solidity
function divWadUp(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawDivWadUp

*Equivalent to `(x * WAD) / y` rounded up, but without overflow and divide by zero checks.*


```solidity
function rawDivWadUp(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### powWad

*Equivalent to `x` to the power of `y`.
because `x ** y = (e ** ln(x)) ** y = e ** (ln(x) * y)`.*


```solidity
function powWad(int256 x, int256 y) internal pure returns (int256);
```

### expWad

*Returns `exp(x)`, denominated in `WAD`.
Credit to Remco Bloemen under MIT license: https://2π.com/22/exp-ln*


```solidity
function expWad(int256 x) internal pure returns (int256 r);
```

### lnWad

*Returns `ln(x)`, denominated in `WAD`.
Credit to Remco Bloemen under MIT license: https://2π.com/22/exp-ln*


```solidity
function lnWad(int256 x) internal pure returns (int256 r);
```

### lambertW0Wad

*Returns `W_0(x)`, denominated in `WAD`.
See: https://en.wikipedia.org/wiki/Lambert_W_function
a.k.a. Product log function. This is an approximation of the principal branch.*


```solidity
function lambertW0Wad(int256 x) internal pure returns (int256 w);
```

### fullMulDiv

*Calculates `floor(x * y / d)` with full precision.
Throws if result overflows a uint256 or when `d` is zero.
Credit to Remco Bloemen under MIT license: https://2π.com/21/muldiv*


```solidity
function fullMulDiv(uint256 x, uint256 y, uint256 d) internal pure returns (uint256 result);
```

### fullMulDivUp

*Calculates `floor(x * y / d)` with full precision, rounded up.
Throws if result overflows a uint256 or when `d` is zero.
Credit to Uniswap-v3-core under MIT license:
https://github.com/Uniswap/v3-core/blob/main/contracts/libraries/FullMath.sol*


```solidity
function fullMulDivUp(uint256 x, uint256 y, uint256 d) internal pure returns (uint256 result);
```

### mulDiv

*Returns `floor(x * y / d)`.
Reverts if `x * y` overflows, or `d` is zero.*


```solidity
function mulDiv(uint256 x, uint256 y, uint256 d) internal pure returns (uint256 z);
```

### mulDivUp

*Returns `ceil(x * y / d)`.
Reverts if `x * y` overflows, or `d` is zero.*


```solidity
function mulDivUp(uint256 x, uint256 y, uint256 d) internal pure returns (uint256 z);
```

### divUp

*Returns `ceil(x / d)`.
Reverts if `d` is zero.*


```solidity
function divUp(uint256 x, uint256 d) internal pure returns (uint256 z);
```

### zeroFloorSub

*Returns `max(0, x - y)`.*


```solidity
function zeroFloorSub(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rpow

*Exponentiate `x` to `y` by squaring, denominated in base `b`.
Reverts if the computation overflows.*


```solidity
function rpow(uint256 x, uint256 y, uint256 b) internal pure returns (uint256 z);
```

### sqrt

*Returns the square root of `x`.*


```solidity
function sqrt(uint256 x) internal pure returns (uint256 z);
```

### cbrt

*Returns the cube root of `x`.
Credit to bout3fiddy and pcaversaccio under AGPLv3 license:
https://github.com/pcaversaccio/snekmate/blob/main/src/utils/Math.vy*


```solidity
function cbrt(uint256 x) internal pure returns (uint256 z);
```

### sqrtWad

*Returns the square root of `x`, denominated in `WAD`.*


```solidity
function sqrtWad(uint256 x) internal pure returns (uint256 z);
```

### cbrtWad

*Returns the cube root of `x`, denominated in `WAD`.*


```solidity
function cbrtWad(uint256 x) internal pure returns (uint256 z);
```

### factorial

*Returns the factorial of `x`.*


```solidity
function factorial(uint256 x) internal pure returns (uint256 result);
```

### log2

*Returns the log2 of `x`.
Equivalent to computing the index of the most significant bit (MSB) of `x`.
Returns 0 if `x` is zero.*


```solidity
function log2(uint256 x) internal pure returns (uint256 r);
```

### log2Up

*Returns the log2 of `x`, rounded up.
Returns 0 if `x` is zero.*


```solidity
function log2Up(uint256 x) internal pure returns (uint256 r);
```

### log10

*Returns the log10 of `x`.
Returns 0 if `x` is zero.*


```solidity
function log10(uint256 x) internal pure returns (uint256 r);
```

### log10Up

*Returns the log10 of `x`, rounded up.
Returns 0 if `x` is zero.*


```solidity
function log10Up(uint256 x) internal pure returns (uint256 r);
```

### log256

*Returns the log256 of `x`.
Returns 0 if `x` is zero.*


```solidity
function log256(uint256 x) internal pure returns (uint256 r);
```

### log256Up

*Returns the log256 of `x`, rounded up.
Returns 0 if `x` is zero.*


```solidity
function log256Up(uint256 x) internal pure returns (uint256 r);
```

### sci

*Returns the scientific notation format `mantissa * 10 ** exponent` of `x`.
Useful for compressing prices (e.g. using 25 bit mantissa and 7 bit exponent).*


```solidity
function sci(uint256 x) internal pure returns (uint256 mantissa, uint256 exponent);
```

### packSci

*Convenience function for packing `x` into a smaller number using `sci`.
The `mantissa` will be in bits [7..255] (the upper 249 bits).
The `exponent` will be in bits [0..6] (the lower 7 bits).
Use `SafeCastLib` to safely ensure that the `packed` number is small
enough to fit in the desired unsigned integer type:
```
uint32 packed = SafeCastLib.toUint32(FixedPointMathLib.packSci(777 ether));
```*


```solidity
function packSci(uint256 x) internal pure returns (uint256 packed);
```

### unpackSci

*Convenience function for unpacking a packed number from `packSci`.*


```solidity
function unpackSci(uint256 packed) internal pure returns (uint256 unpacked);
```

### avg

*Returns the average of `x` and `y`.*


```solidity
function avg(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### avg

*Returns the average of `x` and `y`.*


```solidity
function avg(int256 x, int256 y) internal pure returns (int256 z);
```

### abs

*Returns the absolute value of `x`.*


```solidity
function abs(int256 x) internal pure returns (uint256 z);
```

### dist

*Returns the absolute distance between `x` and `y`.*


```solidity
function dist(int256 x, int256 y) internal pure returns (uint256 z);
```

### min

*Returns the minimum of `x` and `y`.*


```solidity
function min(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### min

*Returns the minimum of `x` and `y`.*


```solidity
function min(int256 x, int256 y) internal pure returns (int256 z);
```

### max

*Returns the maximum of `x` and `y`.*


```solidity
function max(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### max

*Returns the maximum of `x` and `y`.*


```solidity
function max(int256 x, int256 y) internal pure returns (int256 z);
```

### clamp

*Returns `x`, bounded to `minValue` and `maxValue`.*


```solidity
function clamp(uint256 x, uint256 minValue, uint256 maxValue) internal pure returns (uint256 z);
```

### clamp

*Returns `x`, bounded to `minValue` and `maxValue`.*


```solidity
function clamp(int256 x, int256 minValue, int256 maxValue) internal pure returns (int256 z);
```

### gcd

*Returns greatest common divisor of `x` and `y`.*


```solidity
function gcd(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawAdd

*Returns `x + y`, without checking for overflow.*


```solidity
function rawAdd(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawAdd

*Returns `x + y`, without checking for overflow.*


```solidity
function rawAdd(int256 x, int256 y) internal pure returns (int256 z);
```

### rawSub

*Returns `x - y`, without checking for underflow.*


```solidity
function rawSub(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawSub

*Returns `x - y`, without checking for underflow.*


```solidity
function rawSub(int256 x, int256 y) internal pure returns (int256 z);
```

### rawMul

*Returns `x * y`, without checking for overflow.*


```solidity
function rawMul(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawMul

*Returns `x * y`, without checking for overflow.*


```solidity
function rawMul(int256 x, int256 y) internal pure returns (int256 z);
```

### rawDiv

*Returns `x / y`, returning 0 if `y` is zero.*


```solidity
function rawDiv(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawSDiv

*Returns `x / y`, returning 0 if `y` is zero.*


```solidity
function rawSDiv(int256 x, int256 y) internal pure returns (int256 z);
```

### rawMod

*Returns `x % y`, returning 0 if `y` is zero.*


```solidity
function rawMod(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### rawSMod

*Returns `x % y`, returning 0 if `y` is zero.*


```solidity
function rawSMod(int256 x, int256 y) internal pure returns (int256 z);
```

### rawAddMod

*Returns `(x + y) % d`, return 0 if `d` if zero.*


```solidity
function rawAddMod(uint256 x, uint256 y, uint256 d) internal pure returns (uint256 z);
```

### rawMulMod

*Returns `(x * y) % d`, return 0 if `d` if zero.*


```solidity
function rawMulMod(uint256 x, uint256 y, uint256 d) internal pure returns (uint256 z);
```

## Errors
### ExpOverflow
*The operation failed, as the output exceeds the maximum value of uint256.*


```solidity
error ExpOverflow();
```

### FactorialOverflow
*The operation failed, as the output exceeds the maximum value of uint256.*


```solidity
error FactorialOverflow();
```

### RPowOverflow
*The operation failed, due to an overflow.*


```solidity
error RPowOverflow();
```

### MantissaOverflow
*The mantissa is too big to fit.*


```solidity
error MantissaOverflow();
```

### MulWadFailed
*The operation failed, due to an multiplication overflow.*


```solidity
error MulWadFailed();
```

### SMulWadFailed
*The operation failed, due to an multiplication overflow.*


```solidity
error SMulWadFailed();
```

### DivWadFailed
*The operation failed, either due to a multiplication overflow, or a division by a zero.*


```solidity
error DivWadFailed();
```

### SDivWadFailed
*The operation failed, either due to a multiplication overflow, or a division by a zero.*


```solidity
error SDivWadFailed();
```

### MulDivFailed
*The operation failed, either due to a multiplication overflow, or a division by a zero.*


```solidity
error MulDivFailed();
```

### DivFailed
*The division failed, as the denominator is zero.*


```solidity
error DivFailed();
```

### FullMulDivFailed
*The full precision multiply-divide operation failed, either due
to the result being larger than 256 bits, or a division by a zero.*


```solidity
error FullMulDivFailed();
```

### LnWadUndefined
*The output is undefined, as the input is less-than-or-equal to zero.*


```solidity
error LnWadUndefined();
```

### OutOfDomain
*The input outside the acceptable domain.*


```solidity
error OutOfDomain();
```

