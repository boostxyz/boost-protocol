# AccessControlERC20MintMissing
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [AccessControl](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md)


## State Variables
### MINTER_ROLE

```solidity
bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
```


### BURNER_ROLE

```solidity
bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
```


## Functions
### constructor


```solidity
constructor() ERC20("MyToken", "TKN");
```

### mint


```solidity
function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE);
```

### burn


```solidity
function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE);
```

