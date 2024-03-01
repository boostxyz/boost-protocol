# ReturnsRawBytesToken

## State Variables
### name

```solidity
string public constant name = "ReturnsRawBytesToken";
```


### symbol

```solidity
string public constant symbol = "RGT";
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


### rawBytes

```solidity
bytes rawBytes;
```


## Functions
### constructor


```solidity
constructor();
```

### approve


```solidity
function approve(address spender, uint256 amount) public virtual;
```

### transfer


```solidity
function transfer(address to, uint256 amount) public virtual;
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 amount) public virtual;
```

### setRawBytes


```solidity
function setRawBytes(bytes memory _rawBytes) public virtual;
```

## Events
### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```

### Approval

```solidity
event Approval(address indexed owner, address indexed spender, uint256 amount);
```

