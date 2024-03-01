# MockERC20Test
**Inherits:**
[StdCheats](/lib/forge-std/src/StdCheats.sol/abstract.StdCheats.md), [Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### token

```solidity
Token_ERC20 token;
```


### PERMIT_TYPEHASH

```solidity
bytes32 constant PERMIT_TYPEHASH =
    keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
```


## Functions
### setUp


```solidity
function setUp() public;
```

### invariantMetadata


```solidity
function invariantMetadata() public;
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

### testFailTransferInsufficientBalance


```solidity
function testFailTransferInsufficientBalance() public;
```

### testFailTransferFromInsufficientAllowance


```solidity
function testFailTransferFromInsufficientAllowance() public;
```

### testFailTransferFromInsufficientBalance


```solidity
function testFailTransferFromInsufficientBalance() public;
```

### testFailPermitBadNonce


```solidity
function testFailPermitBadNonce() public;
```

### testFailPermitBadDeadline


```solidity
function testFailPermitBadDeadline() public;
```

### testFailPermitPastDeadline


```solidity
function testFailPermitPastDeadline() public;
```

### testFailPermitReplay


```solidity
function testFailPermitReplay() public;
```

### testMetadata


```solidity
function testMetadata(string calldata name, string calldata symbol, uint8 decimals) public;
```

### testMint


```solidity
function testMint(address from, uint256 amount) public;
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
function testTransfer(address from, uint256 amount) public;
```

### testTransferFrom


```solidity
function testTransferFrom(address to, uint256 approval, uint256 amount) public;
```

### testPermit


```solidity
function testPermit(uint248 privKey, address to, uint256 amount, uint256 deadline) public;
```

### testFailBurnInsufficientBalance


```solidity
function testFailBurnInsufficientBalance(address to, uint256 mintAmount, uint256 burnAmount) public;
```

### testFailTransferInsufficientBalance


```solidity
function testFailTransferInsufficientBalance(address to, uint256 mintAmount, uint256 sendAmount) public;
```

### testFailTransferFromInsufficientAllowance


```solidity
function testFailTransferFromInsufficientAllowance(address to, uint256 approval, uint256 amount) public;
```

### testFailTransferFromInsufficientBalance


```solidity
function testFailTransferFromInsufficientBalance(address to, uint256 mintAmount, uint256 sendAmount) public;
```

### testFailPermitBadNonce


```solidity
function testFailPermitBadNonce(uint256 privateKey, address to, uint256 amount, uint256 deadline, uint256 nonce)
    public;
```

### testFailPermitBadDeadline


```solidity
function testFailPermitBadDeadline(uint256 privateKey, address to, uint256 amount, uint256 deadline) public;
```

### testFailPermitPastDeadline


```solidity
function testFailPermitPastDeadline(uint256 privateKey, address to, uint256 amount, uint256 deadline) public;
```

### testFailPermitReplay


```solidity
function testFailPermitReplay(uint256 privateKey, address to, uint256 amount, uint256 deadline) public;
```

