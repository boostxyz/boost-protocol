# ERC20Mock
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)


## State Variables
### $name

```solidity
string private $name;
```


### $symbol

```solidity
string private $symbol;
```


### $decimals

```solidity
uint8 private $decimals;
```


## Functions
### constructor


```solidity
constructor(string memory name_, string memory symbol_, uint8 decimals_);
```

### mint


```solidity
function mint(address account, uint256 amount) public;
```

### burn


```solidity
function burn(address account, uint256 amount) public;
```

### name


```solidity
function name() public view virtual override returns (string memory);
```

### symbol


```solidity
function symbol() public view virtual override returns (string memory);
```

### decimals


```solidity
function decimals() public view virtual override returns (uint8);
```

### safeTransferETH


```solidity
function safeTransferETH(address to, uint256 value) public;
```

### forceSafeTransferETH


```solidity
function forceSafeTransferETH(address to, uint256 value) public;
```

### forceSafeTransferETHGas


```solidity
function forceSafeTransferETHGas(address to, uint256 value, uint256 gas) public;
```

### trySafeTransferETH


```solidity
function trySafeTransferETH(address to, uint256 value, uint256 gasStipend) public returns (bool);
```

### safeTransferFrom


```solidity
function safeTransferFrom(address token, address from, address to, uint256 value) public;
```

### safeTransferAllFrom


```solidity
function safeTransferAllFrom(address token, address from, address to) public;
```

### safeTransfer


```solidity
function safeTransfer(address token, address to, uint256 value) public;
```

### safeTransferAll


```solidity
function safeTransferAll(address token, address to) public;
```

### safeApprove


```solidity
function safeApprove(address token, address spender, uint256 value) public;
```

### balanceOfoor


```solidity
function balanceOfoor(address token, address account) public view returns (uint256);
```

