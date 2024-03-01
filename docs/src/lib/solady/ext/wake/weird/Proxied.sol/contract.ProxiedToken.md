# ProxiedToken

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


### admin

```solidity
mapping(address => bool) public admin;
```


### delegators

```solidity
mapping(address => bool) public delegators;
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

### rely


```solidity
function rely(address usr) external auth;
```

### deny


```solidity
function deny(address usr) external auth;
```

### auth


```solidity
modifier auth();
```

### delegated


```solidity
modifier delegated();
```

### setDelegator


```solidity
function setDelegator(address delegator, bool status) external;
```

### transfer


```solidity
function transfer(address dst, uint256 wad) external delegated returns (bool);
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) external delegated returns (bool);
```

### approve


```solidity
function approve(address usr, uint256 wad) external delegated returns (bool);
```

### _transferFrom


```solidity
function _transferFrom(address caller, address src, address dst, uint256 wad) internal returns (bool);
```

### _approve


```solidity
function _approve(address caller, address usr, uint256 wad) internal returns (bool);
```

### _getCaller


```solidity
function _getCaller() internal pure returns (address result);
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

