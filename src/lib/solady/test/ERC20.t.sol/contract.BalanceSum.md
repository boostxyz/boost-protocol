# BalanceSum

## State Variables
### token

```solidity
MockERC20 token;
```


### sum

```solidity
uint256 public sum;
```


## Functions
### constructor


```solidity
constructor(MockERC20 _token);
```

### mint


```solidity
function mint(address from, uint256 amount) public;
```

### burn


```solidity
function burn(address from, uint256 amount) public;
```

### approve


```solidity
function approve(address to, uint256 amount) public;
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 amount) public;
```

### transfer


```solidity
function transfer(address to, uint256 amount) public;
```

