# MockERC6909
**Inherits:**
[ERC6909](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### name


```solidity
function name(uint256) public view virtual override returns (string memory);
```

### symbol


```solidity
function symbol(uint256) public view virtual override returns (string memory);
```

### tokenURI


```solidity
function tokenURI(uint256 id) public view virtual override returns (string memory);
```

### mint


```solidity
function mint(address to, uint256 id, uint256 amount) public payable virtual;
```

### burn


```solidity
function burn(address from, uint256 id, uint256 amount) public payable virtual;
```

### approve


```solidity
function approve(address spender, uint256 id, uint256 amount) public payable virtual override returns (bool);
```

### setOperator


```solidity
function setOperator(address owner, bool approved) public payable virtual override returns (bool);
```

### transfer


```solidity
function transfer(address to, uint256 id, uint256 amount) public payable virtual override returns (bool);
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 id, uint256 amount)
    public
    payable
    virtual
    override
    returns (bool);
```

### directTransferFrom


```solidity
function directTransferFrom(address by, address from, address to, uint256 id, uint256 amount) public payable virtual;
```

### directSetOperator


```solidity
function directSetOperator(address owner, address operator, bool approved) public payable virtual;
```

### directApprove


```solidity
function directApprove(address owner, address spender, uint256 id, uint256 amount) public payable virtual;
```

### _brutalized


```solidity
function _brutalized(address a) internal view returns (address result);
```

## Errors
### TokenDoesNotExist

```solidity
error TokenDoesNotExist();
```

