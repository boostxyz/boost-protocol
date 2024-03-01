# GovernorInternalTest
**Inherits:**
[Test](/lib/forge-std/src/Test.sol/abstract.Test.md), [Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)


## Functions
### constructor


```solidity
constructor() Governor("");
```

### testValidDescriptionForProposer


```solidity
function testValidDescriptionForProposer(string memory description, address proposer, bool includeProposer) public;
```

### testInvalidDescriptionForProposer


```solidity
function testInvalidDescriptionForProposer(string memory description, address commitProposer, address actualProposer)
    public;
```

### clock


```solidity
function clock() public pure override returns (uint48);
```

### CLOCK_MODE


```solidity
function CLOCK_MODE() public pure override returns (string memory);
```

### COUNTING_MODE


```solidity
function COUNTING_MODE() public pure virtual override returns (string memory);
```

### votingDelay


```solidity
function votingDelay() public pure virtual override returns (uint256);
```

### votingPeriod


```solidity
function votingPeriod() public pure virtual override returns (uint256);
```

### quorum


```solidity
function quorum(uint256) public pure virtual override returns (uint256);
```

### hasVoted


```solidity
function hasVoted(uint256, address) public pure virtual override returns (bool);
```

### _quorumReached


```solidity
function _quorumReached(uint256) internal pure virtual override returns (bool);
```

### _voteSucceeded


```solidity
function _voteSucceeded(uint256) internal pure virtual override returns (bool);
```

### _getVotes


```solidity
function _getVotes(address, uint256, bytes memory) internal pure virtual override returns (uint256);
```

### _countVote


```solidity
function _countVote(uint256, address, uint8, uint256, bytes memory) internal virtual override;
```

