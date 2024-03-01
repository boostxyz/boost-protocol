# Uint96ERC20

## State Variables
### name

```solidity
string public constant name = "Token";
```


### symbol

```solidity
string public constant symbol = "TKN";
```


### decimals

```solidity
uint8 public decimals = 18;
```


### supply

```solidity
uint96 internal supply;
```


### balances

```solidity
mapping(address => uint96) internal balances;
```


### allowances

```solidity
mapping(address => mapping(address => uint96)) internal allowances;
```


## Functions
### add


```solidity
function add(uint96 x, uint96 y) internal pure returns (uint96 z);
```

### sub


```solidity
function sub(uint96 x, uint96 y) internal pure returns (uint96 z);
```

### safe96


```solidity
function safe96(uint256 n) internal pure returns (uint96);
```

### constructor


```solidity
constructor(uint96 _supply) public;
```

### totalSupply


```solidity
function totalSupply() external view returns (uint256);
```

### balanceOf


```solidity
function balanceOf(address usr) external view returns (uint256);
```

### allowance


```solidity
function allowance(address src, address dst) external view returns (uint256);
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

