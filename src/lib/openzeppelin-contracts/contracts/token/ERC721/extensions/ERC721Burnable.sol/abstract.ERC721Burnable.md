# ERC721Burnable
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)

*ERC-721 Token that can be burned (destroyed).*


## Functions
### burn

*Burns `tokenId`. See [ERC721-_burn](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_burn).
Requirements:
- The caller must own `tokenId` or be an approved operator.*


```solidity
function burn(uint256 tokenId) public virtual;
```

