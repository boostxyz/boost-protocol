# InitializableTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### m

```solidity
MockInitializable m;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _args


```solidity
function _args() internal returns (MockInitializable.Args memory a);
```

### _expectEmitInitialized


```solidity
function _expectEmitInitialized(uint64 version) internal;
```

### testInitialize


```solidity
function testInitialize() public;
```

### _checkVersion


```solidity
function _checkVersion(uint64 version) internal;
```

### testInitializeReinititalize


```solidity
function testInitializeReinititalize(uint256) public;
```

### testOnlyInitializing


```solidity
function testOnlyInitializing() public;
```

### testDisableInitializers


```solidity
function testDisableInitializers() public;
```

### testInitializableConstructor


```solidity
function testInitializableConstructor() public;
```

### testInitializeInititalizerTrick


```solidity
function testInitializeInititalizerTrick(bool initializing, uint64 initializedVersion, uint16 codeSize) public;
```

### testInitializeReinititalizerTrick


```solidity
function testInitializeReinititalizerTrick(bool initializing, uint64 initializedVersion, uint64 version) public;
```

## Events
### Initialized

```solidity
event Initialized(uint64 version);
```

