# SafeTransferLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### SUCCESS

```solidity
uint256 constant SUCCESS = 1;
```


### REVERTS_WITH_SELECTOR

```solidity
uint256 constant REVERTS_WITH_SELECTOR = 2;
```


### REVERTS_WITH_ANY

```solidity
uint256 constant REVERTS_WITH_ANY = 3;
```


### reverting

```solidity
RevertingToken reverting;
```


### returnsTwo

```solidity
ReturnsTwoToken returnsTwo;
```


### returnsFalse

```solidity
ReturnsFalseToken returnsFalse;
```


### missingReturn

```solidity
MissingReturnToken missingReturn;
```


### returnsTooMuch

```solidity
ReturnsTooMuchToken returnsTooMuch;
```


### returnsRawBytes

```solidity
ReturnsRawBytesToken returnsRawBytes;
```


### returnsTooLittle

```solidity
ReturnsTooLittleToken returnsTooLittle;
```


### erc20

```solidity
MockERC20 erc20;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testTransferWithMissingReturn


```solidity
function testTransferWithMissingReturn() public;
```

### testTransferWithStandardERC20


```solidity
function testTransferWithStandardERC20() public;
```

### testTransferWithReturnsTooMuch


```solidity
function testTransferWithReturnsTooMuch() public;
```

### testTransferWithNonContract


```solidity
function testTransferWithNonContract() public;
```

### testTransferFromWithMissingReturn


```solidity
function testTransferFromWithMissingReturn() public;
```

### testTransferFromWithStandardERC20


```solidity
function testTransferFromWithStandardERC20() public;
```

### testTransferFromWithReturnsTooMuch


```solidity
function testTransferFromWithReturnsTooMuch() public;
```

### testTransferFromWithNonContract


```solidity
function testTransferFromWithNonContract() public;
```

### testApproveWithMissingReturn


```solidity
function testApproveWithMissingReturn() public;
```

### testApproveWithStandardERC20


```solidity
function testApproveWithStandardERC20() public;
```

### testApproveWithReturnsTooMuch


```solidity
function testApproveWithReturnsTooMuch() public;
```

### testApproveWithNonContract


```solidity
function testApproveWithNonContract() public;
```

### testApproveWithRetryWithNonContract


```solidity
function testApproveWithRetryWithNonContract() public;
```

### testTransferETH


```solidity
function testTransferETH() public;
```

### testTransferAllETH


```solidity
function testTransferAllETH() public;
```

### testTryTransferETH


```solidity
function testTryTransferETH() public;
```

### testTryTransferAllETH


```solidity
function testTryTransferAllETH() public;
```

### testTryTransferETHWithNoStorageWrites


```solidity
function testTryTransferETHWithNoStorageWrites() public;
```

### testTryTransferETHWithNoGrief


```solidity
function testTryTransferETHWithNoGrief() public;
```

### testForceTransferETHToGriever


```solidity
function testForceTransferETHToGriever(uint256 amount, uint256 randomness) public;
```

### testForceTransferETHToGriever


```solidity
function testForceTransferETHToGriever() public;
```

### testTransferWithReturnsFalseReverts


```solidity
function testTransferWithReturnsFalseReverts() public;
```

### testTransferWithRevertingReverts


```solidity
function testTransferWithRevertingReverts() public;
```

### testTransferWithReturnsTooLittleReverts


```solidity
function testTransferWithReturnsTooLittleReverts() public;
```

### testTransferFromWithReturnsFalseReverts


```solidity
function testTransferFromWithReturnsFalseReverts() public;
```

### testTransferFromWithRevertingReverts


```solidity
function testTransferFromWithRevertingReverts() public;
```

### testTransferFromWithReturnsTooLittleReverts


```solidity
function testTransferFromWithReturnsTooLittleReverts() public;
```

### testApproveWithReturnsFalseReverts


```solidity
function testApproveWithReturnsFalseReverts() public;
```

### testApproveWithRevertingReverts


```solidity
function testApproveWithRevertingReverts() public;
```

### testApproveWithReturnsTooLittleReverts


```solidity
function testApproveWithReturnsTooLittleReverts() public;
```

### testBalanceOfStandardERC20


```solidity
function testBalanceOfStandardERC20() public view;
```

### testBalanceOfStandardERC20


```solidity
function testBalanceOfStandardERC20(address to, uint256 amount) public;
```

### testTransferAllWithStandardERC20


```solidity
function testTransferAllWithStandardERC20() public;
```

### testTransferAllWithStandardERC20


```solidity
function testTransferAllWithStandardERC20(address to, uint256 amount) public;
```

### testTransferAllFromWithStandardERC20


```solidity
function testTransferAllFromWithStandardERC20() public;
```

### testTransferAllFromWithStandardERC20


```solidity
function testTransferAllFromWithStandardERC20(address to, address from, uint256 amount) public;
```

### testTransferWithMissingReturn


```solidity
function testTransferWithMissingReturn(address to, uint256 amount) public;
```

### testTransferWithStandardERC20


```solidity
function testTransferWithStandardERC20(address to, uint256 amount) public;
```

### testTransferWithReturnsTooMuch


```solidity
function testTransferWithReturnsTooMuch(address to, uint256 amount) public;
```

### testTransferWithNonGarbage


```solidity
function testTransferWithNonGarbage(address to, uint256 amount) public;
```

### testTransferWithNonContract


```solidity
function testTransferWithNonContract(address nonContract, address to, uint256 amount) public;
```

### testTransferETHToContractWithoutFallbackReverts


```solidity
function testTransferETHToContractWithoutFallbackReverts() public;
```

### testTransferAllETHToContractWithoutFallbackReverts


```solidity
function testTransferAllETHToContractWithoutFallbackReverts() public;
```

### testTransferFromWithMissingReturn


```solidity
function testTransferFromWithMissingReturn(address from, address to, uint256 amount) public;
```

### testTransferFromWithStandardERC20


```solidity
function testTransferFromWithStandardERC20(address from, address to, uint256 amount) public;
```

### testTransferFromWithReturnsTooMuch


```solidity
function testTransferFromWithReturnsTooMuch(address from, address to, uint256 amount) public;
```

### testTransferFromWithNonGarbage


```solidity
function testTransferFromWithNonGarbage(address from, address to, uint256 amount) public;
```

### testTransferFromWithNonContract


```solidity
function testTransferFromWithNonContract(address nonContract, address from, address to, uint256 amount) public;
```

### testApproveWithMissingReturn


```solidity
function testApproveWithMissingReturn(address to, uint256 amount) public;
```

### testApproveWithStandardERC20


```solidity
function testApproveWithStandardERC20(address to, uint256 amount) public;
```

### testApproveWithReturnsTooMuch


```solidity
function testApproveWithReturnsTooMuch(address to, uint256 amount) public;
```

### testApproveWithNonGarbage


```solidity
function testApproveWithNonGarbage(address to, uint256 amount) public;
```

### testApproveWithNonContract


```solidity
function testApproveWithNonContract(address nonContract, address to, uint256 amount) public;
```

### testApproveWithRetryWithNonContract


```solidity
function testApproveWithRetryWithNonContract(address nonContract, address to, uint256 amount) public;
```

### testApproveWithRetry


```solidity
function testApproveWithRetry(address to, uint256 amount0, uint256 amount1) public;
```

### testApproveWithRetry


```solidity
function testApproveWithRetry() public;
```

### testTransferETH


```solidity
function testTransferETH(address recipient, uint256 amount) public;
```

### testTransferAllETH


```solidity
function testTransferAllETH(address recipient) public;
```

### testTransferWithReturnsFalseReverts


```solidity
function testTransferWithReturnsFalseReverts(address to, uint256 amount) public;
```

### testTransferWithRevertingReverts


```solidity
function testTransferWithRevertingReverts(address to, uint256 amount) public;
```

### testTransferWithReturnsTooLittleReverts


```solidity
function testTransferWithReturnsTooLittleReverts(address to, uint256 amount) public;
```

### testTransferWithReturnsTwoReverts


```solidity
function testTransferWithReturnsTwoReverts(address to, uint256 amount) public;
```

### testTransferWithGarbageReverts


```solidity
function testTransferWithGarbageReverts(address to, uint256 amount) public;
```

### testTransferFromWithReturnsFalseReverts


```solidity
function testTransferFromWithReturnsFalseReverts(address from, address to, uint256 amount) public;
```

### testTransferFromWithRevertingReverts


```solidity
function testTransferFromWithRevertingReverts(address from, address to, uint256 amount) public;
```

### testTransferFromWithReturnsTooLittleReverts


```solidity
function testTransferFromWithReturnsTooLittleReverts(address from, address to, uint256 amount) public;
```

### testTransferFromWithReturnsTwoReverts


```solidity
function testTransferFromWithReturnsTwoReverts(address from, address to, uint256 amount) public;
```

### testTransferFromWithGarbageReverts


```solidity
function testTransferFromWithGarbageReverts(address from, address to, uint256 amount) public;
```

### testApproveWithReturnsFalseReverts


```solidity
function testApproveWithReturnsFalseReverts(address to, uint256 amount) public;
```

### testApproveWithRevertingReverts


```solidity
function testApproveWithRevertingReverts(address to, uint256 amount) public;
```

### testApproveWithReturnsTooLittleReverts


```solidity
function testApproveWithReturnsTooLittleReverts(address to, uint256 amount) public;
```

### testApproveWithReturnsTwoReverts


```solidity
function testApproveWithReturnsTwoReverts(address to, uint256 amount) public;
```

### testApproveWithGarbageReverts


```solidity
function testApproveWithGarbageReverts(address to, uint256 amount) public;
```

### testTransferETHToContractWithoutFallbackReverts


```solidity
function testTransferETHToContractWithoutFallbackReverts(uint256 amount) public;
```

### testTransferAllETHToContractWithoutFallbackReverts


```solidity
function testTransferAllETHToContractWithoutFallbackReverts(uint256) public;
```

### verifySafeTransfer


```solidity
function verifySafeTransfer(address token, address to, uint256 amount, uint256 mode) public;
```

### verifySafeTransfer


```solidity
function verifySafeTransfer(address token, address to, uint256 amount) public brutalizeMemory;
```

### verifySafeTransferFrom


```solidity
function verifySafeTransferFrom(address token, address from, address to, uint256 amount, uint256 mode) public;
```

### verifySafeTransferFrom


```solidity
function verifySafeTransferFrom(address token, address from, address to, uint256 amount) public brutalizeMemory;
```

### verifySafeApprove


```solidity
function verifySafeApprove(address token, address to, uint256 amount, uint256 mode) public;
```

### verifySafeApprove


```solidity
function verifySafeApprove(address token, address to, uint256 amount) public;
```

### forceApprove


```solidity
function forceApprove(address token, address from, address to, uint256 amount) public;
```

### forceSafeTransferETH


```solidity
function forceSafeTransferETH(address to, uint256 amount, uint256 gasStipend) public;
```

### forceSafeTransferETH


```solidity
function forceSafeTransferETH(address to, uint256 amount) public;
```

### safeTransferETH


```solidity
function safeTransferETH(address to, uint256 amount) public;
```

### safeTransferAllETH


```solidity
function safeTransferAllETH(address to) public;
```

### _generateGarbage


```solidity
function _generateGarbage() internal returns (bytes memory result);
```

### _generateNonGarbage


```solidity
function _generateNonGarbage() internal returns (bytes memory result);
```

### _brutalized


```solidity
function _brutalized(address a) internal pure returns (address result);
```

