# IAccessManaged

## Functions
### authority

*Returns the current authority.*


```solidity
function authority() external view returns (address);
```

### setAuthority

*Transfers control to a new authority. The caller must be the current authority.*


```solidity
function setAuthority(address) external;
```

### isConsumingScheduledOp

*Returns true only in the context of a delayed restricted call, at the moment that the scheduled operation is
being consumed. Prevents denial of service for delayed restricted calls in the case that the contract performs
attacker controlled calls.*


```solidity
function isConsumingScheduledOp() external view returns (bytes4);
```

## Events
### AuthorityUpdated
*Authority that manages this contract was updated.*


```solidity
event AuthorityUpdated(address authority);
```

## Errors
### AccessManagedUnauthorized

```solidity
error AccessManagedUnauthorized(address caller);
```

### AccessManagedRequiredDelay

```solidity
error AccessManagedRequiredDelay(address caller, uint32 delay);
```

### AccessManagedInvalidAuthority

```solidity
error AccessManagedInvalidAuthority(address authority);
```

