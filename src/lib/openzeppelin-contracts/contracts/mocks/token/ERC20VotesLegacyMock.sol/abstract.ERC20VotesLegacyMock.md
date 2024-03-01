# ERC20VotesLegacyMock
**Inherits:**
[IVotes](/lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol/interface.IVotes.md), [ERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md)

*Copied from the master branch at commit 86de1e8b6c3fa6b4efa4a5435869d2521be0f5f5*


## State Variables
### _DELEGATION_TYPEHASH

```solidity
bytes32 private constant _DELEGATION_TYPEHASH = keccak256("Delegation(address delegatee,uint256 nonce,uint256 expiry)");
```


### _delegatee

```solidity
mapping(address account => address) private _delegatee;
```


### _checkpoints

```solidity
mapping(address delegatee => Checkpoint[]) private _checkpoints;
```


### _totalSupplyCheckpoints

```solidity
Checkpoint[] private _totalSupplyCheckpoints;
```


## Functions
### checkpoints

*Get the `pos`-th checkpoint for `account`.*


```solidity
function checkpoints(address account, uint32 pos) public view virtual returns (Checkpoint memory);
```

### numCheckpoints

*Get number of checkpoints for `account`.*


```solidity
function numCheckpoints(address account) public view virtual returns (uint32);
```

### delegates

*Get the address `account` is currently delegating to.*


```solidity
function delegates(address account) public view virtual returns (address);
```

### getVotes

*Gets the current votes balance for `account`*


```solidity
function getVotes(address account) public view virtual returns (uint256);
```

### getPastVotes

*Retrieve the number of votes for `account` at the end of `blockNumber`.
Requirements:
- `blockNumber` must have been already mined*


```solidity
function getPastVotes(address account, uint256 blockNumber) public view virtual returns (uint256);
```

### getPastTotalSupply

*Retrieve the `totalSupply` at the end of `blockNumber`. Note, this value is the sum of all balances.
It is NOT the sum of all the delegated votes!
Requirements:
- `blockNumber` must have been already mined*


```solidity
function getPastTotalSupply(uint256 blockNumber) public view virtual returns (uint256);
```

### _checkpointsLookup

*Lookup a value in a list of (sorted) checkpoints.*


```solidity
function _checkpointsLookup(Checkpoint[] storage ckpts, uint256 blockNumber) private view returns (uint256);
```

### delegate

*Delegate votes from the sender to `delegatee`.*


```solidity
function delegate(address delegatee) public virtual;
```

### delegateBySig

*Delegates votes from signer to `delegatee`*


```solidity
function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s)
    public
    virtual;
```

### _maxSupply

*Maximum token supply. Defaults to `type(uint224).max` (2^224^ - 1).*


```solidity
function _maxSupply() internal view virtual returns (uint224);
```

### _update

*Move voting power when tokens are transferred.
Emits a [IVotes-DelegateVotesChanged](/lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol/interface.IVotes.md#delegatevoteschanged) event.*


```solidity
function _update(address from, address to, uint256 amount) internal virtual override;
```

### _delegate

*Change delegation for `delegator` to `delegatee`.
Emits events [IVotes-DelegateChanged](/lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol/interface.IVotes.md#delegatechanged) and {IVotes-DelegateVotesChanged}.*


```solidity
function _delegate(address delegator, address delegatee) internal virtual;
```

### _moveVotingPower


```solidity
function _moveVotingPower(address src, address dst, uint256 amount) private;
```

### _writeCheckpoint


```solidity
function _writeCheckpoint(
    Checkpoint[] storage ckpts,
    function(uint256, uint256) view returns (uint256) op,
    uint256 delta
) private returns (uint256 oldWeight, uint256 newWeight);
```

### _add


```solidity
function _add(uint256 a, uint256 b) private pure returns (uint256);
```

### _subtract


```solidity
function _subtract(uint256 a, uint256 b) private pure returns (uint256);
```

### _unsafeAccess

*Access an element of the array without performing bounds check. The position is assumed to be within bounds.*


```solidity
function _unsafeAccess(Checkpoint[] storage ckpts, uint256 pos) private pure returns (Checkpoint storage result);
```

## Structs
### Checkpoint

```solidity
struct Checkpoint {
    uint32 fromBlock;
    uint224 votes;
}
```

