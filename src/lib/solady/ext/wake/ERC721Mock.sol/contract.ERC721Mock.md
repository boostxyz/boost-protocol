# ERC721Mock
**Inherits:**
[ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)


## State Variables
### _ERC721_MASTER_SLOT_SEED

```solidity
uint256 private constant _ERC721_MASTER_SLOT_SEED = 0x7d8825530a5a2e7a << 192;
```


## Functions
### name

*Returns the token collection name.*


```solidity
function name() public view override returns (string memory);
```

### symbol

*Returns the token collection symbol.*


```solidity
function symbol() public view override returns (string memory);
```

### tokenURI

*Returns the Uniform Resource Identifier (URI) for token `id`.*


```solidity
function tokenURI(uint256 id) public view override returns (string memory);
```

### getAux


```solidity
function getAux(address owner) public view returns (uint256 result);
```

### _beforeTokenTransfer


```solidity
function _beforeTokenTransfer(address from, address to, uint256 id) internal override;
```

### _afterTokenTransfer


```solidity
function _afterTokenTransfer(address from, address to, uint256 id) internal override;
```

### mint


```solidity
function mint(address to, uint256 id) public;
```

### burnZero


```solidity
function burnZero(uint256 id) public;
```

### burn


```solidity
function burn(uint256 id) public;
```

### transfer


```solidity
function transfer(address from, address to, uint256 id) public;
```

### balanceOf


```solidity
function balanceOf(address owner) public view virtual override returns (uint256 result);
```

### ownerOf


```solidity
function ownerOf(uint256 id) public view virtual override returns (address result);
```

## Events
### BeforeTokenTransfer

```solidity
event BeforeTokenTransfer(address from, address to, uint256 id);
```

### AfterTokenTransfer

```solidity
event AfterTokenTransfer(address from, address to, uint256 id);
```

