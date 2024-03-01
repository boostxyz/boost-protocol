# AccessControlEnumerable
**Inherits:**
[IAccessControlEnumerable](/lib/openzeppelin-contracts/contracts/access/extensions/IAccessControlEnumerable.sol/interface.IAccessControlEnumerable.md), [AccessControl](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md)

*Extension of {AccessControl} that allows enumerating the members of each role.*


## State Variables
### _roleMembers

```solidity
mapping(bytes32 role => EnumerableSet.AddressSet) private _roleMembers;
```


## Functions
### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool);
```

### getRoleMember

*Returns one of the accounts that have `role`. `index` must be a
value between 0 and [getRoleMemberCount](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlEnumerable.sol/abstract.AccessControlEnumerable.md#getrolemembercount), non-inclusive.
Role bearers are not sorted in any particular way, and their ordering may
change at any point.
WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
you perform all queries on the same block. See the following
https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
for more information.*


```solidity
function getRoleMember(bytes32 role, uint256 index) public view virtual returns (address);
```

### getRoleMemberCount

*Returns the number of accounts that have `role`. Can be used
together with [getRoleMember](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlEnumerable.sol/abstract.AccessControlEnumerable.md#getrolemember) to enumerate all bearers of a role.*


```solidity
function getRoleMemberCount(bytes32 role) public view virtual returns (uint256);
```

### getRoleMembers

*Return all accounts that have `role`
WARNING: This operation will copy the entire storage to memory, which can be quite expensive. This is designed
to mostly be used by view accessors that are queried without any gas fees. Developers should keep in mind that
this function has an unbounded cost, and using it as part of a state-changing function may render the function
uncallable if the set grows to a point where copying to memory consumes too much gas to fit in a block.*


```solidity
function getRoleMembers(bytes32 role) public view virtual returns (address[] memory);
```

### _grantRole

*Overload [AccessControl-_grantRole](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#_grantrole) to track enumerable memberships*


```solidity
function _grantRole(bytes32 role, address account) internal virtual override returns (bool);
```

### _revokeRole

*Overload [AccessControl-_revokeRole](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md#_revokerole) to track enumerable memberships*


```solidity
function _revokeRole(bytes32 role, address account) internal virtual override returns (bool);
```

