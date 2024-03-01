# MissingReturnToken

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
### add


```solidity
function add(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### sub


```solidity
function sub(uint256 x, uint256 y) internal pure returns (uint256 z);
```

### constructor


```solidity
constructor(uint256 _totalSupply) public;
```

### transfer


```solidity
function transfer(address dst, uint256 wad) external;
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public;
```

### approve


```solidity
function approve(address usr, uint256 wad) external;
```

### mint


```solidity
function mint(address usr, uint256 wad) external;
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

