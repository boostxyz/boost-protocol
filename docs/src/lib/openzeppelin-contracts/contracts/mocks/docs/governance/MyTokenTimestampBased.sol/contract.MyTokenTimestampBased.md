# MyTokenTimestampBased
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [ERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md), [ERC20Votes](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol/abstract.ERC20Votes.md)


## Functions
### constructor


```solidity
constructor() ERC20("MyTokenTimestampBased", "MTK") ERC20Permit("MyTokenTimestampBased");
```

### clock


```solidity
function clock() public view override returns (uint48);
```

### CLOCK_MODE


```solidity
function CLOCK_MODE() public pure override returns (string memory);
```

### _update


```solidity
function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes);
```

### nonces


```solidity
function nonces(address owner) public view virtual override(ERC20Permit, Nonces) returns (uint256);
```

