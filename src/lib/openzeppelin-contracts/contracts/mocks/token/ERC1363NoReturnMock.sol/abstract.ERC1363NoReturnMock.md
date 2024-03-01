# ERC1363NoReturnMock
**Inherits:**
[ERC1363](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC1363.sol/abstract.ERC1363.md)


## Functions
### transferAndCall


```solidity
function transferAndCall(address to, uint256 value, bytes memory data) public override returns (bool);
```

### transferFromAndCall


```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes memory data)
    public
    override
    returns (bool);
```

### approveAndCall


```solidity
function approveAndCall(address spender, uint256 value, bytes memory data) public override returns (bool);
```

