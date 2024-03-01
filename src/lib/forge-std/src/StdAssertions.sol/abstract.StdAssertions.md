# StdAssertions
**Inherits:**
[DSTest](/lib/forge-std/lib/ds-test/src/test.sol/contract.DSTest.md)


## Functions
### fail


```solidity
function fail(string memory err) internal virtual;
```

### assertFalse


```solidity
function assertFalse(bool data) internal virtual;
```

### assertFalse


```solidity
function assertFalse(bool data, string memory err) internal virtual;
```

### assertEq


```solidity
function assertEq(bool a, bool b) internal virtual;
```

### assertEq


```solidity
function assertEq(bool a, bool b, string memory err) internal virtual;
```

### assertEq


```solidity
function assertEq(bytes memory a, bytes memory b) internal virtual;
```

### assertEq


```solidity
function assertEq(bytes memory a, bytes memory b, string memory err) internal virtual;
```

### assertEq


```solidity
function assertEq(uint256[] memory a, uint256[] memory b) internal virtual;
```

### assertEq


```solidity
function assertEq(int256[] memory a, int256[] memory b) internal virtual;
```

### assertEq


```solidity
function assertEq(address[] memory a, address[] memory b) internal virtual;
```

### assertEq


```solidity
function assertEq(uint256[] memory a, uint256[] memory b, string memory err) internal virtual;
```

### assertEq


```solidity
function assertEq(int256[] memory a, int256[] memory b, string memory err) internal virtual;
```

### assertEq


```solidity
function assertEq(address[] memory a, address[] memory b, string memory err) internal virtual;
```

### assertEqUint


```solidity
function assertEqUint(uint256 a, uint256 b) internal virtual;
```

### assertApproxEqAbs


```solidity
function assertApproxEqAbs(uint256 a, uint256 b, uint256 maxDelta) internal virtual;
```

### assertApproxEqAbs


```solidity
function assertApproxEqAbs(uint256 a, uint256 b, uint256 maxDelta, string memory err) internal virtual;
```

### assertApproxEqAbsDecimal


```solidity
function assertApproxEqAbsDecimal(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals) internal virtual;
```

### assertApproxEqAbsDecimal


```solidity
function assertApproxEqAbsDecimal(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals, string memory err)
    internal
    virtual;
```

### assertApproxEqAbs


```solidity
function assertApproxEqAbs(int256 a, int256 b, uint256 maxDelta) internal virtual;
```

### assertApproxEqAbs


```solidity
function assertApproxEqAbs(int256 a, int256 b, uint256 maxDelta, string memory err) internal virtual;
```

### assertApproxEqAbsDecimal


```solidity
function assertApproxEqAbsDecimal(int256 a, int256 b, uint256 maxDelta, uint256 decimals) internal virtual;
```

### assertApproxEqAbsDecimal


```solidity
function assertApproxEqAbsDecimal(int256 a, int256 b, uint256 maxDelta, uint256 decimals, string memory err)
    internal
    virtual;
```

### assertApproxEqRel


```solidity
function assertApproxEqRel(uint256 a, uint256 b, uint256 maxPercentDelta) internal virtual;
```

### assertApproxEqRel


```solidity
function assertApproxEqRel(uint256 a, uint256 b, uint256 maxPercentDelta, string memory err) internal virtual;
```

### assertApproxEqRelDecimal


```solidity
function assertApproxEqRelDecimal(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals) internal virtual;
```

### assertApproxEqRelDecimal


```solidity
function assertApproxEqRelDecimal(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals, string memory err)
    internal
    virtual;
```

### assertApproxEqRel


```solidity
function assertApproxEqRel(int256 a, int256 b, uint256 maxPercentDelta) internal virtual;
```

### assertApproxEqRel


```solidity
function assertApproxEqRel(int256 a, int256 b, uint256 maxPercentDelta, string memory err) internal virtual;
```

### assertApproxEqRelDecimal


```solidity
function assertApproxEqRelDecimal(int256 a, int256 b, uint256 maxPercentDelta, uint256 decimals) internal virtual;
```

### assertApproxEqRelDecimal


```solidity
function assertApproxEqRelDecimal(int256 a, int256 b, uint256 maxPercentDelta, uint256 decimals, string memory err)
    internal
    virtual;
```

### assertEqCall


```solidity
function assertEqCall(address target, bytes memory callDataA, bytes memory callDataB) internal virtual;
```

### assertEqCall


```solidity
function assertEqCall(address targetA, bytes memory callDataA, address targetB, bytes memory callDataB)
    internal
    virtual;
```

### assertEqCall


```solidity
function assertEqCall(address target, bytes memory callDataA, bytes memory callDataB, bool strictRevertData)
    internal
    virtual;
```

### assertEqCall


```solidity
function assertEqCall(
    address targetA,
    bytes memory callDataA,
    address targetB,
    bytes memory callDataB,
    bool strictRevertData
) internal virtual;
```

## Events
### log_array

```solidity
event log_array(uint256[] val);
```

### log_array

```solidity
event log_array(int256[] val);
```

### log_array

```solidity
event log_array(address[] val);
```

### log_named_array

```solidity
event log_named_array(string key, uint256[] val);
```

### log_named_array

```solidity
event log_named_array(string key, int256[] val);
```

### log_named_array

```solidity
event log_named_array(string key, address[] val);
```

