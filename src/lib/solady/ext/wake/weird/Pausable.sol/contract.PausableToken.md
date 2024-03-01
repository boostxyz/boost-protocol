# PausableToken
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)


## State Variables
### owner

```solidity
address owner;
```


### live

```solidity
bool live = true;
```


## Functions
### auth


```solidity
modifier auth();
```

### stop


```solidity
function stop() external auth;
```

### start


```solidity
function start() external auth;
```

### constructor


```solidity
constructor(uint256 _totalSupply) public ERC20(_totalSupply);
```

### approve


```solidity
function approve(address usr, uint256 wad) public override returns (bool);
```

### transfer


```solidity
function transfer(address dst, uint256 wad) public override returns (bool);
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public override returns (bool);
```

