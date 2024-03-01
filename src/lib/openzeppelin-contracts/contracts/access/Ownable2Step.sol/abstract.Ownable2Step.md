# Ownable2Step
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md)

*Contract module which provides access control mechanism, where
there is an account (an owner) that can be granted exclusive access to
specific functions.
This extension of the {Ownable} contract includes a two-step mechanism to transfer
ownership, where the new owner must call {acceptOwnership} in order to replace the
old one. This can help prevent common mistakes, such as transfers of ownership to
incorrect accounts, or to contracts that are unable to interact with the
permission system.
The initial owner is specified at deployment time in the constructor for `Ownable`. This
can later be changed with {transferOwnership} and {acceptOwnership}.
This module is used through inheritance. It will make available all functions
from parent (Ownable).*


## State Variables
### _pendingOwner

```solidity
address private _pendingOwner;
```


## Functions
### pendingOwner

*Returns the address of the pending owner.*


```solidity
function pendingOwner() public view virtual returns (address);
```

### transferOwnership

*Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
Can only be called by the current owner.*


```solidity
function transferOwnership(address newOwner) public virtual override onlyOwner;
```

### _transferOwnership

*Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
Internal function without access restriction.*


```solidity
function _transferOwnership(address newOwner) internal virtual override;
```

### acceptOwnership

*The new owner accepts the ownership transfer.*


```solidity
function acceptOwnership() public virtual;
```

## Events
### OwnershipTransferStarted

```solidity
event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
```

