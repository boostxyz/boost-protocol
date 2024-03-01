# GovernorPreventLateQuorumMock
**Inherits:**
[GovernorSettings](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md), [GovernorVotes](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol/abstract.GovernorVotes.md), [GovernorCountingSimple](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol/abstract.GovernorCountingSimple.md), [GovernorPreventLateQuorum](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorPreventLateQuorum.sol/abstract.GovernorPreventLateQuorum.md)


## State Variables
### _quorum

```solidity
uint256 private _quorum;
```


## Functions
### constructor


```solidity
constructor(uint256 quorum_);
```

### quorum


```solidity
function quorum(uint256) public view override returns (uint256);
```

### proposalDeadline


```solidity
function proposalDeadline(uint256 proposalId)
    public
    view
    override(Governor, GovernorPreventLateQuorum)
    returns (uint256);
```

### proposalThreshold


```solidity
function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256);
```

### _castVote


```solidity
function _castVote(uint256 proposalId, address account, uint8 support, string memory reason, bytes memory params)
    internal
    override(Governor, GovernorPreventLateQuorum)
    returns (uint256);
```

