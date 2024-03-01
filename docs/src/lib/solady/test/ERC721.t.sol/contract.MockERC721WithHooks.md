# MockERC721WithHooks
**Inherits:**
[MockERC721](/lib/forge-std/src/mocks/MockERC721.sol/contract.MockERC721.md)


## State Variables
### beforeCounter

```solidity
uint256 public beforeCounter;
```


### afterCounter

```solidity
uint256 public afterCounter;
```


## Functions
### _beforeTokenTransfer


```solidity
function _beforeTokenTransfer(address, address, uint256) internal virtual override;
```

### _afterTokenTransfer


```solidity
function _afterTokenTransfer(address, address, uint256) internal virtual override;
```

