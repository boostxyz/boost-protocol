# ERC721Harness
**Inherits:**
[ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)


## Functions
### constructor


```solidity
constructor(string memory name, string memory symbol) ERC721(name, symbol);
```

### mint


```solidity
function mint(address account, uint256 tokenId) external;
```

### safeMint


```solidity
function safeMint(address to, uint256 tokenId) external;
```

### safeMint


```solidity
function safeMint(address to, uint256 tokenId, bytes memory data) external;
```

### burn


```solidity
function burn(uint256 tokenId) external;
```

### unsafeOwnerOf


```solidity
function unsafeOwnerOf(uint256 tokenId) external view returns (address);
```

### unsafeGetApproved


```solidity
function unsafeGetApproved(uint256 tokenId) external view returns (address);
```

