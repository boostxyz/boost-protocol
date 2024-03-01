# ERC1155Burnable
**Inherits:**
[ERC1155](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md)

*Extension of {ERC1155} that allows token holders to destroy both their
own tokens and those that they have been approved to use.*


## Functions
### burn


```solidity
function burn(address account, uint256 id, uint256 value) public virtual;
```

### burnBatch


```solidity
function burnBatch(address account, uint256[] memory ids, uint256[] memory values) public virtual;
```

