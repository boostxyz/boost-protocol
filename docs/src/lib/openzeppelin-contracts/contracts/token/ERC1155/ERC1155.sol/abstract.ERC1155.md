# ERC1155
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md), [IERC1155](/lib/forge-std/src/interfaces/IERC1155.sol/interface.IERC1155.md), [IERC1155MetadataURI](/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol/interface.IERC1155MetadataURI.md), [IERC1155Errors](/lib/openzeppelin-contracts/contracts/interfaces/draft-IERC6093.sol/interface.IERC1155Errors.md)

*Implementation of the basic standard multi-token.
See https://eips.ethereum.org/EIPS/eip-1155
Originally based on code by Enjin: https://github.com/enjin/erc-1155*


## State Variables
### _balances

```solidity
mapping(uint256 id => mapping(address account => uint256)) private _balances;
```


### _operatorApprovals

```solidity
mapping(address account => mapping(address operator => bool)) private _operatorApprovals;
```


### _uri

```solidity
string private _uri;
```


## Functions
### constructor

*See [_setURI](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_seturi).*


```solidity
constructor(string memory uri_);
```

### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol/abstract.ERC1155Holder.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool);
```

### uri

*See [IERC1155MetadataURI-uri](/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol/abstract.ERC1155URIStorage.md#uri).
This implementation returns the same URI for *all* token types. It relies
on the token type ID substitution mechanism
https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the ERC].
Clients calling this function must replace the `\{id\}` substring with the
actual token type ID.*


```solidity
function uri(uint256) public view virtual returns (string memory);
```

### balanceOf

*See [IERC1155-balanceOf](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#balanceof).*


```solidity
function balanceOf(address account, uint256 id) public view virtual returns (uint256);
```

### balanceOfBatch

*See [IERC1155-balanceOfBatch](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#balanceofbatch).
Requirements:
- `accounts` and `ids` must have the same length.*


```solidity
function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
    public
    view
    virtual
    returns (uint256[] memory);
```

### setApprovalForAll

*See [IERC1155-setApprovalForAll](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#setapprovalforall).*


```solidity
function setApprovalForAll(address operator, bool approved) public virtual;
```

### isApprovedForAll

*See [IERC1155-isApprovedForAll](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#isapprovedforall).*


```solidity
function isApprovedForAll(address account, address operator) public view virtual returns (bool);
```

### safeTransferFrom

*See [IERC1155-safeTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#safetransferfrom).*


```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public virtual;
```

### safeBatchTransferFrom

*See [IERC1155-safeBatchTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol/interface.IERC1155.md#safebatchtransferfrom).*


```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory values,
    bytes memory data
) public virtual;
```

### _update

*Transfers a `value` amount of tokens of type `id` from `from` to `to`. Will mint (or burn) if `from`
(or `to`) is the zero address.
Emits a {TransferSingle} event if the arrays contain one element, and {TransferBatch} otherwise.
Requirements:
- If `to` refers to a smart contract, it must implement either {IERC1155Receiver-onERC1155Received}
or {IERC1155Receiver-onERC1155BatchReceived} and return the acceptance magic value.
- `ids` and `values` must have the same length.
NOTE: The ERC-1155 acceptance check is not performed in this function. See {_updateWithAcceptanceCheck} instead.*


```solidity
function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal virtual;
```

### _updateWithAcceptanceCheck

*Version of [_update](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_update) that performs the token acceptance check by calling
{IERC1155Receiver-onERC1155Received} or {IERC1155Receiver-onERC1155BatchReceived} on the receiver address if it
contains code (eg. is a smart contract at the moment of execution).
IMPORTANT: Overriding this function is discouraged because it poses a reentrancy risk from the receiver. So any
update to the contract state after this function would break the check-effect-interaction pattern. Consider
overriding {_update} instead.*


```solidity
function _updateWithAcceptanceCheck(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory values,
    bytes memory data
) internal virtual;
```

### _safeTransferFrom

*Transfers a `value` tokens of token type `id` from `from` to `to`.
Emits a {TransferSingle} event.
Requirements:
- `to` cannot be the zero address.
- `from` must have a balance of tokens of type `id` of at least `value` amount.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value.*


```solidity
function _safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) internal;
```

### _safeBatchTransferFrom

*xref:ROOT:erc1155.adoc#batch-operations[Batched] version of [_safeTransferFrom](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_safetransferfrom).
Emits a {TransferBatch} event.
Requirements:
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value.
- `ids` and `values` must have the same length.*


```solidity
function _safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory values,
    bytes memory data
) internal;
```

### _setURI

*Sets a new URI for all token types, by relying on the token type ID
substitution mechanism
https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the ERC].
By this mechanism, any occurrence of the `\{id\}` substring in either the
URI or any of the values in the JSON file at said URI will be replaced by
clients with the token type ID.
For example, the `https://token-cdn-domain/\{id\}.json` URI would be
interpreted by clients as
`https://token-cdn-domain/000000000000000000000000000000000000000000000000000000000004cce0.json`
for token type ID 0x4cce0.
See [uri](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#uri).
Because these URIs cannot be meaningfully represented by the {URI} event,
this function emits no events.*


```solidity
function _setURI(string memory newuri) internal virtual;
```

### _mint

*Creates a `value` amount of tokens of type `id`, and assigns them to `to`.
Emits a {TransferSingle} event.
Requirements:
- `to` cannot be the zero address.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
acceptance magic value.*


```solidity
function _mint(address to, uint256 id, uint256 value, bytes memory data) internal;
```

### _mintBatch

*xref:ROOT:erc1155.adoc#batch-operations[Batched] version of [_mint](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_mint).
Emits a {TransferBatch} event.
Requirements:
- `ids` and `values` must have the same length.
- `to` cannot be the zero address.
- If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
acceptance magic value.*


```solidity
function _mintBatch(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) internal;
```

### _burn

*Destroys a `value` amount of tokens of type `id` from `from`
Emits a {TransferSingle} event.
Requirements:
- `from` cannot be the zero address.
- `from` must have at least `value` amount of tokens of type `id`.*


```solidity
function _burn(address from, uint256 id, uint256 value) internal;
```

### _burnBatch

*xref:ROOT:erc1155.adoc#batch-operations[Batched] version of [_burn](/lib/openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol/abstract.ERC1155.md#_burn).
Emits a {TransferBatch} event.
Requirements:
- `from` cannot be the zero address.
- `from` must have at least `value` amount of tokens of type `id`.
- `ids` and `values` must have the same length.*


```solidity
function _burnBatch(address from, uint256[] memory ids, uint256[] memory values) internal;
```

### _setApprovalForAll

*Approve `operator` to operate on all of `owner` tokens
Emits an {ApprovalForAll} event.
Requirements:
- `operator` cannot be the zero address.*


```solidity
function _setApprovalForAll(address owner, address operator, bool approved) internal virtual;
```

### _asSingletonArrays

*Creates an array in memory with only one value for each of the elements provided.*


```solidity
function _asSingletonArrays(uint256 element1, uint256 element2)
    private
    pure
    returns (uint256[] memory array1, uint256[] memory array2);
```

