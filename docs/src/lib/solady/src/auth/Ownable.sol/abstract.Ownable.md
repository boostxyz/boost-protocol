# Ownable
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/auth/Ownable.sol)

Simple single owner authorization mixin.

*Note:
This implementation does NOT auto-initialize the owner to `msg.sender`.
You MUST call the `_initializeOwner` in the constructor / initializer.
While the ownable portion follows
[EIP-173](https://eips.ethereum.org/EIPS/eip-173) for compatibility,
the nomenclature for the 2-step ownership handover may be unique to this codebase.*


## State Variables
### _OWNERSHIP_TRANSFERRED_EVENT_SIGNATURE
*`keccak256(bytes("OwnershipTransferred(address,address)"))`.*


```solidity
uint256 private constant _OWNERSHIP_TRANSFERRED_EVENT_SIGNATURE =
    0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0;
```


### _OWNERSHIP_HANDOVER_REQUESTED_EVENT_SIGNATURE
*`keccak256(bytes("OwnershipHandoverRequested(address)"))`.*


```solidity
uint256 private constant _OWNERSHIP_HANDOVER_REQUESTED_EVENT_SIGNATURE =
    0xdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d;
```


### _OWNERSHIP_HANDOVER_CANCELED_EVENT_SIGNATURE
*`keccak256(bytes("OwnershipHandoverCanceled(address)"))`.*


```solidity
uint256 private constant _OWNERSHIP_HANDOVER_CANCELED_EVENT_SIGNATURE =
    0xfa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92;
```


### _OWNER_SLOT
*The owner slot is given by:
`bytes32(~uint256(uint32(bytes4(keccak256("_OWNER_SLOT_NOT")))))`.
It is intentionally chosen to be a high value
to avoid collision with lower slots.
The choice of manual storage layout is to enable compatibility
with both regular and upgradeable contracts.*


```solidity
bytes32 internal constant _OWNER_SLOT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffff74873927;
```


### _HANDOVER_SLOT_SEED
The ownership handover slot of `newOwner` is given by:
```
mstore(0x00, or(shl(96, user), _HANDOVER_SLOT_SEED))
let handoverSlot := keccak256(0x00, 0x20)
```
It stores the expiry timestamp of the two-step ownership handover.


```solidity
uint256 private constant _HANDOVER_SLOT_SEED = 0x389a75e1;
```


## Functions
### _guardInitializeOwner

*Override to return true to make `_initializeOwner` prevent double-initialization.*


```solidity
function _guardInitializeOwner() internal pure virtual returns (bool guard);
```

### _initializeOwner

*Initializes the owner directly without authorization guard.
This function must be called upon initialization,
regardless of whether the contract is upgradeable or not.
This is to enable generalization to both regular and upgradeable contracts,
and to save gas in case the initial owner is not the caller.
For performance reasons, this function will not check if there
is an existing owner.*


```solidity
function _initializeOwner(address newOwner) internal virtual;
```

### _setOwner

*Sets the owner directly without authorization guard.*


```solidity
function _setOwner(address newOwner) internal virtual;
```

### _checkOwner

*Throws if the sender is not the owner.*


```solidity
function _checkOwner() internal view virtual;
```

### _ownershipHandoverValidFor

*Returns how long a two-step ownership handover is valid for in seconds.
Override to return a different value if needed.
Made internal to conserve bytecode. Wrap it in a public function if needed.*


```solidity
function _ownershipHandoverValidFor() internal view virtual returns (uint64);
```

### transferOwnership

*Allows the owner to transfer the ownership to `newOwner`.*


```solidity
function transferOwnership(address newOwner) public payable virtual onlyOwner;
```

### renounceOwnership

*Allows the owner to renounce their ownership.*


```solidity
function renounceOwnership() public payable virtual onlyOwner;
```

### requestOwnershipHandover

*Request a two-step ownership handover to the caller.
The request will automatically expire in 48 hours (172800 seconds) by default.*


```solidity
function requestOwnershipHandover() public payable virtual;
```

### cancelOwnershipHandover

*Cancels the two-step ownership handover to the caller, if any.*


```solidity
function cancelOwnershipHandover() public payable virtual;
```

### completeOwnershipHandover

*Allows the owner to complete the two-step ownership handover to `pendingOwner`.
Reverts if there is no existing ownership handover requested by `pendingOwner`.*


```solidity
function completeOwnershipHandover(address pendingOwner) public payable virtual onlyOwner;
```

### owner

*Returns the owner of the contract.*


```solidity
function owner() public view virtual returns (address result);
```

### ownershipHandoverExpiresAt

*Returns the expiry timestamp for the two-step ownership handover to `pendingOwner`.*


```solidity
function ownershipHandoverExpiresAt(address pendingOwner) public view virtual returns (uint256 result);
```

### onlyOwner

*Marks a function as only callable by the owner.*


```solidity
modifier onlyOwner() virtual;
```

## Events
### OwnershipTransferred
*The ownership is transferred from `oldOwner` to `newOwner`.
This event is intentionally kept the same as OpenZeppelin's Ownable to be
compatible with indexers and [EIP-173](https://eips.ethereum.org/EIPS/eip-173),
despite it not being as lightweight as a single argument event.*


```solidity
event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
```

### OwnershipHandoverRequested
*An ownership handover to `pendingOwner` has been requested.*


```solidity
event OwnershipHandoverRequested(address indexed pendingOwner);
```

### OwnershipHandoverCanceled
*The ownership handover to `pendingOwner` has been canceled.*


```solidity
event OwnershipHandoverCanceled(address indexed pendingOwner);
```

## Errors
### Unauthorized
*The caller is not authorized to call the function.*


```solidity
error Unauthorized();
```

### NewOwnerIsZeroAddress
*The `newOwner` cannot be the zero address.*


```solidity
error NewOwnerIsZeroAddress();
```

### NoHandoverRequest
*The `pendingOwner` does not have a valid handover request.*


```solidity
error NoHandoverRequest();
```

### AlreadyInitialized
*Cannot double-initialize.*


```solidity
error AlreadyInitialized();
```

