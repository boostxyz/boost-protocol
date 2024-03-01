# MockERC20
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### _name

```solidity
string internal _name;
```


### _symbol

```solidity
string internal _symbol;
```


### _decimals

```solidity
uint8 internal _decimals;
```


### _nameHash

```solidity
bytes32 internal immutable _nameHash;
```


## Functions
### constructor


```solidity
constructor(string memory name_, string memory symbol_, uint8 decimals_);
```

### _constantNameHash


```solidity
function _constantNameHash() internal view virtual override returns (bytes32);
```

### name


```solidity
function name() public view virtual override returns (string memory);
```

### symbol


```solidity
function symbol() public view virtual override returns (string memory);
```

### decimals


```solidity
function decimals() public view virtual override returns (uint8);
```

### mint


```solidity
function mint(address to, uint256 value) public virtual;
```

### burn


```solidity
function burn(address from, uint256 value) public virtual;
```

### directTransfer


```solidity
function directTransfer(address from, address to, uint256 amount) public virtual;
```

### directSpendAllowance


```solidity
function directSpendAllowance(address owner, address spender, uint256 amount) public virtual;
```

### transfer


```solidity
function transfer(address to, uint256 amount) public virtual override returns (bool);
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool);
```

### _brutalized


```solidity
function _brutalized(address a) internal view returns (address result);
```

