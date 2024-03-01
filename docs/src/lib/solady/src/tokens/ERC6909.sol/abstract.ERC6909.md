# ERC6909
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/ERC6909.sol)

Simple EIP-6909 implementation.

*Note:
The ERC6909 standard allows minting and transferring to and from the zero address,
minting and transferring zero tokens, as well as self-approvals.
For performance, this implementation WILL NOT revert for such actions.
Please add any checks with overrides if desired.
If you are overriding:
- Make sure all variables written to storage are properly cleaned
- Check that the overridden function is actually used in the function you want to
change the behavior of. Much of the code has been manually inlined for performance.*


## State Variables
### _TRANSFER_EVENT_SIGNATURE
*`keccak256(bytes("Transfer(address,address,address,uint256,uint256)"))`.*


```solidity
uint256 private constant _TRANSFER_EVENT_SIGNATURE = 0x1b3d7edb2e9c0b0e7c525b20aaaef0f5940d2ed71663c7d39266ecafac728859;
```


### _OPERATOR_SET_EVENT_SIGNATURE
*`keccak256(bytes("OperatorSet(address,address,bool)"))`.*


```solidity
uint256 private constant _OPERATOR_SET_EVENT_SIGNATURE =
    0xceb576d9f15e4e200fdb5096d64d5dfd667e16def20c1eefd14256d8e3faa267;
```


### _APPROVAL_EVENT_SIGNATURE
*`keccak256(bytes("Approval(address,address,uint256,uint256)"))`.*


```solidity
uint256 private constant _APPROVAL_EVENT_SIGNATURE = 0xb3fd5071835887567a0671151121894ddccc2842f1d10bedad13e0d17cace9a7;
```


### _ERC6909_MASTER_SLOT_SEED
*The `ownerSlotSeed` of a given owner is given by.
```
let ownerSlotSeed := or(_ERC6909_MASTER_SLOT_SEED, shl(96, owner))
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
```
The allowance slot of (`owner`, `spender`, `id`) is given by:
```
mstore(0x34, ownerSlotSeed)
mstore(0x14, spender)
mstore(0x00, id)
let allowanceSlot := keccak256(0x00, 0x54)
```*


```solidity
uint256 private constant _ERC6909_MASTER_SLOT_SEED = 0xedcaa89a82293940;
```


## Functions
### name

*Returns the name for token `id`.*


```solidity
function name(uint256 id) public view virtual returns (string memory);
```

### symbol

*Returns the symbol for token `id`.*


```solidity
function symbol(uint256 id) public view virtual returns (string memory);
```

### decimals

*Returns the number of decimals for token `id`.
Returns 18 by default.
Please override this function if you need to return a custom value.*


```solidity
function decimals(uint256 id) public view virtual returns (uint8);
```

### tokenURI

*Returns the Uniform Resource Identifier (URI) for token `id`.*


```solidity
function tokenURI(uint256 id) public view virtual returns (string memory);
```

### balanceOf

*Returns the amount of token `id` owned by `owner`.*


```solidity
function balanceOf(address owner, uint256 id) public view virtual returns (uint256 amount);
```

### allowance

*Returns the amount of token `id` that `spender` can spend on behalf of `owner`.*


```solidity
function allowance(address owner, address spender, uint256 id) public view virtual returns (uint256 amount);
```

### isOperator

*Checks if a `spender` is approved by `owner` to manage all of their tokens.*


```solidity
function isOperator(address owner, address spender) public view virtual returns (bool status);
```

### transfer

*Transfers `amount` of token `id` from the caller to `to`.
Requirements:
- caller must at least have `amount`.
Emits a [Transfer](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#transfer) event.*


```solidity
function transfer(address to, uint256 id, uint256 amount) public payable virtual returns (bool);
```

### transferFrom

*Transfers `amount` of token `id` from `from` to `to`.
Note: Does not update the allowance if it is the maximum uint256 value.
Requirements:
- `from` must at least have `amount` of token `id`.
-  The caller must have at least `amount` of allowance to transfer the
tokens of `from` or approved as an operator.
Emits a [Transfer](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#transfer) event.*


```solidity
function transferFrom(address from, address to, uint256 id, uint256 amount) public payable virtual returns (bool);
```

### approve

*Sets `amount` as the allowance of `spender` for the caller for token `id`.
Emits a [Approval](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#approval) event.*


```solidity
function approve(address spender, uint256 id, uint256 amount) public payable virtual returns (bool);
```

### setOperator

*Sets whether `operator` is approved to manage the tokens of the caller.
Emits [OperatorSet](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#operatorset) event.*


```solidity
function setOperator(address operator, bool approved) public payable virtual returns (bool);
```

### supportsInterface

*Returns true if this contract implements the interface defined by `interfaceId`.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool result);
```

### _mint

*Mints `amount` of token `id` to `to`.
Emits a [Transfer](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#transfer) event.*


```solidity
function _mint(address to, uint256 id, uint256 amount) internal virtual;
```

### _burn

*Burns `amount` token `id` from `from`.
Emits a [Transfer](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#transfer) event.*


```solidity
function _burn(address from, uint256 id, uint256 amount) internal virtual;
```

### _transfer

*Transfers `amount` of token `id` from `from` to `to`.
Note: Does not update the allowance if it is the maximum uint256 value.
Requirements:
- `from` must at least have `amount` of token `id`.
- If `by` is not the zero address,
it must have at least `amount` of allowance to transfer the
tokens of `from` or approved as an operator.
Emits a [Transfer](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#transfer) event.*


```solidity
function _transfer(address by, address from, address to, uint256 id, uint256 amount) internal virtual;
```

### _approve

*Sets `amount` as the allowance of `spender` for `owner` for token `id`.
Emits a [Approval](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#approval) event.*


```solidity
function _approve(address owner, address spender, uint256 id, uint256 amount) internal virtual;
```

### _setOperator

*Sets whether `operator` is approved to manage the tokens of `owner`.
Emits [OperatorSet](/lib/solady/src/tokens/ERC6909.sol/abstract.ERC6909.md#operatorset) event.*


```solidity
function _setOperator(address owner, address operator, bool approved) internal virtual;
```

### _beforeTokenTransfer

*Hook that is called before any transfer of tokens.
This includes minting and burning.*


```solidity
function _beforeTokenTransfer(address from, address to, uint256 id, uint256 amount) internal virtual;
```

### _afterTokenTransfer

*Hook that is called after any transfer of tokens.
This includes minting and burning.*


```solidity
function _afterTokenTransfer(address from, address to, uint256 id, uint256 amount) internal virtual;
```

## Events
### Transfer
*Emitted when `by` transfers `amount` of token `id` from `from` to `to`.*


```solidity
event Transfer(address by, address indexed from, address indexed to, uint256 indexed id, uint256 amount);
```

### OperatorSet
*Emitted when `owner` enables or disables `operator` to manage all of their tokens.*


```solidity
event OperatorSet(address indexed owner, address indexed operator, bool approved);
```

### Approval
*Emitted when `owner` approves `spender` to use `amount` of `id` token.*


```solidity
event Approval(address indexed owner, address indexed spender, uint256 indexed id, uint256 amount);
```

## Errors
### InsufficientBalance
*Insufficient balance.*


```solidity
error InsufficientBalance();
```

### InsufficientPermission
*Insufficient permission to perform the action.*


```solidity
error InsufficientPermission();
```

### BalanceOverflow
*The balance has overflowed.*


```solidity
error BalanceOverflow();
```

