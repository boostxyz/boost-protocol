# GovernorSettings
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*Extension of {Governor} for settings updatable through governance.*


## State Variables
### _proposalThreshold

```solidity
uint256 private _proposalThreshold;
```


### _votingDelay

```solidity
uint48 private _votingDelay;
```


### _votingPeriod

```solidity
uint32 private _votingPeriod;
```


## Functions
### constructor

*Initialize the governance parameters.*


```solidity
constructor(uint48 initialVotingDelay, uint32 initialVotingPeriod, uint256 initialProposalThreshold);
```

### votingDelay

*See [IGovernor-votingDelay](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votingdelay).*


```solidity
function votingDelay() public view virtual override returns (uint256);
```

### votingPeriod

*See [IGovernor-votingPeriod](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votingperiod).*


```solidity
function votingPeriod() public view virtual override returns (uint256);
```

### proposalThreshold

*See [Governor-proposalThreshold](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalthreshold).*


```solidity
function proposalThreshold() public view virtual override returns (uint256);
```

### setVotingDelay

*Update the voting delay. This operation can only be performed through a governance proposal.
Emits a [VotingDelaySet](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#votingdelayset) event.*


```solidity
function setVotingDelay(uint48 newVotingDelay) public virtual onlyGovernance;
```

### setVotingPeriod

*Update the voting period. This operation can only be performed through a governance proposal.
Emits a [VotingPeriodSet](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#votingperiodset) event.*


```solidity
function setVotingPeriod(uint32 newVotingPeriod) public virtual onlyGovernance;
```

### setProposalThreshold

*Update the proposal threshold. This operation can only be performed through a governance proposal.
Emits a [ProposalThresholdSet](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#proposalthresholdset) event.*


```solidity
function setProposalThreshold(uint256 newProposalThreshold) public virtual onlyGovernance;
```

### _setVotingDelay

*Internal setter for the voting delay.
Emits a [VotingDelaySet](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#votingdelayset) event.*


```solidity
function _setVotingDelay(uint48 newVotingDelay) internal virtual;
```

### _setVotingPeriod

*Internal setter for the voting period.
Emits a [VotingPeriodSet](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#votingperiodset) event.*


```solidity
function _setVotingPeriod(uint32 newVotingPeriod) internal virtual;
```

### _setProposalThreshold

*Internal setter for the proposal threshold.
Emits a [ProposalThresholdSet](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#proposalthresholdset) event.*


```solidity
function _setProposalThreshold(uint256 newProposalThreshold) internal virtual;
```

## Events
### VotingDelaySet

```solidity
event VotingDelaySet(uint256 oldVotingDelay, uint256 newVotingDelay);
```

### VotingPeriodSet

```solidity
event VotingPeriodSet(uint256 oldVotingPeriod, uint256 newVotingPeriod);
```

### ProposalThresholdSet

```solidity
event ProposalThresholdSet(uint256 oldProposalThreshold, uint256 newProposalThreshold);
```

