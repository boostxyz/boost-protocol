# WETHTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### weth

```solidity
WETH weth;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _expectDepositEvent


```solidity
function _expectDepositEvent(address from, uint256 amount) internal;
```

### _expectDepositEvent


```solidity
function _expectDepositEvent(uint256 amount) internal;
```

### _expectWithdrawalEvent


```solidity
function _expectWithdrawalEvent(address to, uint256 amount) internal;
```

### _expectWithdrawalEvent


```solidity
function _expectWithdrawalEvent(uint256 amount) internal;
```

### testMetadata


```solidity
function testMetadata() public;
```

### testFallbackDeposit


```solidity
function testFallbackDeposit() public;
```

### testDeposit


```solidity
function testDeposit() public;
```

### testWithdraw


```solidity
function testWithdraw() public;
```

### testPartialWithdraw


```solidity
function testPartialWithdraw() public;
```

### testWithdrawToContractWithoutReceiveReverts


```solidity
function testWithdrawToContractWithoutReceiveReverts() public;
```

### testFallbackDeposit


```solidity
function testFallbackDeposit(uint256 amount) public;
```

### testDeposit


```solidity
function testDeposit(uint256 amount) public;
```

### testWithdraw


```solidity
function testWithdraw(uint256 depositAmount, uint256 withdrawAmount) public;
```

### receive


```solidity
receive() external payable;
```

## Events
### Deposit

```solidity
event Deposit(address indexed from, uint256 amount);
```

### Withdrawal

```solidity
event Withdrawal(address indexed to, uint256 amount);
```

