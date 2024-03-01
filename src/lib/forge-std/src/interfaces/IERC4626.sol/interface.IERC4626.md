# IERC4626
**Inherits:**
[IERC20](/lib/forge-std/src/interfaces/IERC20.sol/interface.IERC20.md)

*Interface of the ERC4626 "Tokenized Vault Standard", as defined in
https://eips.ethereum.org/EIPS/eip-4626*


## Functions
### asset

Returns the address of the underlying token used for the Vault for accounting, depositing, and withdrawing.

*
- MUST be an ERC-20 token contract.
- MUST NOT revert.*


```solidity
function asset() external view returns (address assetTokenAddress);
```

### totalAssets

Returns the total amount of the underlying asset that is “managed” by Vault.

*
- SHOULD include any compounding that occurs from yield.
- MUST be inclusive of any fees that are charged against assets in the Vault.
- MUST NOT revert.*


```solidity
function totalAssets() external view returns (uint256 totalManagedAssets);
```

### convertToShares

Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal
scenario where all the conditions are met.

*
- MUST NOT be inclusive of any fees that are charged against assets in the Vault.
- MUST NOT show any variations depending on the caller.
- MUST NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
- MUST NOT revert.
NOTE: This calculation MAY NOT reflect the “per-user” price-per-share, and instead should reflect the
“average-user’s” price-per-share, meaning what the average user should expect to see when exchanging to and
from.*


```solidity
function convertToShares(uint256 assets) external view returns (uint256 shares);
```

### convertToAssets

Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal
scenario where all the conditions are met.

*
- MUST NOT be inclusive of any fees that are charged against assets in the Vault.
- MUST NOT show any variations depending on the caller.
- MUST NOT reflect slippage or other on-chain conditions, when performing the actual exchange.
- MUST NOT revert.
NOTE: This calculation MAY NOT reflect the “per-user” price-per-share, and instead should reflect the
“average-user’s” price-per-share, meaning what the average user should expect to see when exchanging to and
from.*


```solidity
function convertToAssets(uint256 shares) external view returns (uint256 assets);
```

### maxDeposit

Returns the maximum amount of the underlying asset that can be deposited into the Vault for the receiver,
through a deposit call.

*
- MUST return a limited value if receiver is subject to some deposit limit.
- MUST return 2 ** 256 - 1 if there is no limit on the maximum amount of assets that may be deposited.
- MUST NOT revert.*


```solidity
function maxDeposit(address receiver) external view returns (uint256 maxAssets);
```

### previewDeposit

Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given
current on-chain conditions.

*
- MUST return as close to and no more than the exact amount of Vault shares that would be minted in a deposit
call in the same transaction. I.e. deposit should return the same or more shares as previewDeposit if called
in the same transaction.
- MUST NOT account for deposit limits like those returned from maxDeposit and should always act as though the
deposit would be accepted, regardless if the user has enough tokens approved, etc.
- MUST be inclusive of deposit fees. Integrators should be aware of the existence of deposit fees.
- MUST NOT revert.
NOTE: any unfavorable discrepancy between convertToShares and previewDeposit SHOULD be considered slippage in
share price or some other type of condition, meaning the depositor will lose assets by depositing.*


```solidity
function previewDeposit(uint256 assets) external view returns (uint256 shares);
```

### deposit

Mints shares Vault shares to receiver by depositing exactly amount of underlying tokens.

*
- MUST emit the Deposit event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the
deposit execution, and are accounted for during deposit.
- MUST revert if all of assets cannot be deposited (due to deposit limit being reached, slippage, the user not
approving enough underlying tokens to the Vault contract, etc).
NOTE: most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.*


```solidity
function deposit(uint256 assets, address receiver) external returns (uint256 shares);
```

### maxMint

Returns the maximum amount of the Vault shares that can be minted for the receiver, through a mint call.

*
- MUST return a limited value if receiver is subject to some mint limit.
- MUST return 2 ** 256 - 1 if there is no limit on the maximum amount of shares that may be minted.
- MUST NOT revert.*


```solidity
function maxMint(address receiver) external view returns (uint256 maxShares);
```

### previewMint

Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given
current on-chain conditions.

*
- MUST return as close to and no fewer than the exact amount of assets that would be deposited in a mint call
in the same transaction. I.e. mint should return the same or fewer assets as previewMint if called in the
same transaction.
- MUST NOT account for mint limits like those returned from maxMint and should always act as though the mint
would be accepted, regardless if the user has enough tokens approved, etc.
- MUST be inclusive of deposit fees. Integrators should be aware of the existence of deposit fees.
- MUST NOT revert.
NOTE: any unfavorable discrepancy between convertToAssets and previewMint SHOULD be considered slippage in
share price or some other type of condition, meaning the depositor will lose assets by minting.*


```solidity
function previewMint(uint256 shares) external view returns (uint256 assets);
```

### mint

Mints exactly shares Vault shares to receiver by depositing amount of underlying tokens.

*
- MUST emit the Deposit event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the mint
execution, and are accounted for during mint.
- MUST revert if all of shares cannot be minted (due to deposit limit being reached, slippage, the user not
approving enough underlying tokens to the Vault contract, etc).
NOTE: most implementations will require pre-approval of the Vault with the Vault’s underlying asset token.*


```solidity
function mint(uint256 shares, address receiver) external returns (uint256 assets);
```

### maxWithdraw

Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the
Vault, through a withdraw call.

*
- MUST return a limited value if owner is subject to some withdrawal limit or timelock.
- MUST NOT revert.*


```solidity
function maxWithdraw(address owner) external view returns (uint256 maxAssets);
```

### previewWithdraw

Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block,
given current on-chain conditions.

*
- MUST return as close to and no fewer than the exact amount of Vault shares that would be burned in a withdraw
call in the same transaction. I.e. withdraw should return the same or fewer shares as previewWithdraw if
called
in the same transaction.
- MUST NOT account for withdrawal limits like those returned from maxWithdraw and should always act as though
the withdrawal would be accepted, regardless if the user has enough shares, etc.
- MUST be inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
- MUST NOT revert.
NOTE: any unfavorable discrepancy between convertToShares and previewWithdraw SHOULD be considered slippage in
share price or some other type of condition, meaning the depositor will lose assets by depositing.*


```solidity
function previewWithdraw(uint256 assets) external view returns (uint256 shares);
```

### withdraw

Burns shares from owner and sends exactly assets of underlying tokens to receiver.

*
- MUST emit the Withdraw event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the
withdraw execution, and are accounted for during withdraw.
- MUST revert if all of assets cannot be withdrawn (due to withdrawal limit being reached, slippage, the owner
not having enough shares, etc).
Note that some implementations will require pre-requesting to the Vault before a withdrawal may be performed.
Those methods should be performed separately.*


```solidity
function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
```

### maxRedeem

Returns the maximum amount of Vault shares that can be redeemed from the owner balance in the Vault,
through a redeem call.

*
- MUST return a limited value if owner is subject to some withdrawal limit or timelock.
- MUST return balanceOf(owner) if owner is not subject to any withdrawal limit or timelock.
- MUST NOT revert.*


```solidity
function maxRedeem(address owner) external view returns (uint256 maxShares);
```

### previewRedeem

Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block,
given current on-chain conditions.

*
- MUST return as close to and no more than the exact amount of assets that would be withdrawn in a redeem call
in the same transaction. I.e. redeem should return the same or more assets as previewRedeem if called in the
same transaction.
- MUST NOT account for redemption limits like those returned from maxRedeem and should always act as though the
redemption would be accepted, regardless if the user has enough shares, etc.
- MUST be inclusive of withdrawal fees. Integrators should be aware of the existence of withdrawal fees.
- MUST NOT revert.
NOTE: any unfavorable discrepancy between convertToAssets and previewRedeem SHOULD be considered slippage in
share price or some other type of condition, meaning the depositor will lose assets by redeeming.*


```solidity
function previewRedeem(uint256 shares) external view returns (uint256 assets);
```

### redeem

Burns exactly shares from owner and sends assets of underlying tokens to receiver.

*
- MUST emit the Withdraw event.
- MAY support an additional flow in which the underlying tokens are owned by the Vault contract before the
redeem execution, and are accounted for during redeem.
- MUST revert if all of shares cannot be redeemed (due to withdrawal limit being reached, slippage, the owner
not having enough shares, etc).
NOTE: some implementations will require pre-requesting to the Vault before a withdrawal may be performed.
Those methods should be performed separately.*


```solidity
function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
```

## Events
### Deposit

```solidity
event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
```

### Withdraw

```solidity
event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);
```

