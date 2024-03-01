# ERC1155Holder
**Inherits:**
[ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md), [IERC1155Receiver](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol/interface.IERC1155Receiver.md)

*Simple implementation of `IERC1155Receiver` that will allow a contract to hold ERC-1155 tokens.
IMPORTANT: When inheriting this contract, you must include a way to use the received tokens, otherwise they will be
stuck.*


## Functions
### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlEnumerable.sol/abstract.AccessControlEnumerable.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool);
```

### onERC1155Received


```solidity
function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual override returns (bytes4);
```

### onERC1155BatchReceived


```solidity
function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory)
    public
    virtual
    override
    returns (bytes4);
```

