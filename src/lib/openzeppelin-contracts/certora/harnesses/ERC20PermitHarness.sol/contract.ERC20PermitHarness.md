# ERC20PermitHarness
**Inherits:**
[ERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md)


## Functions
### constructor


```solidity
constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name);
```

### mint


```solidity
function mint(address account, uint256 amount) external;
```

### burn


```solidity
function burn(address account, uint256 amount) external;
```

