# ERC721Holder
**Inherits:**
[IERC721Receiver](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol/interface.IERC721Receiver.md)

*Implementation of the {IERC721Receiver} interface.
Accepts all token transfers.
Make sure the contract is able to use its token with {IERC721-safeTransferFrom}, {IERC721-approve} or
{IERC721-setApprovalForAll}.*


## Functions
### onERC721Received

*See [IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Wrapper.sol/abstract.ERC721Wrapper.md#onerc721received).
Always returns `IERC721Receiver.onERC721Received.selector`.*


```solidity
function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4);
```

