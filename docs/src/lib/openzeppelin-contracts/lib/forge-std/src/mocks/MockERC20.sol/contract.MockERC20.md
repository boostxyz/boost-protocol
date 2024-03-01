# MockERC20
This is a mock contract of the ERC20 standard for testing purposes only, it SHOULD NOT be used in production.

*Forked from: https://github.com/transmissions11/solmate/blob/0384dbaaa4fcb5715738a9254a7c0a4cb62cf458/src/tokens/ERC20.sol*


## State Variables
### name

```solidity
string public name;
```


### symbol

```solidity
string public symbol;
```


### decimals

```solidity
uint8 public decimals;
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


### INITIAL_CHAIN_ID

```solidity
uint256 internal INITIAL_CHAIN_ID;
```


### INITIAL_DOMAIN_SEPARATOR

```solidity
bytes32 internal INITIAL_DOMAIN_SEPARATOR;
```


### nonces

```solidity
mapping(address => uint256) public nonces;
```


### initialized
*A bool to track whether the contract has been initialized.*


```solidity
bool private initialized;
```


## Functions
### initialize

*To hide constructor warnings across solc versions due to different constructor visibility requirements and
syntaxes, we add an initialization function that can be called only once.*


```solidity
function initialize(string memory _name, string memory _symbol, uint8 _decimals) public;
```

### approve


```solidity
function approve(address spender, uint256 amount) public virtual returns (bool);
```

### transfer


```solidity
function transfer(address to, uint256 amount) public virtual returns (bool);
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 amount) public virtual returns (bool);
```

### permit


```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
    public
    virtual;
```

### DOMAIN_SEPARATOR


```solidity
function DOMAIN_SEPARATOR() public view virtual returns (bytes32);
```

### computeDomainSeparator


```solidity
function computeDomainSeparator() internal view virtual returns (bytes32);
```

### _mint


```solidity
function _mint(address to, uint256 amount) internal virtual;
```

### _burn


```solidity
function _burn(address from, uint256 amount) internal virtual;
```

### _add


```solidity
function _add(uint256 a, uint256 b) internal pure returns (uint256);
```

### _sub


```solidity
function _sub(uint256 a, uint256 b) internal pure returns (uint256);
```

### _viewChainId


```solidity
function _viewChainId() private view returns (uint256 chainId);
```

### _pureChainId


```solidity
function _pureChainId() private pure returns (uint256 chainId);
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

