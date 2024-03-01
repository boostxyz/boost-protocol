# ERC6909Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### token

```solidity
MockERC6909 token;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testMetadata


```solidity
function testMetadata(uint256 id) public;
```

### testMint


```solidity
function testMint() public;
```

### testDecimals


```solidity
function testDecimals() public;
```

### testBurn


```solidity
function testBurn() public;
```

### testApprove


```solidity
function testApprove() public;
```

### testTransfer


```solidity
function testTransfer() public;
```

### testTransferFrom


```solidity
function testTransferFrom() public;
```

### testInfiniteApproveTransferFrom


```solidity
function testInfiniteApproveTransferFrom() public;
```

### testOperatorTransferFrom


```solidity
function testOperatorTransferFrom() public;
```

### testSetOperator


```solidity
function testSetOperator() public;
```

### testTokenURI


```solidity
function testTokenURI() public;
```

### testMintOverMaxUintReverts


```solidity
function testMintOverMaxUintReverts() public;
```

### testTransferOverMaxUintReverts


```solidity
function testTransferOverMaxUintReverts() public;
```

### testTransferFromOverMaxUintReverts


```solidity
function testTransferFromOverMaxUintReverts() public;
```

### testTransferInsufficientBalanceReverts


```solidity
function testTransferInsufficientBalanceReverts() public;
```

### testTransferFromInsufficientPermission


```solidity
function testTransferFromInsufficientPermission() public;
```

### testTransferFromInsufficientBalanceReverts


```solidity
function testTransferFromInsufficientBalanceReverts() public;
```

### testMint


```solidity
function testMint(address to, uint256 id, uint256 amount) public;
```

### testBurn


```solidity
function testBurn(address from, uint256 id, uint256 mintAmount, uint256 burnAmount) public;
```

### testApprove


```solidity
function testApprove(address to, uint256 id, uint256 amount) public;
```

### testTransfer


```solidity
function testTransfer(address to, uint256 id, uint256 amount) public;
```

### testTransferFrom


```solidity
function testTransferFrom(address spender, address from, address to, uint256 id, uint256 approval, uint256 amount)
    public;
```

### testSetOperator


```solidity
function testSetOperator(address owner, address spender, bool approved) public;
```

### testMintOverMaxUintReverts


```solidity
function testMintOverMaxUintReverts(address to, uint256 id, uint256 amount0, uint256 amount1) public;
```

### testBurnInsufficientBalanceReverts


```solidity
function testBurnInsufficientBalanceReverts(address to, uint256 mintAmount, uint256 id, uint256 burnAmount) public;
```

### testTransferOverMaxUintReverts


```solidity
function testTransferOverMaxUintReverts(address to, uint256 id, uint256 amount0, uint256 amount1) public;
```

### testTransferInsufficientBalanceReverts


```solidity
function testTransferInsufficientBalanceReverts(address to, uint256 id, uint256 mintAmount, uint256 sendAmount)
    public;
```

### testTransferFromOverMaxUintReverts


```solidity
function testTransferFromOverMaxUintReverts(address to, uint256 id, uint256 amount0, uint256 amount1) public;
```

### testTransferFromInsufficientAllowanceReverts


```solidity
function testTransferFromInsufficientAllowanceReverts(address to, uint256 id, uint256 approval, uint256 amount)
    public;
```

### testTransferFromInsufficientBalanceReverts


```solidity
function testTransferFromInsufficientBalanceReverts(address to, uint256 id, uint256 mintAmount, uint256 sendAmount)
    public;
```

### testTransferFromCallerIsNotOperator


```solidity
function testTransferFromCallerIsNotOperator(address to, uint256 id, uint256 amount) public;
```

### testDirectSetOperator


```solidity
function testDirectSetOperator() public;
```

### testDirectApprove


```solidity
function testDirectApprove() public;
```

### testDirectTransfer


```solidity
function testDirectTransfer() public;
```

### testDirectFunctions


```solidity
function testDirectFunctions(uint256) public;
```

### _expectInsufficientBalanceRevert


```solidity
function _expectInsufficientBalanceRevert() internal;
```

### _expectInsufficientPermissionRevert


```solidity
function _expectInsufficientPermissionRevert() internal;
```

### _approve


```solidity
function _approve(address owner, address spender, uint256 id, uint256 amount) internal;
```

### _setOperator


```solidity
function _setOperator(address owner, address operator, bool approved) internal;
```

### _directApprove


```solidity
function _directApprove(address owner, address spender, uint256 id, uint256 amount) internal;
```

### _directSetOperator


```solidity
function _directSetOperator(address owner, address operator, bool approved) internal;
```

## Events
### Transfer

```solidity
event Transfer(address by, address indexed from, address indexed to, uint256 indexed id, uint256 amount);
```

### OperatorSet

```solidity
event OperatorSet(address indexed owner, address indexed spender, bool approved);
```

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 indexed id, uint256 amount);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    uint256 id;
    uint256 allowance;
    bool isOperator;
    uint256 balance;
    uint256 amount;
    address by;
    address from;
    address to;
    bool success;
}
```

