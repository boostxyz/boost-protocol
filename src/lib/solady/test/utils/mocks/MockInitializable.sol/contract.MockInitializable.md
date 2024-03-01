# MockInitializable
**Inherits:**
[Initializable](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### x

```solidity
uint256 public x;
```


### y

```solidity
uint256 public y;
```


## Functions
### constructor


```solidity
constructor(Args memory a);
```

### initialize


```solidity
function initialize(Args memory a) public initializer;
```

### reinitialize


```solidity
function reinitialize(Args memory a) public reinitializer(a.version);
```

### version


```solidity
function version() external view returns (uint64);
```

### isInitializing


```solidity
function isInitializing() external view returns (bool);
```

### onlyDuringInitializing


```solidity
function onlyDuringInitializing() public onlyInitializing;
```

### disableInitializers


```solidity
function disableInitializers() public;
```

## Structs
### Args

```solidity
struct Args {
    uint256 x;
    uint64 version;
    bool disableInitializers;
    bool initializeMulti;
    bool checkOnlyDuringInitializing;
    bool recurse;
}
```

