# MockERC1271Wallet
**Inherits:**
[ERC721TokenReceiver](/lib/solady/test/ERC721.t.sol/abstract.ERC721TokenReceiver.md), [ERC1155TokenReceiver](/lib/solady/test/utils/mocks/MockERC1271Wallet.sol/abstract.ERC1155TokenReceiver.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### signer

```solidity
address signer;
```


## Functions
### constructor


```solidity
constructor(address signer_);
```

### isValidSignature


```solidity
function isValidSignature(bytes32 hash, bytes calldata signature) external view returns (bytes4);
```

