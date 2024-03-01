# TestTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## Functions
### expectFailure


```solidity
modifier expectFailure(bool expectFail);
```

### _fail


```solidity
function _fail(string memory err) external expectFailure(true);
```

### _assertFalse


```solidity
function _assertFalse(bool data, bool expectFail) external expectFailure(expectFail);
```

### _assertFalse


```solidity
function _assertFalse(bool data, string memory err, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(bool a, bool b, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(bool a, bool b, string memory err, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(bytes memory a, bytes memory b, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(bytes memory a, bytes memory b, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(uint256[] memory a, uint256[] memory b, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(int256[] memory a, int256[] memory b, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(address[] memory a, address[] memory b, bool expectFail) external expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(uint256[] memory a, uint256[] memory b, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(int256[] memory a, int256[] memory b, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertEq


```solidity
function _assertEq(address[] memory a, address[] memory b, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertNotEq


```solidity
function _assertNotEq(bytes32 a, bytes32 b, bool expectFail) external expectFailure(expectFail);
```

### _assertNotEq


```solidity
function _assertNotEq(bytes32 a, bytes32 b, string memory err, bool expectFail) external expectFailure(expectFail);
```

### _assertApproxEqAbs


```solidity
function _assertApproxEqAbs(uint256 a, uint256 b, uint256 maxDelta, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqAbs


```solidity
function _assertApproxEqAbs(uint256 a, uint256 b, uint256 maxDelta, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqAbsDecimal


```solidity
function _assertApproxEqAbsDecimal(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqAbsDecimal


```solidity
function _assertApproxEqAbsDecimal(
    uint256 a,
    uint256 b,
    uint256 maxDelta,
    uint256 decimals,
    string memory err,
    bool expectFail
) external expectFailure(expectFail);
```

### _assertApproxEqAbs


```solidity
function _assertApproxEqAbs(int256 a, int256 b, uint256 maxDelta, bool expectFail) external expectFailure(expectFail);
```

### _assertApproxEqAbs


```solidity
function _assertApproxEqAbs(int256 a, int256 b, uint256 maxDelta, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqAbsDecimal


```solidity
function _assertApproxEqAbsDecimal(int256 a, int256 b, uint256 maxDelta, uint256 decimals, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqAbsDecimal


```solidity
function _assertApproxEqAbsDecimal(
    int256 a,
    int256 b,
    uint256 maxDelta,
    uint256 decimals,
    string memory err,
    bool expectFail
) external expectFailure(expectFail);
```

### _assertApproxEqRel


```solidity
function _assertApproxEqRel(uint256 a, uint256 b, uint256 maxPercentDelta, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqRel


```solidity
function _assertApproxEqRel(uint256 a, uint256 b, uint256 maxPercentDelta, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqRelDecimal


```solidity
function _assertApproxEqRelDecimal(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqRelDecimal


```solidity
function _assertApproxEqRelDecimal(
    uint256 a,
    uint256 b,
    uint256 maxPercentDelta,
    uint256 decimals,
    string memory err,
    bool expectFail
) external expectFailure(expectFail);
```

### _assertApproxEqRel


```solidity
function _assertApproxEqRel(int256 a, int256 b, uint256 maxPercentDelta, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqRel


```solidity
function _assertApproxEqRel(int256 a, int256 b, uint256 maxPercentDelta, string memory err, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqRelDecimal


```solidity
function _assertApproxEqRelDecimal(int256 a, int256 b, uint256 maxPercentDelta, uint256 decimals, bool expectFail)
    external
    expectFailure(expectFail);
```

### _assertApproxEqRelDecimal


```solidity
function _assertApproxEqRelDecimal(
    int256 a,
    int256 b,
    uint256 maxPercentDelta,
    uint256 decimals,
    string memory err,
    bool expectFail
) external expectFailure(expectFail);
```

### _assertEqCall


```solidity
function _assertEqCall(
    address targetA,
    bytes memory callDataA,
    address targetB,
    bytes memory callDataB,
    bool strictRevertData,
    bool expectFail
) external expectFailure(expectFail);
```

