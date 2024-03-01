# GovernorWithParamsMock
**Inherits:**
[GovernorVotes](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorVotes.sol/abstract.GovernorVotes.md), [GovernorCountingSimple](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorCountingSimple.sol/abstract.GovernorCountingSimple.md)


## Functions
### quorum


```solidity
function quorum(uint256) public pure override returns (uint256);
```

### votingDelay


```solidity
function votingDelay() public pure override returns (uint256);
```

### votingPeriod


```solidity
function votingPeriod() public pure override returns (uint256);
```

### _getVotes


```solidity
function _getVotes(address account, uint256 blockNumber, bytes memory params)
    internal
    view
    override(Governor, GovernorVotes)
    returns (uint256);
```

### _countVote


```solidity
function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight, bytes memory params)
    internal
    override(Governor, GovernorCountingSimple);
```

## Events
### CountParams

```solidity
event CountParams(uint256 uintParam, string strParam);
```

