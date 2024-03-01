# ERC4626Fees
**Inherits:**
[ERC4626](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md)

*ERC-4626 vault with entry/exit fees expressed in https://en.wikipedia.org/wiki/Basis_point[basis point (bp)].*


## State Variables
### _BASIS_POINT_SCALE

```solidity
uint256 private constant _BASIS_POINT_SCALE = 1e4;
```


## Functions
### previewDeposit

*Preview taking an entry fee on deposit. See [IERC4626-previewDeposit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#previewdeposit).*


```solidity
function previewDeposit(uint256 assets) public view virtual override returns (uint256);
```

### previewMint

*Preview adding an entry fee on mint. See [IERC4626-previewMint](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#previewmint).*


```solidity
function previewMint(uint256 shares) public view virtual override returns (uint256);
```

### previewWithdraw

*Preview adding an exit fee on withdraw. See [IERC4626-previewWithdraw](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#previewwithdraw).*


```solidity
function previewWithdraw(uint256 assets) public view virtual override returns (uint256);
```

### previewRedeem

*Preview taking an exit fee on redeem. See [IERC4626-previewRedeem](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#previewredeem).*


```solidity
function previewRedeem(uint256 shares) public view virtual override returns (uint256);
```

### _deposit

*Send entry fee to [_entryFeeRecipient](/lib/openzeppelin-contracts/contracts/mocks/docs/ERC4626Fees.sol/abstract.ERC4626Fees.md#_entryfeerecipient). See {IERC4626-_deposit}.*


```solidity
function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual override;
```

### _withdraw

*Send exit fee to [_exitFeeRecipient](/lib/openzeppelin-contracts/contracts/mocks/docs/ERC4626Fees.sol/abstract.ERC4626Fees.md#_exitfeerecipient). See {IERC4626-_deposit}.*


```solidity
function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares)
    internal
    virtual
    override;
```

### _entryFeeBasisPoints


```solidity
function _entryFeeBasisPoints() internal view virtual returns (uint256);
```

### _exitFeeBasisPoints


```solidity
function _exitFeeBasisPoints() internal view virtual returns (uint256);
```

### _entryFeeRecipient


```solidity
function _entryFeeRecipient() internal view virtual returns (address);
```

### _exitFeeRecipient


```solidity
function _exitFeeRecipient() internal view virtual returns (address);
```

### _feeOnRaw

*Calculates the fees that should be added to an amount `assets` that does not already include fees.
Used in [IERC4626-mint](/lib/openzeppelin-contracts/contracts/mocks/docs/access-control/AccessControlERC20MintMissing.sol/contract.AccessControlERC20MintMissing.md#mint) and {IERC4626-withdraw} operations.*


```solidity
function _feeOnRaw(uint256 assets, uint256 feeBasisPoints) private pure returns (uint256);
```

### _feeOnTotal

*Calculates the fee part of an amount `assets` that already includes fees.
Used in [IERC4626-deposit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#deposit) and {IERC4626-redeem} operations.*


```solidity
function _feeOnTotal(uint256 assets, uint256 feeBasisPoints) private pure returns (uint256);
```

