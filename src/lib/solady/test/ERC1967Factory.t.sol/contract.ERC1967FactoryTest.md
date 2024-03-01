# ERC1967FactoryTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### factory

```solidity
ERC1967Factory factory;
```


### implementation0

```solidity
address implementation0;
```


### implementation1

```solidity
address implementation1;
```


## Functions
### _testTemps


```solidity
function _testTemps() internal returns (_TestTemps memory t);
```

### setUp


```solidity
function setUp() public;
```

### withFactories


```solidity
modifier withFactories();
```

### testDeploy


```solidity
function testDeploy() public withFactories;
```

### testDeployBrutalized


```solidity
function testDeployBrutalized(uint256) public withFactories;
```

### testDeployAndCall


```solidity
function testDeployAndCall(uint256) public withFactories;
```

### testDeployDeterministicAndCall


```solidity
function testDeployDeterministicAndCall(uint256) public withFactories;
```

### testDeployAndCallWithRevert


```solidity
function testDeployAndCallWithRevert() public withFactories;
```

### testProxySucceeds


```solidity
function testProxySucceeds() public withFactories;
```

### testProxyFails


```solidity
function testProxyFails() public withFactories;
```

### testChangeAdmin


```solidity
function testChangeAdmin() public withFactories;
```

### testChangeAdminUnauthorized


```solidity
function testChangeAdminUnauthorized() public withFactories;
```

### testUpgrade


```solidity
function testUpgrade() public withFactories;
```

### testUpgradeAndCall


```solidity
function testUpgradeAndCall() public withFactories;
```

### testUpgradeAndCallWithRevert


```solidity
function testUpgradeAndCallWithRevert() public withFactories;
```

### testUpgradeUnauthorized


```solidity
function testUpgradeUnauthorized() public withFactories;
```

### testUpgradeWithCorruptedProxy


```solidity
function testUpgradeWithCorruptedProxy() public withFactories;
```

### testFactoryDeployment


```solidity
function testFactoryDeployment() public;
```

### _randomAccounts


```solidity
function _randomAccounts() internal returns (address a, address b);
```

### _checkImplementationSlot


```solidity
function _checkImplementationSlot(address proxy, address implementation) internal;
```

### _checkProxyBytecode


```solidity
function _checkProxyBytecode(address proxy) internal;
```

## Events
### AdminChanged

```solidity
event AdminChanged(address indexed proxy, address indexed admin);
```

### Upgraded

```solidity
event Upgraded(address indexed proxy, address indexed implementation);
```

### Deployed

```solidity
event Deployed(address indexed proxy, address indexed implementation, address indexed admin);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    uint256 key;
    uint256 value;
    uint256 msgValue;
    bytes32 salt;
    address predictedProxy;
    address proxy;
}
```

