# IERC4626
**Inherits:**
[IERC20](/lib/forge-std/src/interfaces/IERC20.sol/interface.IERC20.md)


## Functions
### asset


```solidity
function asset() external view returns (address assetTokenAddress);
```

### totalAssets


```solidity
function totalAssets() external view returns (uint256 totalManagedAssets);
```

### convertToShares


```solidity
function convertToShares(uint256 assets) external view returns (uint256 shares);
```

### convertToAssets


```solidity
function convertToAssets(uint256 shares) external view returns (uint256 assets);
```

### maxDeposit


```solidity
function maxDeposit(address receiver) external view returns (uint256 maxAssets);
```

### previewDeposit


```solidity
function previewDeposit(uint256 assets) external view returns (uint256 shares);
```

### deposit


```solidity
function deposit(uint256 assets, address receiver) external returns (uint256 shares);
```

### maxMint


```solidity
function maxMint(address receiver) external view returns (uint256 maxShares);
```

### previewMint


```solidity
function previewMint(uint256 shares) external view returns (uint256 assets);
```

### mint


```solidity
function mint(uint256 shares, address receiver) external returns (uint256 assets);
```

### maxWithdraw


```solidity
function maxWithdraw(address owner) external view returns (uint256 maxAssets);
```

### previewWithdraw


```solidity
function previewWithdraw(uint256 assets) external view returns (uint256 shares);
```

### withdraw


```solidity
function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
```

### maxRedeem


```solidity
function maxRedeem(address owner) external view returns (uint256 maxShares);
```

### previewRedeem


```solidity
function previewRedeem(uint256 shares) external view returns (uint256 assets);
```

### redeem


```solidity
function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets);
```

## Events
### Deposit

```solidity
event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
```

### Withdraw

```solidity
event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);
```

