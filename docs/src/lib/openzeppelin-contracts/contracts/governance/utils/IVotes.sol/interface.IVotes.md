# IVotes
*Common interface for {ERC20Votes}, {ERC721Votes}, and other {Votes}-enabled contracts.*


## Functions
### getVotes

*Returns the current amount of votes that `account` has.*


```solidity
function getVotes(address account) external view returns (uint256);
```

### getPastVotes

*Returns the amount of votes that `account` had at a specific moment in the past. If the `clock()` is
configured to use block numbers, this will return the value at the end of the corresponding block.*


```solidity
function getPastVotes(address account, uint256 timepoint) external view returns (uint256);
```

### getPastTotalSupply

*Returns the total supply of votes available at a specific moment in the past. If the `clock()` is
configured to use block numbers, this will return the value at the end of the corresponding block.
NOTE: This value is the sum of all available votes, which is not necessarily the sum of all delegated votes.
Votes that have not been delegated are still part of total supply, even though they would not participate in a
vote.*


```solidity
function getPastTotalSupply(uint256 timepoint) external view returns (uint256);
```

### delegates

*Returns the delegate that `account` has chosen.*


```solidity
function delegates(address account) external view returns (address);
```

### delegate

*Delegates votes from the sender to `delegatee`.*


```solidity
function delegate(address delegatee) external;
```

### delegateBySig

*Delegates votes from signer to `delegatee`.*


```solidity
function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) external;
```

## Events
### DelegateChanged
*Emitted when an account changes their delegate.*


```solidity
event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
```

### DelegateVotesChanged
*Emitted when a token transfer or delegate change results in changes to a delegate's number of voting units.*


```solidity
event DelegateVotesChanged(address indexed delegate, uint256 previousVotes, uint256 newVotes);
```

## Errors
### VotesExpiredSignature
*The signature used has expired.*


```solidity
error VotesExpiredSignature(uint256 expiry);
```

