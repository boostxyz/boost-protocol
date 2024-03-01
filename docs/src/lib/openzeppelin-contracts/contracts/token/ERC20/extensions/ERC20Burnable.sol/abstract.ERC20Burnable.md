# ERC20Burnable
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)

*Extension of {ERC20} that allows token holders to destroy both their own
tokens and those that they have an allowance for, in a way that can be
recognized off-chain (via event analysis).*


## Functions
### burn

*Destroys a `value` amount of tokens from the caller.
See [ERC20-_burn](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#_burn).*


```solidity
function burn(uint256 value) public virtual;
```

### burnFrom

*Destroys a `value` amount of tokens from `account`, deducting from
the caller's allowance.
See [ERC20-_burn](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#_burn) and {ERC20-allowance}.
Requirements:
- the caller must have allowance for ``accounts``'s tokens of at least
`value`.*


```solidity
function burnFrom(address account, uint256 value) public virtual;
```

