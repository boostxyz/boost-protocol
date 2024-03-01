# ERC721ConsecutiveMock
**Inherits:**
[ERC721Consecutive](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md), [ERC721Pausable](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Pausable.sol/abstract.ERC721Pausable.md), [ERC721Votes](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Votes.sol/abstract.ERC721Votes.md)


## State Variables
### _offset

```solidity
uint96 private immutable _offset;
```


## Functions
### constructor


```solidity
constructor(
    string memory name,
    string memory symbol,
    uint96 offset,
    address[] memory delegates,
    address[] memory receivers,
    uint96[] memory amounts
) ERC721(name, symbol) EIP712(name, "1");
```

### _firstConsecutiveId


```solidity
function _firstConsecutiveId() internal view virtual override returns (uint96);
```

### _ownerOf


```solidity
function _ownerOf(uint256 tokenId) internal view virtual override(ERC721, ERC721Consecutive) returns (address);
```

### _update


```solidity
function _update(address to, uint256 tokenId, address auth)
    internal
    virtual
    override(ERC721Consecutive, ERC721Pausable, ERC721Votes)
    returns (address);
```

### _increaseBalance


```solidity
function _increaseBalance(address account, uint128 amount) internal virtual override(ERC721, ERC721Votes);
```

