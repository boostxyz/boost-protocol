# OwnableTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### mockOwnable

```solidity
MockOwnable mockOwnable;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testBytecodeSize


```solidity
function testBytecodeSize() public;
```

### testInitializeOwnerDirect


```solidity
function testInitializeOwnerDirect() public;
```

### testSetOwnerDirect


```solidity
function testSetOwnerDirect(address newOwner) public;
```

### testSetOwnerDirect


```solidity
function testSetOwnerDirect() public;
```

### testRenounceOwnership


```solidity
function testRenounceOwnership() public;
```

### testTransferOwnership


```solidity
function testTransferOwnership(address newOwner, bool setNewOwnerToZeroAddress, bool callerIsOwner) public;
```

### testTransferOwnership


```solidity
function testTransferOwnership() public;
```

### testOnlyOwnerModifier


```solidity
function testOnlyOwnerModifier(address nonOwner, bool callerIsOwner) public;
```

### testHandoverOwnership


```solidity
function testHandoverOwnership(address pendingOwner) public;
```

### testHandoverOwnership


```solidity
function testHandoverOwnership() public;
```

### testHandoverOwnershipRevertsIfCompleteIsNotOwner


```solidity
function testHandoverOwnershipRevertsIfCompleteIsNotOwner() public;
```

### testHandoverOwnershipWithCancellation


```solidity
function testHandoverOwnershipWithCancellation() public;
```

### testHandoverOwnershipBeforeExpiration


```solidity
function testHandoverOwnershipBeforeExpiration() public;
```

### testHandoverOwnershipAfterExpiration


```solidity
function testHandoverOwnershipAfterExpiration() public;
```

### testOwnershipHandoverValidForDefaultValue


```solidity
function testOwnershipHandoverValidForDefaultValue() public;
```

## Events
### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
```

### OwnershipHandoverRequested

```solidity
event OwnershipHandoverRequested(address indexed pendingOwner);
```

### OwnershipHandoverCanceled

```solidity
event OwnershipHandoverCanceled(address indexed pendingOwner);
```

