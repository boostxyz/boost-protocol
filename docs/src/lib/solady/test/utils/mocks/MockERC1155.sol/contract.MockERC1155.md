# MockERC1155
**Inherits:**
[ERC1155](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### uri


```solidity
function uri(uint256) public pure virtual override returns (string memory);
```

### mint


```solidity
function mint(address to, uint256 id, uint256 amount, bytes memory data) public virtual;
```

### batchMint


```solidity
function batchMint(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public virtual;
```

### burn


```solidity
function burn(address from, uint256 id, uint256 amount) public virtual;
```

### uncheckedBurn


```solidity
function uncheckedBurn(address from, uint256 id, uint256 amount) public virtual;
```

### batchBurn


```solidity
function batchBurn(address from, uint256[] memory ids, uint256[] memory amounts) public virtual;
```

### uncheckedBatchBurn


```solidity
function uncheckedBatchBurn(address from, uint256[] memory ids, uint256[] memory amounts) public virtual;
```

### safeTransferFrom


```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data)
    public
    virtual
    override;
```

### directSafeTransferFrom


```solidity
function directSafeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data)
    public
    virtual;
```

### uncheckedSafeTransferFrom


```solidity
function uncheckedSafeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data)
    public
    virtual;
```

### safeBatchTransferFrom


```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata data
) public virtual override;
```

### directSafeBatchTransferFrom


```solidity
function directSafeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) public virtual;
```

### uncheckedSafeBatchTransferFrom


```solidity
function uncheckedSafeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) public virtual;
```

### directSetApprovalForAll


```solidity
function directSetApprovalForAll(address operator, bool approved) public virtual;
```

### _brutalized


```solidity
function _brutalized(address a) internal view returns (address result);
```

