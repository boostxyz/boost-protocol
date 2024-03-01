# MyTokenWrapped
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [ERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md), [ERC20Votes](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol/abstract.ERC20Votes.md), [ERC20Wrapper](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Wrapper.sol/abstract.ERC20Wrapper.md)


## Functions
### constructor


```solidity
constructor(IERC20 wrappedToken)
    ERC20("MyTokenWrapped", "MTK")
    ERC20Permit("MyTokenWrapped")
    ERC20Wrapper(wrappedToken);
```

### decimals


```solidity
function decimals() public view override(ERC20, ERC20Wrapper) returns (uint8);
```

### _update


```solidity
function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes);
```

### nonces


```solidity
function nonces(address owner) public view virtual override(ERC20Permit, Nonces) returns (uint256);
```

