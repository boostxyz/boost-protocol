# UUPSUpgradeable
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/UUPSUpgradeable.sol), Modified from OpenZeppelin
(https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/utils/UUPSUpgradeable.sol)
Note:
- This implementation is intended to be used with ERC1967 proxies.
See: `LibClone.deployERC1967` and related functions.
- This implementation is NOT compatible with legacy OpenZeppelin proxies
which do not store the implementation at `_ERC1967_IMPLEMENTATION_SLOT`.

UUPS proxy mixin.


## State Variables
### __self
*For checking if the context is a delegate call.*


```solidity
uint256 private immutable __self = uint256(uint160(address(this)));
```


### _UPGRADED_EVENT_SIGNATURE
*`keccak256(bytes("Upgraded(address)"))`.*


```solidity
uint256 private constant _UPGRADED_EVENT_SIGNATURE = 0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b;
```


### _ERC1967_IMPLEMENTATION_SLOT
*The ERC-1967 storage slot for the implementation in the proxy.
`uint256(keccak256("eip1967.proxy.implementation")) - 1`.*


```solidity
bytes32 internal constant _ERC1967_IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### _authorizeUpgrade

*Please override this function to check if `msg.sender` is authorized
to upgrade the proxy to `newImplementation`, reverting if not.
```
function _authorizeUpgrade(address) internal override onlyOwner {}
```*


```solidity
function _authorizeUpgrade(address newImplementation) internal virtual;
```

### proxiableUUID

*Returns the storage slot used by the implementation,
as specified in [ERC1822](https://eips.ethereum.org/EIPS/eip-1822).
Note: The `notDelegated` modifier prevents accidental upgrades to
an implementation that is a proxy contract.*


```solidity
function proxiableUUID() public view virtual notDelegated returns (bytes32);
```

### upgradeToAndCall

*Upgrades the proxy's implementation to `newImplementation`.
Emits a [Upgraded](/lib/solady/src/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md#upgraded) event.
Note: Passing in empty `data` skips the delegatecall to `newImplementation`.*


```solidity
function upgradeToAndCall(address newImplementation, bytes calldata data) public payable virtual onlyProxy;
```

### onlyProxy

*Requires that the execution is performed through a proxy.*


```solidity
modifier onlyProxy();
```

### notDelegated

*Requires that the execution is NOT performed via delegatecall.
This is the opposite of `onlyProxy`.*


```solidity
modifier notDelegated();
```

## Events
### Upgraded
*Emitted when the proxy's implementation is upgraded.*


```solidity
event Upgraded(address indexed implementation);
```

## Errors
### UpgradeFailed
*The upgrade failed.*


```solidity
error UpgradeFailed();
```

### UnauthorizedCallContext
*The call is from an unauthorized call context.*


```solidity
error UnauthorizedCallContext();
```

