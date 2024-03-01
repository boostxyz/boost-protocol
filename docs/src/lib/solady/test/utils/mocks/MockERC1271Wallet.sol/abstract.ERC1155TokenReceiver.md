# ERC1155TokenReceiver
**Author:**
Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC1155.sol)

A generic interface for a contract which properly accepts ERC1155 tokens.


## Functions
### onERC1155Received


```solidity
function onERC1155Received(address, address, uint256, uint256, bytes calldata) external virtual returns (bytes4);
```

### onERC1155BatchReceived


```solidity
function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
    external
    virtual
    returns (bytes4);
```

