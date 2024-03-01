# InitializableHarness
**Inherits:**
[Initializable](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md)


## Functions
### initialize


```solidity
function initialize() public initializer;
```

### reinitialize


```solidity
function reinitialize(uint64 n) public reinitializer(n);
```

### disable


```solidity
function disable() public;
```

### nested_init_init


```solidity
function nested_init_init() public initializer;
```

### nested_init_reinit


```solidity
function nested_init_reinit(uint64 m) public initializer;
```

### nested_reinit_init


```solidity
function nested_reinit_init(uint64 n) public reinitializer(n);
```

### nested_reinit_reinit


```solidity
function nested_reinit_reinit(uint64 n, uint64 m) public reinitializer(n);
```

### version


```solidity
function version() public view returns (uint64);
```

### initializing


```solidity
function initializing() public view returns (bool);
```

