# VotesMock
**Inherits:**
[Votes](/lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol/abstract.Votes.md)


## State Variables
### _votingUnits

```solidity
mapping(address voter => uint256) private _votingUnits;
```


## Functions
### getTotalSupply


```solidity
function getTotalSupply() public view returns (uint256);
```

### delegate


```solidity
function delegate(address account, address newDelegation) public;
```

### _getVotingUnits


```solidity
function _getVotingUnits(address account) internal view override returns (uint256);
```

### _mint


```solidity
function _mint(address account, uint256 votes) internal;
```

### _burn


```solidity
function _burn(address account, uint256 votes) internal;
```

