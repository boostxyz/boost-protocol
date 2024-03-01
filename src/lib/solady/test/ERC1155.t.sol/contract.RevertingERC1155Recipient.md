# RevertingERC1155Recipient
**Inherits:**
[ERC1155TokenReceiver](/lib/solady/test/utils/mocks/MockERC1271Wallet.sol/abstract.ERC1155TokenReceiver.md)


## Functions
### onERC1155Received


```solidity
function onERC1155Received(address, address, uint256, uint256, bytes calldata) public pure override returns (bytes4);
```

### onERC1155BatchReceived


```solidity
function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
    external
    pure
    override
    returns (bytes4);
```

