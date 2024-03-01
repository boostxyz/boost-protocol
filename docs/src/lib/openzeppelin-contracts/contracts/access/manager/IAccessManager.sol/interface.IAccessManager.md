# IAccessManager

## Functions
### canCall

*Check if an address (`caller`) is authorised to call a given function on a given contract directly (with
no restriction). Additionally, it returns the delay needed to perform the call indirectly through the [schedule](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#schedule)
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
function canCall(address caller, address target, bytes4 selector) external view returns (bool allowed, uint32 delay);
```

### expiration

*Expiration delay for scheduled proposals. Defaults to 1 week.
IMPORTANT: Avoid overriding the expiration with 0. Otherwise every contract proposal will be expired immediately,
disabling any scheduling usage.*


```solidity
function expiration() external view returns (uint32);
```

### minSetback

*Minimum setback for all delay updates, with the exception of execution delays. It
can be increased without setback (and reset via [revokeRole](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#revokerole) in the case event of an
accidental increase). Defaults to 5 days.*


```solidity
function minSetback() external view returns (uint32);
```

### isTargetClosed

*Get whether the contract is closed disabling any access. Otherwise role permissions are applied.*


```solidity
function isTargetClosed(address target) external view returns (bool);
```

### getTargetFunctionRole

*Get the role required to call a function.*


```solidity
function getTargetFunctionRole(address target, bytes4 selector) external view returns (uint64);
```

### getTargetAdminDelay

*Get the admin delay for a target contract. Changes to contract configuration are subject to this delay.*


```solidity
function getTargetAdminDelay(address target) external view returns (uint32);
```

### getRoleAdmin

*Get the id of the role that acts as an admin for the given role.
The admin permission is required to grant the role, revoke the role and update the execution delay to execute
an operation that is restricted to this role.*


```solidity
function getRoleAdmin(uint64 roleId) external view returns (uint64);
```

### getRoleGuardian

*Get the role that acts as a guardian for a given role.
The guardian permission allows canceling operations that have been scheduled under the role.*


```solidity
function getRoleGuardian(uint64 roleId) external view returns (uint64);
```

### getRoleGrantDelay

*Get the role current grant delay.
Its value may change at any point without an event emitted following a call to [setGrantDelay](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#setgrantdelay).
Changes to this value, including effect timepoint are notified in advance by the {RoleGrantDelayChanged} event.*


```solidity
function getRoleGrantDelay(uint64 roleId) external view returns (uint32);
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
    external
    view
    returns (uint48 since, uint32 currentDelay, uint32 pendingDelay, uint48 effect);
```

### hasRole

*Check if a given account currently has the permission level corresponding to a given role. Note that this
permission might be associated with an execution delay. [getAccess](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#getaccess) can provide more details.*


```solidity
function hasRole(uint64 roleId, address account) external view returns (bool isMember, uint32 executionDelay);
```

### labelRole

*Give a label to a role, for improved role discoverability by UIs.
Requirements:
- the caller must be a global admin
Emits a [RoleLabel](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#rolelabel) event.*


```solidity
function labelRole(uint64 roleId, string calldata label) external;
```

### grantRole

*Add `account` to `roleId`, or change its execution delay.
This gives the account the authorization to call any function that is restricted to this role. An optional
execution delay (in seconds) can be set. If that delay is non 0, the user is required to schedule any operation
that is restricted to members of this role. The user will only be able to execute the operation after the delay has
passed, before it has expired. During this period, admin and guardians can cancel the operation (see [cancel](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#cancel)).
If the account has already been granted this role, the execution delay will be updated. This update is not
immediate and follows the delay rules. For example, if a user currently has a delay of 3 hours, and this is
called to reduce that delay to 1 hour, the new delay will take some time to take effect, enforcing that any
operation executed in the 3 hours that follows this update was indeed scheduled before this update.
Requirements:
- the caller must be an admin for the role (see {getRoleAdmin})
- granted role must not be the `PUBLIC_ROLE`
Emits a {RoleGranted} event.*


```solidity
function grantRole(uint64 roleId, address account, uint32 executionDelay) external;
```

### revokeRole

*Remove an account from a role, with immediate effect. If the account does not have the role, this call has
no effect.
Requirements:
- the caller must be an admin for the role (see [getRoleAdmin](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#getroleadmin))
- revoked role must not be the `PUBLIC_ROLE`
Emits a {RoleRevoked} event if the account had the role.*


```solidity
function revokeRole(uint64 roleId, address account) external;
```

### renounceRole

*Renounce role permissions for the calling account with immediate effect. If the sender is not in
the role this call has no effect.
Requirements:
- the caller must be `callerConfirmation`.
Emits a [RoleRevoked](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#rolerevoked) event if the account had the role.*


```solidity
function renounceRole(uint64 roleId, address callerConfirmation) external;
```

### setRoleAdmin

*Change admin role for a given role.
Requirements:
- the caller must be a global admin
Emits a [RoleAdminChanged](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#roleadminchanged) event*


```solidity
function setRoleAdmin(uint64 roleId, uint64 admin) external;
```

### setRoleGuardian

*Change guardian role for a given role.
Requirements:
- the caller must be a global admin
Emits a [RoleGuardianChanged](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#roleguardianchanged) event*


```solidity
function setRoleGuardian(uint64 roleId, uint64 guardian) external;
```

### setGrantDelay

*Update the delay for granting a `roleId`.
Requirements:
- the caller must be a global admin
Emits a [RoleGrantDelayChanged](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#rolegrantdelaychanged) event.*


```solidity
function setGrantDelay(uint64 roleId, uint32 newDelay) external;
```

### setTargetFunctionRole

*Set the role required to call functions identified by the `selectors` in the `target` contract.
Requirements:
- the caller must be a global admin
Emits a [TargetFunctionRoleUpdated](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#targetfunctionroleupdated) event per selector.*


```solidity
function setTargetFunctionRole(address target, bytes4[] calldata selectors, uint64 roleId) external;
```

### setTargetAdminDelay

*Set the delay for changing the configuration of a given target contract.
Requirements:
- the caller must be a global admin
Emits a [TargetAdminDelayUpdated](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#targetadmindelayupdated) event.*


```solidity
function setTargetAdminDelay(address target, uint32 newDelay) external;
```

### setTargetClosed

*Set the closed flag for a contract.
Requirements:
- the caller must be a global admin
Emits a [TargetClosed](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#targetclosed) event.*


```solidity
function setTargetClosed(address target, bool closed) external;
```

### getSchedule

*Return the timepoint at which a scheduled operation will be ready for execution. This returns 0 if the
operation is not yet scheduled, has expired, was executed, or was canceled.*


```solidity
function getSchedule(bytes32 id) external view returns (uint48);
```

### getNonce

*Return the nonce for the latest scheduled operation with a given id. Returns 0 if the operation has never
been scheduled.*


```solidity
function getNonce(bytes32 id) external view returns (uint32);
```

### schedule

*Schedule a delayed operation for future execution, and return the operation identifier. It is possible to
choose the timestamp at which the operation becomes executable as long as it satisfies the execution delays
required for the caller. The special value zero will automatically set the earliest possible time.
Returns the `operationId` that was scheduled. Since this value is a hash of the parameters, it can reoccur when
the same parameters are used; if this is relevant, the returned `nonce` can be used to uniquely identify this
scheduled operation from other occurrences of the same `operationId` in invocations of [execute](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#execute) and {cancel}.
Emits a {OperationScheduled} event.
NOTE: It is not possible to concurrently schedule more than one operation with the same `target` and `data`. If
this is necessary, a random byte can be appended to `data` to act as a salt that will be ignored by the target
contract if it is using standard Solidity ABI encoding.*


```solidity
function schedule(address target, bytes calldata data, uint48 when)
    external
    returns (bytes32 operationId, uint32 nonce);
```

### execute

*Execute a function that is delay restricted, provided it was properly scheduled beforehand, or the
execution delay is 0.
Returns the nonce that identifies the previously scheduled operation that is executed, or 0 if the
operation wasn't previously scheduled (if the caller doesn't have an execution delay).
Emits an [OperationExecuted](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#operationexecuted) event only if the call was scheduled and delayed.*


```solidity
function execute(address target, bytes calldata data) external payable returns (uint32);
```

### cancel

*Cancel a scheduled (delayed) operation. Returns the nonce that identifies the previously scheduled
operation that is cancelled.
Requirements:
- the caller must be the proposer, a guardian of the targeted function, or a global admin
Emits a [OperationCanceled](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#operationcanceled) event.*


```solidity
function cancel(address caller, address target, bytes calldata data) external returns (uint32);
```

### consumeScheduledOp

*Consume a scheduled operation targeting the caller. If such an operation exists, mark it as consumed
(emit an [OperationExecuted](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManager.sol/interface.IAccessManager.md#operationexecuted) event and clean the state). Otherwise, throw an error.
This is useful for contract that want to enforce that calls targeting them were scheduled on the manager,
with all the verifications that it implies.
Emit a {OperationExecuted} event.*


```solidity
function consumeScheduledOp(address caller, bytes calldata data) external;
```

### hashOperation

*Hashing function for delayed operations.*


```solidity
function hashOperation(address caller, address target, bytes calldata data) external view returns (bytes32);
```

### updateAuthority

*Changes the authority of a target managed by this manager instance.
Requirements:
- the caller must be a global admin*


```solidity
function updateAuthority(address target, address newAuthority) external;
```

## Events
### OperationScheduled
*A delayed operation was scheduled.*


```solidity
event OperationScheduled(
    bytes32 indexed operationId, uint32 indexed nonce, uint48 schedule, address caller, address target, bytes data
);
```

### OperationExecuted
*A scheduled operation was executed.*


```solidity
event OperationExecuted(bytes32 indexed operationId, uint32 indexed nonce);
```

### OperationCanceled
*A scheduled operation was canceled.*


```solidity
event OperationCanceled(bytes32 indexed operationId, uint32 indexed nonce);
```

### RoleLabel
*Informational labelling for a roleId.*


```solidity
event RoleLabel(uint64 indexed roleId, string label);
```

### RoleGranted
*Emitted when `account` is granted `roleId`.
NOTE: The meaning of the `since` argument depends on the `newMember` argument.
If the role is granted to a new member, the `since` argument indicates when the account becomes a member of the role,
otherwise it indicates the execution delay for this account and roleId is updated.*


```solidity
event RoleGranted(uint64 indexed roleId, address indexed account, uint32 delay, uint48 since, bool newMember);
```

### RoleRevoked
*Emitted when `account` membership or `roleId` is revoked. Unlike granting, revoking is instantaneous.*


```solidity
event RoleRevoked(uint64 indexed roleId, address indexed account);
```

### RoleAdminChanged
*Role acting as admin over a given `roleId` is updated.*


```solidity
event RoleAdminChanged(uint64 indexed roleId, uint64 indexed admin);
```

### RoleGuardianChanged
*Role acting as guardian over a given `roleId` is updated.*


```solidity
event RoleGuardianChanged(uint64 indexed roleId, uint64 indexed guardian);
```

### RoleGrantDelayChanged
*Grant delay for a given `roleId` will be updated to `delay` when `since` is reached.*


```solidity
event RoleGrantDelayChanged(uint64 indexed roleId, uint32 delay, uint48 since);
```

### TargetClosed
*Target mode is updated (true = closed, false = open).*


```solidity
event TargetClosed(address indexed target, bool closed);
```

### TargetFunctionRoleUpdated
*Role required to invoke `selector` on `target` is updated to `roleId`.*


```solidity
event TargetFunctionRoleUpdated(address indexed target, bytes4 selector, uint64 indexed roleId);
```

### TargetAdminDelayUpdated
*Admin delay for a given `target` will be updated to `delay` when `since` is reached.*


```solidity
event TargetAdminDelayUpdated(address indexed target, uint32 delay, uint48 since);
```

## Errors
### AccessManagerAlreadyScheduled

```solidity
error AccessManagerAlreadyScheduled(bytes32 operationId);
```

### AccessManagerNotScheduled

```solidity
error AccessManagerNotScheduled(bytes32 operationId);
```

### AccessManagerNotReady

```solidity
error AccessManagerNotReady(bytes32 operationId);
```

### AccessManagerExpired

```solidity
error AccessManagerExpired(bytes32 operationId);
```

### AccessManagerLockedAccount

```solidity
error AccessManagerLockedAccount(address account);
```

### AccessManagerLockedRole

```solidity
error AccessManagerLockedRole(uint64 roleId);
```

### AccessManagerBadConfirmation

```solidity
error AccessManagerBadConfirmation();
```

### AccessManagerUnauthorizedAccount

```solidity
error AccessManagerUnauthorizedAccount(address msgsender, uint64 roleId);
```

### AccessManagerUnauthorizedCall

```solidity
error AccessManagerUnauthorizedCall(address caller, address target, bytes4 selector);
```

### AccessManagerUnauthorizedConsume

```solidity
error AccessManagerUnauthorizedConsume(address target);
```

### AccessManagerUnauthorizedCancel

```solidity
error AccessManagerUnauthorizedCancel(address msgsender, address caller, address target, bytes4 selector);
```

### AccessManagerInvalidInitialAdmin

```solidity
error AccessManagerInvalidInitialAdmin(address initialAdmin);
```

