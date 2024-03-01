# MulticallableTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### multicallable

```solidity
MockMulticallable multicallable;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testMulticallableRevertWithMessage


```solidity
function testMulticallableRevertWithMessage(string memory revertMessage) public;
```

### testMulticallableRevertWithMessage


```solidity
function testMulticallableRevertWithMessage() public;
```

### testMulticallableRevertWithCustomError


```solidity
function testMulticallableRevertWithCustomError() public;
```

### testMulticallableRevertWithNothing


```solidity
function testMulticallableRevertWithNothing() public;
```

### testMulticallableReturnDataIsProperlyEncoded


```solidity
function testMulticallableReturnDataIsProperlyEncoded(uint256 a0, uint256 b0, uint256 a1, uint256 b1) public;
```

### testMulticallableReturnDataIsProperlyEncoded


```solidity
function testMulticallableReturnDataIsProperlyEncoded(string memory sIn0, string memory sIn1, uint256 n) public;
```

### testMulticallableReturnDataIsProperlyEncoded


```solidity
function testMulticallableReturnDataIsProperlyEncoded() public;
```

### testMulticallableBenchmark


```solidity
function testMulticallableBenchmark() public;
```

### testMulticallableOriginalBenchmark


```solidity
function testMulticallableOriginalBenchmark() public;
```

### testMulticallableWithNoData


```solidity
function testMulticallableWithNoData() public;
```

### testMulticallablePreservesMsgSender


```solidity
function testMulticallablePreservesMsgSender() public;
```

