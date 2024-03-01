# ERC4626
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)

**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/ERC4626.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/mixins/ERC4626.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC4626.sol)

Simple ERC4626 tokenized Vault implementation.


## State Variables
### _DEFAULT_UNDERLYING_DECIMALS
*The default underlying decimals.*


```solidity
uint8 internal constant _DEFAULT_UNDERLYING_DECIMALS = 18;
```


### _DEFAULT_DECIMALS_OFFSET
*The default decimals offset.*


```solidity
uint8 internal constant _DEFAULT_DECIMALS_OFFSET = 0;
```


### _DEPOSIT_EVENT_SIGNATURE
*`keccak256(bytes("Deposit(address,address,uint256,uint256)"))`.*


```solidity
uint256 private constant _DEPOSIT_EVENT_SIGNATURE = 0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7;
```


### _WITHDRAW_EVENT_SIGNATURE
*`keccak256(bytes("Withdraw(address,address,address,uint256,uint256)"))`.*


```solidity
uint256 private constant _WITHDRAW_EVENT_SIGNATURE = 0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db;
```


## Functions
### asset

*To be overridden to return the address of the underlying asset.
- MUST be an ERC20 token contract.
- MUST NOT revert.*


```solidity
function asset() public view virtual returns (address);
```

### _underlyingDecimals

*To be overridden to return the number of decimals of the underlying asset.
Default: 18.
- MUST NOT revert.*


```solidity
function _underlyingDecimals() internal view virtual returns (uint8);
```

### _decimalsOffset

*Override to return a non-zero value to make the inflation attack even more unfeasible.
Only used when [_useVirtualShares](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#_usevirtualshares) returns true.
Default: 0.
- MUST NOT revert.*


```solidity
function _decimalsOffset() internal view virtual returns (uint8);
```

### _useVirtualShares

*Returns whether virtual shares will be used to mitigate the inflation attack.
See: https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3706
Override to return true or false.
Default: true.
- MUST NOT revert.*


```solidity
function _useVirtualShares() internal view virtual returns (bool);
```

### decimals

*Returns the decimals places of the token.
- MUST NOT revert.*


```solidity
function decimals() public view virtual override(ERC20) returns (uint8);
```

### _tryGetAssetDecimals

*Helper function to get the decimals of the underlying asset.
Useful for setting the return value of `_underlyingDecimals` during initialization.
If the retrieval succeeds, `success` will be true, and `result` will hold the result.
Otherwise, `success` will be false, and `result` will be zero.
Example usage:
```
(bool success, uint8 result) = _tryGetAssetDecimals(underlying);
_decimals = success ? result : _DEFAULT_UNDERLYING_DECIMALS;
```*


```solidity
function _tryGetAssetDecimals(address underlying) internal view returns (bool success, uint8 result);
```

### totalAssets

*Returns the total amount of the underlying asset managed by the Vault.
- SHOULD include any compounding that occurs from the yield.
- MUST be inclusive of any fees that are charged against assets in the Vault.
- MUST NOT revert.*


```solidity
function totalAssets() public view virtual returns (uint256 assets);
```

### convertToShares

*Returns the amount of shares that the Vault will exchange for the amount of
assets provided, in an ideal scenario where all conditions are met.
- MUST NOT be inclusive of any fees that are charged against assets in the Vault.
- MUST NOT show any variations depending on the caller.
- MUST NOT reflect slippage or other on-chain conditions, during the actual exchange.
- MUST NOT revert.
Note: This calculation MAY NOT reflect the "per-user" price-per-share, and instead
should reflect the "average-user's" price-per-share, i.e. what the average user should
expect to see when exchanging to and from.*


```solidity
function convertToShares(uint256 assets) public view virtual returns (uint256 shares);
```

### convertToAssets

*Returns the amount of assets that the Vault will exchange for the amount of
shares provided, in an ideal scenario where all conditions are met.
- MUST NOT be inclusive of any fees that are charged against assets in the Vault.
- MUST NOT show any variations depending on the caller.
- MUST NOT reflect slippage or other on-chain conditions, during the actual exchange.
- MUST NOT revert.
Note: This calculation MAY NOT reflect the "per-user" price-per-share, and instead
should reflect the "average-user's" price-per-share, i.e. what the average user should
expect to see when exchanging to and from.*


```solidity
function convertToAssets(uint256 shares) public view virtual returns (uint256 assets);
```

### previewDeposit

*Allows an on-chain or off-chain user to simulate the effects of their deposit
at the current block, given current on-chain conditions.
- MUST return as close to and no more than the exact amount of Vault shares that
will be minted in a deposit call in the same transaction, i.e. deposit should
return the same or more shares as `previewDeposit` if call in the same transaction.
- MUST NOT account for deposit limits like those returned from `maxDeposit` and should
always act as if the deposit will be accepted, regardless of approvals, etc.
- MUST be inclusive of deposit fees. Integrators should be aware of this.
- MUST not revert.
Note: Any unfavorable discrepancy between `convertToShares` and `previewDeposit` SHOULD
be considered slippage in share price or some other type of condition, meaning
the depositor will lose assets by depositing.*


```solidity
function previewDeposit(uint256 assets) public view virtual returns (uint256 shares);
```

### previewMint

*Allows an on-chain or off-chain user to simulate the effects of their mint
at the current block, given current on-chain conditions.
- MUST return as close to and no fewer than the exact amount of assets that
will be deposited in a mint call in the same transaction, i.e. mint should
return the same or fewer assets as `previewMint` if called in the same transaction.
- MUST NOT account for mint limits like those returned from `maxMint` and should
always act as if the mint will be accepted, regardless of approvals, etc.
- MUST be inclusive of deposit fees. Integrators should be aware of this.
- MUST not revert.
Note: Any unfavorable discrepancy between `convertToAssets` and `previewMint` SHOULD
be considered slippage in share price or some other type of condition,
meaning the depositor will lose assets by minting.*


```solidity
function previewMint(uint256 shares) public view virtual returns (uint256 assets);
```

### previewWithdraw

*Allows an on-chain or off-chain user to simulate the effects of their withdrawal
at the current block, given the current on-chain conditions.
- MUST return as close to and no fewer than the exact amount of Vault shares that
will be burned in a withdraw call in the same transaction, i.e. withdraw should
return the same or fewer shares as `previewWithdraw` if call in the same transaction.
- MUST NOT account for withdrawal limits like those returned from `maxWithdraw` and should
always act as if the withdrawal will be accepted, regardless of share balance, etc.
- MUST be inclusive of withdrawal fees. Integrators should be aware of this.
- MUST not revert.
Note: Any unfavorable discrepancy between `convertToShares` and `previewWithdraw` SHOULD
be considered slippage in share price or some other type of condition,
meaning the depositor will lose assets by depositing.*


```solidity
function previewWithdraw(uint256 assets) public view virtual returns (uint256 shares);
```

### previewRedeem

*Allows an on-chain or off-chain user to simulate the effects of their redemption
at the current block, given current on-chain conditions.
- MUST return as close to and no more than the exact amount of assets that
will be withdrawn in a redeem call in the same transaction, i.e. redeem should
return the same or more assets as `previewRedeem` if called in the same transaction.
- MUST NOT account for redemption limits like those returned from `maxRedeem` and should
always act as if the redemption will be accepted, regardless of approvals, etc.
- MUST be inclusive of withdrawal fees. Integrators should be aware of this.
- MUST NOT revert.
Note: Any unfavorable discrepancy between `convertToAssets` and `previewRedeem` SHOULD
be considered slippage in share price or some other type of condition,
meaning the depositor will lose assets by depositing.*


```solidity
function previewRedeem(uint256 shares) public view virtual returns (uint256 assets);
```

### _eitherIsZero

*Private helper to return if either value is zero.*


```solidity
function _eitherIsZero(uint256 a, uint256 b) private pure returns (bool result);
```

### _inc

*Private helper to return `x + 1` without the overflow check.
Use to compute the denominator input to `FixedPointMathLib.fullMulDiv(a, b, x + 1)`.
When `x == type(uint256).max`, we get `x + 1 == 0` (mod 2**256 - 1),
and `FixedPointMathLib.fullMulDiv` will revert as the denominator is zero.*


```solidity
function _inc(uint256 x) private pure returns (uint256);
```

### maxDeposit

*Returns the maximum amount of the underlying asset that can be deposited
into the Vault for `to`, via a deposit call.
- MUST return a limited value if `to` is subject to some deposit limit.
- MUST return `2**256-1` if there is no maximum limit.
- MUST NOT revert.*


```solidity
function maxDeposit(address to) public view virtual returns (uint256 maxAssets);
```

### maxMint

*Returns the maximum amount of the Vault shares that can be minter for `to`,
via a mint call.
- MUST return a limited value if `to` is subject to some mint limit.
- MUST return `2**256-1` if there is no maximum limit.
- MUST NOT revert.*


```solidity
function maxMint(address to) public view virtual returns (uint256 maxShares);
```

### maxWithdraw

*Returns the maximum amount of the underlying asset that can be withdrawn
from the `owner`'s balance in the Vault, via a withdraw call.
- MUST return a limited value if `owner` is subject to some withdrawal limit or timelock.
- MUST NOT revert.*


```solidity
function maxWithdraw(address owner) public view virtual returns (uint256 maxAssets);
```

### maxRedeem

*Returns the maximum amount of Vault shares that can be redeemed
from the `owner`'s balance in the Vault, via a redeem call.
- MUST return a limited value if `owner` is subject to some withdrawal limit or timelock.
- MUST return `balanceOf(owner)` otherwise.
- MUST NOT revert.*


```solidity
function maxRedeem(address owner) public view virtual returns (uint256 maxShares);
```

### deposit

*Mints `shares` Vault shares to `to` by depositing exactly `assets`
of underlying tokens.
- MUST emit the [Deposit](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#deposit) event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault
contract before the deposit execution, and are accounted for during deposit.
- MUST revert if all of `assets` cannot be deposited, such as due to deposit limit,
slippage, insufficient approval, etc.
Note: Most implementations will require pre-approval of the Vault with the
Vault's underlying `asset` token.*


```solidity
function deposit(uint256 assets, address to) public virtual returns (uint256 shares);
```

### mint

*Mints exactly `shares` Vault shares to `to` by depositing `assets`
of underlying tokens.
- MUST emit the [Deposit](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#deposit) event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault
contract before the mint execution, and are accounted for during mint.
- MUST revert if all of `shares` cannot be deposited, such as due to deposit limit,
slippage, insufficient approval, etc.
Note: Most implementations will require pre-approval of the Vault with the
Vault's underlying `asset` token.*


```solidity
function mint(uint256 shares, address to) public virtual returns (uint256 assets);
```

### withdraw

*Burns `shares` from `owner` and sends exactly `assets` of underlying tokens to `to`.
- MUST emit the [Withdraw](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#withdraw) event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault
contract before the withdraw execution, and are accounted for during withdraw.
- MUST revert if all of `assets` cannot be withdrawn, such as due to withdrawal limit,
slippage, insufficient balance, etc.
Note: Some implementations will require pre-requesting to the Vault before a withdrawal
may be performed. Those methods should be performed separately.*


```solidity
function withdraw(uint256 assets, address to, address owner) public virtual returns (uint256 shares);
```

### redeem

*Burns exactly `shares` from `owner` and sends `assets` of underlying tokens to `to`.
- MUST emit the [Withdraw](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#withdraw) event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault
contract before the redeem execution, and are accounted for during redeem.
- MUST revert if all of shares cannot be redeemed, such as due to withdrawal limit,
slippage, insufficient balance, etc.
Note: Some implementations will require pre-requesting to the Vault before a redeem
may be performed. Those methods should be performed separately.*


```solidity
function redeem(uint256 shares, address to, address owner) public virtual returns (uint256 assets);
```

### _revert

*Internal helper for reverting efficiently.*


```solidity
function _revert(uint256 s) private pure;
```

### _deposit

*For deposits and mints.
Emits a [Deposit](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#deposit) event.*


```solidity
function _deposit(address by, address to, uint256 assets, uint256 shares) internal virtual;
```

### _withdraw

*For withdrawals and redemptions.
Emits a [Withdraw](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#withdraw) event.*


```solidity
function _withdraw(address by, address to, address owner, uint256 assets, uint256 shares) internal virtual;
```

### _initialConvertToShares

*Internal conversion function (from assets to shares) to apply when the Vault is empty.
Only used when [_useVirtualShares](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#_usevirtualshares) returns false.
Note: Make sure to keep this function consistent with {_initialConvertToAssets}
when overriding it.*


```solidity
function _initialConvertToShares(uint256 assets) internal view virtual returns (uint256 shares);
```

### _initialConvertToAssets

*Internal conversion function (from shares to assets) to apply when the Vault is empty.
Only used when [_useVirtualShares](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md#_usevirtualshares) returns false.
Note: Make sure to keep this function consistent with {_initialConvertToShares}
when overriding it.*


```solidity
function _initialConvertToAssets(uint256 shares) internal view virtual returns (uint256 assets);
```

### _beforeWithdraw

*Hook that is called before any withdrawal or redemption.*


```solidity
function _beforeWithdraw(uint256 assets, uint256 shares) internal virtual;
```

### _afterDeposit

*Hook that is called after any deposit or mint.*


```solidity
function _afterDeposit(uint256 assets, uint256 shares) internal virtual;
```

## Events
### Deposit
*Emitted during a mint call or deposit call.*


```solidity
event Deposit(address indexed by, address indexed owner, uint256 assets, uint256 shares);
```

### Withdraw
*Emitted during a withdraw call or redeem call.*


```solidity
event Withdraw(address indexed by, address indexed to, address indexed owner, uint256 assets, uint256 shares);
```

## Errors
### DepositMoreThanMax
*Cannot deposit more than the max limit.*


```solidity
error DepositMoreThanMax();
```

### MintMoreThanMax
*Cannot mint more than the max limit.*


```solidity
error MintMoreThanMax();
```

### WithdrawMoreThanMax
*Cannot withdraw more than the max limit.*


```solidity
error WithdrawMoreThanMax();
```

### RedeemMoreThanMax
*Cannot redeem more than the max limit.*


```solidity
error RedeemMoreThanMax();
```

