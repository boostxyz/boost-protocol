# ERC20Pausable
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [Pausable](/lib/openzeppelin-contracts/contracts/utils/Pausable.sol/abstract.Pausable.md)

*ERC-20 token with pausable token transfers, minting and burning.
Useful for scenarios such as preventing trades until the end of an evaluation
period, or having an emergency switch for freezing all token transfers in the
event of a large bug.
IMPORTANT: This contract does not include public pause and unpause functions. In
addition to inheriting this contract, you must define both functions, invoking the
[Pausable-_pause](/lib/openzeppelin-contracts/contracts/utils/Pausable.sol/abstract.Pausable.md#_pause) and {Pausable-_unpause} internal functions, with appropriate
access control, e.g. using {AccessControl} or {Ownable}. Not doing so will
make the contract pause mechanism of the contract unreachable, and thus unusable.*


## Functions
### _update

*See [ERC20-_update](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol/abstract.ERC20Votes.md#_update).
Requirements:
- the contract must not be paused.*


```solidity
function _update(address from, address to, uint256 value) internal virtual override whenNotPaused;
```

