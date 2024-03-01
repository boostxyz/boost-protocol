# ERC20
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/ERC20.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC20.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol)

Simple ERC20 + EIP-2612 implementation.

*Note:
- The ERC20 standard allows minting and transferring to and from the zero address,
minting and transferring zero tokens, as well as self-approvals.
For performance, this implementation WILL NOT revert for such actions.
Please add any checks with overrides if desired.
- The `permit` function uses the ecrecover precompile (0x1).
If you are overriding:
- NEVER violate the ERC20 invariant:
the total sum of all balances must be equal to `totalSupply()`.
- Check that the overridden function is actually used in the function you want to
change the behavior of. Much of the code has been manually inlined for performance.*


## State Variables
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


### _TOTAL_SUPPLY_SLOT
*The storage slot for the total supply.*


```solidity
uint256 private constant _TOTAL_SUPPLY_SLOT = 0x05345cdf77eb68f44c;
```


### _BALANCE_SLOT_SEED
*The balance slot of `owner` is given by:
```
mstore(0x0c, _BALANCE_SLOT_SEED)
mstore(0x00, owner)
let balanceSlot := keccak256(0x0c, 0x20)
```*


```solidity
uint256 private constant _BALANCE_SLOT_SEED = 0x87a211a2;
```


### _ALLOWANCE_SLOT_SEED
*The allowance slot of (`owner`, `spender`) is given by:
```
mstore(0x20, spender)
mstore(0x0c, _ALLOWANCE_SLOT_SEED)
mstore(0x00, owner)
let allowanceSlot := keccak256(0x0c, 0x34)
```*


```solidity
uint256 private constant _ALLOWANCE_SLOT_SEED = 0x7f5e9f20;
```


### _NONCES_SLOT_SEED
*The nonce slot of `owner` is given by:
```
mstore(0x0c, _NONCES_SLOT_SEED)
mstore(0x00, owner)
let nonceSlot := keccak256(0x0c, 0x20)
```*


```solidity
uint256 private constant _NONCES_SLOT_SEED = 0x38377508;
```


### _NONCES_SLOT_SEED_WITH_SIGNATURE_PREFIX
*`(_NONCES_SLOT_SEED << 16) | 0x1901`.*


```solidity
uint256 private constant _NONCES_SLOT_SEED_WITH_SIGNATURE_PREFIX = 0x383775081901;
```


### _DOMAIN_TYPEHASH
*`keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")`.*


```solidity
bytes32 private constant _DOMAIN_TYPEHASH = 0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f;
```


### _VERSION_HASH
*`keccak256("1")`.*


```solidity
bytes32 private constant _VERSION_HASH = 0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6;
```


### _PERMIT_TYPEHASH
*`keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")`.*


```solidity
bytes32 private constant _PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
```


## Functions
### name

*Returns the name of the token.*


```solidity
function name() public view virtual returns (string memory);
```

### symbol

*Returns the symbol of the token.*


```solidity
function symbol() public view virtual returns (string memory);
```

### decimals

*Returns the decimals places of the token.*


```solidity
function decimals() public view virtual returns (uint8);
```

### totalSupply

*Returns the amount of tokens in existence.*


```solidity
function totalSupply() public view virtual returns (uint256 result);
```

### balanceOf

*Returns the amount of tokens owned by `owner`.*


```solidity
function balanceOf(address owner) public view virtual returns (uint256 result);
```

### allowance

*Returns the amount of tokens that `spender` can spend on behalf of `owner`.*


```solidity
function allowance(address owner, address spender) public view virtual returns (uint256 result);
```

### approve

*Sets `amount` as the allowance of `spender` over the caller's tokens.
Emits a [Approval](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#approval) event.*


```solidity
function approve(address spender, uint256 amount) public virtual returns (bool);
```

### transfer

*Transfer `amount` tokens from the caller to `to`.
Requirements:
- `from` must at least have `amount`.
Emits a [Transfer](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#transfer) event.*


```solidity
function transfer(address to, uint256 amount) public virtual returns (bool);
```

### transferFrom

*Transfers `amount` tokens from `from` to `to`.
Note: Does not update the allowance if it is the maximum uint256 value.
Requirements:
- `from` must at least have `amount`.
- The caller must have at least `amount` of allowance to transfer the tokens of `from`.
Emits a [Transfer](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#transfer) event.*


```solidity
function transferFrom(address from, address to, uint256 amount) public virtual returns (bool);
```

### _constantNameHash

*For more performance, override to return the constant value
of `keccak256(bytes(name()))` if `name()` will never change.*


```solidity
function _constantNameHash() internal view virtual returns (bytes32 result);
```

### nonces

*Returns the current nonce for `owner`.
This value is used to compute the signature for EIP-2612 permit.*


```solidity
function nonces(address owner) public view virtual returns (uint256 result);
```

### permit

*Sets `value` as the allowance of `spender` over the tokens of `owner`,
authorized by a signed approval by `owner`.
Emits a [Approval](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#approval) event.*


```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
    public
    virtual;
```

### DOMAIN_SEPARATOR

*Returns the EIP-712 domain separator for the EIP-2612 permit.*


```solidity
function DOMAIN_SEPARATOR() public view virtual returns (bytes32 result);
```

### _mint

*Mints `amount` tokens to `to`, increasing the total supply.
Emits a [Transfer](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#transfer) event.*


```solidity
function _mint(address to, uint256 amount) internal virtual;
```

### _burn

*Burns `amount` tokens from `from`, reducing the total supply.
Emits a [Transfer](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#transfer) event.*


```solidity
function _burn(address from, uint256 amount) internal virtual;
```

### _transfer

*Moves `amount` of tokens from `from` to `to`.*


```solidity
function _transfer(address from, address to, uint256 amount) internal virtual;
```

### _spendAllowance

*Updates the allowance of `owner` for `spender` based on spent `amount`.*


```solidity
function _spendAllowance(address owner, address spender, uint256 amount) internal virtual;
```

### _approve

*Sets `amount` as the allowance of `spender` over the tokens of `owner`.
Emits a [Approval](/lib/solady/src/tokens/ERC20.sol/abstract.ERC20.md#approval) event.*


```solidity
function _approve(address owner, address spender, uint256 amount) internal virtual;
```

### _beforeTokenTransfer

*Hook that is called before any transfer of tokens.
This includes minting and burning.*


```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual;
```

### _afterTokenTransfer

*Hook that is called after any transfer of tokens.
This includes minting and burning.*


```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual;
```

## Events
### Transfer
*Emitted when `amount` tokens is transferred from `from` to `to`.*


```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```

### Approval
*Emitted when `amount` tokens is approved by `owner` to be used by `spender`.*


```solidity
event Approval(address indexed owner, address indexed spender, uint256 amount);
```

## Errors
### TotalSupplyOverflow
*The total supply has overflowed.*


```solidity
error TotalSupplyOverflow();
```

### AllowanceOverflow
*The allowance has overflowed.*


```solidity
error AllowanceOverflow();
```

### AllowanceUnderflow
*The allowance has underflowed.*


```solidity
error AllowanceUnderflow();
```

### InsufficientBalance
*Insufficient balance.*


```solidity
error InsufficientBalance();
```

### InsufficientAllowance
*Insufficient allowance.*


```solidity
error InsufficientAllowance();
```

### InvalidPermit
*The permit is invalid.*


```solidity
error InvalidPermit();
```

### PermitExpired
*The permit has expired.*


```solidity
error PermitExpired();
```

