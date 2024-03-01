# ERC4626Mock
**Inherits:**
[ERC4626](/lib/solady/src/tokens/ERC4626.sol/abstract.ERC4626.md)


## Functions
### constructor


```solidity
constructor(address underlying) ERC20("ERC4626Mock", "E4626M") ERC4626(IERC20(underlying));
```

### mint


```solidity
function mint(address account, uint256 amount) external;
```

### burn


```solidity
function burn(address account, uint256 amount) external;
```

