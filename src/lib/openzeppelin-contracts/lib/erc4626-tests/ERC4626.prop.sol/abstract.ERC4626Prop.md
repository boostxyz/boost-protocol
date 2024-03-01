# ERC4626Prop
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### _delta_

```solidity
uint256 internal _delta_;
```


### _underlying_

```solidity
address internal _underlying_;
```


### _vault_

```solidity
address internal _vault_;
```


### _vaultMayBeEmpty

```solidity
bool internal _vaultMayBeEmpty;
```


### _unlimitedAmount

```solidity
bool internal _unlimitedAmount;
```


## Functions
### prop_asset


```solidity
function prop_asset(address caller) public;
```

### prop_totalAssets


```solidity
function prop_totalAssets(address caller) public;
```

### prop_convertToShares


```solidity
function prop_convertToShares(address caller1, address caller2, uint256 assets) public;
```

### prop_convertToAssets


```solidity
function prop_convertToAssets(address caller1, address caller2, uint256 shares) public;
```

### prop_maxDeposit


```solidity
function prop_maxDeposit(address caller, address receiver) public;
```

### prop_previewDeposit


```solidity
function prop_previewDeposit(address caller, address receiver, address other, uint256 assets) public;
```

### prop_deposit


```solidity
function prop_deposit(address caller, address receiver, uint256 assets) public;
```

### prop_maxMint


```solidity
function prop_maxMint(address caller, address receiver) public;
```

### prop_previewMint


```solidity
function prop_previewMint(address caller, address receiver, address other, uint256 shares) public;
```

### prop_mint


```solidity
function prop_mint(address caller, address receiver, uint256 shares) public;
```

### prop_maxWithdraw


```solidity
function prop_maxWithdraw(address caller, address owner) public;
```

### prop_previewWithdraw


```solidity
function prop_previewWithdraw(address caller, address receiver, address owner, address other, uint256 assets) public;
```

### prop_withdraw


```solidity
function prop_withdraw(address caller, address receiver, address owner, uint256 assets) public;
```

### prop_maxRedeem


```solidity
function prop_maxRedeem(address caller, address owner) public;
```

### prop_previewRedeem


```solidity
function prop_previewRedeem(address caller, address receiver, address owner, address other, uint256 shares) public;
```

### prop_redeem


```solidity
function prop_redeem(address caller, address receiver, address owner, uint256 shares) public;
```

### prop_RT_deposit_redeem


```solidity
function prop_RT_deposit_redeem(address caller, uint256 assets) public;
```

### prop_RT_deposit_withdraw


```solidity
function prop_RT_deposit_withdraw(address caller, uint256 assets) public;
```

### prop_RT_redeem_deposit


```solidity
function prop_RT_redeem_deposit(address caller, uint256 shares) public;
```

### prop_RT_redeem_mint


```solidity
function prop_RT_redeem_mint(address caller, uint256 shares) public;
```

### prop_RT_mint_withdraw


```solidity
function prop_RT_mint_withdraw(address caller, uint256 shares) public;
```

### prop_RT_mint_redeem


```solidity
function prop_RT_mint_redeem(address caller, uint256 shares) public;
```

### prop_RT_withdraw_mint


```solidity
function prop_RT_withdraw_mint(address caller, uint256 assets) public;
```

### prop_RT_withdraw_deposit


```solidity
function prop_RT_withdraw_deposit(address caller, uint256 assets) public;
```

### vault_convertToShares


```solidity
function vault_convertToShares(uint256 assets) internal returns (uint256);
```

### vault_convertToAssets


```solidity
function vault_convertToAssets(uint256 shares) internal returns (uint256);
```

### vault_maxDeposit


```solidity
function vault_maxDeposit(address receiver) internal returns (uint256);
```

### vault_maxMint


```solidity
function vault_maxMint(address receiver) internal returns (uint256);
```

### vault_maxWithdraw


```solidity
function vault_maxWithdraw(address owner) internal returns (uint256);
```

### vault_maxRedeem


```solidity
function vault_maxRedeem(address owner) internal returns (uint256);
```

### vault_previewDeposit


```solidity
function vault_previewDeposit(uint256 assets) internal returns (uint256);
```

### vault_previewMint


```solidity
function vault_previewMint(uint256 shares) internal returns (uint256);
```

### vault_previewWithdraw


```solidity
function vault_previewWithdraw(uint256 assets) internal returns (uint256);
```

### vault_previewRedeem


```solidity
function vault_previewRedeem(uint256 shares) internal returns (uint256);
```

### vault_deposit


```solidity
function vault_deposit(uint256 assets, address receiver) internal returns (uint256);
```

### vault_mint


```solidity
function vault_mint(uint256 shares, address receiver) internal returns (uint256);
```

### vault_withdraw


```solidity
function vault_withdraw(uint256 assets, address receiver, address owner) internal returns (uint256);
```

### vault_redeem


```solidity
function vault_redeem(uint256 shares, address receiver, address owner) internal returns (uint256);
```

### _call_vault


```solidity
function _call_vault(bytes memory data) internal returns (uint256);
```

### assertApproxGeAbs


```solidity
function assertApproxGeAbs(uint256 a, uint256 b, uint256 maxDelta) internal;
```

### assertApproxLeAbs


```solidity
function assertApproxLeAbs(uint256 a, uint256 b, uint256 maxDelta) internal;
```

