# MockERC721
**Inherits:**
[ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### name


```solidity
function name() public view virtual override returns (string memory);
```

### symbol


```solidity
function symbol() public view virtual override returns (string memory);
```

### tokenURI


```solidity
function tokenURI(uint256 id) public view virtual override returns (string memory);
```

### exists


```solidity
function exists(uint256 id) public view virtual returns (bool);
```

### mint


```solidity
function mint(address to, uint256 id) public virtual;
```

### mintWithExtraDataUnchecked


```solidity
function mintWithExtraDataUnchecked(address to, uint256 id, uint96 value) public virtual;
```

### burn


```solidity
function burn(uint256 id) public virtual;
```

### uncheckedBurn


```solidity
function uncheckedBurn(uint256 id) public virtual;
```

### safeMint


```solidity
function safeMint(address to, uint256 id) public virtual;
```

### safeMint


```solidity
function safeMint(address to, uint256 id, bytes calldata data) public virtual;
```

### getExtraData


```solidity
function getExtraData(uint256 id) public view virtual returns (uint96);
```

### setExtraData


```solidity
function setExtraData(uint256 id, uint96 value) public virtual;
```

### getAux


```solidity
function getAux(address owner) public view virtual returns (uint224);
```

### setAux


```solidity
function setAux(address owner, uint224 value) public virtual;
```

### approve


```solidity
function approve(address account, uint256 id) public payable virtual override;
```

### directApprove


```solidity
function directApprove(address account, uint256 id) public virtual;
```

### setApprovalForAll


```solidity
function setApprovalForAll(address operator, bool approved) public virtual override;
```

### directSetApprovalForAll


```solidity
function directSetApprovalForAll(address operator, bool approved) public virtual;
```

### transferFrom


```solidity
function transferFrom(address from, address to, uint256 id) public payable virtual override;
```

### uncheckedTransferFrom


```solidity
function uncheckedTransferFrom(address from, address to, uint256 id) public payable virtual;
```

### directTransferFrom


```solidity
function directTransferFrom(address from, address to, uint256 id) public virtual;
```

### safeTransferFrom


```solidity
function safeTransferFrom(address from, address to, uint256 id) public payable virtual override;
```

### directSafeTransferFrom


```solidity
function directSafeTransferFrom(address from, address to, uint256 id) public virtual;
```

### safeTransferFrom


```solidity
function safeTransferFrom(address from, address to, uint256 id, bytes calldata data) public payable virtual override;
```

### directSafeTransferFrom


```solidity
function directSafeTransferFrom(address from, address to, uint256 id, bytes calldata data) public virtual;
```

### isApprovedOrOwner


```solidity
function isApprovedOrOwner(address account, uint256 id) public view virtual returns (bool);
```

### directOwnerOf


```solidity
function directOwnerOf(uint256 id) public view virtual returns (address);
```

### directGetApproved


```solidity
function directGetApproved(uint256 id) public view virtual returns (address);
```

### _brutalized


```solidity
function _brutalized(address a) internal view returns (address result);
```

### _brutalized


```solidity
function _brutalized(uint96 value) internal view returns (uint96 result);
```

