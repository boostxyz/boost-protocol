# IERC2981
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md)

*Interface for the NFT Royalty Standard.
A standardized way to retrieve royalty payment information for non-fungible tokens (NFTs) to enable universal
support for royalty payments across all NFT marketplaces and ecosystem participants.*


## Functions
### royaltyInfo

*Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of
exchange. The royalty amount is denominated and should be paid in that same unit of exchange.*


```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice)
    external
    view
    returns (address receiver, uint256 royaltyAmount);
```

