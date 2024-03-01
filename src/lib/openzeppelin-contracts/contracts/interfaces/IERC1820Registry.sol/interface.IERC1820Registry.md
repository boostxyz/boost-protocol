# IERC1820Registry
*Interface of the global ERC-1820 Registry, as defined in the
https://eips.ethereum.org/EIPS/eip-1820[ERC]. Accounts may register
implementers for interfaces in this registry, as well as query support.
Implementers may be shared by multiple accounts, and can also implement more
than a single interface for each account. Contracts can implement interfaces
for themselves, but externally-owned accounts (EOA) must delegate this to a
contract.
{IERC165} interfaces can also be queried via the registry.
For an in-depth explanation and source code analysis, see the ERC text.*


## Functions
### setManager

*Sets `newManager` as the manager for `account`. A manager of an
account is able to set interface implementers for it.
By default, each account is its own manager. Passing a value of `0x0` in
`newManager` will reset the manager to this initial state.
Emits a [ManagerChanged](/lib/openzeppelin-contracts/contracts/interfaces/IERC1820Registry.sol/interface.IERC1820Registry.md#managerchanged) event.
Requirements:
- the caller must be the current manager for `account`.*


```solidity
function setManager(address account, address newManager) external;
```

### getManager

*Returns the manager for `account`.
See [setManager](/lib/openzeppelin-contracts/contracts/interfaces/IERC1820Registry.sol/interface.IERC1820Registry.md#setmanager).*


```solidity
function getManager(address account) external view returns (address);
```

### setInterfaceImplementer

*Sets the `implementer` contract as ``account``'s implementer for
`interfaceHash`.
`account` being the zero address is an alias for the caller's address.
The zero address can also be used in `implementer` to remove an old one.
See [interfaceHash](/lib/openzeppelin-contracts/contracts/interfaces/IERC1820Registry.sol/interface.IERC1820Registry.md#interfacehash) to learn how these are created.
Emits an {InterfaceImplementerSet} event.
Requirements:
- the caller must be the current manager for `account`.
- `interfaceHash` must not be an {IERC165} interface id (i.e. it must not
end in 28 zeroes).
- `implementer` must implement {IERC1820Implementer} and return true when
queried for support, unless `implementer` is the caller. See
{IERC1820Implementer-canImplementInterfaceForAddress}.*


```solidity
function setInterfaceImplementer(address account, bytes32 _interfaceHash, address implementer) external;
```

### getInterfaceImplementer

*Returns the implementer of `interfaceHash` for `account`. If no such
implementer is registered, returns the zero address.
If `interfaceHash` is an {IERC165} interface id (i.e. it ends with 28
zeroes), `account` will be queried for support of it.
`account` being the zero address is an alias for the caller's address.*


```solidity
function getInterfaceImplementer(address account, bytes32 _interfaceHash) external view returns (address);
```

### interfaceHash

*Returns the interface hash for an `interfaceName`, as defined in the
corresponding
https://eips.ethereum.org/EIPS/eip-1820#interface-name[section of the ERC].*


```solidity
function interfaceHash(string calldata interfaceName) external pure returns (bytes32);
```

### updateERC165Cache

Updates the cache with whether the contract implements an ERC-165 interface or not.


```solidity
function updateERC165Cache(address account, bytes4 interfaceId) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|Address of the contract for which to update the cache.|
|`interfaceId`|`bytes4`|ERC-165 interface for which to update the cache.|


### implementsERC165Interface

Checks whether a contract implements an ERC-165 interface or not.
If the result is not cached a direct lookup on the contract address is performed.
If the result is not cached or the cached value is out-of-date, the cache MUST be updated manually by calling
[updateERC165Cache](/lib/openzeppelin-contracts/contracts/interfaces/IERC1820Registry.sol/interface.IERC1820Registry.md#updateerc165cache) with the contract address.


```solidity
function implementsERC165Interface(address account, bytes4 interfaceId) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|Address of the contract to check.|
|`interfaceId`|`bytes4`|ERC-165 interface to check.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if `account` implements `interfaceId`, false otherwise.|


### implementsERC165InterfaceNoCache

Checks whether a contract implements an ERC-165 interface or not without using or updating the cache.


```solidity
function implementsERC165InterfaceNoCache(address account, bytes4 interfaceId) external view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|Address of the contract to check.|
|`interfaceId`|`bytes4`|ERC-165 interface to check.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if `account` implements `interfaceId`, false otherwise.|


## Events
### InterfaceImplementerSet

```solidity
event InterfaceImplementerSet(address indexed account, bytes32 indexed interfaceHash, address indexed implementer);
```

### ManagerChanged

```solidity
event ManagerChanged(address indexed account, address indexed newManager);
```

