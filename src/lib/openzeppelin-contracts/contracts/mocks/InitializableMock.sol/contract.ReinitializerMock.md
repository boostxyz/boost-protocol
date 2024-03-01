# ReinitializerMock
**Inherits:**
[Initializable](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md)


## State Variables
### counter

```solidity
uint256 public counter;
```


## Functions
### getInitializedVersion


```solidity
function getInitializedVersion() public view returns (uint64);
```

### initialize


```solidity
function initialize() public initializer;
```

### reinitialize


```solidity
function reinitialize(uint64 i) public reinitializer(i);
```

### nestedReinitialize


```solidity
function nestedReinitialize(uint64 i, uint64 j) public reinitializer(i);
```

### chainReinitialize


```solidity
function chainReinitialize(uint64 i, uint64 j) public;
```

### disableInitializers


```solidity
function disableInitializers() public;
```

### doStuff


```solidity
function doStuff() public onlyInitializing;
```

