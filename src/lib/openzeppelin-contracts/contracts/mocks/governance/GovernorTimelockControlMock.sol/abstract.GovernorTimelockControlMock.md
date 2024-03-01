# GovernorTimelockControlMock
**Inherits:**
[GovernorSettings](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md), [GovernorTimelockControl](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol/abstract.GovernorTimelockControl.md), [GovernorVotesQuorumFraction](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md), [GovernorCountingSimple](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol/abstract.GovernorCountingSimple.md)


## Functions
### quorum


```solidity
function quorum(uint256 blockNumber) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256);
```

### state


```solidity
function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState);
```

### proposalThreshold


```solidity
function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256);
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

### nonGovernanceFunction


```solidity
function nonGovernanceFunction() external;
```

