# ProxyAdmin
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md)

*This is an auxiliary contract meant to be assigned as the admin of a {TransparentUpgradeableProxy}. For an
explanation of why you would want to use this see the documentation for {TransparentUpgradeableProxy}.*


## State Variables
### UPGRADE_INTERFACE_VERSION
*The version of the upgrade interface of the contract. If this getter is missing, both `upgrade(address)`
and `upgradeAndCall(address,bytes)` are present, and `upgradeTo` must be used if no function should be called,
while `upgradeAndCall` will invoke the `receive` function if the second argument is the empty byte string.
If the getter returns `"5.0.0"`, only `upgradeAndCall(address,bytes)` is present, and the second argument must
be the empty byte string if no function should be called, making it impossible to invoke the `receive` function
during an upgrade.*


```solidity
string public constant UPGRADE_INTERFACE_VERSION = "5.0.0";
```


## Functions
### constructor

*Sets the initial owner who can perform upgrades.*


```solidity
constructor(address initialOwner) Ownable(initialOwner);
```

### upgradeAndCall

*Upgrades `proxy` to `implementation` and calls a function on the new implementation.
See [TransparentUpgradeableProxy-_dispatchUpgradeToAndCall](/lib/openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol/contract.TransparentUpgradeableProxy.md#_dispatchupgradetoandcall).
Requirements:
- This contract must be the admin of `proxy`.
- If `data` is empty, `msg.value` must be zero.*


```solidity
function upgradeAndCall(ITransparentUpgradeableProxy proxy, address implementation, bytes memory data)
    public
    payable
    virtual
    onlyOwner;
```

