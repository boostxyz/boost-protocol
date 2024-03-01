# ERC20
**Inherits:**
[Math](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.Math.md)


## State Variables
### name

```solidity
bytes32 public constant name = "Token";
```


### symbol

```solidity
bytes32 public constant symbol = "TKN";
```


### decimals

```solidity
uint8 public constant decimals = 18;
```


### totalSupply

```solidity
uint256 public totalSupply;
```


### balanceOf

```solidity
mapping(address => uint256) public balanceOf;
```


### allowance

```solidity
mapping(address => mapping(address => uint256)) public allowance;
```


## Functions
### constructor


```solidity
constructor(uint256 _totalSupply) public;
```

### transfer


```solidity
function transfer(address dst, uint256 wad) public virtual returns (bool);
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public virtual returns (bool);
```

### approve


```solidity
function approve(address usr, uint256 wad) public virtual returns (bool);
```

### mint


```solidity
function mint(address usr, uint256 wad) public virtual;
```

## Events
### Approval

```solidity
event Approval(address indexed src, address indexed guy, uint256 wad);
```

### Transfer

```solidity
event Transfer(address indexed src, address indexed dst, uint256 wad);
```

