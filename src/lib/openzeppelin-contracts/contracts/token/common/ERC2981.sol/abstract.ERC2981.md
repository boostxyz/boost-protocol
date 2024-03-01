# ERC2981
**Inherits:**
[IERC2981](/lib/openzeppelin-contracts/contracts/interfaces/IERC2981.sol/interface.IERC2981.md), [ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md)

*Implementation of the NFT Royalty Standard, a standardized way to retrieve royalty payment information.
Royalty information can be specified globally for all token ids via [_setDefaultRoyalty](/lib/openzeppelin-contracts/contracts/token/common/ERC2981.sol/abstract.ERC2981.md#_setdefaultroyalty), and/or individually for
specific token ids via {_setTokenRoyalty}. The latter takes precedence over the first.
Royalty is specified as a fraction of sale price. {_feeDenominator} is overridable but defaults to 10000, meaning the
fee is specified in basis points by default.
IMPORTANT: ERC-2981 only specifies a way to signal royalty information and does not enforce its payment. See
https://eips.ethereum.org/EIPS/eip-2981#optional-royalty-payments[Rationale] in the ERC. Marketplaces are expected to
voluntarily pay royalties together with sales, but note that this standard is not yet widely supported.*


## State Variables
### _defaultRoyaltyInfo

```solidity
RoyaltyInfo private _defaultRoyaltyInfo;
```


### _tokenRoyaltyInfo

```solidity
mapping(uint256 tokenId => RoyaltyInfo) private _tokenRoyaltyInfo;
```


## Functions
### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool);
```

### royaltyInfo

*Returns how much royalty is owed and to whom, based on a sale price that may be denominated in any unit of
exchange. The royalty amount is denominated and should be paid in that same unit of exchange.*


```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) public view virtual returns (address, uint256);
```

### _feeDenominator

*The denominator with which to interpret the fee set in [_setTokenRoyalty](/lib/openzeppelin-contracts/contracts/token/common/ERC2981.sol/abstract.ERC2981.md#_settokenroyalty) and {_setDefaultRoyalty} as a
fraction of the sale price. Defaults to 10000 so fees are expressed in basis points, but may be customized by an
override.*


```solidity
function _feeDenominator() internal pure virtual returns (uint96);
```

### _setDefaultRoyalty

*Sets the royalty information that all ids in this contract will default to.
Requirements:
- `receiver` cannot be the zero address.
- `feeNumerator` cannot be greater than the fee denominator.*


```solidity
function _setDefaultRoyalty(address receiver, uint96 feeNumerator) internal virtual;
```

### _deleteDefaultRoyalty

*Removes default royalty information.*


```solidity
function _deleteDefaultRoyalty() internal virtual;
```

### _setTokenRoyalty

*Sets the royalty information for a specific token id, overriding the global default.
Requirements:
- `receiver` cannot be the zero address.
- `feeNumerator` cannot be greater than the fee denominator.*


```solidity
function _setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) internal virtual;
```

### _resetTokenRoyalty

*Resets royalty information for the token id back to the global default.*


```solidity
function _resetTokenRoyalty(uint256 tokenId) internal virtual;
```

## Errors
### ERC2981InvalidDefaultRoyalty
*The default royalty set is invalid (eg. (numerator / denominator) >= 1).*


```solidity
error ERC2981InvalidDefaultRoyalty(uint256 numerator, uint256 denominator);
```

### ERC2981InvalidDefaultRoyaltyReceiver
*The default royalty receiver is invalid.*


```solidity
error ERC2981InvalidDefaultRoyaltyReceiver(address receiver);
```

### ERC2981InvalidTokenRoyalty
*The royalty set for an specific `tokenId` is invalid (eg. (numerator / denominator) >= 1).*


```solidity
error ERC2981InvalidTokenRoyalty(uint256 tokenId, uint256 numerator, uint256 denominator);
```

### ERC2981InvalidTokenRoyaltyReceiver
*The royalty receiver for `tokenId` is invalid.*


```solidity
error ERC2981InvalidTokenRoyaltyReceiver(uint256 tokenId, address receiver);
```

## Structs
### RoyaltyInfo

```solidity
struct RoyaltyInfo {
    address receiver;
    uint96 royaltyFraction;
}
```

