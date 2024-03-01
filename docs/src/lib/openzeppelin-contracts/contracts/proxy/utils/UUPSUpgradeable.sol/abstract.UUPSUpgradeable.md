# UUPSUpgradeable
**Inherits:**
[IERC1822Proxiable](/lib/openzeppelin-contracts/contracts/interfaces/draft-IERC1822.sol/interface.IERC1822Proxiable.md)

*An upgradeability mechanism designed for UUPS proxies. The functions included here can perform an upgrade of an
{ERC1967Proxy}, when this contract is set as the implementation behind such a proxy.
A security mechanism ensures that an upgrade does not turn off upgradeability accidentally, although this risk is
reinstated if the upgrade retains upgradeability but removes the security mechanism, e.g. by replacing
`UUPSUpgradeable` with a custom implementation of upgrades.
The {_authorizeUpgrade} function must be overridden to include access restriction to the upgrade mechanism.*


## State Variables
### __self

```solidity
address private immutable __self = address(this);
```


### UPGRADE_INTERFACE_VERSION
*The version of the upgrade interface of the contract. If this getter is missing, both `upgradeTo(address)`
and `upgradeToAndCall(address,bytes)` are present, and `upgradeTo` must be used if no function should be called,
while `upgradeToAndCall` will invoke the `receive` function if the second argument is the empty byte string.
If the getter returns `"5.0.0"`, only `upgradeToAndCall(address,bytes)` is present, and the second argument must
be the empty byte string if no function should be called, making it impossible to invoke the `receive` function
during an upgrade.*


```solidity
string public constant UPGRADE_INTERFACE_VERSION = "5.0.0";
```


## Functions
### onlyProxy

*Check that the execution is being performed through a delegatecall call and that the execution context is
a proxy contract with an implementation (as defined in ERC-1967) pointing to self. This should only be the case
for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
function through ERC-1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
fail.*


```solidity
modifier onlyProxy();
```

### notDelegated

*Check that the execution is not being performed through a delegate call. This allows a function to be
callable on the implementing contract but not through proxies.*


```solidity
modifier notDelegated();
```

### proxiableUUID

*Implementation of the ERC-1822 [proxiableUUID](/lib/openzeppelin-contracts/contracts/proxy/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md#proxiableuuid) function. This returns the storage slot used by the
implementation. It is used to validate the implementation's compatibility when performing an upgrade.
IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.*


```solidity
function proxiableUUID() external view virtual notDelegated returns (bytes32);
```

### upgradeToAndCall

*Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
encoded in `data`.
Calls [_authorizeUpgrade](/lib/openzeppelin-contracts/contracts/proxy/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md#_authorizeupgrade).
Emits an {Upgraded} event.*


```solidity
function upgradeToAndCall(address newImplementation, bytes memory data) public payable virtual onlyProxy;
```

### _checkProxy

*Reverts if the execution is not performed via delegatecall or the execution
context is not of a proxy with an ERC-1967 compliant implementation pointing to self.
See {_onlyProxy}.*


```solidity
function _checkProxy() internal view virtual;
```

### _checkNotDelegated

*Reverts if the execution is performed via delegatecall.
See [notDelegated](/lib/openzeppelin-contracts/contracts/proxy/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md#notdelegated).*


```solidity
function _checkNotDelegated() internal view virtual;
```

### _authorizeUpgrade

*Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
[upgradeToAndCall](/lib/openzeppelin-contracts/contracts/proxy/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md#upgradetoandcall).
Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
```solidity
function _authorizeUpgrade(address) internal onlyOwner {}
```*


```solidity
function _authorizeUpgrade(address newImplementation) internal virtual;
```

### _upgradeToAndCallUUPS

*Performs an implementation upgrade with a security check for UUPS proxies, and additional setup call.
As a security check, [proxiableUUID](/lib/openzeppelin-contracts/contracts/proxy/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md#proxiableuuid) is invoked in the new implementation, and the return value
is expected to be the implementation slot in ERC-1967.
Emits an {IERC1967-Upgraded} event.*


```solidity
function _upgradeToAndCallUUPS(address newImplementation, bytes memory data) private;
```

## Errors
### UUPSUnauthorizedCallContext
*The call is from an unauthorized context.*


```solidity
error UUPSUnauthorizedCallContext();
```

### UUPSUnsupportedProxiableUUID
*The storage `slot` is unsupported as a UUID.*


```solidity
error UUPSUnsupportedProxiableUUID(bytes32 slot);
```

