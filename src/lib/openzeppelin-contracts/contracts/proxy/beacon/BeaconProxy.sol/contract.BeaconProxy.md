# BeaconProxy
**Inherits:**
[Proxy](/lib/solady/ext/wake/weird/Upgradable.sol/contract.Proxy.md)

*This contract implements a proxy that gets the implementation address for each call from an {UpgradeableBeacon}.
The beacon address can only be set once during construction, and cannot be changed afterwards. It is stored in an
immutable variable to avoid unnecessary storage reads, and also in the beacon storage slot specified by
https://eips.ethereum.org/EIPS/eip-1967[ERC-1967] so that it can be accessed externally.
CAUTION: Since the beacon address can never be changed, you must ensure that you either control the beacon, or trust
the beacon to not upgrade the implementation maliciously.
IMPORTANT: Do not use the implementation logic to modify the beacon storage slot. Doing so would leave the proxy in
an inconsistent state where the beacon storage slot does not match the beacon address.*


## State Variables
### _beacon

```solidity
address private immutable _beacon;
```


## Functions
### constructor

*Initializes the proxy with `beacon`.
If `data` is nonempty, it's used as data in a delegate call to the implementation returned by the beacon. This
will typically be an encoded function call, and allows initializing the storage of the proxy like a Solidity
constructor.
Requirements:
- `beacon` must be a contract with the interface {IBeacon}.
- If `data` is empty, `msg.value` must be zero.*


```solidity
constructor(address beacon, bytes memory data) payable;
```

### _implementation

*Returns the current implementation address of the associated beacon.*


```solidity
function _implementation() internal view virtual override returns (address);
```

### _getBeacon

*Returns the beacon.*


```solidity
function _getBeacon() internal view virtual returns (address);
```

