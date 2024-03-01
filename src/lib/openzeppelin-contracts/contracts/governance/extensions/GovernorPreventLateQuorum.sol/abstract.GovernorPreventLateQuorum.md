# GovernorPreventLateQuorum
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*A module that ensures there is a minimum voting period after quorum is reached. This prevents a large voter from
swaying a vote and triggering quorum at the last minute, by ensuring there is always time for other voters to react
and try to oppose the decision.
If a vote causes quorum to be reached, the proposal's voting period may be extended so that it does not end before at
least a specified time has passed (the "vote extension" parameter). This parameter can be set through a governance
proposal.*


## State Variables
### _voteExtension

```solidity
uint48 private _voteExtension;
```


### _extendedDeadlines

```solidity
mapping(uint256 proposalId => uint48) private _extendedDeadlines;
```


## Functions
### constructor

*Initializes the vote extension parameter: the time in either number of blocks or seconds (depending on the
governor clock mode) that is required to pass since the moment a proposal reaches quorum until its voting period
ends. If necessary the voting period will be extended beyond the one set during proposal creation.*


```solidity
constructor(uint48 initialVoteExtension);
```

### proposalDeadline

*Returns the proposal deadline, which may have been extended beyond that set at proposal creation, if the
proposal reached quorum late in the voting period. See [Governor-proposalDeadline](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposaldeadline).*


```solidity
function proposalDeadline(uint256 proposalId) public view virtual override returns (uint256);
```

### _castVote

*Casts a vote and detects if it caused quorum to be reached, potentially extending the voting period. See
{Governor-_castVote}.
May emit a {ProposalExtended} event.*


```solidity
function _castVote(uint256 proposalId, address account, uint8 support, string memory reason, bytes memory params)
    internal
    virtual
    override
    returns (uint256);
```

### lateQuorumVoteExtension

*Returns the current value of the vote extension parameter: the number of blocks that are required to pass
from the time a proposal reaches quorum until its voting period ends.*


```solidity
function lateQuorumVoteExtension() public view virtual returns (uint48);
```

### setLateQuorumVoteExtension

*Changes the [lateQuorumVoteExtension](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorPreventLateQuorum.sol/abstract.GovernorPreventLateQuorum.md#latequorumvoteextension). This operation can only be performed by the governance executor,
generally through a governance proposal.
Emits a {LateQuorumVoteExtensionSet} event.*


```solidity
function setLateQuorumVoteExtension(uint48 newVoteExtension) public virtual onlyGovernance;
```

### _setLateQuorumVoteExtension

*Changes the [lateQuorumVoteExtension](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorPreventLateQuorum.sol/abstract.GovernorPreventLateQuorum.md#latequorumvoteextension). This is an internal function that can be exposed in a public function
like {setLateQuorumVoteExtension} if another access control mechanism is needed.
Emits a {LateQuorumVoteExtensionSet} event.*


```solidity
function _setLateQuorumVoteExtension(uint48 newVoteExtension) internal virtual;
```

## Events
### ProposalExtended
*Emitted when a proposal deadline is pushed back due to reaching quorum late in its voting period.*


```solidity
event ProposalExtended(uint256 indexed proposalId, uint64 extendedDeadline);
```

### LateQuorumVoteExtensionSet
*Emitted when the [lateQuorumVoteExtension](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorPreventLateQuorum.sol/abstract.GovernorPreventLateQuorum.md#latequorumvoteextension) parameter is changed.*


```solidity
event LateQuorumVoteExtensionSet(uint64 oldVoteExtension, uint64 newVoteExtension);
```

