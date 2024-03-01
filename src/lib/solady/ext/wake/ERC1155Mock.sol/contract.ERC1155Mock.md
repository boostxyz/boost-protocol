# ERC1155Mock
**Inherits:**
[ERC1155](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md)


## State Variables
### _enableHooks

```solidity
bool private immutable _enableHooks;
```


## Functions
### constructor


```solidity
constructor(bool enableHooks_);
```

### _useBeforeTokenTransfer


```solidity
function _useBeforeTokenTransfer() internal view override returns (bool);
```

### _useAfterTokenTransfer


```solidity
function _useAfterTokenTransfer() internal view override returns (bool);
```

### _beforeTokenTransfer


```solidity
function _beforeTokenTransfer(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) internal override;
```

### _afterTokenTransfer


```solidity
function _afterTokenTransfer(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) internal override;
```

### uri


```solidity
function uri(uint256 id) public view override returns (string memory);
```

### mint


```solidity
function mint(address to, uint256 id, uint256 amount, bytes memory data) external;
```

### batchMint


```solidity
function batchMint(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) external;
```

### burnUnchecked


```solidity
function burnUnchecked(address by, address from, uint256 id, uint256 amount) external;
```

### burn


```solidity
function burn(address from, uint256 id, uint256 amount) external;
```

### batchBurnUnchecked


```solidity
function batchBurnUnchecked(address by, address from, uint256[] memory ids, uint256[] memory amounts) external;
```

### batchBurn


```solidity
function batchBurn(address from, uint256[] memory ids, uint256[] memory amounts) external;
```

### setApprovalForAllUnchecked


```solidity
function setApprovalForAllUnchecked(address by, address operator, bool approved) external;
```

### safeTransferUnchecked


```solidity
function safeTransferUnchecked(address by, address from, address to, uint256 id, uint256 amount, bytes memory data)
    external;
```

### safeBatchTransferUnchecked


```solidity
function safeBatchTransferUnchecked(
    address by,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) external;
```

## Events
### BeforeTokenTransfer

```solidity
event BeforeTokenTransfer(address from, address to, uint256[] ids, uint256[] amounts, bytes data);
```

### AfterTokenTransfer

```solidity
event AfterTokenTransfer(address from, address to, uint256[] ids, uint256[] amounts, bytes data);
```

