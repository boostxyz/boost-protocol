# IERC1155MetadataURI
**Inherits:**
[IERC1155](/lib/forge-std/src/interfaces/IERC1155.sol/interface.IERC1155.md)

*Interface of the optional ERC1155MetadataExtension interface, as defined
in the https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[ERC].*


## Functions
### uri

*Returns the URI for token type `id`.
If the `\{id\}` substring is present in the URI, it must be replaced by
clients with the actual token type ID.*


```solidity
function uri(uint256 id) external view returns (string memory);
```

