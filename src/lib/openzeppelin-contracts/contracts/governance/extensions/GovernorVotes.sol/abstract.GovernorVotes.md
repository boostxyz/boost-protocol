# GovernorVotes
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*Extension of {Governor} for voting weight extraction from an {ERC20Votes} token, or since v4.5 an {ERC721Votes}
token.*


## State Variables
### _token

```solidity
IERC5805 private immutable _token;
```


## Functions
### constructor


```solidity
constructor(IVotes tokenAddress);
```

### token

*The token that voting power is sourced from.*


```solidity
function token() public view virtual returns (IERC5805);
```

### clock

*Clock (as specified in ERC-6372) is set to match the token's clock. Fallback to block numbers if the token
does not implement ERC-6372.*


```solidity
function clock() public view virtual override returns (uint48);
```

### CLOCK_MODE

*Machine-readable description of the clock as specified in ERC-6372.*


```solidity
function CLOCK_MODE() public view virtual override returns (string memory);
```

### _getVotes

Read the voting weight from the token's built in snapshot mechanism (see {Governor-_getVotes}).


```solidity
function _getVotes(address account, uint256 timepoint, bytes memory) internal view virtual override returns (uint256);
```

