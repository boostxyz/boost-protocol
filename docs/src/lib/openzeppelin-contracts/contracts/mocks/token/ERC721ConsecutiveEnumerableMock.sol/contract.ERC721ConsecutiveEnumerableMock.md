# ERC721ConsecutiveEnumerableMock
**Inherits:**
[ERC721Consecutive](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md), [ERC721Enumerable](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol/abstract.ERC721Enumerable.md)


## Functions
### constructor


```solidity
constructor(string memory name, string memory symbol, address[] memory receivers, uint96[] memory amounts)
    ERC721(name, symbol);
```

### supportsInterface


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool);
```

### _ownerOf


```solidity
function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721Consecutive) returns (address);
```

### _update


```solidity
function _update(address to, uint256 tokenId, address auth)
    internal
    virtual
    override(ERC721Consecutive, ERC721Enumerable)
    returns (address);
```

### _increaseBalance


```solidity
function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721Enumerable);
```

