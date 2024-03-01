# AccessControlDefaultAdminRules
**Inherits:**
[IAccessControlDefaultAdminRules](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlDefaultAdminRules.sol/interface.IAccessControlDefaultAdminRules.md), [IERC5313](/lib/openzeppelin-contracts/contracts/interfaces/IERC5313.sol/interface.IERC5313.md), [AccessControl](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md)

*Extension of {AccessControl} that allows specifying special rules to manage
the `DEFAULT_ADMIN_ROLE` holder, which is a sensitive role with special permissions
over other roles that may potentially have privileged rights in the system.
If a specific role doesn't have an admin role assigned, the holder of the
`DEFAULT_ADMIN_ROLE` will have the ability to grant it and revoke it.
This contract implements the following risk mitigations on top of {AccessControl}:
Only one account holds the `DEFAULT_ADMIN_ROLE` since deployment until it's potentially renounced.
Enforces a 2-step process to transfer the `DEFAULT_ADMIN_ROLE` to another account.
Enforces a configurable delay between the two steps, with the ability to cancel before the transfer is accepted.
The delay can be changed by scheduling, see {changeDefaultAdminDelay}.
It is not possible to use another role to manage the `DEFAULT_ADMIN_ROLE`.
Example usage:
```solidity
contract MyToken is AccessControlDefaultAdminRules {
constructor() AccessControlDefaultAdminRules(
3 days,
msg.sender // Explicit initial `DEFAULT_ADMIN_ROLE` holder
) {}
}
```*


## State Variables
### _pendingDefaultAdmin

```solidity
address private _pendingDefaultAdmin;
```


### _pendingDefaultAdminSchedule

```solidity
uint48 private _pendingDefaultAdminSchedule;
```


### _currentDelay

```solidity
uint48 private _currentDelay;
```


### _currentDefaultAdmin

```solidity
address private _currentDefaultAdmin;
```


### _pendingDelay

```solidity
uint48 private _pendingDelay;
```


### _pendingDelaySchedule

```solidity
uint48 private _pendingDelaySchedule;
```


## Functions
### constructor

*Sets the initial values for [defaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#defaultadmindelay) and {defaultAdmin} address.*


```solidity
constructor(uint48 initialDelay, address initialDefaultAdmin);
```

### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool);
```

### owner

*See [IERC5313-owner](/lib/openzeppelin-contracts/contracts/interfaces/IERC5313.sol/interface.IERC5313.md#owner).*


```solidity
function owner() public view virtual returns (address);
```

### grantRole


Override AccessControl role management

*See [AccessControl-grantRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#grantrole). Reverts for `DEFAULT_ADMIN_ROLE`.*


```solidity
function grantRole(bytes32 role, address account) public virtual override(AccessControl, IAccessControl);
```

### revokeRole

*See [AccessControl-revokeRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#revokerole). Reverts for `DEFAULT_ADMIN_ROLE`.*


```solidity
function revokeRole(bytes32 role, address account) public virtual override(AccessControl, IAccessControl);
```

### renounceRole

*See [AccessControl-renounceRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#renouncerole).
For the `DEFAULT_ADMIN_ROLE`, it only allows renouncing in two steps by first calling
{beginDefaultAdminTransfer} to the `address(0)`, so it's required that the {pendingDefaultAdmin} schedule
has also passed when calling this function.
After its execution, it will not be possible to call `onlyRole(DEFAULT_ADMIN_ROLE)` functions.
NOTE: Renouncing `DEFAULT_ADMIN_ROLE` will leave the contract without a {defaultAdmin},
thereby disabling any functionality that is only available for it, and the possibility of reassigning a
non-administrated role.*


```solidity
function renounceRole(bytes32 role, address account) public virtual override(AccessControl, IAccessControl);
```

### _grantRole

*See [AccessControl-_grantRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#_grantrole).
For `DEFAULT_ADMIN_ROLE`, it only allows granting if there isn't already a {defaultAdmin} or if the
role has been previously renounced.
NOTE: Exposing this function through another mechanism may make the `DEFAULT_ADMIN_ROLE`
assignable again. Make sure to guarantee this is the expected behavior in your implementation.*


```solidity
function _grantRole(bytes32 role, address account) internal virtual override returns (bool);
```

### _revokeRole

*See [AccessControl-_revokeRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#_revokerole).*


```solidity
function _revokeRole(bytes32 role, address account) internal virtual override returns (bool);
```

### _setRoleAdmin

*See [AccessControl-_setRoleAdmin](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#_setroleadmin). Reverts for `DEFAULT_ADMIN_ROLE`.*


```solidity
function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual override;
```

### defaultAdmin


AccessControlDefaultAdminRules accessors

*Returns the address of the current `DEFAULT_ADMIN_ROLE` holder.*


```solidity
function defaultAdmin() public view virtual returns (address);
```

### pendingDefaultAdmin

*Returns a tuple of a `newAdmin` and an accept schedule.
After the `schedule` passes, the `newAdmin` will be able to accept the {defaultAdmin} role
by calling {acceptDefaultAdminTransfer}, completing the role transfer.
A zero value only in `acceptSchedule` indicates no pending admin transfer.
NOTE: A zero address `newAdmin` means that {defaultAdmin} is being renounced.*


```solidity
function pendingDefaultAdmin() public view virtual returns (address newAdmin, uint48 schedule);
```

### defaultAdminDelay

*Returns the delay required to schedule the acceptance of a {defaultAdmin} transfer started.
This delay will be added to the current timestamp when calling {beginDefaultAdminTransfer} to set
the acceptance schedule.
NOTE: If a delay change has been scheduled, it will take effect as soon as the schedule passes, making this
function returns the new delay. See {changeDefaultAdminDelay}.*


```solidity
function defaultAdminDelay() public view virtual returns (uint48);
```

### pendingDefaultAdminDelay

*Returns a tuple of `newDelay` and an effect schedule.
After the `schedule` passes, the `newDelay` will get into effect immediately for every
new {defaultAdmin} transfer started with {beginDefaultAdminTransfer}.
A zero value only in `effectSchedule` indicates no pending delay change.
NOTE: A zero value only for `newDelay` means that the next {defaultAdminDelay}
will be zero after the effect schedule.*


```solidity
function pendingDefaultAdminDelay() public view virtual returns (uint48 newDelay, uint48 schedule);
```

### defaultAdminDelayIncreaseWait

*Maximum time in seconds for an increase to {defaultAdminDelay} (that is scheduled using {changeDefaultAdminDelay})
to take effect. Default to 5 days.
When the {defaultAdminDelay} is scheduled to be increased, it goes into effect after the new delay has passed with
the purpose of giving enough time for reverting any accidental change (i.e. using milliseconds instead of seconds)
that may lock the contract. However, to avoid excessive schedules, the wait is capped by this function and it can
be overrode for a custom {defaultAdminDelay} increase scheduling.
IMPORTANT: Make sure to add a reasonable amount of time while overriding this value, otherwise,
there's a risk of setting a high new delay that goes into effect almost immediately without the
possibility of human intervention in the case of an input error (eg. set milliseconds instead of seconds).*


```solidity
function defaultAdminDelayIncreaseWait() public view virtual returns (uint48);
```

### beginDefaultAdminTransfer


AccessControlDefaultAdminRules public and internal setters for defaultAdmin/pendingDefaultAdmin

*Starts a {defaultAdmin} transfer by setting a {pendingDefaultAdmin} scheduled for acceptance
after the current timestamp plus a {defaultAdminDelay}.
Requirements:
- Only can be called by the current {defaultAdmin}.
Emits a DefaultAdminRoleChangeStarted event.*


```solidity
function beginDefaultAdminTransfer(address newAdmin) public virtual onlyRole(DEFAULT_ADMIN_ROLE);
```

### _beginDefaultAdminTransfer

*See [beginDefaultAdminTransfer](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#begindefaultadmintransfer).
Internal function without access restriction.*


```solidity
function _beginDefaultAdminTransfer(address newAdmin) internal virtual;
```

### cancelDefaultAdminTransfer

*Cancels a {defaultAdmin} transfer previously started with {beginDefaultAdminTransfer}.
A {pendingDefaultAdmin} not yet accepted can also be cancelled with this function.
Requirements:
- Only can be called by the current {defaultAdmin}.
May emit a DefaultAdminTransferCanceled event.*


```solidity
function cancelDefaultAdminTransfer() public virtual onlyRole(DEFAULT_ADMIN_ROLE);
```

### _cancelDefaultAdminTransfer

*See [cancelDefaultAdminTransfer](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#canceldefaultadmintransfer).
Internal function without access restriction.*


```solidity
function _cancelDefaultAdminTransfer() internal virtual;
```

### acceptDefaultAdminTransfer

*Completes a {defaultAdmin} transfer previously started with {beginDefaultAdminTransfer}.
After calling the function:
- `DEFAULT_ADMIN_ROLE` should be granted to the caller.
- `DEFAULT_ADMIN_ROLE` should be revoked from the previous holder.
- {pendingDefaultAdmin} should be reset to zero values.
Requirements:
- Only can be called by the {pendingDefaultAdmin}'s `newAdmin`.
- The {pendingDefaultAdmin}'s `acceptSchedule` should've passed.*


```solidity
function acceptDefaultAdminTransfer() public virtual;
```

### _acceptDefaultAdminTransfer

*See [acceptDefaultAdminTransfer](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#acceptdefaultadmintransfer).
Internal function without access restriction.*


```solidity
function _acceptDefaultAdminTransfer() internal virtual;
```

### changeDefaultAdminDelay


AccessControlDefaultAdminRules public and internal setters for defaultAdminDelay/pendingDefaultAdminDelay

*Initiates a {defaultAdminDelay} update by setting a {pendingDefaultAdminDelay} scheduled for getting
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
function changeDefaultAdminDelay(uint48 newDelay) public virtual onlyRole(DEFAULT_ADMIN_ROLE);
```

### _changeDefaultAdminDelay

*See [changeDefaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#changedefaultadmindelay).
Internal function without access restriction.*


```solidity
function _changeDefaultAdminDelay(uint48 newDelay) internal virtual;
```

### rollbackDefaultAdminDelay

*Cancels a scheduled {defaultAdminDelay} change.
Requirements:
- Only can be called by the current {defaultAdmin}.
May emit a DefaultAdminDelayChangeCanceled event.*


```solidity
function rollbackDefaultAdminDelay() public virtual onlyRole(DEFAULT_ADMIN_ROLE);
```

### _rollbackDefaultAdminDelay

*See [rollbackDefaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#rollbackdefaultadmindelay).
Internal function without access restriction.*


```solidity
function _rollbackDefaultAdminDelay() internal virtual;
```

### _delayChangeWait

*Returns the amount of seconds to wait after the `newDelay` will
become the new [defaultAdminDelay](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#defaultadmindelay).
The value returned guarantees that if the delay is reduced, it will go into effect
after a wait that honors the previously set delay.
See {defaultAdminDelayIncreaseWait}.*


```solidity
function _delayChangeWait(uint48 newDelay) internal view virtual returns (uint48);
```

### _setPendingDefaultAdmin


Private setters

*Setter of the tuple for pending admin and its schedule.
May emit a DefaultAdminTransferCanceled event.*


```solidity
function _setPendingDefaultAdmin(address newAdmin, uint48 newSchedule) private;
```

### _setPendingDelay

*Setter of the tuple for pending delay and its schedule.
May emit a DefaultAdminDelayChangeCanceled event.*


```solidity
function _setPendingDelay(uint48 newDelay, uint48 newSchedule) private;
```

### _isScheduleSet


Private helpers

*Defines if an `schedule` is considered set. For consistency purposes.*


```solidity
function _isScheduleSet(uint48 schedule) private pure returns (bool);
```

### _hasSchedulePassed

*Defines if an `schedule` is considered passed. For consistency purposes.*


```solidity
function _hasSchedulePassed(uint48 schedule) private view returns (bool);
```

