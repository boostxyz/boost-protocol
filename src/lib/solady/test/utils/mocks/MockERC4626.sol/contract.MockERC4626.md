# MockERC4626
**Inherits:**
[ERC4626](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### useVirtualShares

```solidity
bool public immutable useVirtualShares;
```


### decimalsOffset

```solidity
uint8 public immutable decimalsOffset;
```


### _underlying

```solidity
address internal immutable _underlying;
```


### _decimals

```solidity
uint8 internal immutable _decimals;
```


### _name

```solidity
string internal _name;
```


### _symbol

```solidity
string internal _symbol;
```


### beforeWithdrawHookCalledCounter

```solidity
uint256 public beforeWithdrawHookCalledCounter;
```


### afterDepositHookCalledCounter

```solidity
uint256 public afterDepositHookCalledCounter;
```


## Functions
### constructor


```solidity
constructor(
    address underlying_,
    string memory name_,
    string memory symbol_,
    bool useVirtualShares_,
    uint8 decimalsOffset_
);
```

### asset


```solidity
function asset() public view virtual override returns (address);
```

### name


```solidity
function name() public view virtual override returns (string memory);
```

### symbol


```solidity
function symbol() public view virtual override returns (string memory);
```

### _useVirtualShares


```solidity
function _useVirtualShares() internal view virtual override returns (bool);
```

### _underlyingDecimals


```solidity
function _underlyingDecimals() internal view virtual override returns (uint8);
```

### _decimalsOffset


```solidity
function _decimalsOffset() internal view virtual override returns (uint8);
```

### _beforeWithdraw


```solidity
function _beforeWithdraw(uint256, uint256) internal override;
```

### _afterDeposit


```solidity
function _afterDeposit(uint256, uint256) internal override;
```

