# ERC721ConsecutiveTarget
**Inherits:**
[StdUtils](/lib/forge-std/src/StdUtils.sol/abstract.StdUtils.md), [ERC721Consecutive](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Consecutive.sol/abstract.ERC721Consecutive.md)


## State Variables
### _offset

```solidity
uint96 private immutable _offset;
```


### totalMinted

```solidity
uint256 public totalMinted = 0;
```


## Functions
### constructor


```solidity
constructor(address[] memory receivers, uint256[] memory batches, uint256 startingId) ERC721("", "");
```

### burn


```solidity
function burn(uint256 tokenId) public;
```

### _firstConsecutiveId


```solidity
function _firstConsecutiveId() internal view virtual override returns (uint96);
```

