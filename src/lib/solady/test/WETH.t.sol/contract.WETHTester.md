# WETHTester

## State Variables
### weth

```solidity
WETH weth;
```


## Functions
### constructor


```solidity
constructor(WETH _weth) payable;
```

### deposit


```solidity
function deposit(uint256 amount) public;
```

### fallbackDeposit


```solidity
function fallbackDeposit(uint256 amount) public;
```

### withdraw


```solidity
function withdraw(uint256 amount) public;
```

### receive


```solidity
receive() external payable;
```

