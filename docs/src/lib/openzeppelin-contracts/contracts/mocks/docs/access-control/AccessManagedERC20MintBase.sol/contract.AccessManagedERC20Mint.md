# AccessManagedERC20Mint
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [AccessManaged](/lib/openzeppelin-contracts/contracts/access/manager/AccessManaged.sol/abstract.AccessManaged.md)


## Functions
### constructor


```solidity
constructor(address manager) ERC20("MyToken", "TKN") AccessManaged(manager);
```

### mint


```solidity
function mint(address to, uint256 amount) public restricted;
```

