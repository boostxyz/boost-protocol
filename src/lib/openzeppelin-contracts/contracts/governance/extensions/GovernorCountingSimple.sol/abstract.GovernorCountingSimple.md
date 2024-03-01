# GovernorCountingSimple
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*Extension of {Governor} for simple, 3 options, vote counting.*


## State Variables
### _proposalVotes

```solidity
mapping(uint256 proposalId => ProposalVote) private _proposalVotes;
```


## Functions
### COUNTING_MODE

*See [IGovernor-COUNTING_MODE](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#counting_mode).*


```solidity
function COUNTING_MODE() public pure virtual override returns (string memory);
```

### hasVoted

*See [IGovernor-hasVoted](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#hasvoted).*


```solidity
function hasVoted(uint256 proposalId, address account) public view virtual override returns (bool);
```

### proposalVotes

*Accessor to the internal vote counts.*


```solidity
function proposalVotes(uint256 proposalId)
    public
    view
    virtual
    returns (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes);
```

### _quorumReached

*See {Governor-_quorumReached}.*


```solidity
function _quorumReached(uint256 proposalId) internal view virtual override returns (bool);
```

### _voteSucceeded

*See {Governor-_voteSucceeded}. In this module, the forVotes must be strictly over the againstVotes.*


```solidity
function _voteSucceeded(uint256 proposalId) internal view virtual override returns (bool);
```

### _countVote

*See {Governor-_countVote}. In this module, the support follows the `VoteType` enum (from Governor Bravo).*


```solidity
function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight, bytes memory)
    internal
    virtual
    override;
```

## Structs
### ProposalVote

```solidity
struct ProposalVote {
    uint256 againstVotes;
    uint256 forVotes;
    uint256 abstainVotes;
    mapping(address voter => bool) hasVoted;
}
```

## Enums
### VoteType
*Supported vote types. Matches Governor Bravo ordering.*


```solidity
enum VoteType {
    Against,
    For,
    Abstain
}
```

