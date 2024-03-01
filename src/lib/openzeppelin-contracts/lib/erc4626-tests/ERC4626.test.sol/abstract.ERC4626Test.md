# ERC4626Test
**Inherits:**
[ERC4626Prop](/lib/openzeppelin-contracts/lib/erc4626-tests/ERC4626.prop.sol/abstract.ERC4626Prop.md)


## State Variables
### N

```solidity
uint256 constant N = 4;
```


## Functions
### setUp


```solidity
function setUp() public virtual;
```

### setUpVault


```solidity
function setUpVault(Init memory init) public virtual;
```

### setUpYield


```solidity
function setUpYield(Init memory init) public virtual;
```

### test_asset


```solidity
function test_asset(Init memory init) public virtual;
```

### test_totalAssets


```solidity
function test_totalAssets(Init memory init) public virtual;
```

### test_convertToShares


```solidity
function test_convertToShares(Init memory init, uint256 assets) public virtual;
```

### test_convertToAssets


```solidity
function test_convertToAssets(Init memory init, uint256 shares) public virtual;
```

### test_maxDeposit


```solidity
function test_maxDeposit(Init memory init) public virtual;
```

### test_previewDeposit


```solidity
function test_previewDeposit(Init memory init, uint256 assets) public virtual;
```

### test_deposit


```solidity
function test_deposit(Init memory init, uint256 assets, uint256 allowance) public virtual;
```

### test_maxMint


```solidity
function test_maxMint(Init memory init) public virtual;
```

### test_previewMint


```solidity
function test_previewMint(Init memory init, uint256 shares) public virtual;
```

### test_mint


```solidity
function test_mint(Init memory init, uint256 shares, uint256 allowance) public virtual;
```

### test_maxWithdraw


```solidity
function test_maxWithdraw(Init memory init) public virtual;
```

### test_previewWithdraw


```solidity
function test_previewWithdraw(Init memory init, uint256 assets) public virtual;
```

### test_withdraw


```solidity
function test_withdraw(Init memory init, uint256 assets, uint256 allowance) public virtual;
```

### testFail_withdraw


```solidity
function testFail_withdraw(Init memory init, uint256 assets) public virtual;
```

### test_maxRedeem


```solidity
function test_maxRedeem(Init memory init) public virtual;
```

### test_previewRedeem


```solidity
function test_previewRedeem(Init memory init, uint256 shares) public virtual;
```

### test_redeem


```solidity
function test_redeem(Init memory init, uint256 shares, uint256 allowance) public virtual;
```

### testFail_redeem


```solidity
function testFail_redeem(Init memory init, uint256 shares) public virtual;
```

### test_RT_deposit_redeem


```solidity
function test_RT_deposit_redeem(Init memory init, uint256 assets) public virtual;
```

### test_RT_deposit_withdraw


```solidity
function test_RT_deposit_withdraw(Init memory init, uint256 assets) public virtual;
```

### test_RT_redeem_deposit


```solidity
function test_RT_redeem_deposit(Init memory init, uint256 shares) public virtual;
```

### test_RT_redeem_mint


```solidity
function test_RT_redeem_mint(Init memory init, uint256 shares) public virtual;
```

### test_RT_mint_withdraw


```solidity
function test_RT_mint_withdraw(Init memory init, uint256 shares) public virtual;
```

### test_RT_mint_redeem


```solidity
function test_RT_mint_redeem(Init memory init, uint256 shares) public virtual;
```

### test_RT_withdraw_mint


```solidity
function test_RT_withdraw_mint(Init memory init, uint256 assets) public virtual;
```

### test_RT_withdraw_deposit


```solidity
function test_RT_withdraw_deposit(Init memory init, uint256 assets) public virtual;
```

### _isContract


```solidity
function _isContract(address account) internal view returns (bool);
```

### _isEOA


```solidity
function _isEOA(address account) internal view returns (bool);
```

### _approve


```solidity
function _approve(address token, address owner, address spender, uint256 amount) internal;
```

### _safeApprove


```solidity
function _safeApprove(address token, address spender, uint256 amount) internal;
```

### _max_deposit


```solidity
function _max_deposit(address from) internal virtual returns (uint256);
```

### _max_mint


```solidity
function _max_mint(address from) internal virtual returns (uint256);
```

### _max_withdraw


```solidity
function _max_withdraw(address from) internal virtual returns (uint256);
```

### _max_redeem


```solidity
function _max_redeem(address from) internal virtual returns (uint256);
```

## Structs
### Init

```solidity
struct Init {
    address[N] user;
    uint256[N] share;
    uint256[N] asset;
    int256 yield;
}
```

