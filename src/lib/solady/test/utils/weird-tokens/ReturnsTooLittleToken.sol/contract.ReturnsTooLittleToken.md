# ReturnsTooLittleToken

## State Variables
### name

```solidity
string public constant name = "ReturnsTooLittleToken";
```


### symbol

```solidity
string public constant symbol = "RTLT";
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
constructor();
```

### approve


```solidity
function approve(address, uint256) public virtual;
```

### transfer


```solidity
function transfer(address, uint256) public virtual;
```

### transferFrom


```solidity
function transferFrom(address, address, uint256) public virtual;
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

