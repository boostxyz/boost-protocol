# ERC721
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/ERC721.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC721.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721/ERC721.sol)

Simple ERC721 implementation with storage hitchhiking.

*Note:
- The ERC721 standard allows for self-approvals.
For performance, this implementation WILL NOT revert for such actions.
Please add any checks with overrides if desired.
- For performance, methods are made payable where permitted by the ERC721 standard.
- The `safeTransfer` functions use the identity precompile (0x4)
to copy memory internally.
If you are overriding:
- NEVER violate the ERC721 invariant:
the balance of an owner MUST always be equal to their number of ownership slots.
The transfer functions do not have an underflow guard for user token balances.
- Make sure all variables written to storage are properly cleaned
- Check that the overridden function is actually used in the function you want to
change the behavior of. Much of the code has been manually inlined for performance.*


## State Variables
### _MAX_ACCOUNT_BALANCE
*An account can hold up to 4294967295 tokens.*


```solidity
uint256 internal constant _MAX_ACCOUNT_BALANCE = 0xffffffff;
```


### _TRANSFER_EVENT_SIGNATURE
*`keccak256(bytes("Transfer(address,address,uint256)"))`.*


```solidity
uint256 private constant _TRANSFER_EVENT_SIGNATURE = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
```


### _APPROVAL_EVENT_SIGNATURE
*`keccak256(bytes("Approval(address,address,uint256)"))`.*


```solidity
uint256 private constant _APPROVAL_EVENT_SIGNATURE = 0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925;
```


### _APPROVAL_FOR_ALL_EVENT_SIGNATURE
*`keccak256(bytes("ApprovalForAll(address,address,bool)"))`.*


```solidity
uint256 private constant _APPROVAL_FOR_ALL_EVENT_SIGNATURE =
    0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31;
```


### _ERC721_MASTER_SLOT_SEED
*The ownership data slot of `id` is given by:
```
mstore(0x00, id)
mstore(0x1c, _ERC721_MASTER_SLOT_SEED)
let ownershipSlot := add(id, add(id, keccak256(0x00, 0x20)))
```
Bits Layout:
- [0..159]   `addr`
- [160..255] `extraData`
The approved address slot is given by: `add(1, ownershipSlot)`.
See: https://notes.ethereum.org/%40vbuterin/verkle_tree_eip
The balance slot of `owner` is given by:
```
mstore(0x1c, _ERC721_MASTER_SLOT_SEED)
mstore(0x00, owner)
let balanceSlot := keccak256(0x0c, 0x1c)
```
Bits Layout:
- [0..31]   `balance`
- [32..255] `aux`
The `operator` approval slot of `owner` is given by:
```
mstore(0x1c, or(_ERC721_MASTER_SLOT_SEED, operator))
mstore(0x00, owner)
let operatorApprovalSlot := keccak256(0x0c, 0x30)
```*


```solidity
uint256 private constant _ERC721_MASTER_SLOT_SEED = 0x7d8825530a5a2e7a << 192;
```


### _ERC721_MASTER_SLOT_SEED_MASKED
*Pre-shifted and pre-masked constant.*


```solidity
uint256 private constant _ERC721_MASTER_SLOT_SEED_MASKED = 0x0a5a2e7a00000000;
```


## Functions
### name

*Returns the token collection name.*


```solidity
function name() public view virtual returns (string memory);
```

### symbol

*Returns the token collection symbol.*


```solidity
function symbol() public view virtual returns (string memory);
```

### tokenURI

*Returns the Uniform Resource Identifier (URI) for token `id`.*


```solidity
function tokenURI(uint256 id) public view virtual returns (string memory);
```

### ownerOf

*Returns the owner of token `id`.
Requirements:
- Token `id` must exist.*


```solidity
function ownerOf(uint256 id) public view virtual returns (address result);
```

### balanceOf

*Returns the number of tokens owned by `owner`.
Requirements:
- `owner` must not be the zero address.*


```solidity
function balanceOf(address owner) public view virtual returns (uint256 result);
```

### getApproved

*Returns the account approved to manage token `id`.
Requirements:
- Token `id` must exist.*


```solidity
function getApproved(uint256 id) public view virtual returns (address result);
```

### approve

*Sets `account` as the approved account to manage token `id`.
Requirements:
- Token `id` must exist.
- The caller must be the owner of the token,
or an approved operator for the token owner.
Emits an [Approval](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#approval) event.*


```solidity
function approve(address account, uint256 id) public payable virtual;
```

### isApprovedForAll

*Returns whether `operator` is approved to manage the tokens of `owner`.*


```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool result);
```

### setApprovalForAll

*Sets whether `operator` is approved to manage the tokens of the caller.
Emits an [ApprovalForAll](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#approvalforall) event.*


```solidity
function setApprovalForAll(address operator, bool isApproved) public virtual;
```

### transferFrom

*Transfers token `id` from `from` to `to`.
Requirements:
- Token `id` must exist.
- `from` must be the owner of the token.
- `to` cannot be the zero address.
- The caller must be the owner of the token, or be approved to manage the token.
Emits a [Transfer](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#transfer) event.*


```solidity
function transferFrom(address from, address to, uint256 id) public payable virtual;
```

### safeTransferFrom

*Equivalent to `safeTransferFrom(from, to, id, "")`.*


```solidity
function safeTransferFrom(address from, address to, uint256 id) public payable virtual;
```

### safeTransferFrom

*Transfers token `id` from `from` to `to`.
Requirements:
- Token `id` must exist.
- `from` must be the owner of the token.
- `to` cannot be the zero address.
- The caller must be the owner of the token, or be approved to manage the token.
- If `to` refers to a smart contract, it must implement
[IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ReceiverMock.sol/contract.ERC721ReceiverMock.md#onerc721received), which is called upon a safe transfer.
Emits a {Transfer} event.*


```solidity
function safeTransferFrom(address from, address to, uint256 id, bytes calldata data) public payable virtual;
```

### supportsInterface

*Returns true if this contract implements the interface defined by `interfaceId`.
See: https://eips.ethereum.org/EIPS/eip-165
This function call must use less than 30000 gas.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool result);
```

### _exists

*Returns if token `id` exists.*


```solidity
function _exists(uint256 id) internal view virtual returns (bool result);
```

### _ownerOf

*Returns the owner of token `id`.
Returns the zero address instead of reverting if the token does not exist.*


```solidity
function _ownerOf(uint256 id) internal view virtual returns (address result);
```

### _getAux

*Returns the auxiliary data for `owner`.
Minting, transferring, burning the tokens of `owner` will not change the auxiliary data.
Auxiliary data can be set for any address, even if it does not have any tokens.*


```solidity
function _getAux(address owner) internal view virtual returns (uint224 result);
```

### _setAux

*Set the auxiliary data for `owner` to `value`.
Minting, transferring, burning the tokens of `owner` will not change the auxiliary data.
Auxiliary data can be set for any address, even if it does not have any tokens.*


```solidity
function _setAux(address owner, uint224 value) internal virtual;
```

### _getExtraData

*Returns the extra data for token `id`.
Minting, transferring, burning a token will not change the extra data.
The extra data can be set on a non-existent token.*


```solidity
function _getExtraData(uint256 id) internal view virtual returns (uint96 result);
```

### _setExtraData

*Sets the extra data for token `id` to `value`.
Minting, transferring, burning a token will not change the extra data.
The extra data can be set on a non-existent token.*


```solidity
function _setExtraData(uint256 id, uint96 value) internal virtual;
```

### _mint

*Mints token `id` to `to`.
Requirements:
- Token `id` must not exist.
- `to` cannot be the zero address.
Emits a [Transfer](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#transfer) event.*


```solidity
function _mint(address to, uint256 id) internal virtual;
```

### _mintAndSetExtraDataUnchecked

*Mints token `id` to `to`, and updates the extra data for token `id` to `value`.
Does NOT check if token `id` already exists (assumes `id` is auto-incrementing).
Requirements:
- `to` cannot be the zero address.
Emits a [Transfer](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#transfer) event.*


```solidity
function _mintAndSetExtraDataUnchecked(address to, uint256 id, uint96 value) internal virtual;
```

### _safeMint

*Equivalent to `_safeMint(to, id, "")`.*


```solidity
function _safeMint(address to, uint256 id) internal virtual;
```

### _safeMint

*Mints token `id` to `to`.
Requirements:
- Token `id` must not exist.
- `to` cannot be the zero address.
- If `to` refers to a smart contract, it must implement
[IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ReceiverMock.sol/contract.ERC721ReceiverMock.md#onerc721received), which is called upon a safe transfer.
Emits a {Transfer} event.*


```solidity
function _safeMint(address to, uint256 id, bytes memory data) internal virtual;
```

### _burn

*Equivalent to `_burn(address(0), id)`.*


```solidity
function _burn(uint256 id) internal virtual;
```

### _burn

*Destroys token `id`, using `by`.
Requirements:
- Token `id` must exist.
- If `by` is not the zero address,
it must be the owner of the token, or be approved to manage the token.
Emits a [Transfer](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#transfer) event.*


```solidity
function _burn(address by, uint256 id) internal virtual;
```

### _isApprovedOrOwner

*Returns whether `account` is the owner of token `id`, or is approved to manage it.
Requirements:
- Token `id` must exist.*


```solidity
function _isApprovedOrOwner(address account, uint256 id) internal view virtual returns (bool result);
```

### _getApproved

*Returns the account approved to manage token `id`.
Returns the zero address instead of reverting if the token does not exist.*


```solidity
function _getApproved(uint256 id) internal view virtual returns (address result);
```

### _approve

*Equivalent to `_approve(address(0), account, id)`.*


```solidity
function _approve(address account, uint256 id) internal virtual;
```

### _approve

*Sets `account` as the approved account to manage token `id`, using `by`.
Requirements:
- Token `id` must exist.
- If `by` is not the zero address, `by` must be the owner
or an approved operator for the token owner.
Emits a [Transfer](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#transfer) event.*


```solidity
function _approve(address by, address account, uint256 id) internal virtual;
```

### _setApprovalForAll

*Approve or remove the `operator` as an operator for `by`,
without authorization checks.
Emits an [ApprovalForAll](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#approvalforall) event.*


```solidity
function _setApprovalForAll(address by, address operator, bool isApproved) internal virtual;
```

### _transfer

*Equivalent to `_transfer(address(0), from, to, id)`.*


```solidity
function _transfer(address from, address to, uint256 id) internal virtual;
```

### _transfer

*Transfers token `id` from `from` to `to`.
Requirements:
- Token `id` must exist.
- `from` must be the owner of the token.
- `to` cannot be the zero address.
- If `by` is not the zero address,
it must be the owner of the token, or be approved to manage the token.
Emits a [Transfer](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md#transfer) event.*


```solidity
function _transfer(address by, address from, address to, uint256 id) internal virtual;
```

### _safeTransfer

*Equivalent to `_safeTransfer(from, to, id, "")`.*


```solidity
function _safeTransfer(address from, address to, uint256 id) internal virtual;
```

### _safeTransfer

*Transfers token `id` from `from` to `to`.
Requirements:
- Token `id` must exist.
- `from` must be the owner of the token.
- `to` cannot be the zero address.
- The caller must be the owner of the token, or be approved to manage the token.
- If `to` refers to a smart contract, it must implement
[IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ReceiverMock.sol/contract.ERC721ReceiverMock.md#onerc721received), which is called upon a safe transfer.
Emits a {Transfer} event.*


```solidity
function _safeTransfer(address from, address to, uint256 id, bytes memory data) internal virtual;
```

### _safeTransfer

*Equivalent to `_safeTransfer(by, from, to, id, "")`.*


```solidity
function _safeTransfer(address by, address from, address to, uint256 id) internal virtual;
```

### _safeTransfer

*Transfers token `id` from `from` to `to`.
Requirements:
- Token `id` must exist.
- `from` must be the owner of the token.
- `to` cannot be the zero address.
- If `by` is not the zero address,
it must be the owner of the token, or be approved to manage the token.
- If `to` refers to a smart contract, it must implement
[IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ReceiverMock.sol/contract.ERC721ReceiverMock.md#onerc721received), which is called upon a safe transfer.
Emits a {Transfer} event.*


```solidity
function _safeTransfer(address by, address from, address to, uint256 id, bytes memory data) internal virtual;
```

### _beforeTokenTransfer

*Hook that is called before any token transfers, including minting and burning.*


```solidity
function _beforeTokenTransfer(address from, address to, uint256 id) internal virtual;
```

### _afterTokenTransfer

*Hook that is called after any token transfers, including minting and burning.*


```solidity
function _afterTokenTransfer(address from, address to, uint256 id) internal virtual;
```

### _hasCode

*Returns if `a` has bytecode of non-zero length.*


```solidity
function _hasCode(address a) private view returns (bool result);
```

### _checkOnERC721Received

*Perform a call to invoke [IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/mocks/token/ERC721ReceiverMock.sol/contract.ERC721ReceiverMock.md#onerc721received) on `to`.
Reverts if the target does not support the function correctly.*


```solidity
function _checkOnERC721Received(address from, address to, uint256 id, bytes memory data) private;
```

## Events
### Transfer
*Emitted when token `id` is transferred from `from` to `to`.*


```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed id);
```

### Approval
*Emitted when `owner` enables `account` to manage the `id` token.*


```solidity
event Approval(address indexed owner, address indexed account, uint256 indexed id);
```

### ApprovalForAll
*Emitted when `owner` enables or disables `operator` to manage all of their tokens.*


```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool isApproved);
```

## Errors
### NotOwnerNorApproved
*Only the token owner or an approved account can manage the token.*


```solidity
error NotOwnerNorApproved();
```

### TokenDoesNotExist
*The token does not exist.*


```solidity
error TokenDoesNotExist();
```

### TokenAlreadyExists
*The token already exists.*


```solidity
error TokenAlreadyExists();
```

### BalanceQueryForZeroAddress
*Cannot query the balance for the zero address.*


```solidity
error BalanceQueryForZeroAddress();
```

### TransferToZeroAddress
*Cannot mint or transfer to the zero address.*


```solidity
error TransferToZeroAddress();
```

### TransferFromIncorrectOwner
*The token must be owned by `from`.*


```solidity
error TransferFromIncorrectOwner();
```

### AccountBalanceOverflow
*The recipient's balance has overflowed.*


```solidity
error AccountBalanceOverflow();
```

### TransferToNonERC721ReceiverImplementer
*Cannot safely transfer to a contract that does not implement
the ERC721Receiver interface.*


```solidity
error TransferToNonERC721ReceiverImplementer();
```

