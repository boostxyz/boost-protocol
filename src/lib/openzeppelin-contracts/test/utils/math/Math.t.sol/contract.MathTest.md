# MathTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## Functions
### testCeilDiv


```solidity
function testCeilDiv(uint256 a, uint256 b) public;
```

### testSqrt


```solidity
function testSqrt(uint256 input, uint8 r) public;
```

### _squareBigger


```solidity
function _squareBigger(uint256 value, uint256 ref) private pure returns (bool);
```

### _squareSmaller


```solidity
function _squareSmaller(uint256 value, uint256 ref) private pure returns (bool);
```

### testInvMod


```solidity
function testInvMod(uint256 value, uint256 p) public;
```

### testInvMod2


```solidity
function testInvMod2(uint256 seed) public;
```

### testInvMod17


```solidity
function testInvMod17(uint256 seed) public;
```

### testInvMod65537


```solidity
function testInvMod65537(uint256 seed) public;
```

### testInvModP256


```solidity
function testInvModP256(uint256 seed) public;
```

### _testInvMod


```solidity
function _testInvMod(uint256 value, uint256 p, bool allowZero) private;
```

### testLog2


```solidity
function testLog2(uint256 input, uint8 r) public;
```

### _powerOf2Bigger


```solidity
function _powerOf2Bigger(uint256 value, uint256 ref) private pure returns (bool);
```

### _powerOf2Smaller


```solidity
function _powerOf2Smaller(uint256 value, uint256 ref) private pure returns (bool);
```

### testLog10


```solidity
function testLog10(uint256 input, uint8 r) public;
```

### _powerOf10Bigger


```solidity
function _powerOf10Bigger(uint256 value, uint256 ref) private pure returns (bool);
```

### _powerOf10Smaller


```solidity
function _powerOf10Smaller(uint256 value, uint256 ref) private pure returns (bool);
```

### testLog256


```solidity
function testLog256(uint256 input, uint8 r) public;
```

### _powerOf256Bigger


```solidity
function _powerOf256Bigger(uint256 value, uint256 ref) private pure returns (bool);
```

### _powerOf256Smaller


```solidity
function _powerOf256Smaller(uint256 value, uint256 ref) private pure returns (bool);
```

### testMulDiv


```solidity
function testMulDiv(uint256 x, uint256 y, uint256 d) public;
```

### testMulDivDomain


```solidity
function testMulDivDomain(uint256 x, uint256 y, uint256 d) public;
```

### testModExp


```solidity
function testModExp(uint256 b, uint256 e, uint256 m) public;
```

### testTryModExp


```solidity
function testTryModExp(uint256 b, uint256 e, uint256 m) public;
```

### testModExpMemory


```solidity
function testModExpMemory(uint256 b, uint256 e, uint256 m) public;
```

### testTryModExpMemory


```solidity
function testTryModExpMemory(uint256 b, uint256 e, uint256 m) public;
```

### _nativeModExp


```solidity
function _nativeModExp(uint256 b, uint256 e, uint256 m) private pure returns (uint256);
```

### _asRounding


```solidity
function _asRounding(uint8 r) private pure returns (Math.Rounding);
```

### _mulHighLow


```solidity
function _mulHighLow(uint256 x, uint256 y) private pure returns (uint256 high, uint256 low);
```

### _addCarry


```solidity
function _addCarry(uint256 x, uint256 y) private pure returns (uint256 res, uint256 carry);
```

