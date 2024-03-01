# ERC20WrapperHarness
**Inherits:**
[ERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md), [ERC20Wrapper](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Wrapper.sol/abstract.ERC20Wrapper.md)


## Functions
### constructor


```solidity
constructor(IERC20 _underlying, string memory _name, string memory _symbol)
    ERC20(_name, _symbol)
    ERC20Permit(_name)
    ERC20Wrapper(_underlying);
```

### underlyingTotalSupply


```solidity
function underlyingTotalSupply() public view returns (uint256);
```

### underlyingBalanceOf


```solidity
function underlyingBalanceOf(address account) public view returns (uint256);
```

### underlyingAllowanceToThis


```solidity
function underlyingAllowanceToThis(address account) public view returns (uint256);
```

### recover


```solidity
function recover(address account) public returns (uint256);
```

### decimals


```solidity
function decimals() public view override(ERC20Wrapper, ERC20) returns (uint8);
```

