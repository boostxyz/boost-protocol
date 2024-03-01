# Initializable
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/Initializable.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/proxy/utils/Initializable.sol)

Initializable mixin for the upgradeable contracts.


## State Variables
### _INTIALIZED_EVENT_SIGNATURE
*`keccak256(bytes("Initialized(uint64)"))`.*


```solidity
bytes32 private constant _INTIALIZED_EVENT_SIGNATURE =
    0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2;
```


### _INITIALIZABLE_SLOT
*The default initializable slot is given by:
`bytes32(~uint256(uint32(bytes4(keccak256("_INITIALIZABLE_SLOT")))))`.
Bits Layout:
- [0]     `initializing`
- [1..64] `initializedVersion`*


```solidity
bytes32 private constant _INITIALIZABLE_SLOT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffbf601132;
```


## Functions
### _initializableSlot

*Override to return a custom storage slot if required.*


```solidity
function _initializableSlot() internal pure virtual returns (bytes32);
```

### initializer

*Guards an initializer function so that it can be invoked at most once.
You can guard a function with `onlyInitializing` such that it can be called
through a function guarded with `initializer`.
This is similar to `reinitializer(1)`, except that in the context of a constructor,
an `initializer` guarded function can be invoked multiple times.
This can be useful during testing and is not expected to be used in production.
Emits an [Initialized](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md#initialized) event.*


```solidity
modifier initializer() virtual;
```

### reinitializer

*Guards an reinitialzer function so that it can be invoked at most once.
You can guard a function with `onlyInitializing` such that it can be called
through a function guarded with `reinitializer`.
Emits an [Initialized](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md#initialized) event.*


```solidity
modifier reinitializer(uint64 version) virtual;
```

### onlyInitializing

*Guards a function such that it can only be called in the scope
of a function guarded with `initializer` or `reinitializer`.*


```solidity
modifier onlyInitializing() virtual;
```

### _checkInitializing

*Reverts if the contract is not initializing.*


```solidity
function _checkInitializing() internal view virtual;
```

### _disableInitializers

*Locks any future initializations by setting the initialized version to `2**64 - 1`.
Calling this in the constructor will prevent the contract from being initialized
or reinitialized. It is recommended to use this to lock implementation contracts
that are designed to be called through proxies.
Emits an [Initialized](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md#initialized) event the first time it is successfully called.*


```solidity
function _disableInitializers() internal virtual;
```

### _getInitializedVersion

*Returns the highest version that has been initialized.*


```solidity
function _getInitializedVersion() internal view virtual returns (uint64 version);
```

### _isInitializing

*Returns whether the contract is currently initializing.*


```solidity
function _isInitializing() internal view virtual returns (bool result);
```

## Events
### Initialized
*Triggered when the contract has been initialized.*


```solidity
event Initialized(uint64 version);
```

## Errors
### InvalidInitialization
*The contract is already initialized.*


```solidity
error InvalidInitialization();
```

### NotInitializing
*The contract is not initializing.*


```solidity
error NotInitializing();
```

