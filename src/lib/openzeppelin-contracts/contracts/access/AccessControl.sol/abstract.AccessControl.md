# AccessControl
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [IAccessControl](/lib/openzeppelin-contracts/contracts/access/IAccessControl.sol/interface.IAccessControl.md), [ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md)

*Contract module that allows children to implement role-based access
control mechanisms. This is a lightweight version that doesn't allow enumerating role
members except through off-chain means by accessing the contract event logs. Some
applications may benefit from on-chain enumerability, for those cases see
{AccessControlEnumerable}.
Roles are referred to by their `bytes32` identifier. These should be exposed
in the external API and be unique. The best way to achieve this is by
using `public constant` hash digests:
```solidity
bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
```
Roles can be used to represent a set of permissions. To restrict access to a
function call, use {hasRole}:
```solidity
function foo() public {
require(hasRole(MY_ROLE, msg.sender));
...
}
```
Roles can be granted and revoked dynamically via the {grantRole} and
{revokeRole} functions. Each role has an associated admin role, and only
accounts that have a role's admin role can call {grantRole} and {revokeRole}.
By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
that only accounts with this role will be able to grant or revoke other
roles. More complex role relationships can be created by using
{_setRoleAdmin}.
WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
grant and revoke this role. Extra precautions should be taken to secure
accounts that have been granted it. We recommend using {AccessControlDefaultAdminRules}
to enforce additional security measures for this role.*


## State Variables
### _roles

```solidity
mapping(bytes32 role => RoleData) private _roles;
```


### DEFAULT_ADMIN_ROLE

```solidity
bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
```


## Functions
### onlyRole

*Modifier that checks that an account has a specific role. Reverts
with an {AccessControlUnauthorizedAccount} error including the required role.*


```solidity
modifier onlyRole(bytes32 role);
```

### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol/library.ERC165Checker.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool);
```

### hasRole

*Returns `true` if `account` has been granted `role`.*


```solidity
function hasRole(bytes32 role, address account) public view virtual returns (bool);
```

### _checkRole

*Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier.*


```solidity
function _checkRole(bytes32 role) internal view virtual;
```

### _checkRole

*Reverts with an {AccessControlUnauthorizedAccount} error if `account`
is missing `role`.*


```solidity
function _checkRole(bytes32 role, address account) internal view virtual;
```

### getRoleAdmin

*Returns the admin role that controls `role`. See [grantRole](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md#grantrole) and
{revokeRole}.
To change a role's admin, use {_setRoleAdmin}.*


```solidity
function getRoleAdmin(bytes32 role) public view virtual returns (bytes32);
```

### grantRole

*Grants `role` to `account`.
If `account` had not been already granted `role`, emits a {RoleGranted}
event.
Requirements:
- the caller must have ``role``'s admin role.
May emit a {RoleGranted} event.*


```solidity
function grantRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role));
```

### revokeRole

*Revokes `role` from `account`.
If `account` had been granted `role`, emits a {RoleRevoked} event.
Requirements:
- the caller must have ``role``'s admin role.
May emit a {RoleRevoked} event.*


```solidity
function revokeRole(bytes32 role, address account) public virtual onlyRole(getRoleAdmin(role));
```

### renounceRole

*Revokes `role` from the calling account.
Roles are often managed via [grantRole](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md#grantrole) and {revokeRole}: this function's
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).
If the calling account had been revoked `role`, emits a {RoleRevoked}
event.
Requirements:
- the caller must be `callerConfirmation`.
May emit a {RoleRevoked} event.*


```solidity
function renounceRole(bytes32 role, address callerConfirmation) public virtual;
```

### _setRoleAdmin

*Sets `adminRole` as ``role``'s admin role.
Emits a {RoleAdminChanged} event.*


```solidity
function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual;
```

### _grantRole

*Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.
Internal function without access restriction.
May emit a {RoleGranted} event.*


```solidity
function _grantRole(bytes32 role, address account) internal virtual returns (bool);
```

### _revokeRole

*Attempts to revoke `role` to `account` and returns a boolean indicating if `role` was revoked.
Internal function without access restriction.
May emit a {RoleRevoked} event.*


```solidity
function _revokeRole(bytes32 role, address account) internal virtual returns (bool);
```

## Structs
### RoleData

```solidity
struct RoleData {
    mapping(address account => bool) hasRole;
    bytes32 adminRole;
}
```

