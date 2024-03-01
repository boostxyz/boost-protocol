# FixedPointMathLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### _ONE_DIV_EXP

```solidity
int256 internal constant _ONE_DIV_EXP = 367879441171442321;
```


### _LAMBERT_W0_MIN

```solidity
int256 internal constant _LAMBERT_W0_MIN = -367879441171442321;
```


### _EXP

```solidity
int256 internal constant _EXP = 2718281828459045235;
```


### _WAD

```solidity
int256 internal constant _WAD = 10 ** 18;
```


## Functions
### testExpWad


```solidity
function testExpWad() public;
```

### testLambertW0WadKnownValues


```solidity
function testLambertW0WadKnownValues() public;
```

### testLambertW0WadRevertsForOutOfDomain


```solidity
function testLambertW0WadRevertsForOutOfDomain() public;
```

### _checkLambertW0Wad


```solidity
function _checkLambertW0Wad(int256 x, int256 expected) internal;
```

### testLambertW0WadAccuracy


```solidity
function testLambertW0WadAccuracy() public;
```

### testLambertW0WadAccuracy


```solidity
function testLambertW0WadAccuracy(uint184 a) public;
```

### _testLamberW0WadAccuracyThres


```solidity
function _testLamberW0WadAccuracyThres() internal pure returns (int256);
```

### testLambertW0WadWithinBounds


```solidity
function testLambertW0WadWithinBounds(int256 x) public;
```

### testLambertW0WadWithinBounds


```solidity
function testLambertW0WadWithinBounds() public;
```

### testLambertW0WadMonotonicallyIncreasing


```solidity
function testLambertW0WadMonotonicallyIncreasing() public;
```

### testLambertW0WadMonotonicallyIncreasing2


```solidity
function testLambertW0WadMonotonicallyIncreasing2() public;
```

### testLambertW0WadMonoDebug


```solidity
function testLambertW0WadMonoDebug() public;
```

### _testLambertW0WadMonoAround


```solidity
function _testLambertW0WadMonoAround(int256 x) internal;
```

### testLambertW0WadMonotonicallyIncreasingAround2


```solidity
function testLambertW0WadMonotonicallyIncreasingAround2(uint96 t) public;
```

### _testLambertW0WadMonoFocus


```solidity
function _testLambertW0WadMonoFocus(int256 t, int256 i, int256 low, int256 mask) internal;
```

### testLambertW0WadMonotonicallyIncreasingAround


```solidity
function testLambertW0WadMonotonicallyIncreasingAround(int256 t) public;
```

### testLambertW0WadMonotonicallyIncreasing


```solidity
function testLambertW0WadMonotonicallyIncreasing(int256 a, int256 b) public;
```

### _boundLambertW0WadInput


```solidity
function _boundLambertW0WadInput(int256 x) internal pure returns (int256 result);
```

### testMulWad


```solidity
function testMulWad() public;
```

### testMulWadEdgeCases


```solidity
function testMulWadEdgeCases() public;
```

### testSMulWad


```solidity
function testSMulWad() public;
```

### testSMulWadOverflowTrickDifferential


```solidity
function testSMulWadOverflowTrickDifferential(int256 x, int256 y) public;
```

### testSMulWadEdgeCases


```solidity
function testSMulWadEdgeCases() public;
```

### testMulWadUp


```solidity
function testMulWadUp() public;
```

### testMulWadUpEdgeCases


```solidity
function testMulWadUpEdgeCases() public;
```

### testDivWad


```solidity
function testDivWad() public;
```

### testDivWadEdgeCases


```solidity
function testDivWadEdgeCases() public;
```

### testSDivWad


```solidity
function testSDivWad() public;
```

### testSDivWadEdgeCases


```solidity
function testSDivWadEdgeCases() public;
```

### testDivWadZeroDenominatorReverts


```solidity
function testDivWadZeroDenominatorReverts() public;
```

### testDivWadUp


```solidity
function testDivWadUp() public;
```

### testDivWadUpEdgeCases


```solidity
function testDivWadUpEdgeCases() public;
```

### testDivWadUpZeroDenominatorReverts


```solidity
function testDivWadUpZeroDenominatorReverts() public;
```

### testMulDiv


```solidity
function testMulDiv() public;
```

### testMulDivEdgeCases


```solidity
function testMulDivEdgeCases() public;
```

### testMulDivZeroDenominatorReverts


```solidity
function testMulDivZeroDenominatorReverts() public;
```

### testMulDivUp


```solidity
function testMulDivUp() public;
```

### testMulDivUpEdgeCases


```solidity
function testMulDivUpEdgeCases() public;
```

### testMulDivUpZeroDenominator


```solidity
function testMulDivUpZeroDenominator() public;
```

### testLnWad


```solidity
function testLnWad() public;
```

### testLnWadSmall


```solidity
function testLnWadSmall() public;
```

### testLnWadBig


```solidity
function testLnWadBig() public;
```

### testLnWadNegativeReverts


```solidity
function testLnWadNegativeReverts() public;
```

### testLnWadOverflowReverts


```solidity
function testLnWadOverflowReverts() public;
```

### testRPow


```solidity
function testRPow() public;
```

### testRPowOverflowReverts


```solidity
function testRPowOverflowReverts() public;
```

### testSqrt


```solidity
function testSqrt() public;
```

### testSqrtWad


```solidity
function testSqrtWad() public;
```

### testCbrt


```solidity
function testCbrt() public;
```

### testCbrtWad


```solidity
function testCbrtWad() public;
```

### testLog2


```solidity
function testLog2() public;
```

### testLog2Differential


```solidity
function testLog2Differential(uint256 x) public;
```

### _log2Original


```solidity
function _log2Original(uint256 value) internal pure returns (uint256);
```

### testLog2Up


```solidity
function testLog2Up() public;
```

### testAvg


```solidity
function testAvg() public;
```

### testAvgSigned


```solidity
function testAvgSigned() public;
```

### testAvgEdgeCase


```solidity
function testAvgEdgeCase() public;
```

### testAbs


```solidity
function testAbs() public;
```

### testDist


```solidity
function testDist() public;
```

### testDistEdgeCases


```solidity
function testDistEdgeCases() public;
```

### testAbsEdgeCases


```solidity
function testAbsEdgeCases() public;
```

### testGcd


```solidity
function testGcd() public;
```

### testFullMulDiv


```solidity
function testFullMulDiv() public;
```

### testFullMulDivUpRevertsIfRoundedUpResultOverflowsCase1


```solidity
function testFullMulDivUpRevertsIfRoundedUpResultOverflowsCase1() public;
```

### testFullMulDivUpRevertsIfRoundedUpResultOverflowsCase2


```solidity
function testFullMulDivUpRevertsIfRoundedUpResultOverflowsCase2() public;
```

### testFullMulDiv


```solidity
function testFullMulDiv(uint256 a, uint256 b, uint256 d) public returns (uint256 result);
```

### testFullMulDivUp


```solidity
function testFullMulDivUp(uint256 a, uint256 b, uint256 d) public;
```

### testMulWad


```solidity
function testMulWad(uint256 x, uint256 y) public;
```

### testSMulWad


```solidity
function testSMulWad(int256 x, int256 y) public;
```

### testMulWadOverflowReverts


```solidity
function testMulWadOverflowReverts(uint256 x, uint256 y) public;
```

### testSMulWadOverflowRevertsOnCondition1


```solidity
function testSMulWadOverflowRevertsOnCondition1(int256 x, int256 y) public;
```

### testSMulWadOverflowRevertsOnCondition2


```solidity
function testSMulWadOverflowRevertsOnCondition2(int256 x) public;
```

### testMulWadUp


```solidity
function testMulWadUp(uint256 x, uint256 y) public;
```

### testMulWadUpOverflowReverts


```solidity
function testMulWadUpOverflowReverts(uint256 x, uint256 y) public;
```

### testDivWad


```solidity
function testDivWad(uint256 x, uint256 y) public;
```

### testSDivWad


```solidity
function testSDivWad(int256 x, int256 y) public;
```

### testDivWadOverflowReverts


```solidity
function testDivWadOverflowReverts(uint256 x, uint256 y) public;
```

### testSDivWadOverflowReverts


```solidity
function testSDivWadOverflowReverts(int256 x, int256 y) public;
```

### testDivWadZeroDenominatorReverts


```solidity
function testDivWadZeroDenominatorReverts(uint256 x) public;
```

### testSDivWadZeroDenominatorReverts


```solidity
function testSDivWadZeroDenominatorReverts(int256 x) public;
```

### testDivWadUp


```solidity
function testDivWadUp(uint256 x, uint256 y) public;
```

### testDivWadUpOverflowReverts


```solidity
function testDivWadUpOverflowReverts(uint256 x, uint256 y) public;
```

### testDivWadUpZeroDenominatorReverts


```solidity
function testDivWadUpZeroDenominatorReverts(uint256 x) public;
```

### testMulDiv


```solidity
function testMulDiv(uint256 x, uint256 y, uint256 denominator) public;
```

### testMulDivOverflowReverts


```solidity
function testMulDivOverflowReverts(uint256 x, uint256 y, uint256 denominator) public;
```

### testMulDivZeroDenominatorReverts


```solidity
function testMulDivZeroDenominatorReverts(uint256 x, uint256 y) public;
```

### testMulDivUp


```solidity
function testMulDivUp(uint256 x, uint256 y, uint256 denominator) public;
```

### testMulDivUpOverflowReverts


```solidity
function testMulDivUpOverflowReverts(uint256 x, uint256 y, uint256 denominator) public;
```

### testMulDivUpZeroDenominatorReverts


```solidity
function testMulDivUpZeroDenominatorReverts(uint256 x, uint256 y) public;
```

### testCbrt


```solidity
function testCbrt(uint256 x) public;
```

### testCbrtWad


```solidity
function testCbrtWad(uint256 x) public;
```

### testCbrtBack


```solidity
function testCbrtBack(uint256 x) public;
```

### testSqrt


```solidity
function testSqrt(uint256 x) public;
```

### testSqrtWad


```solidity
function testSqrtWad(uint256 x) public;
```

### testSqrtBack


```solidity
function testSqrtBack(uint256 x) public;
```

### testSqrtHashed


```solidity
function testSqrtHashed(uint256 x) public;
```

### testSqrtHashedSingle


```solidity
function testSqrtHashedSingle() public;
```

### testMin


```solidity
function testMin(uint256 x, uint256 y) public;
```

### testMinBrutalized


```solidity
function testMinBrutalized(uint256 x, uint256 y) public;
```

### testMinSigned


```solidity
function testMinSigned(int256 x, int256 y) public;
```

### testMax


```solidity
function testMax(uint256 x, uint256 y) public;
```

### testMaxSigned


```solidity
function testMaxSigned(int256 x, int256 y) public;
```

### testMaxCasted


```solidity
function testMaxCasted(uint32 x, uint32 y, uint256 brutalizer) public;
```

### testZeroFloorSub


```solidity
function testZeroFloorSub(uint256 x, uint256 y) public;
```

### testZeroFloorSubCasted


```solidity
function testZeroFloorSubCasted(uint32 x, uint32 y, uint256 brutalizer) public;
```

### testDist


```solidity
function testDist(int256 x, int256 y) public;
```

### testAbs


```solidity
function testAbs(int256 x) public;
```

### testGcd


```solidity
function testGcd(uint256 x, uint256 y) public;
```

### testClamp


```solidity
function testClamp(uint256 x, uint256 minValue, uint256 maxValue) public;
```

### testClampSigned


```solidity
function testClampSigned(int256 x, int256 minValue, int256 maxValue) public;
```

### testFactorial


```solidity
function testFactorial() public;
```

### testFactorialOriginal


```solidity
function testFactorialOriginal() public;
```

### _factorialOriginal


```solidity
function _factorialOriginal(uint256 x) internal pure returns (uint256 result);
```

### _gcd


```solidity
function _gcd(uint256 x, uint256 y) internal pure returns (uint256 result);
```

### testRawAdd


```solidity
function testRawAdd(uint256 x, uint256 y) public;
```

### testRawAdd


```solidity
function testRawAdd(int256 x, int256 y) public;
```

### testRawSub


```solidity
function testRawSub(uint256 x, uint256 y) public;
```

### testRawSub


```solidity
function testRawSub(int256 x, int256 y) public;
```

### testRawMul


```solidity
function testRawMul(uint256 x, uint256 y) public;
```

### testRawMul


```solidity
function testRawMul(int256 x, int256 y) public;
```

### testRawDiv


```solidity
function testRawDiv(uint256 x, uint256 y) public;
```

### testRawSDiv


```solidity
function testRawSDiv(int256 x, int256 y) public;
```

### testRawMod


```solidity
function testRawMod(uint256 x, uint256 y) public;
```

### testRawSMod


```solidity
function testRawSMod(int256 x, int256 y) public;
```

### testRawAddMod


```solidity
function testRawAddMod(uint256 x, uint256 y, uint256 denominator) public;
```

### testRawMulMod


```solidity
function testRawMulMod(uint256 x, uint256 y, uint256 denominator) public;
```

### testLog10


```solidity
function testLog10() public;
```

### testLog10


```solidity
function testLog10(uint256 i, uint256 j) public;
```

### testLog10Up


```solidity
function testLog10Up() public;
```

### testLog256


```solidity
function testLog256() public;
```

### testLog256


```solidity
function testLog256(uint256 i, uint256 j) public;
```

### testLog256Up


```solidity
function testLog256Up() public;
```

### testSci


```solidity
function testSci() public;
```

### testSci


```solidity
function testSci(uint256 a) public;
```

### testSci2


```solidity
function testSci2(uint256 x) public;
```

### _testSci


```solidity
function _testSci(uint256 x, uint256 expectedMantissa, uint256 expectedExponent) internal;
```

### testPackUnpackSci


```solidity
function testPackUnpackSci(uint256) public;
```

### testPackUnpackSci


```solidity
function testPackUnpackSci() public;
```

## Events
### TestingLambertW0WadMonotonicallyIncreasing

```solidity
event TestingLambertW0WadMonotonicallyIncreasing(
    int256 a, int256 b, int256 w0a, int256 w0b, bool success, uint256 gasUsed
);
```

