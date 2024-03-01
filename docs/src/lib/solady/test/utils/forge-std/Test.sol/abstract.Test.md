# Test
**Inherits:**
[DSTest](/lib/forge-std/lib/ds-test/src/test.sol/contract.DSTest.md), [Script](/lib/forge-std/src/Script.sol/abstract.Script.md)


## State Variables
### UINT256_MAX

```solidity
uint256 internal constant UINT256_MAX = 115792089237316195423570985008687907853269984665640564039457584007913129639935;
```


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
function assertEq(bool a, bool b) internal;
```

### assertEq


```solidity
function assertEq(bool a, bool b, string memory err) internal;
```

### assertEq


```solidity
function assertEq(bytes memory a, bytes memory b) internal;
```

### assertEq


```solidity
function assertEq(bytes memory a, bytes memory b, string memory err) internal;
```

### assertEq


```solidity
function assertEq(uint256[] memory a, uint256[] memory b) internal;
```

### assertEq


```solidity
function assertEq(int256[] memory a, int256[] memory b) internal;
```

### assertEq


```solidity
function assertEq(address[] memory a, address[] memory b) internal;
```

### assertEq


```solidity
function assertEq(uint256[] memory a, uint256[] memory b, string memory err) internal;
```

### assertEq


```solidity
function assertEq(int256[] memory a, int256[] memory b, string memory err) internal;
```

### assertEq


```solidity
function assertEq(address[] memory a, address[] memory b, string memory err) internal;
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

