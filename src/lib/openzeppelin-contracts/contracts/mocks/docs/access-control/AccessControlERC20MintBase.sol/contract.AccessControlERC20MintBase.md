# AccessControlERC20MintBase
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [AccessControl](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md)


## State Variables
### MINTER_ROLE

```solidity
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
```


## Functions
### constructor


```solidity
constructor(address minter) ERC20("MyToken", "TKN");
```

### mint


```solidity
function mint(address to, uint256 amount) public;
```

## Errors
### CallerNotMinter

```solidity
error CallerNotMinter(address caller);
```

