# AccessManager
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [Multicall](/lib/openzeppelin-contracts/contracts/utils/Multicall.sol/abstract.Multicall.md), [IAccessManager](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md)

*AccessManager is a central contract to store the permissions of a system.
A smart contract under the control of an AccessManager instance is known as a target, and will inherit from the
{AccessManaged} contract, be connected to this contract as its manager and implement the {AccessManaged-restricted}
modifier on a set of functions selected to be permissioned. Note that any function without this setup won't be
effectively restricted.
The restriction rules for such functions are defined in terms of "roles" identified by an `uint64` and scoped
by target (`address`) and function selectors (`bytes4`). These roles are stored in this contract and can be
configured by admins (`ADMIN_ROLE` members) after a delay (see {getTargetAdminDelay}).
For each target contract, admins can configure the following without any delay:
The target's {AccessManaged-authority} via {updateAuthority}.
Close or open a target via {setTargetClosed} keeping the permissions intact.
The roles that are allowed (or disallowed) to call a given function (identified by its selector) through {setTargetFunctionRole}.
By default every address is member of the `PUBLIC_ROLE` and every target function is restricted to the `ADMIN_ROLE` until configured otherwise.
Additionally, each role has the following configuration options restricted to this manager's admins:
A role's admin role via {setRoleAdmin} who can grant or revoke roles.
A role's guardian role via {setRoleGuardian} who's allowed to cancel operations.
A delay in which a role takes effect after being granted through {setGrantDelay}.
A delay of any target's admin action via {setTargetAdminDelay}.
A role label for discoverability purposes with {labelRole}.
Any account can be added and removed into any number of these roles by using the {grantRole} and {revokeRole} functions
restricted to each role's admin (see {getRoleAdmin}).
Since all the permissions of the managed system can be modified by the admins of this instance, it is expected that
they will be highly secured (e.g., a multisig or a well-configured DAO).
NOTE: This contract implements a form of the {IAuthority} interface, but {canCall} has additional return data so it
doesn't inherit `IAuthority`. It is however compatible with the `IAuthority` interface since the first 32 bytes of
the return data are a boolean as expected by that interface.
NOTE: Systems that implement other access control mechanisms (for example using {Ownable}) can be paired with an
{AccessManager} by transferring permissions (ownership in the case of {Ownable}) directly to the {AccessManager}.
Users will be able to interact with these contracts through the {execute} function, following the access rules
registered in the {AccessManager}. Keep in mind that in that context, the msg.sender seen by restricted functions
will be {AccessManager} itself.
WARNING: When granting permissions over an {Ownable} or {AccessControl} contract to an {AccessManager}, be very
mindful of the danger associated with functions such as {{Ownable-renounceOwnership}} or
{{AccessControl-renounceRole}}.*


## State Variables
### ADMIN_ROLE

```solidity
uint64 public constant ADMIN_ROLE = type(uint64).min;
```


### PUBLIC_ROLE

```solidity
uint64 public constant PUBLIC_ROLE = type(uint64).max;
```


### _targets

```solidity
mapping(address target => TargetConfig mode) private _targets;
```


### _roles

```solidity
mapping(uint64 roleId => Role) private _roles;
```


### _schedules

```solidity
mapping(bytes32 operationId => Schedule) private _schedules;
```


### _executionId

```solidity
bytes32 private _executionId;
```


## Functions
### onlyAuthorized

*Check that the caller is authorized to perform the operation, following the restrictions encoded in
[_getAdminRestrictions](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#_getadminrestrictions).*


```solidity
modifier onlyAuthorized();
```

### constructor


```solidity
constructor(address initialAdmin);
```

### canCall

*Check if an address (`caller`) is authorised to call a given function on a given contract directly (with
no restriction). Additionally, it returns the delay needed to perform the call indirectly through the {schedule}
& {execute} workflow.
This function is usually called by the targeted contract to control immediate execution of restricted functions.
Therefore we only return true if the call can be performed without any delay. If the call is subject to a
previously set delay (not zero), then the function should return false and the caller should schedule the operation
for future execution.
If `immediate` is true, the delay can be disregarded and the operation can be immediately executed, otherwise
the operation can be executed if and only if delay is greater than 0.
NOTE: The IAuthority interface does not include the `uint32` delay. This is an extension of that interface that
is backward compatible. Some contracts may thus ignore the second return argument. In that case they will fail
to identify the indirect workflow, and will consider calls that require a delay to be forbidden.
NOTE: This function does not report the permissions of this manager itself. These are defined by the
{_canCallSelf} function instead.*


```solidity
function canCall(address caller, address target, bytes4 selector)
    public
    view
    virtual
    returns (bool immediate, uint32 delay);
```

### expiration

*Expiration delay for scheduled proposals. Defaults to 1 week.
IMPORTANT: Avoid overriding the expiration with 0. Otherwise every contract proposal will be expired immediately,
disabling any scheduling usage.*


```solidity
function expiration() public view virtual returns (uint32);
```

### minSetback

*Minimum setback for all delay updates, with the exception of execution delays. It
can be increased without setback (and reset via {revokeRole} in the case event of an
accidental increase). Defaults to 5 days.*


```solidity
function minSetback() public view virtual returns (uint32);
```

### isTargetClosed

*Get whether the contract is closed disabling any access. Otherwise role permissions are applied.*


```solidity
function isTargetClosed(address target) public view virtual returns (bool);
```

### getTargetFunctionRole

*Get the role required to call a function.*


```solidity
function getTargetFunctionRole(address target, bytes4 selector) public view virtual returns (uint64);
```

### getTargetAdminDelay

*Get the admin delay for a target contract. Changes to contract configuration are subject to this delay.*


```solidity
function getTargetAdminDelay(address target) public view virtual returns (uint32);
```

### getRoleAdmin

*Get the id of the role that acts as an admin for the given role.
The admin permission is required to grant the role, revoke the role and update the execution delay to execute
an operation that is restricted to this role.*


```solidity
function getRoleAdmin(uint64 roleId) public view virtual returns (uint64);
```

### getRoleGuardian

*Get the role that acts as a guardian for a given role.
The guardian permission allows canceling operations that have been scheduled under the role.*


```solidity
function getRoleGuardian(uint64 roleId) public view virtual returns (uint64);
```

### getRoleGrantDelay

*Get the role current grant delay.
Its value may change at any point without an event emitted following a call to {setGrantDelay}.
Changes to this value, including effect timepoint are notified in advance by the {RoleGrantDelayChanged} event.*


```solidity
function getRoleGrantDelay(uint64 roleId) public view virtual returns (uint32);
```

### getAccess

*Get the access details for a given account for a given role. These details include the timepoint at which
membership becomes active, and the delay applied to all operation by this user that requires this permission
level.
Returns:
[0] Timestamp at which the account membership becomes valid. 0 means role is not granted.
[1] Current execution delay for the account.
[2] Pending execution delay for the account.
[3] Timestamp at which the pending execution delay will become active. 0 means no delay update is scheduled.*


```solidity
function getAccess(uint64 roleId, address account)
    public
    view
    virtual
    returns (uint48 since, uint32 currentDelay, uint32 pendingDelay, uint48 effect);
```

### hasRole

*Check if a given account currently has the permission level corresponding to a given role. Note that this
permission might be associated with an execution delay. {getAccess} can provide more details.*


```solidity
function hasRole(uint64 roleId, address account) public view virtual returns (bool isMember, uint32 executionDelay);
```

### labelRole

*Give a label to a role, for improved role discoverability by UIs.
Requirements:
- the caller must be a global admin
Emits a {RoleLabel} event.*


```solidity
function labelRole(uint64 roleId, string calldata label) public virtual onlyAuthorized;
```

### grantRole

*Add `account` to `roleId`, or change its execution delay.
This gives the account the authorization to call any function that is restricted to this role. An optional
execution delay (in seconds) can be set. If that delay is non 0, the user is required to schedule any operation
that is restricted to members of this role. The user will only be able to execute the operation after the delay has
passed, before it has expired. During this period, admin and guardians can cancel the operation (see {cancel}).
If the account has already been granted this role, the execution delay will be updated. This update is not
immediate and follows the delay rules. For example, if a user currently has a delay of 3 hours, and this is
called to reduce that delay to 1 hour, the new delay will take some time to take effect, enforcing that any
operation executed in the 3 hours that follows this update was indeed scheduled before this update.
Requirements:
- the caller must be an admin for the role (see {getRoleAdmin})
- granted role must not be the `PUBLIC_ROLE`
Emits a {RoleGranted} event.*


```solidity
function grantRole(uint64 roleId, address account, uint32 executionDelay) public virtual onlyAuthorized;
```

### revokeRole

*Remove an account from a role, with immediate effect. If the account does not have the role, this call has
no effect.
Requirements:
- the caller must be an admin for the role (see {getRoleAdmin})
- revoked role must not be the `PUBLIC_ROLE`
Emits a {RoleRevoked} event if the account had the role.*


```solidity
function revokeRole(uint64 roleId, address account) public virtual onlyAuthorized;
```

### renounceRole

*Renounce role permissions for the calling account with immediate effect. If the sender is not in
the role this call has no effect.
Requirements:
- the caller must be `callerConfirmation`.
Emits a {RoleRevoked} event if the account had the role.*


```solidity
function renounceRole(uint64 roleId, address callerConfirmation) public virtual;
```

### setRoleAdmin

*Change admin role for a given role.
Requirements:
- the caller must be a global admin
Emits a {RoleAdminChanged} event*


```solidity
function setRoleAdmin(uint64 roleId, uint64 admin) public virtual onlyAuthorized;
```

### setRoleGuardian

*Change guardian role for a given role.
Requirements:
- the caller must be a global admin
Emits a {RoleGuardianChanged} event*


```solidity
function setRoleGuardian(uint64 roleId, uint64 guardian) public virtual onlyAuthorized;
```

### setGrantDelay

*Update the delay for granting a `roleId`.
Requirements:
- the caller must be a global admin
Emits a {RoleGrantDelayChanged} event.*


```solidity
function setGrantDelay(uint64 roleId, uint32 newDelay) public virtual onlyAuthorized;
```

### _grantRole

*Internal version of [grantRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#grantrole) without access control. Returns true if the role was newly granted.
Emits a {RoleGranted} event.*


```solidity
function _grantRole(uint64 roleId, address account, uint32 grantDelay, uint32 executionDelay)
    internal
    virtual
    returns (bool);
```

### _revokeRole

*Internal version of [revokeRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#revokerole) without access control. This logic is also used by {renounceRole}.
Returns true if the role was previously granted.
Emits a {RoleRevoked} event if the account had the role.*


```solidity
function _revokeRole(uint64 roleId, address account) internal virtual returns (bool);
```

### _setRoleAdmin

*Internal version of [setRoleAdmin](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#setroleadmin) without access control.
Emits a {RoleAdminChanged} event.
NOTE: Setting the admin role as the `PUBLIC_ROLE` is allowed, but it will effectively allow
anyone to set grant or revoke such role.*


```solidity
function _setRoleAdmin(uint64 roleId, uint64 admin) internal virtual;
```

### _setRoleGuardian

*Internal version of [setRoleGuardian](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#setroleguardian) without access control.
Emits a {RoleGuardianChanged} event.
NOTE: Setting the guardian role as the `PUBLIC_ROLE` is allowed, but it will effectively allow
anyone to cancel any scheduled operation for such role.*


```solidity
function _setRoleGuardian(uint64 roleId, uint64 guardian) internal virtual;
```

### _setGrantDelay

*Internal version of [setGrantDelay](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#setgrantdelay) without access control.
Emits a {RoleGrantDelayChanged} event.*


```solidity
function _setGrantDelay(uint64 roleId, uint32 newDelay) internal virtual;
```

### setTargetFunctionRole

*Set the role required to call functions identified by the `selectors` in the `target` contract.
Requirements:
- the caller must be a global admin
Emits a {TargetFunctionRoleUpdated} event per selector.*


```solidity
function setTargetFunctionRole(address target, bytes4[] calldata selectors, uint64 roleId)
    public
    virtual
    onlyAuthorized;
```

### _setTargetFunctionRole

*Internal version of [setTargetFunctionRole](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#settargetfunctionrole) without access control.
Emits a {TargetFunctionRoleUpdated} event.*


```solidity
function _setTargetFunctionRole(address target, bytes4 selector, uint64 roleId) internal virtual;
```

### setTargetAdminDelay

*Set the delay for changing the configuration of a given target contract.
Requirements:
- the caller must be a global admin
Emits a {TargetAdminDelayUpdated} event.*


```solidity
function setTargetAdminDelay(address target, uint32 newDelay) public virtual onlyAuthorized;
```

### _setTargetAdminDelay

*Internal version of [setTargetAdminDelay](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#settargetadmindelay) without access control.
Emits a {TargetAdminDelayUpdated} event.*


```solidity
function _setTargetAdminDelay(address target, uint32 newDelay) internal virtual;
```

### setTargetClosed

*Set the closed flag for a contract.
Requirements:
- the caller must be a global admin
Emits a {TargetClosed} event.*


```solidity
function setTargetClosed(address target, bool closed) public virtual onlyAuthorized;
```

### _setTargetClosed

*Set the closed flag for a contract. This is an internal setter with no access restrictions.
Emits a {TargetClosed} event.*


```solidity
function _setTargetClosed(address target, bool closed) internal virtual;
```

### getSchedule

*Return the timepoint at which a scheduled operation will be ready for execution. This returns 0 if the
operation is not yet scheduled, has expired, was executed, or was canceled.*


```solidity
function getSchedule(bytes32 id) public view virtual returns (uint48);
```

### getNonce

*Return the nonce for the latest scheduled operation with a given id. Returns 0 if the operation has never
been scheduled.*


```solidity
function getNonce(bytes32 id) public view virtual returns (uint32);
```

### schedule

*Schedule a delayed operation for future execution, and return the operation identifier. It is possible to
choose the timestamp at which the operation becomes executable as long as it satisfies the execution delays
required for the caller. The special value zero will automatically set the earliest possible time.
Returns the `operationId` that was scheduled. Since this value is a hash of the parameters, it can reoccur when
the same parameters are used; if this is relevant, the returned `nonce` can be used to uniquely identify this
scheduled operation from other occurrences of the same `operationId` in invocations of {execute} and {cancel}.
Emits a {OperationScheduled} event.
NOTE: It is not possible to concurrently schedule more than one operation with the same `target` and `data`. If
this is necessary, a random byte can be appended to `data` to act as a salt that will be ignored by the target
contract if it is using standard Solidity ABI encoding.*


```solidity
function schedule(address target, bytes calldata data, uint48 when)
    public
    virtual
    returns (bytes32 operationId, uint32 nonce);
```

### _checkNotScheduled

*Reverts if the operation is currently scheduled and has not expired.
(Note: This function was introduced due to stack too deep errors in schedule.)*


```solidity
function _checkNotScheduled(bytes32 operationId) private view;
```

### execute

*Execute a function that is delay restricted, provided it was properly scheduled beforehand, or the
execution delay is 0.
Returns the nonce that identifies the previously scheduled operation that is executed, or 0 if the
operation wasn't previously scheduled (if the caller doesn't have an execution delay).
Emits an {OperationExecuted} event only if the call was scheduled and delayed.*


```solidity
function execute(address target, bytes calldata data) public payable virtual returns (uint32);
```

### cancel

*Cancel a scheduled (delayed) operation. Returns the nonce that identifies the previously scheduled
operation that is cancelled.
Requirements:
- the caller must be the proposer, a guardian of the targeted function, or a global admin
Emits a {OperationCanceled} event.*


```solidity
function cancel(address caller, address target, bytes calldata data) public virtual returns (uint32);
```

### consumeScheduledOp

*Consume a scheduled operation targeting the caller. If such an operation exists, mark it as consumed
(emit an {OperationExecuted} event and clean the state). Otherwise, throw an error.
This is useful for contract that want to enforce that calls targeting them were scheduled on the manager,
with all the verifications that it implies.
Emit a {OperationExecuted} event.*


```solidity
function consumeScheduledOp(address caller, bytes calldata data) public virtual;
```

### _consumeScheduledOp

*Internal variant of [consumeScheduledOp](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#consumescheduledop) that operates on bytes32 operationId.
Returns the nonce of the scheduled operation that is consumed.*


```solidity
function _consumeScheduledOp(bytes32 operationId) internal virtual returns (uint32);
```

### hashOperation

*Hashing function for delayed operations.*


```solidity
function hashOperation(address caller, address target, bytes calldata data) public view virtual returns (bytes32);
```

### updateAuthority

*Changes the authority of a target managed by this manager instance.
Requirements:
- the caller must be a global admin*


```solidity
function updateAuthority(address target, address newAuthority) public virtual onlyAuthorized;
```

### _checkAuthorized

*Check if the current call is authorized according to admin logic.*


```solidity
function _checkAuthorized() private;
```

### _getAdminRestrictions

*Get the admin restrictions of a given function call based on the function and arguments involved.
Returns:
- bool restricted: does this data match a restricted operation
- uint64: which role is this operation restricted to
- uint32: minimum delay to enforce for that operation (max between operation's delay and admin's execution delay)*


```solidity
function _getAdminRestrictions(bytes calldata data)
    private
    view
    returns (bool restricted, uint64 roleAdminId, uint32 executionDelay);
```

### _canCallExtended

*An extended version of [canCall](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#cancall) for internal usage that checks {_canCallSelf}
when the target is this contract.
Returns:
- bool immediate: whether the operation can be executed immediately (with no delay)
- uint32 delay: the execution delay*


```solidity
function _canCallExtended(address caller, address target, bytes calldata data)
    private
    view
    returns (bool immediate, uint32 delay);
```

### _canCallSelf

*A version of [canCall](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md#cancall) that checks for admin restrictions in this contract.*


```solidity
function _canCallSelf(address caller, bytes calldata data) private view returns (bool immediate, uint32 delay);
```

### _isExecuting

*Returns true if a call with `target` and `selector` is being executed via {executed}.*


```solidity
function _isExecuting(address target, bytes4 selector) private view returns (bool);
```

### _isExpired

*Returns true if a schedule timepoint is past its expiration deadline.*


```solidity
function _isExpired(uint48 timepoint) private view returns (bool);
```

### _checkSelector

*Extracts the selector from calldata. Panics if data is not at least 4 bytes*


```solidity
function _checkSelector(bytes calldata data) private pure returns (bytes4);
```

### _hashExecutionId

*Hashing function for execute protection*


```solidity
function _hashExecutionId(address target, bytes4 selector) private pure returns (bytes32);
```

## Structs
### TargetConfig

```solidity
struct TargetConfig {
    mapping(bytes4 selector => uint64 roleId) allowedRoles;
    Time.Delay adminDelay;
    bool closed;
}
```

### Access

```solidity
struct Access {
    uint48 since;
    Time.Delay delay;
}
```

### Role

```solidity
struct Role {
    mapping(address user => Access access) members;
    uint64 admin;
    uint64 guardian;
    Time.Delay grantDelay;
}
```

### Schedule

```solidity
struct Schedule {
    uint48 timepoint;
    uint32 nonce;
}
```

