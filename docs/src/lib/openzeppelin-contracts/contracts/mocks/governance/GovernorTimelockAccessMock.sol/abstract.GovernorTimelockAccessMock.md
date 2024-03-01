# GovernorTimelockAccessMock
**Inherits:**
[GovernorSettings](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md), [GovernorTimelockAccess](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md), [GovernorVotesQuorumFraction](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md), [GovernorCountingSimple](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol/abstract.GovernorCountingSimple.md)


## Functions
### nonGovernanceFunction


```solidity
function nonGovernanceFunction() external;
```

### quorum


```solidity
function quorum(uint256 blockNumber) public view override(Governor, GovernorVotesQuorumFraction) returns (uint256);
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
    override(Governor, GovernorTimelockAccess)
    returns (bool);
```

### propose


```solidity
function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
    public
    override(Governor, GovernorTimelockAccess)
    returns (uint256);
```

### _queueOperations


```solidity
function _queueOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockAccess) returns (uint48);
```

### _executeOperations


```solidity
function _executeOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal override(Governor, GovernorTimelockAccess);
```

### _cancel


```solidity
function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    override(Governor, GovernorTimelockAccess)
    returns (uint256);
```

