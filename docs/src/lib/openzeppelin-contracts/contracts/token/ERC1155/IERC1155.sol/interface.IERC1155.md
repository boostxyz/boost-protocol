# IERC1155
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md)

*Required interface of an ERC-1155 compliant contract, as defined in the
https://eips.ethereum.org/EIPS/eip-1155[ERC].*


## Functions
### balanceOf

*Returns the value of tokens of token type `id` owned by `account`.*


```solidity
function balanceOf(address account, uint256 id) external view returns (uint256);
```

### balanceOfBatch

*xref:ROOT:erc1155.adoc#batch-operations[Batched] version of [balanceOf](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#balanceof).
Requirements:
- `accounts` and `ids` must have the same length.*


```solidity
function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory);
```

### setApprovalForAll

*Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
Emits an [ApprovalForAll](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#approvalforall) event.
Requirements:
- `operator` cannot be the zero address.*


```solidity
function setApprovalForAll(address operator, bool approved) external;
```

### isApprovedForAll

*Returns true if `operator` is approved to transfer ``account``'s tokens.
See [setApprovalForAll](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#setapprovalforall).*


```solidity
function isApprovedForAll(address account, address operator) external view returns (bool);
```

### safeTransferFrom

*Transfers a `value` amount of tokens of type `id` from `from` to `to`.
WARNING: This function can potentially allow a reentrancy attack when transferring tokens
to an untrusted contract, when invoking {onERC1155Received} on the receiver.
Ensure to follow the checks-effects-interactions pattern and consider employing
reentrancy guards when interacting with untrusted contracts.
Emits a {TransferSingle} event.
Requirements:
- `to` cannot be the zero address.
- If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
- `from` must have a balance of tokens of type `id` of at least `value` amount.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value.*


```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes calldata data) external;
```

### safeBatchTransferFrom

*xref:ROOT:erc1155.adoc#batch-operations[Batched] version of [safeTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#safetransferfrom).
WARNING: This function can potentially allow a reentrancy attack when transferring tokens
to an untrusted contract, when invoking {onERC1155BatchReceived} on the receiver.
Ensure to follow the checks-effects-interactions pattern and consider employing
reentrancy guards when interacting with untrusted contracts.
Emits either a {TransferSingle} or a {TransferBatch} event, depending on the length of the array arguments.
Requirements:
- `ids` and `values` must have the same length.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value.*


```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
) external;
```

## Events
### TransferSingle
*Emitted when `value` amount of tokens of type `id` are transferred from `from` to `to` by `operator`.*


```solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
```

### TransferBatch
*Equivalent to multiple [TransferSingle](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#transfersingle) events, where `operator`, `from` and `to` are the same for all
transfers.*


```solidity
event TransferBatch(
    address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values
);
```

### ApprovalForAll
*Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
`approved`.*


```solidity
event ApprovalForAll(address indexed account, address indexed operator, bool approved);
```

### URI
*Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.
If an [URI](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#uri) event was emitted for `id`, the standard
https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
returned by {IERC1155MetadataURI-uri}.*


```solidity
event URI(string value, uint256 indexed id);
```

