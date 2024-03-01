# EIP712Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### mock

```solidity
MockEIP712 mock;
```


### mockClone

```solidity
MockEIP712 mockClone;
```


### mockDynamic

```solidity
MockEIP712Dynamic mockDynamic;
```


### mockDynamicClone

```solidity
MockEIP712Dynamic mockDynamicClone;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testHashTypedData


```solidity
function testHashTypedData() public;
```

### testHashTypedDataOnClone


```solidity
function testHashTypedDataOnClone() public;
```

### testHashTypedDataOnDynamic


```solidity
function testHashTypedDataOnDynamic() public;
```

### testHashTypedDataOnCloneDynamic


```solidity
function testHashTypedDataOnCloneDynamic() public;
```

### testHashTypedDataWithChaindIdChange


```solidity
function testHashTypedDataWithChaindIdChange() public;
```

### testHashTypedDataOnCloneWithChaindIdChange


```solidity
function testHashTypedDataOnCloneWithChaindIdChange() public;
```

### testHashTypedDataOnDynamicWithChaindIdChange


```solidity
function testHashTypedDataOnDynamicWithChaindIdChange() public;
```

### testHashTypedDataOnCloneDynamicWithChaindIdChange


```solidity
function testHashTypedDataOnCloneDynamicWithChaindIdChange() public;
```

### _testHashTypedDataOnClone


```solidity
function _testHashTypedDataOnClone(MockEIP712 mockToTest) internal;
```

### testDomainSeparator


```solidity
function testDomainSeparator() public;
```

### testDomainSeparatorOnClone


```solidity
function testDomainSeparatorOnClone() public;
```

### testDomainSeparatorWithChainIdChange


```solidity
function testDomainSeparatorWithChainIdChange() public;
```

### testDomainSeparatorOnCloneWithChainIdChange


```solidity
function testDomainSeparatorOnCloneWithChainIdChange() public;
```

### testDomainSeparatorOnDynamicWithChainIdChange


```solidity
function testDomainSeparatorOnDynamicWithChainIdChange() public;
```

### testDomainSeparatorOnCloneDynamicWithChainIdChange


```solidity
function testDomainSeparatorOnCloneDynamicWithChainIdChange() public;
```

### _testDomainSeparator


```solidity
function _testDomainSeparator(MockEIP712 mockToTest, bytes memory name, bytes memory version) internal;
```

### _testDomainSeparator


```solidity
function _testDomainSeparator(MockEIP712 mockToTest) internal;
```

### testEIP5267


```solidity
function testEIP5267() public;
```

### _testEIP5267


```solidity
function _testEIP5267(MockEIP712 mockToTest) public;
```

## Structs
### _testEIP5267Variables

```solidity
struct _testEIP5267Variables {
    bytes1 fields;
    string name;
    string version;
    uint256 chainId;
    address verifyingContract;
    bytes32 salt;
    uint256[] extensions;
}
```

