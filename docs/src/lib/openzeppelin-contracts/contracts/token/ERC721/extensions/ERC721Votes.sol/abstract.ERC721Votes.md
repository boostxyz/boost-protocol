# ERC721Votes
**Inherits:**
[ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md), [Votes](/lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol/abstract.Votes.md)

*Extension of ERC-721 to support voting and delegation as implemented by {Votes}, where each individual NFT counts
as 1 vote unit.
Tokens do not count as votes until they are delegated, because votes must be tracked which incurs an additional cost
on every transfer. Token holders can either delegate to a trusted representative who will decide how to make use of
the votes in governance decisions, or they can delegate to themselves to be their own representative.*


## Functions
### _update

*See [ERC721-_update](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol/abstract.ERC721Enumerable.md#_update). Adjusts votes when tokens are transferred.
Emits a {IVotes-DelegateVotesChanged} event.*


```solidity
function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address);
```

### _getVotingUnits

*Returns the balance of `account`.
WARNING: Overriding this function will likely result in incorrect vote tracking.*


```solidity
function _getVotingUnits(address account) internal view virtual override returns (uint256);
```

### _increaseBalance

*See [ERC721-_increaseBalance](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol/abstract.ERC721Enumerable.md#_increasebalance). We need that to account tokens that were minted in batch.*


```solidity
function _increaseBalance(address account, uint128 amount) internal virtual override;
```

