# ERC4337FactoryTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### _ENTRY_POINT

```solidity
address internal constant _ENTRY_POINT = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;
```


### factory

```solidity
ERC4337Factory factory;
```


### erc4337

```solidity
MockERC4337 erc4337;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testDeployDeterministic


```solidity
function testDeployDeterministic(uint256) public;
```

### testCreateAccountRepeatedDeployment


```solidity
function testCreateAccountRepeatedDeployment() public;
```

### testCreateAccountRepeatedDeployment


```solidity
function testCreateAccountRepeatedDeployment(uint256) public;
```

### _checkImplementationSlot


```solidity
function _checkImplementationSlot(address proxy, address implementation_) internal;
```

