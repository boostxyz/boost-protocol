# ERC1271WalletMock
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md), [IERC1271](/lib/openzeppelin-contracts/contracts/interfaces/IERC1271.sol/interface.IERC1271.md)


## Functions
### constructor


```solidity
constructor(address originalOwner) Ownable(originalOwner);
```

### isValidSignature


```solidity
function isValidSignature(bytes32 hash, bytes memory signature) public view returns (bytes4 magicValue);
```

