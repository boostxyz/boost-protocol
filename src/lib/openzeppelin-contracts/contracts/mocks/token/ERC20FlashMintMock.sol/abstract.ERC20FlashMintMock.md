# ERC20FlashMintMock
**Inherits:**
[ERC20FlashMint](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20FlashMint.sol/abstract.ERC20FlashMint.md)


## State Variables
### _flashFeeAmount

```solidity
uint256 _flashFeeAmount;
```


### _flashFeeReceiverAddress

```solidity
address _flashFeeReceiverAddress;
```


## Functions
### setFlashFee


```solidity
function setFlashFee(uint256 amount) public;
```

### _flashFee


```solidity
function _flashFee(address, uint256) internal view override returns (uint256);
```

### setFlashFeeReceiver


```solidity
function setFlashFeeReceiver(address receiver) public;
```

### _flashFeeReceiver


```solidity
function _flashFeeReceiver() internal view override returns (address);
```

