# MockERC1155WithHooks
**Inherits:**
[MockERC1155](/lib/solady/test/utils/mocks/MockERC1155.sol/contract.MockERC1155.md)


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
### _useBeforeTokenTransfer


```solidity
function _useBeforeTokenTransfer() internal view virtual override returns (bool);
```

### _useAfterTokenTransfer


```solidity
function _useAfterTokenTransfer() internal view virtual override returns (bool);
```

### _beforeTokenTransfer


```solidity
function _beforeTokenTransfer(address, address, uint256[] memory, uint256[] memory, bytes memory)
    internal
    virtual
    override;
```

### _afterTokenTransfer


```solidity
function _afterTokenTransfer(address, address, uint256[] memory, uint256[] memory, bytes memory)
    internal
    virtual
    override;
```

