# MyGovernor
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md), [GovernorCountingSimple](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol/abstract.GovernorCountingSimple.md), [GovernorVotes](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol/abstract.GovernorVotes.md), [GovernorVotesQuorumFraction](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md), [GovernorTimelockControl](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol/abstract.GovernorTimelockControl.md)


## Functions
### constructor


```solidity
constructor(IVotes _token, TimelockController _timelock)
    Governor("MyGovernor")
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(4)
    GovernorTimelockControl(_timelock);
```

### votingDelay


```solidity
function votingDelay() public pure override returns (uint256);
```

### votingPeriod


```solidity
function votingPeriod() public pure override returns (uint256);
```

### proposalThreshold


```solidity
function proposalThreshold() public pure override returns (uint256);
```

### state


```solidity
function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState);
```

### proposalNeedsQueuing


```solidity
function proposalNeedsQueuing(uint256 proposalId)
    public
    view
    virtual
    override(Governor, GovernorTimelockControl)
    returns (bool);
```

### _queueOperations


```solidity
function _queueOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockControl) returns (uint48);
```

### _executeOperations


```solidity
function _executeOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockControl);
```

### _cancel


```solidity
function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    override(Governor, GovernorTimelockControl)
    returns (uint256);
```

### _executor


```solidity
function _executor() internal view override(Governor, GovernorTimelockControl) returns (address);
```

