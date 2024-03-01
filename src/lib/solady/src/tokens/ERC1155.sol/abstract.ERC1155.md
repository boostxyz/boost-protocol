# ERC1155
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/ERC1155.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC1155.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC1155/ERC1155.sol)

Simple ERC1155 implementation.

*Note:
- The ERC1155 standard allows for self-approvals.
For performance, this implementation WILL NOT revert for such actions.
Please add any checks with overrides if desired.
- The transfer functions use the identity precompile (0x4)
to copy memory internally.
If you are overriding:
- Make sure all variables written to storage are properly cleaned
- Check that the overridden function is actually used in the function you want to
change the behavior of. Much of the code has been manually inlined for performance.*


## State Variables
### _TRANSFER_SINGLE_EVENT_SIGNATURE
*`keccak256(bytes("TransferSingle(address,address,address,uint256,uint256)"))`.*


```solidity
uint256 private constant _TRANSFER_SINGLE_EVENT_SIGNATURE =
    0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62;
```


### _TRANSFER_BATCH_EVENT_SIGNATURE
*`keccak256(bytes("TransferBatch(address,address,address,uint256[],uint256[])"))`.*


```solidity
uint256 private constant _TRANSFER_BATCH_EVENT_SIGNATURE =
    0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb;
```


### _APPROVAL_FOR_ALL_EVENT_SIGNATURE
*`keccak256(bytes("ApprovalForAll(address,address,bool)"))`.*


```solidity
uint256 private constant _APPROVAL_FOR_ALL_EVENT_SIGNATURE =
    0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31;
```


### _ERC1155_MASTER_SLOT_SEED
*The `ownerSlotSeed` of a given owner is given by.
```
let ownerSlotSeed := or(_ERC1155_MASTER_SLOT_SEED, shl(96, owner))
```
The balance slot of `owner` is given by.
```
mstore(0x20, ownerSlotSeed)
mstore(0x00, id)
let balanceSlot := keccak256(0x00, 0x40)
```
The operator approval slot of `owner` is given by.
```
mstore(0x20, ownerSlotSeed)
mstore(0x00, operator)
let operatorApprovalSlot := keccak256(0x0c, 0x34)
```*


```solidity
uint256 private constant _ERC1155_MASTER_SLOT_SEED = 0x9a31110384e0b0c9;
```


## Functions
### uri

*Returns the URI for token `id`.
You can either return the same templated URI for all token IDs,
(e.g. "https://example.com/api/{id}.json"),
or return a unique URI for each `id`.
See: https://eips.ethereum.org/EIPS/eip-1155#metadata*


```solidity
function uri(uint256 id) public view virtual returns (string memory);
```

### balanceOf

*Returns the amount of `id` owned by `owner`.*


```solidity
function balanceOf(address owner, uint256 id) public view virtual returns (uint256 result);
```

### isApprovedForAll

*Returns whether `operator` is approved to manage the tokens of `owner`.*


```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool result);
```

### setApprovalForAll

*Sets whether `operator` is approved to manage the tokens of the caller.
Emits a [ApprovalForAll](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md#approvalforall) event.*


```solidity
function setApprovalForAll(address operator, bool isApproved) public virtual;
```

### safeTransferFrom

*Transfers `amount` of `id` from `from` to `to`.
Requirements:
- `to` cannot be the zero address.
- `from` must have at least `amount` of `id`.
- If the caller is not `from`,
it must be approved to manage the tokens of `from`.
- If `to` refers to a smart contract, it must implement
{ERC1155-onERC1155Reveived}, which is called upon a batch transfer.
Emits a {Transfer} event.*


```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) public virtual;
```

### safeBatchTransferFrom

*Transfers `amounts` of `ids` from `from` to `to`.
Requirements:
- `to` cannot be the zero address.
- `from` must have at least `amount` of `id`.
- `ids` and `amounts` must have the same length.
- If the caller is not `from`,
it must be approved to manage the tokens of `from`.
- If `to` refers to a smart contract, it must implement
{ERC1155-onERC1155BatchReveived}, which is called upon a batch transfer.
Emits a {TransferBatch} event.*


```solidity
function safeBatchTransferFrom(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata data
) public virtual;
```

### balanceOfBatch

*Returns the amounts of `ids` for `owners.
Requirements:
- `owners` and `ids` must have the same length.*


```solidity
function balanceOfBatch(address[] calldata owners, uint256[] calldata ids)
    public
    view
    virtual
    returns (uint256[] memory balances);
```

### supportsInterface

*Returns true if this contract implements the interface defined by `interfaceId`.
See: https://eips.ethereum.org/EIPS/eip-165
This function call must use less than 30000 gas.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool result);
```

### _mint

*Mints `amount` of `id` to `to`.
Requirements:
- `to` cannot be the zero address.
- If `to` refers to a smart contract, it must implement
{ERC1155-onERC1155Reveived}, which is called upon a batch transfer.
Emits a {Transfer} event.*


```solidity
function _mint(address to, uint256 id, uint256 amount, bytes memory data) internal virtual;
```

### _batchMint

*Mints `amounts` of `ids` to `to`.
Requirements:
- `to` cannot be the zero address.
- `ids` and `amounts` must have the same length.
- If `to` refers to a smart contract, it must implement
{ERC1155-onERC1155BatchReveived}, which is called upon a batch transfer.
Emits a {TransferBatch} event.*


```solidity
function _batchMint(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal virtual;
```

### _burn

*Equivalent to `_burn(address(0), from, id, amount)`.*


```solidity
function _burn(address from, uint256 id, uint256 amount) internal virtual;
```

### _burn

*Destroys `amount` of `id` from `from`.
Requirements:
- `from` must have at least `amount` of `id`.
- If `by` is not the zero address, it must be either `from`,
or approved to manage the tokens of `from`.
Emits a {Transfer} event.*


```solidity
function _burn(address by, address from, uint256 id, uint256 amount) internal virtual;
```

### _batchBurn

*Equivalent to `_batchBurn(address(0), from, ids, amounts)`.*


```solidity
function _batchBurn(address from, uint256[] memory ids, uint256[] memory amounts) internal virtual;
```

### _batchBurn

*Destroys `amounts` of `ids` from `from`.
Requirements:
- `ids` and `amounts` must have the same length.
- `from` must have at least `amounts` of `ids`.
- If `by` is not the zero address, it must be either `from`,
or approved to manage the tokens of `from`.
Emits a [TransferBatch](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md#transferbatch) event.*


```solidity
function _batchBurn(address by, address from, uint256[] memory ids, uint256[] memory amounts) internal virtual;
```

### _setApprovalForAll

*Approve or remove the `operator` as an operator for `by`,
without authorization checks.
Emits a [ApprovalForAll](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md#approvalforall) event.*


```solidity
function _setApprovalForAll(address by, address operator, bool isApproved) internal virtual;
```

### _safeTransfer

*Equivalent to `_safeTransfer(address(0), from, to, id, amount, data)`.*


```solidity
function _safeTransfer(address from, address to, uint256 id, uint256 amount, bytes memory data) internal virtual;
```

### _safeTransfer

*Transfers `amount` of `id` from `from` to `to`.
Requirements:
- `to` cannot be the zero address.
- `from` must have at least `amount` of `id`.
- If `by` is not the zero address, it must be either `from`,
or approved to manage the tokens of `from`.
- If `to` refers to a smart contract, it must implement
{ERC1155-onERC1155Reveived}, which is called upon a batch transfer.
Emits a {Transfer} event.*


```solidity
function _safeTransfer(address by, address from, address to, uint256 id, uint256 amount, bytes memory data)
    internal
    virtual;
```

### _safeBatchTransfer

*Equivalent to `_safeBatchTransfer(address(0), from, to, ids, amounts, data)`.*


```solidity
function _safeBatchTransfer(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal
    virtual;
```

### _safeBatchTransfer

*Transfers `amounts` of `ids` from `from` to `to`.
Requirements:
- `to` cannot be the zero address.
- `ids` and `amounts` must have the same length.
- `from` must have at least `amounts` of `ids`.
- If `by` is not the zero address, it must be either `from`,
or approved to manage the tokens of `from`.
- If `to` refers to a smart contract, it must implement
{ERC1155-onERC1155BatchReveived}, which is called upon a batch transfer.
Emits a {TransferBatch} event.*


```solidity
function _safeBatchTransfer(
    address by,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) internal virtual;
```

### _useBeforeTokenTransfer

*Override this function to return true if `_beforeTokenTransfer` is used.
This is to help the compiler avoid producing dead bytecode.*


```solidity
function _useBeforeTokenTransfer() internal view virtual returns (bool);
```

### _beforeTokenTransfer

*Hook that is called before any token transfer.
This includes minting and burning, as well as batched variants.
The same hook is called on both single and batched variants.
For single transfers, the length of the `id` and `amount` arrays are 1.*


```solidity
function _beforeTokenTransfer(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) internal virtual;
```

### _useAfterTokenTransfer

*Override this function to return true if `_afterTokenTransfer` is used.
This is to help the compiler avoid producing dead bytecode.*


```solidity
function _useAfterTokenTransfer() internal view virtual returns (bool);
```

### _afterTokenTransfer

*Hook that is called after any token transfer.
This includes minting and burning, as well as batched variants.
The same hook is called on both single and batched variants.
For single transfers, the length of the `id` and `amount` arrays are 1.*


```solidity
function _afterTokenTransfer(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) internal virtual;
```

### _afterTokenTransferCalldata

*Helper for calling the `_afterTokenTransfer` hook.
This is to help the compiler avoid producing dead bytecode.*


```solidity
function _afterTokenTransferCalldata(
    address from,
    address to,
    uint256[] calldata ids,
    uint256[] calldata amounts,
    bytes calldata data
) private;
```

### _hasCode

*Returns if `a` has bytecode of non-zero length.*


```solidity
function _hasCode(address a) private view returns (bool result);
```

### _checkOnERC1155Received

*Perform a call to invoke [IERC1155Receiver-onERC1155Received](/lib/openzeppelin-contracts/contracts/mocks/token/ERC1155ReceiverMock.sol/contract.ERC1155ReceiverMock.md#onerc1155received) on `to`.
Reverts if the target does not support the function correctly.*


```solidity
function _checkOnERC1155Received(address from, address to, uint256 id, uint256 amount, bytes memory data) private;
```

### _checkOnERC1155BatchReceived

*Perform a call to invoke [IERC1155Receiver-onERC1155BatchReceived](/lib/openzeppelin-contracts/contracts/mocks/token/ERC1155ReceiverMock.sol/contract.ERC1155ReceiverMock.md#onerc1155batchreceived) on `to`.
Reverts if the target does not support the function correctly.*


```solidity
function _checkOnERC1155BatchReceived(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) private;
```

### _single

*Returns `x` in an array with a single element.*


```solidity
function _single(uint256 x) private pure returns (uint256[] memory result);
```

## Events
### TransferSingle
*Emitted when `amount` of token `id` is transferred
from `from` to `to` by `operator`.*


```solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 amount);
```

### TransferBatch
*Emitted when `amounts` of token `ids` are transferred
from `from` to `to` by `operator`.*


```solidity
event TransferBatch(
    address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] amounts
);
```

### ApprovalForAll
*Emitted when `owner` enables or disables `operator` to manage all of their tokens.*


```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool isApproved);
```

### URI
*Emitted when the Uniform Resource Identifier (URI) for token `id`
is updated to `value`. This event is not used in the base contract.
You may need to emit this event depending on your URI logic.
See: https://eips.ethereum.org/EIPS/eip-1155#metadata*


```solidity
event URI(string value, uint256 indexed id);
```

## Errors
### ArrayLengthsMismatch
*The lengths of the input arrays are not the same.*


```solidity
error ArrayLengthsMismatch();
```

### TransferToZeroAddress
*Cannot mint or transfer to the zero address.*


```solidity
error TransferToZeroAddress();
```

### AccountBalanceOverflow
*The recipient's balance has overflowed.*


```solidity
error AccountBalanceOverflow();
```

### InsufficientBalance
*Insufficient balance.*


```solidity
error InsufficientBalance();
```

### NotOwnerNorApproved
*Only the token owner or an approved account can manage the tokens.*


```solidity
error NotOwnerNorApproved();
```

### TransferToNonERC1155ReceiverImplementer
*Cannot safely transfer to a contract that does not implement
the ERC1155Receiver interface.*


```solidity
error TransferToNonERC1155ReceiverImplementer();
```

