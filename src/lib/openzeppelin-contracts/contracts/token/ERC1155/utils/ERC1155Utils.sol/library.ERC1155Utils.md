# ERC1155Utils
*Library that provide common ERC-1155 utility functions.
See https://eips.ethereum.org/EIPS/eip-1155[ERC-1155].*


## Functions
### checkOnERC1155Received

*Performs an acceptance check for the provided `operator` by calling [IERC1155-onERC1155Received](/lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol/abstract.ERC1155Holder.md#onerc1155received)
on the `to` address. The `operator` is generally the address that initiated the token transfer (i.e. `msg.sender`).
The acceptance call is not executed and treated as a no-op if the target address is doesn't contain code (i.e. an EOA).
Otherwise, the recipient must implement {IERC1155Receiver-onERC1155Received} and return the acceptance magic value to accept
the transfer.*


```solidity
function checkOnERC1155Received(
    address operator,
    address from,
    address to,
    uint256 id,
    uint256 value,
    bytes memory data
) internal;
```

### checkOnERC1155BatchReceived

*Performs a batch acceptance check for the provided `operator` by calling [IERC1155-onERC1155BatchReceived](/lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol/abstract.ERC1155Holder.md#onerc1155batchreceived)
on the `to` address. The `operator` is generally the address that initiated the token transfer (i.e. `msg.sender`).
The acceptance call is not executed and treated as a no-op if the target address is doesn't contain code (i.e. an EOA).
Otherwise, the recipient must implement {IERC1155Receiver-onERC1155Received} and return the acceptance magic value to accept
the transfer.*


```solidity
function checkOnERC1155BatchReceived(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory values,
    bytes memory data
) internal;
```

