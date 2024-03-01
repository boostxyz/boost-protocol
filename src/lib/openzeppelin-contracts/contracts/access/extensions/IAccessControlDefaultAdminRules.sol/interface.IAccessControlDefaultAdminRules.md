# IAccessControlDefaultAdminRules
**Inherits:**
[IAccessControl](/lib/openzeppelin-contracts/contracts/access/IAccessControl.sol/interface.IAccessControl.md)

*External interface of AccessControlDefaultAdminRules declared to support ERC-165 detection.*


## Functions
### defaultAdmin

*Returns the address of the current `DEFAULT_ADMIN_ROLE` holder.*


```solidity
function defaultAdmin() external view returns (address);
```

### pendingDefaultAdmin

*Returns a tuple of a `newAdmin` and an accept schedule.
After the `schedule` passes, the `newAdmin` will be able to accept the [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) role
by calling {acceptDefaultAdminTransfer}, completing the role transfer.
A zero value only in `acceptSchedule` indicates no pending admin transfer.
NOTE: A zero address `newAdmin` means that {defaultAdmin} is being renounced.*


```solidity
function pendingDefaultAdmin() external view returns (address newAdmin, uint48 acceptSchedule);
```

### defaultAdminDelay

*Returns the delay required to schedule the acceptance of a [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) transfer started.
This delay will be added to the current timestamp when calling {beginDefaultAdminTransfer} to set
the acceptance schedule.
NOTE: If a delay change has been scheduled, it will take effect as soon as the schedule passes, making this
function returns the new delay. See {changeDefaultAdminDelay}.*


```solidity
function defaultAdminDelay() external view returns (uint48);
```

### pendingDefaultAdminDelay

*Returns a tuple of `newDelay` and an effect schedule.
After the `schedule` passes, the `newDelay` will get into effect immediately for every
new [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) transfer started with {beginDefaultAdminTransfer}.
A zero value only in `effectSchedule` indicates no pending delay change.
NOTE: A zero value only for `newDelay` means that the next {defaultAdminDelay}
will be zero after the effect schedule.*


```solidity
function pendingDefaultAdminDelay() external view returns (uint48 newDelay, uint48 effectSchedule);
```

### beginDefaultAdminTransfer

*Starts a [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) transfer by setting a {pendingDefaultAdmin} scheduled for acceptance
after the current timestamp plus a {defaultAdminDelay}.
Requirements:
- Only can be called by the current {defaultAdmin}.
Emits a DefaultAdminRoleChangeStarted event.*


```solidity
function beginDefaultAdminTransfer(address newAdmin) external;
```

### cancelDefaultAdminTransfer

*Cancels a [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) transfer previously started with {beginDefaultAdminTransfer}.
A {pendingDefaultAdmin} not yet accepted can also be cancelled with this function.
Requirements:
- Only can be called by the current {defaultAdmin}.
May emit a DefaultAdminTransferCanceled event.*


```solidity
function cancelDefaultAdminTransfer() external;
```

### acceptDefaultAdminTransfer

*Completes a [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) transfer previously started with {beginDefaultAdminTransfer}.
After calling the function:
- `DEFAULT_ADMIN_ROLE` should be granted to the caller.
- `DEFAULT_ADMIN_ROLE` should be revoked from the previous holder.
- {pendingDefaultAdmin} should be reset to zero values.
Requirements:
- Only can be called by the {pendingDefaultAdmin}'s `newAdmin`.
- The {pendingDefaultAdmin}'s `acceptSchedule` should've passed.*


```solidity
function acceptDefaultAdminTransfer() external;
```

### changeDefaultAdminDelay

*Initiates a [defaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmindelay) update by setting a {pendingDefaultAdminDelay} scheduled for getting
into effect after the current timestamp plus a {defaultAdminDelay}.
This function guarantees that any call to {beginDefaultAdminTransfer} done between the timestamp this
method is called and the {pendingDefaultAdminDelay} effect schedule will use the current {defaultAdminDelay}
set before calling.
The {pendingDefaultAdminDelay}'s effect schedule is defined in a way that waiting until the schedule and then
calling {beginDefaultAdminTransfer} with the new delay will take at least the same as another {defaultAdmin}
complete transfer (including acceptance).
The schedule is designed for two scenarios:
- When the delay is changed for a larger one the schedule is `block.timestamp + newDelay` capped by
{defaultAdminDelayIncreaseWait}.
- When the delay is changed for a shorter one, the schedule is `block.timestamp + (current delay - new delay)`.
A {pendingDefaultAdminDelay} that never got into effect will be canceled in favor of a new scheduled change.
Requirements:
- Only can be called by the current {defaultAdmin}.
Emits a DefaultAdminDelayChangeScheduled event and may emit a DefaultAdminDelayChangeCanceled event.*


```solidity
function changeDefaultAdminDelay(uint48 newDelay) external;
```

### rollbackDefaultAdminDelay

*Cancels a scheduled [defaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmindelay) change.
Requirements:
- Only can be called by the current {defaultAdmin}.
May emit a DefaultAdminDelayChangeCanceled event.*


```solidity
function rollbackDefaultAdminDelay() external;
```

### defaultAdminDelayIncreaseWait

*Maximum time in seconds for an increase to [defaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmindelay) (that is scheduled using {changeDefaultAdminDelay})
to take effect. Default to 5 days.
When the {defaultAdminDelay} is scheduled to be increased, it goes into effect after the new delay has passed with
the purpose of giving enough time for reverting any accidental change (i.e. using milliseconds instead of seconds)
that may lock the contract. However, to avoid excessive schedules, the wait is capped by this function and it can
be overrode for a custom {defaultAdminDelay} increase scheduling.
IMPORTANT: Make sure to add a reasonable amount of time while overriding this value, otherwise,
there's a risk of setting a high new delay that goes into effect almost immediately without the
possibility of human intervention in the case of an input error (eg. set milliseconds instead of seconds).*


```solidity
function defaultAdminDelayIncreaseWait() external view returns (uint48);
```

## Events
### DefaultAdminTransferScheduled
*Emitted when a [defaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmin) transfer is started, setting `newAdmin` as the next
address to become the {defaultAdmin} by calling {acceptDefaultAdminTransfer} only after `acceptSchedule`
passes.*


```solidity
event DefaultAdminTransferScheduled(address indexed newAdmin, uint48 acceptSchedule);
```

### DefaultAdminTransferCanceled
*Emitted when a [pendingDefaultAdmin](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#pendingdefaultadmin) is reset if it was never accepted, regardless of its schedule.*


```solidity
event DefaultAdminTransferCanceled();
```

### DefaultAdminDelayChangeScheduled
*Emitted when a [defaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#defaultadmindelay) change is started, setting `newDelay` as the next
delay to be applied between default admin transfer after `effectSchedule` has passed.*


```solidity
event DefaultAdminDelayChangeScheduled(uint48 newDelay, uint48 effectSchedule);
```

### DefaultAdminDelayChangeCanceled
*Emitted when a [pendingDefaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md#pendingdefaultadmindelay) is reset if its schedule didn't pass.*


```solidity
event DefaultAdminDelayChangeCanceled();
```

## Errors
### AccessControlInvalidDefaultAdmin
*The new default admin is not a valid default admin.*


```solidity
error AccessControlInvalidDefaultAdmin(address defaultAdmin);
```

### AccessControlEnforcedDefaultAdminRules
*At least one of the following rules was violated:
- The `DEFAULT_ADMIN_ROLE` must only be managed by itself.
- The `DEFAULT_ADMIN_ROLE` must only be held by one account at the time.
- Any `DEFAULT_ADMIN_ROLE` transfer must be in two delayed steps.*


```solidity
error AccessControlEnforcedDefaultAdminRules();
```

### AccessControlEnforcedDefaultAdminDelay
*The delay for transferring the default admin delay is enforced and
the operation must wait until `schedule`.
NOTE: `schedule` can be 0 indicating there's no transfer scheduled.*


```solidity
error AccessControlEnforcedDefaultAdminDelay(uint48 schedule);
```

