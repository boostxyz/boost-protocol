# ERC2771ContextMock
**Inherits:**
[ContextMock](/lib/openzeppelin-contracts/contracts/mocks/ContextMock.sol/contract.ContextMock.md), [ERC2771Context](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Context.sol/abstract.ERC2771Context.md), [Multicall](/lib/openzeppelin-contracts/contracts/utils/Multicall.sol/abstract.Multicall.md)


## Functions
### constructor


```solidity
constructor(address trustedForwarder) ERC2771Context(trustedForwarder);
```

### _msgSender


```solidity
function _msgSender() internal view override(Context, ERC2771Context) returns (address);
```

### _msgData


```solidity
function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata);
```

### _contextSuffixLength


```solidity
function _contextSuffixLength() internal view override(Context, ERC2771Context) returns (uint256);
```

