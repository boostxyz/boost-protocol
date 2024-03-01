# GovernorVotesQuorumFraction
**Inherits:**
[GovernorVotes](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol/abstract.GovernorVotes.md)

*Extension of {Governor} for voting weight extraction from an {ERC20Votes} token and a quorum expressed as a
fraction of the total supply.*


## State Variables
### _quorumNumeratorHistory

```solidity
Checkpoints.Trace208 private _quorumNumeratorHistory;
```


## Functions
### constructor

*Initialize quorum as a fraction of the token's total supply.
The fraction is specified as `numerator / denominator`. By default the denominator is 100, so quorum is
specified as a percent: a numerator of 10 corresponds to quorum being 10% of total supply. The denominator can be
customized by overriding [quorumDenominator](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md#quorumdenominator).*


```solidity
constructor(uint256 quorumNumeratorValue);
```

### quorumNumerator

*Returns the current quorum numerator. See [quorumDenominator](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md#quorumdenominator).*


```solidity
function quorumNumerator() public view virtual returns (uint256);
```

### quorumNumerator

*Returns the quorum numerator at a specific timepoint. See [quorumDenominator](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md#quorumdenominator).*


```solidity
function quorumNumerator(uint256 timepoint) public view virtual returns (uint256);
```

### quorumDenominator

*Returns the quorum denominator. Defaults to 100, but may be overridden.*


```solidity
function quorumDenominator() public view virtual returns (uint256);
```

### quorum

*Returns the quorum for a timepoint, in terms of number of votes: `supply * numerator / denominator`.*


```solidity
function quorum(uint256 timepoint) public view virtual override returns (uint256);
```

### updateQuorumNumerator

*Changes the quorum numerator.
Emits a [QuorumNumeratorUpdated](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md#quorumnumeratorupdated) event.
Requirements:
- Must be called through a governance proposal.
- New numerator must be smaller or equal to the denominator.*


```solidity
function updateQuorumNumerator(uint256 newQuorumNumerator) external virtual onlyGovernance;
```

### _updateQuorumNumerator

*Changes the quorum numerator.
Emits a [QuorumNumeratorUpdated](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotesQuorumFraction.sol/abstract.GovernorVotesQuorumFraction.md#quorumnumeratorupdated) event.
Requirements:
- New numerator must be smaller or equal to the denominator.*


```solidity
function _updateQuorumNumerator(uint256 newQuorumNumerator) internal virtual;
```

## Events
### QuorumNumeratorUpdated

```solidity
event QuorumNumeratorUpdated(uint256 oldQuorumNumerator, uint256 newQuorumNumerator);
```

## Errors
### GovernorInvalidQuorumFraction
*The quorum set is not a valid fraction.*


```solidity
error GovernorInvalidQuorumFraction(uint256 quorumNumerator, uint256 quorumDenominator);
```

