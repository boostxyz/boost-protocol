# Pausable
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md)

*Contract module which allows children to implement an emergency stop
mechanism that can be triggered by an authorized account.
This module is used through inheritance. It will make available the
modifiers `whenNotPaused` and `whenPaused`, which can be applied to
the functions of your contract. Note that they will not be pausable by
simply including this module, only once the modifiers are put in place.*


## State Variables
### _paused

```solidity
bool private _paused;
```


## Functions
### constructor

*Initializes the contract in unpaused state.*


```solidity
constructor();
```

### whenNotPaused

*Modifier to make a function callable only when the contract is not paused.
Requirements:
- The contract must not be paused.*


```solidity
modifier whenNotPaused();
```

### whenPaused

*Modifier to make a function callable only when the contract is paused.
Requirements:
- The contract must be paused.*


```solidity
modifier whenPaused();
```

### paused

*Returns true if the contract is paused, and false otherwise.*


```solidity
function paused() public view virtual returns (bool);
```

### _requireNotPaused

*Throws if the contract is paused.*


```solidity
function _requireNotPaused() internal view virtual;
```

### _requirePaused

*Throws if the contract is not paused.*


```solidity
function _requirePaused() internal view virtual;
```

### _pause

*Triggers stopped state.
Requirements:
- The contract must not be paused.*


```solidity
function _pause() internal virtual whenNotPaused;
```

### _unpause

*Returns to normal state.
Requirements:
- The contract must be paused.*


```solidity
function _unpause() internal virtual whenPaused;
```

## Events
### Paused
*Emitted when the pause is triggered by `account`.*


```solidity
event Paused(address account);
```

### Unpaused
*Emitted when the pause is lifted by `account`.*


```solidity
event Unpaused(address account);
```

## Errors
### EnforcedPause
*The operation failed because the contract is paused.*


```solidity
error EnforcedPause();
```

### ExpectedPause
*The operation failed because the contract is not paused.*


```solidity
error ExpectedPause();
```

