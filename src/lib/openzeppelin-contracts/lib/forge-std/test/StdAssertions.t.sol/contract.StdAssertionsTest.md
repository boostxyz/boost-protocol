# StdAssertionsTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### CUSTOM_ERROR

```solidity
string constant CUSTOM_ERROR = "guh!";
```


### EXPECT_PASS

```solidity
bool constant EXPECT_PASS = false;
```


### EXPECT_FAIL

```solidity
bool constant EXPECT_FAIL = true;
```


### SHOULD_REVERT

```solidity
bool constant SHOULD_REVERT = true;
```


### SHOULD_RETURN

```solidity
bool constant SHOULD_RETURN = false;
```


### STRICT_REVERT_DATA

```solidity
bool constant STRICT_REVERT_DATA = true;
```


### NON_STRICT_REVERT_DATA

```solidity
bool constant NON_STRICT_REVERT_DATA = false;
```


### t

```solidity
TestTest t = new TestTest();
```


## Functions
### test_ShouldFail


```solidity
function test_ShouldFail() external;
```

### test_AssertFalse_Pass


```solidity
function test_AssertFalse_Pass() external;
```

### test_AssertFalse_Fail


```solidity
function test_AssertFalse_Fail() external;
```

### test_AssertFalse_Err_Pass


```solidity
function test_AssertFalse_Err_Pass() external;
```

### test_AssertFalse_Err_Fail


```solidity
function test_AssertFalse_Err_Fail() external;
```

### testFuzz_AssertEq_Bool_Pass


```solidity
function testFuzz_AssertEq_Bool_Pass(bool a) external;
```

### testFuzz_AssertEq_Bool_Fail


```solidity
function testFuzz_AssertEq_Bool_Fail(bool a, bool b) external;
```

### testFuzz_AssertEq_BoolErr_Pass


```solidity
function testFuzz_AssertEq_BoolErr_Pass(bool a) external;
```

### testFuzz_AssertEq_BoolErr_Fail


```solidity
function testFuzz_AssertEq_BoolErr_Fail(bool a, bool b) external;
```

### testFuzz_AssertEq_Bytes_Pass


```solidity
function testFuzz_AssertEq_Bytes_Pass(bytes calldata a) external;
```

### testFuzz_AssertEq_Bytes_Fail


```solidity
function testFuzz_AssertEq_Bytes_Fail(bytes calldata a, bytes calldata b) external;
```

### testFuzz_AssertEq_BytesErr_Pass


```solidity
function testFuzz_AssertEq_BytesErr_Pass(bytes calldata a) external;
```

### testFuzz_AssertEq_BytesErr_Fail


```solidity
function testFuzz_AssertEq_BytesErr_Fail(bytes calldata a, bytes calldata b) external;
```

### testFuzz_AssertEq_UintArr_Pass


```solidity
function testFuzz_AssertEq_UintArr_Pass(uint256 e0, uint256 e1, uint256 e2) public;
```

### testFuzz_AssertEq_IntArr_Pass


```solidity
function testFuzz_AssertEq_IntArr_Pass(int256 e0, int256 e1, int256 e2) public;
```

### testFuzz_AssertEq_AddressArr_Pass


```solidity
function testFuzz_AssertEq_AddressArr_Pass(address e0, address e1, address e2) public;
```

### testFuzz_AssertEq_UintArr_FailEl


```solidity
function testFuzz_AssertEq_UintArr_FailEl(uint256 e1) public;
```

### testFuzz_AssertEq_IntArr_FailEl


```solidity
function testFuzz_AssertEq_IntArr_FailEl(int256 e1) public;
```

### testFuzz_AssertEq_AddressArr_FailEl


```solidity
function testFuzz_AssertEq_AddressArr_FailEl(address e1) public;
```

### testFuzz_AssertEq_UintArrErr_FailEl


```solidity
function testFuzz_AssertEq_UintArrErr_FailEl(uint256 e1) public;
```

### testFuzz_AssertEq_IntArrErr_FailEl


```solidity
function testFuzz_AssertEq_IntArrErr_FailEl(int256 e1) public;
```

### testFuzz_AssertEq_AddressArrErr_FailEl


```solidity
function testFuzz_AssertEq_AddressArrErr_FailEl(address e1) public;
```

### testFuzz_AssertEq_UintArr_FailLen


```solidity
function testFuzz_AssertEq_UintArr_FailLen(uint256 lenA, uint256 lenB) public;
```

### testFuzz_AssertEq_IntArr_FailLen


```solidity
function testFuzz_AssertEq_IntArr_FailLen(uint256 lenA, uint256 lenB) public;
```

### testFuzz_AssertEq_AddressArr_FailLen


```solidity
function testFuzz_AssertEq_AddressArr_FailLen(uint256 lenA, uint256 lenB) public;
```

### testFuzz_AssertEq_UintArrErr_FailLen


```solidity
function testFuzz_AssertEq_UintArrErr_FailLen(uint256 lenA, uint256 lenB) public;
```

### testFuzz_AssertEq_IntArrErr_FailLen


```solidity
function testFuzz_AssertEq_IntArrErr_FailLen(uint256 lenA, uint256 lenB) public;
```

### testFuzz_AssertEq_AddressArrErr_FailLen


```solidity
function testFuzz_AssertEq_AddressArrErr_FailLen(uint256 lenA, uint256 lenB) public;
```

### test_AssertEqUint


```solidity
function test_AssertEqUint() public;
```

### testFail_AssertEqUint


```solidity
function testFail_AssertEqUint() public;
```

### testFuzz_AssertApproxEqAbs_Uint_Pass


```solidity
function testFuzz_AssertApproxEqAbs_Uint_Pass(uint256 a, uint256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbs_Uint_Fail


```solidity
function testFuzz_AssertApproxEqAbs_Uint_Fail(uint256 a, uint256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbs_UintErr_Pass


```solidity
function testFuzz_AssertApproxEqAbs_UintErr_Pass(uint256 a, uint256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbs_UintErr_Fail


```solidity
function testFuzz_AssertApproxEqAbs_UintErr_Fail(uint256 a, uint256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbsDecimal_Uint_Pass


```solidity
function testFuzz_AssertApproxEqAbsDecimal_Uint_Pass(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqAbsDecimal_Uint_Fail


```solidity
function testFuzz_AssertApproxEqAbsDecimal_Uint_Fail(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqAbsDecimal_UintErr_Pass


```solidity
function testFuzz_AssertApproxEqAbsDecimal_UintErr_Pass(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqAbsDecimal_UintErr_Fail


```solidity
function testFuzz_AssertApproxEqAbsDecimal_UintErr_Fail(uint256 a, uint256 b, uint256 maxDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqAbs_Int_Pass


```solidity
function testFuzz_AssertApproxEqAbs_Int_Pass(int256 a, int256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbs_Int_Fail


```solidity
function testFuzz_AssertApproxEqAbs_Int_Fail(int256 a, int256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbs_IntErr_Pass


```solidity
function testFuzz_AssertApproxEqAbs_IntErr_Pass(int256 a, int256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbs_IntErr_Fail


```solidity
function testFuzz_AssertApproxEqAbs_IntErr_Fail(int256 a, int256 b, uint256 maxDelta) external;
```

### testFuzz_AssertApproxEqAbsDecimal_Int_Pass


```solidity
function testFuzz_AssertApproxEqAbsDecimal_Int_Pass(int256 a, int256 b, uint256 maxDelta, uint256 decimals) external;
```

### testFuzz_AssertApproxEqAbsDecimal_Int_Fail


```solidity
function testFuzz_AssertApproxEqAbsDecimal_Int_Fail(int256 a, int256 b, uint256 maxDelta, uint256 decimals) external;
```

### testFuzz_AssertApproxEqAbsDecimal_IntErr_Pass


```solidity
function testFuzz_AssertApproxEqAbsDecimal_IntErr_Pass(int256 a, int256 b, uint256 maxDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqAbsDecimal_IntErr_Fail


```solidity
function testFuzz_AssertApproxEqAbsDecimal_IntErr_Fail(int256 a, int256 b, uint256 maxDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqRel_Uint_Pass


```solidity
function testFuzz_AssertApproxEqRel_Uint_Pass(uint256 a, uint256 b, uint256 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRel_Uint_Fail


```solidity
function testFuzz_AssertApproxEqRel_Uint_Fail(uint256 a, uint256 b, uint256 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRel_UintErr_Pass


```solidity
function testFuzz_AssertApproxEqRel_UintErr_Pass(uint256 a, uint256 b, uint256 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRel_UintErr_Fail


```solidity
function testFuzz_AssertApproxEqRel_UintErr_Fail(uint256 a, uint256 b, uint256 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRelDecimal_Uint_Pass


```solidity
function testFuzz_AssertApproxEqRelDecimal_Uint_Pass(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqRelDecimal_Uint_Fail


```solidity
function testFuzz_AssertApproxEqRelDecimal_Uint_Fail(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqRelDecimal_UintErr_Pass


```solidity
function testFuzz_AssertApproxEqRelDecimal_UintErr_Pass(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqRelDecimal_UintErr_Fail


```solidity
function testFuzz_AssertApproxEqRelDecimal_UintErr_Fail(uint256 a, uint256 b, uint256 maxPercentDelta, uint256 decimals)
    external;
```

### testFuzz_AssertApproxEqRel_Int_Pass


```solidity
function testFuzz_AssertApproxEqRel_Int_Pass(int128 a, int128 b, uint128 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRel_Int_Fail


```solidity
function testFuzz_AssertApproxEqRel_Int_Fail(int128 a, int128 b, uint128 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRel_IntErr_Pass


```solidity
function testFuzz_AssertApproxEqRel_IntErr_Pass(int128 a, int128 b, uint128 maxPercentDelta) external;
```

### testFuzz_AssertApproxEqRel_IntErr_Fail


```solidity
function testFuzz_AssertApproxEqRel_IntErr_Fail(int128 a, int128 b, uint128 maxPercentDelta) external;
```

### testAssertApproxEqRelDecimal_Int_Pass


```solidity
function testAssertApproxEqRelDecimal_Int_Pass(int128 a, int128 b, uint128 maxPercentDelta, uint128 decimals)
    external;
```

### testAssertApproxEqRelDecimal_Int_Fail


```solidity
function testAssertApproxEqRelDecimal_Int_Fail(int128 a, int128 b, uint128 maxPercentDelta, uint128 decimals)
    external;
```

### testAssertApproxEqRelDecimal_IntErr_Pass


```solidity
function testAssertApproxEqRelDecimal_IntErr_Pass(int128 a, int128 b, uint128 maxPercentDelta, uint128 decimals)
    external;
```

### testAssertApproxEqRelDecimal_IntErr_Fail


```solidity
function testAssertApproxEqRelDecimal_IntErr_Fail(int128 a, int128 b, uint128 maxPercentDelta, uint128 decimals)
    external;
```

### testFuzz_AssertEqCall_Return_Pass


```solidity
function testFuzz_AssertEqCall_Return_Pass(
    bytes memory callDataA,
    bytes memory callDataB,
    bytes memory returnData,
    bool strictRevertData
) external;
```

### testFuzz_RevertWhenCalled_AssertEqCall_Return_Fail


```solidity
function testFuzz_RevertWhenCalled_AssertEqCall_Return_Fail(
    bytes memory callDataA,
    bytes memory callDataB,
    bytes memory returnDataA,
    bytes memory returnDataB,
    bool strictRevertData
) external;
```

### testFuzz_AssertEqCall_Revert_Pass


```solidity
function testFuzz_AssertEqCall_Revert_Pass(
    bytes memory callDataA,
    bytes memory callDataB,
    bytes memory revertDataA,
    bytes memory revertDataB
) external;
```

### testFuzz_RevertWhenCalled_AssertEqCall_Revert_Fail


```solidity
function testFuzz_RevertWhenCalled_AssertEqCall_Revert_Fail(
    bytes memory callDataA,
    bytes memory callDataB,
    bytes memory revertDataA,
    bytes memory revertDataB
) external;
```

### testFuzz_RevertWhenCalled_AssertEqCall_Fail


```solidity
function testFuzz_RevertWhenCalled_AssertEqCall_Fail(
    bytes memory callDataA,
    bytes memory callDataB,
    bytes memory returnDataA,
    bytes memory returnDataB,
    bool strictRevertData
) external;
```

### testFuzz_AssertNotEq_Bytes_Pass


```solidity
function testFuzz_AssertNotEq_Bytes_Pass(bytes32 a, bytes32 b) external;
```

### testFuzz_AssertNotEq_Bytes_Fail


```solidity
function testFuzz_AssertNotEq_Bytes_Fail(bytes32 a) external;
```

### testFuzz_AssertNotEq_BytesErr_Pass


```solidity
function testFuzz_AssertNotEq_BytesErr_Pass(bytes32 a, bytes32 b) external;
```

### testFuzz_AsserNottEq_BytesErr_Fail


```solidity
function testFuzz_AsserNottEq_BytesErr_Fail(bytes32 a) external;
```

### test_AssertNotEqUint


```solidity
function test_AssertNotEqUint() public;
```

### testFail_AssertNotEqUint


```solidity
function testFail_AssertNotEqUint() public;
```

