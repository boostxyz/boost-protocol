# ERC20FlashMintHarness
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [ERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md), [ERC20FlashMint](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20FlashMint.sol/abstract.ERC20FlashMint.md)


## State Variables
### someFee

```solidity
uint256 someFee;
```


### someFeeReceiver

```solidity
address someFeeReceiver;
```


## Functions
### constructor


```solidity
constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name);
```

### mint


```solidity
function mint(address account, uint256 amount) external;
```

### burn


```solidity
function burn(address account, uint256 amount) external;
```

### flashFeeReceiver


```solidity
function flashFeeReceiver() public view returns (address);
```

### _flashFee


```solidity
function _flashFee(address, uint256) internal view override returns (uint256);
```

### _flashFeeReceiver


```solidity
function _flashFeeReceiver() internal view override returns (address);
```

