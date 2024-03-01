# WETH
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)

**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/WETH.sol), Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/WETH.sol), Inspired by WETH9 (https://github.com/dapphub/ds-weth/blob/master/src/weth9.sol)

Simple Wrapped Ether implementation.


## State Variables
### _DEPOSIT_EVENT_SIGNATURE
*`keccak256(bytes("Deposit(address,uint256)"))`.*


```solidity
uint256 private constant _DEPOSIT_EVENT_SIGNATURE = 0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c;
```


### _WITHDRAWAL_EVENT_SIGNATURE
*`keccak256(bytes("Withdrawal(address,uint256)"))`.*


```solidity
uint256 private constant _WITHDRAWAL_EVENT_SIGNATURE =
    0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65;
```


## Functions
### name

*Returns the name of the token.*


```solidity
function name() public view virtual override returns (string memory);
```

### symbol

*Returns the symbol of the token.*


```solidity
function symbol() public view virtual override returns (string memory);
```

### deposit

*Deposits `amount` ETH of the caller and mints `amount` WETH to the caller.
Emits a [Deposit](/lib/solady/src/tokens/WETH.sol/contract.WETH.md#deposit) event.*


```solidity
function deposit() public payable virtual;
```

### withdraw

*Burns `amount` WETH of the caller and sends `amount` ETH to the caller.
Emits a [Withdrawal](/lib/solady/src/tokens/WETH.sol/contract.WETH.md#withdrawal) event.*


```solidity
function withdraw(uint256 amount) public virtual;
```

### receive

*Equivalent to `deposit()`.*


```solidity
receive() external payable virtual;
```

## Events
### Deposit
*Emitted when `amount` is deposited from `from`.*


```solidity
event Deposit(address indexed from, uint256 amount);
```

### Withdrawal
*Emitted when `amount` is withdrawn to `to`.*


```solidity
event Withdrawal(address indexed to, uint256 amount);
```

## Errors
### ETHTransferFailed
*The ETH transfer has failed.*


```solidity
error ETHTransferFailed();
```

