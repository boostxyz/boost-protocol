# ERC721Royalty
**Inherits:**
[ERC2981](/lib/solady/src/tokens/ERC2981.sol/abstract.ERC2981.md), [ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)

*Extension of ERC-721 with the ERC-2981 NFT Royalty Standard, a standardized way to retrieve royalty payment
information.
Royalty information can be specified globally for all token ids via {ERC2981-_setDefaultRoyalty}, and/or individually
for specific token ids via {ERC2981-_setTokenRoyalty}. The latter takes precedence over the first.
IMPORTANT: ERC-2981 only specifies a way to signal royalty information and does not enforce its payment. See
https://eips.ethereum.org/EIPS/eip-2981#optional-royalty-payments[Rationale] in the ERC. Marketplaces are expected to
voluntarily pay royalties together with sales, but note that this standard is not yet widely supported.*


## Functions
### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol/abstract.ERC721Enumerable.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool);
```

