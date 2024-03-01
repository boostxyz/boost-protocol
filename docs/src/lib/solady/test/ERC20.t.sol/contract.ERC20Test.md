# ERC20Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### token

```solidity
MockERC20 token;
```


### PERMIT_TYPEHASH

```solidity
bytes32 constant PERMIT_TYPEHASH =
    keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
```


## Functions
### _testTemps


```solidity
function _testTemps() internal returns (_TestTemps memory t);
```

### setUp


```solidity
function setUp() public;
```

### testMetadata


```solidity
function testMetadata() public;
```

### testMint


```solidity
function testMint() public;
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

### testPermit


```solidity
function testPermit() public;
```

### testMintOverMaxUintReverts


```solidity
function testMintOverMaxUintReverts() public;
```

### testTransferInsufficientBalanceReverts


```solidity
function testTransferInsufficientBalanceReverts() public;
```

### testTransferFromInsufficientAllowanceReverts


```solidity
function testTransferFromInsufficientAllowanceReverts() public;
```

### testTransferFromInsufficientBalanceReverts


```solidity
function testTransferFromInsufficientBalanceReverts() public;
```

### testMint


```solidity
function testMint(address to, uint256 amount) public;
```

### testBurn


```solidity
function testBurn(address from, uint256 mintAmount, uint256 burnAmount) public;
```

### testApprove


```solidity
function testApprove(address to, uint256 amount) public;
```

### testTransfer


```solidity
function testTransfer(address to, uint256 amount) public;
```

### testTransferFrom


```solidity
function testTransferFrom(address spender, address from, address to, uint256 approval, uint256 amount) public;
```

### testDirectTransfer


```solidity
function testDirectTransfer(uint256) public;
```

### testDirectSpendAllowance


```solidity
function testDirectSpendAllowance(uint256) public;
```

### testPermit


```solidity
function testPermit(uint256) public;
```

### _checkAllowanceAndNonce


```solidity
function _checkAllowanceAndNonce(_TestTemps memory t) internal;
```

### testBurnInsufficientBalanceReverts


```solidity
function testBurnInsufficientBalanceReverts(address to, uint256 mintAmount, uint256 burnAmount) public;
```

### testTransferInsufficientBalanceReverts


```solidity
function testTransferInsufficientBalanceReverts(address to, uint256 mintAmount, uint256 sendAmount) public;
```

### testTransferFromInsufficientAllowanceReverts


```solidity
function testTransferFromInsufficientAllowanceReverts(address to, uint256 approval, uint256 amount) public;
```

### testTransferFromInsufficientBalanceReverts


```solidity
function testTransferFromInsufficientBalanceReverts(address to, uint256 mintAmount, uint256 sendAmount) public;
```

### testPermitBadNonceReverts


```solidity
function testPermitBadNonceReverts(uint256) public;
```

### testPermitBadDeadlineReverts


```solidity
function testPermitBadDeadlineReverts(uint256) public;
```

### testPermitPastDeadlineReverts


```solidity
function testPermitPastDeadlineReverts(uint256) public;
```

### testPermitReplayReverts


```solidity
function testPermitReplayReverts(uint256) public;
```

### _signPermit


```solidity
function _signPermit(_TestTemps memory t) internal view;
```

### _expectPermitEmitApproval


```solidity
function _expectPermitEmitApproval(_TestTemps memory t) internal;
```

### _permit


```solidity
function _permit(_TestTemps memory t) internal;
```

## Events
### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 amount);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    address owner;
    address to;
    uint256 amount;
    uint256 deadline;
    uint8 v;
    bytes32 r;
    bytes32 s;
    uint256 privateKey;
    uint256 nonce;
}
```

