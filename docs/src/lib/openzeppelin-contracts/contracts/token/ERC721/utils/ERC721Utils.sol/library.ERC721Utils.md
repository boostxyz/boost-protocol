# ERC721Utils
*Library that provide common ERC-721 utility functions.
See https://eips.ethereum.org/EIPS/eip-721[ERC-721].*


## Functions
### checkOnERC721Received

*Performs an acceptance check for the provided `operator` by calling [IERC721-onERC721Received](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Wrapper.sol/abstract.ERC721Wrapper.md#onerc721received)
on the `to` address. The `operator` is generally the address that initiated the token transfer (i.e. `msg.sender`).
The acceptance call is not executed and treated as a no-op if the target address is doesn't contain code (i.e. an EOA).
Otherwise, the recipient must implement {IERC721Receiver-onERC721Received} and return the acceptance magic value to accept
the transfer.*


```solidity
function checkOnERC721Received(address operator, address from, address to, uint256 tokenId, bytes memory data)
    internal;
```

