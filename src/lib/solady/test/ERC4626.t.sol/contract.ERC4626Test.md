# ERC4626Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### underlying

```solidity
MockERC20 underlying;
```


### vault

```solidity
MockERC4626 vault;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _replaceWithVirtualSharesVault


```solidity
function _replaceWithVirtualSharesVault(uint8 decimalsOffset) internal;
```

### _replaceWithVirtualSharesVault


```solidity
function _replaceWithVirtualSharesVault() internal;
```

### testDifferentialFullMulDiv


```solidity
function testDifferentialFullMulDiv(uint256 x, uint256 y, uint256 d) public;
```

### fullMulDivChecked


```solidity
function fullMulDivChecked(uint256 x, uint256 y, uint256 d) public pure;
```

### fullMulDivUnchecked


```solidity
function fullMulDivUnchecked(uint256 x, uint256 y, uint256 d) public pure;
```

### testMetadata


```solidity
function testMetadata() public;
```

### testUseVirtualShares


```solidity
function testUseVirtualShares() public;
```

### testTryGetAssetDecimals


```solidity
function testTryGetAssetDecimals() public;
```

### _testTryGetAssetDecimals


```solidity
function _testTryGetAssetDecimals(uint8 i) internal;
```

### testSingleDepositWithdraw


```solidity
function testSingleDepositWithdraw(uint128 amount) public;
```

### testSingleMintRedeem


```solidity
function testSingleMintRedeem(uint128 amount) public;
```

### testMultipleMintDepositRedeemWithdraw


```solidity
function testMultipleMintDepositRedeemWithdraw() public;
```

### testVirtualSharesMultipleMintDepositRedeemWithdraw


```solidity
function testVirtualSharesMultipleMintDepositRedeemWithdraw() public;
```

### _testMultipleMintDepositRedeemWithdraw


```solidity
function _testMultipleMintDepositRedeemWithdraw(uint256 slippage) public;
```

### testDepositWithNotEnoughApprovalReverts


```solidity
function testDepositWithNotEnoughApprovalReverts() public;
```

### testWithdrawWithNotEnoughUnderlyingAmountReverts


```solidity
function testWithdrawWithNotEnoughUnderlyingAmountReverts() public;
```

### testRedeemWithNotEnoughShareAmountReverts


```solidity
function testRedeemWithNotEnoughShareAmountReverts() public;
```

### testWithdrawWithNoUnderlyingAmountReverts


```solidity
function testWithdrawWithNoUnderlyingAmountReverts() public;
```

### testRedeemWithNoShareAmountReverts


```solidity
function testRedeemWithNoShareAmountReverts() public;
```

### testDepositWithNoApprovalReverts


```solidity
function testDepositWithNoApprovalReverts() public;
```

### testMintWithNoApprovalReverts


```solidity
function testMintWithNoApprovalReverts() public;
```

### testMintZero


```solidity
function testMintZero() public;
```

### testWithdrawZero


```solidity
function testWithdrawZero() public;
```

### testVaultInteractionsForSomeoneElse


```solidity
function testVaultInteractionsForSomeoneElse() public;
```

## Events
### Deposit

```solidity
event Deposit(address indexed by, address indexed owner, uint256 assets, uint256 shares);
```

### Withdraw

```solidity
event Withdraw(address indexed by, address indexed to, address indexed owner, uint256 assets, uint256 shares);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    address alice;
    address bob;
    uint256 mutationUnderlyingAmount;
    uint256 aliceUnderlyingAmount;
    uint256 aliceShareAmount;
    uint256 bobShareAmount;
    uint256 bobUnderlyingAmount;
    uint256 preMutationShareBal;
    uint256 preMutationBal;
}
```

