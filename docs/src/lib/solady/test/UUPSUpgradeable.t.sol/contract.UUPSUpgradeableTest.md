# UUPSUpgradeableTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### impl1

```solidity
MockUUPSImplementation impl1;
```


### proxy

```solidity
address proxy;
```


### _ERC1967_IMPLEMENTATION_SLOT

```solidity
bytes32 internal constant _ERC1967_IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testNotDelegatedGuard


```solidity
function testNotDelegatedGuard() public;
```

### testOnlyProxyGuard


```solidity
function testOnlyProxyGuard() public;
```

### testUpgradeTo


```solidity
function testUpgradeTo() public;
```

### testUpgradeToRevertWithUnauthorized


```solidity
function testUpgradeToRevertWithUnauthorized() public;
```

### testUpgradeToRevertWithUpgradeFailed


```solidity
function testUpgradeToRevertWithUpgradeFailed() public;
```

### testUpgradeToAndCall


```solidity
function testUpgradeToAndCall() public;
```

### testUpgradeToAndCallRevertWithUpgradeFailed


```solidity
function testUpgradeToAndCallRevertWithUpgradeFailed() public;
```

### testUpgradeToAndCallRevertWithCustomError


```solidity
function testUpgradeToAndCallRevertWithCustomError() public;
```

### testUpgradeToAndCallRevertWithUnauthorized


```solidity
function testUpgradeToAndCallRevertWithUnauthorized() public;
```

## Events
### Upgraded

```solidity
event Upgraded(address indexed implementation);
```

