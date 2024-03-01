# ERC165Checker
*Library used to query support of an interface declared via {IERC165}.
Note that these functions return the actual result of the query: they do not
`revert` if an interface is not supported. It is up to the caller to decide
what to do in these cases.*


## State Variables
### INTERFACE_ID_INVALID

```solidity
bytes4 private constant INTERFACE_ID_INVALID = 0xffffffff;
```


## Functions
### supportsERC165

*Returns true if `account` supports the {IERC165} interface.*


```solidity
function supportsERC165(address account) internal view returns (bool);
```

### supportsInterface

*Returns true if `account` supports the interface defined by
`interfaceId`. Support for {IERC165} itself is queried automatically.
See {IERC165-supportsInterface}.*


```solidity
function supportsInterface(address account, bytes4 interfaceId) internal view returns (bool);
```

### getSupportedInterfaces

*Returns a boolean array where each value corresponds to the
interfaces passed in and whether they're supported or not. This allows
you to batch check interfaces for a contract where your expectation
is that some interfaces may not be supported.
See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md#supportsinterface).*


```solidity
function getSupportedInterfaces(address account, bytes4[] memory interfaceIds) internal view returns (bool[] memory);
```

### supportsAllInterfaces

*Returns true if `account` supports all the interfaces defined in
`interfaceIds`. Support for {IERC165} itself is queried automatically.
Batch-querying can lead to gas savings by skipping repeated checks for
{IERC165} support.
See {IERC165-supportsInterface}.*


```solidity
function supportsAllInterfaces(address account, bytes4[] memory interfaceIds) internal view returns (bool);
```

### supportsERC165InterfaceUnchecked

Query if a contract implements an interface, does not check ERC-165 support

*Assumes that account contains a contract that supports ERC-165, otherwise
the behavior of this method is undefined. This precondition can be checked
with [supportsERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol/library.ERC165Checker.md#supportserc165).
Some precompiled contracts will falsely indicate support for a given interface, so caution
should be exercised when using this function.
Interface identification is specified in ERC-165.*


```solidity
function supportsERC165InterfaceUnchecked(address account, bytes4 interfaceId) internal view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`account`|`address`|The address of the contract to query for support of an interface|
|`interfaceId`|`bytes4`|The interface identifier, as specified in ERC-165|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|true if the contract at account indicates support of the interface with identifier interfaceId, false otherwise|


