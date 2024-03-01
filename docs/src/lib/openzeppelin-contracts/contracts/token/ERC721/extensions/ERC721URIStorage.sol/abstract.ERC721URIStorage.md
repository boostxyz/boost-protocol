# ERC721URIStorage
**Inherits:**
[IERC4906](/lib/openzeppelin-contracts/contracts/interfaces/IERC4906.sol/interface.IERC4906.md), [ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md)

*ERC-721 token with storage based token URI management.*


## State Variables
### ERC4906_INTERFACE_ID

```solidity
bytes4 private constant ERC4906_INTERFACE_ID = bytes4(0x49064906);
```


### _tokenURIs

```solidity
mapping(uint256 tokenId => string) private _tokenURIs;
```


## Functions
### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Royalty.sol/abstract.ERC721Royalty.md#supportsinterface)*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool);
```

### tokenURI

*See [IERC721Metadata-tokenURI](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol/interface.IERC721Metadata.md#tokenuri).*


```solidity
function tokenURI(uint256 tokenId) public view virtual override returns (string memory);
```

### _setTokenURI

*Sets `_tokenURI` as the tokenURI of `tokenId`.
Emits {MetadataUpdate}.*


```solidity
function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual;
```

