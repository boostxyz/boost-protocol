# ERC1155URIStorage
**Inherits:**
[ERC1155](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md)

*ERC-1155 token with storage based token URI management.
Inspired by the {ERC721URIStorage} extension*


## State Variables
### _baseURI

```solidity
string private _baseURI = "";
```


### _tokenURIs

```solidity
mapping(uint256 tokenId => string) private _tokenURIs;
```


## Functions
### uri

*See [IERC1155MetadataURI-uri](/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol/interface.IERC1155MetadataURI.md#uri).
This implementation returns the concatenation of the `_baseURI`
and the token-specific uri if the latter is set
This enables the following behaviors:
- if `_tokenURIs[tokenId]` is set, then the result is the concatenation
of `_baseURI` and `_tokenURIs[tokenId]` (keep in mind that `_baseURI`
is empty per default);
- if `_tokenURIs[tokenId]` is NOT set then we fallback to `super.uri()`
which in most cases will contain `ERC1155._uri`;
- if `_tokenURIs[tokenId]` is NOT set, and if the parents do not have a
uri value set, then the result is empty.*


```solidity
function uri(uint256 tokenId) public view virtual override returns (string memory);
```

### _setURI

*Sets `tokenURI` as the tokenURI of `tokenId`.*


```solidity
function _setURI(uint256 tokenId, string memory tokenURI) internal virtual;
```

### _setBaseURI

*Sets `baseURI` as the `_baseURI` for all tokens*


```solidity
function _setBaseURI(string memory baseURI) internal virtual;
```

