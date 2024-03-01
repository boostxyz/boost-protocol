# ERC4626
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [IERC4626](/lib/forge-std/src/interfaces/IERC4626.sol/interface.IERC4626.md)

*Implementation of the ERC-4626 "Tokenized Vault Standard" as defined in
https://eips.ethereum.org/EIPS/eip-4626[ERC-4626].
This extension allows the minting and burning of "shares" (represented using the ERC-20 inheritance) in exchange for
underlying "assets" through standardized [deposit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#deposit), {mint}, {redeem} and {burn} workflows. This contract extends
the ERC-20 standard. Any additional extensions included along it would affect the "shares" token represented by this
contract and not the "assets" token which is an independent contract.
[CAUTION]
====
In empty (or nearly empty) ERC-4626 vaults, deposits are at high risk of being stolen through frontrunning
with a "donation" to the vault that inflates the price of a share. This is variously known as a donation or inflation
attack and is essentially a problem of slippage. Vault deployers can protect against this attack by making an initial
deposit of a non-trivial amount of the asset, such that price manipulation becomes infeasible. Withdrawals may
similarly be affected by slippage. Users can protect against this attack as well as unexpected slippage in general by
verifying the amount received is as expected, using a wrapper that performs these checks such as
https://github.com/fei-protocol/ERC4626#erc4626router-and-base[ERC4626Router].
Since v4.9, this implementation introduces configurable virtual assets and shares to help developers mitigate that risk.
The `_decimalsOffset()` corresponds to an offset in the decimal representation between the underlying asset's decimals
and the vault decimals. This offset also determines the rate of virtual shares to virtual assets in the vault, which
itself determines the initial exchange rate. While not fully preventing the attack, analysis shows that the default
offset (0) makes it non-profitable even if an attacker is able to capture value from multiple user deposits, as a result
of the value being captured by the virtual shares (out of the attacker's donation) matching the attacker's expected gains.
With a larger offset, the attack becomes orders of magnitude more expensive than it is profitable. More details about the
underlying math can be found xref:erc4626.adoc#inflation-attack[here].
The drawback of this approach is that the virtual shares do capture (a very small) part of the value being accrued
to the vault. Also, if the vault experiences losses, the users try to exit the vault, the virtual shares and assets
will cause the first user to exit to experience reduced losses in detriment to the last users that will experience
bigger losses. Developers willing to revert back to the pre-v4.9 behavior just need to override the
`_convertToShares` and `_convertToAssets` functions.
To learn more, check out our xref:ROOT:erc4626.adoc[ERC-4626 guide].
====*


## State Variables
### _asset

```solidity
IERC20 private immutable _asset;
```


### _underlyingDecimals

```solidity
uint8 private immutable _underlyingDecimals;
```


## Functions
### constructor

*Set the underlying asset contract. This must be an ERC20-compatible contract (ERC-20 or ERC-777).*


```solidity
constructor(IERC20 asset_);
```

### _tryGetAssetDecimals

*Attempts to fetch the asset decimals. A return value of false indicates that the attempt failed in some way.*


```solidity
function _tryGetAssetDecimals(IERC20 asset_) private view returns (bool, uint8);
```

### decimals

*Decimals are computed by adding the decimal offset on top of the underlying asset's decimals. This
"original" value is cached during construction of the vault contract. If this read operation fails (e.g., the
asset has not been created yet), a default of 18 is used to represent the underlying asset's decimals.
See [IERC20Metadata-decimals](/lib/openzeppelin-contracts/lib/forge-std/src/interfaces/IERC20.sol/interface.IERC20.md#decimals).*


```solidity
function decimals() public view virtual override(IERC20Metadata, ERC20) returns (uint8);
```

### asset

*See [IERC4626-asset](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#asset).*


```solidity
function asset() public view virtual returns (address);
```

### totalAssets

*See [IERC4626-totalAssets](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#totalassets).*


```solidity
function totalAssets() public view virtual returns (uint256);
```

### convertToShares

*See [IERC4626-convertToShares](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#converttoshares).*


```solidity
function convertToShares(uint256 assets) public view virtual returns (uint256);
```

### convertToAssets

*See [IERC4626-convertToAssets](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#converttoassets).*


```solidity
function convertToAssets(uint256 shares) public view virtual returns (uint256);
```

### maxDeposit

*See [IERC4626-maxDeposit](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#maxdeposit).*


```solidity
function maxDeposit(address) public view virtual returns (uint256);
```

### maxMint

*See [IERC4626-maxMint](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#maxmint).*


```solidity
function maxMint(address) public view virtual returns (uint256);
```

### maxWithdraw

*See [IERC4626-maxWithdraw](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#maxwithdraw).*


```solidity
function maxWithdraw(address owner) public view virtual returns (uint256);
```

### maxRedeem

*See [IERC4626-maxRedeem](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#maxredeem).*


```solidity
function maxRedeem(address owner) public view virtual returns (uint256);
```

### previewDeposit

*See [IERC4626-previewDeposit](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#previewdeposit).*


```solidity
function previewDeposit(uint256 assets) public view virtual returns (uint256);
```

### previewMint

*See [IERC4626-previewMint](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#previewmint).*


```solidity
function previewMint(uint256 shares) public view virtual returns (uint256);
```

### previewWithdraw

*See [IERC4626-previewWithdraw](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#previewwithdraw).*


```solidity
function previewWithdraw(uint256 assets) public view virtual returns (uint256);
```

### previewRedeem

*See [IERC4626-previewRedeem](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#previewredeem).*


```solidity
function previewRedeem(uint256 shares) public view virtual returns (uint256);
```

### deposit

*See [IERC4626-deposit](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#deposit).*


```solidity
function deposit(uint256 assets, address receiver) public virtual returns (uint256);
```

### mint

*See [IERC4626-mint](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#mint).*


```solidity
function mint(uint256 shares, address receiver) public virtual returns (uint256);
```

### withdraw

*See [IERC4626-withdraw](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#withdraw).*


```solidity
function withdraw(uint256 assets, address receiver, address owner) public virtual returns (uint256);
```

### redeem

*See [IERC4626-redeem](/lib/openzeppelin-contracts/contracts/interfaces/IERC4626.sol/interface.IERC4626.md#redeem).*


```solidity
function redeem(uint256 shares, address receiver, address owner) public virtual returns (uint256);
```

### _convertToShares

*Internal conversion function (from assets to shares) with support for rounding direction.*


```solidity
function _convertToShares(uint256 assets, Math.Rounding rounding) internal view virtual returns (uint256);
```

### _convertToAssets

*Internal conversion function (from shares to assets) with support for rounding direction.*


```solidity
function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view virtual returns (uint256);
```

### _deposit

*Deposit/mint common workflow.*


```solidity
function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal virtual;
```

### _withdraw

*Withdraw/redeem common workflow.*


```solidity
function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares) internal virtual;
```

### _decimalsOffset


```solidity
function _decimalsOffset() internal view virtual returns (uint8);
```

## Errors
### ERC4626ExceededMaxDeposit
*Attempted to deposit more assets than the max amount for `receiver`.*


```solidity
error ERC4626ExceededMaxDeposit(address receiver, uint256 assets, uint256 max);
```

### ERC4626ExceededMaxMint
*Attempted to mint more shares than the max amount for `receiver`.*


```solidity
error ERC4626ExceededMaxMint(address receiver, uint256 shares, uint256 max);
```

### ERC4626ExceededMaxWithdraw
*Attempted to withdraw more assets than the max amount for `receiver`.*


```solidity
error ERC4626ExceededMaxWithdraw(address owner, uint256 assets, uint256 max);
```

### ERC4626ExceededMaxRedeem
*Attempted to redeem more shares than the max amount for `receiver`.*


```solidity
error ERC4626ExceededMaxRedeem(address owner, uint256 shares, uint256 max);
```

