# OwnableRolesTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### mockOwnableRoles

```solidity
MockOwnableRoles mockOwnableRoles;
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

### testGrantAndRemoveRolesDirect


```solidity
function testGrantAndRemoveRolesDirect(address user, uint256 rolesToGrant, uint256 rolesToRemove) public;
```

### testSetRolesDirect


```solidity
function testSetRolesDirect(uint256) public;
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

### testGrantRoles


```solidity
function testGrantRoles() public;
```

### testGrantAndRevokeOrRenounceRoles


```solidity
function testGrantAndRevokeOrRenounceRoles(
    address user,
    bool granterIsOwner,
    bool useRenounce,
    bool revokerIsOwner,
    uint256 rolesToGrant,
    uint256 rolesToRevoke
) public;
```

### testHasAllRoles


```solidity
function testHasAllRoles(
    address user,
    uint256 rolesToGrant,
    uint256 rolesToGrantBrutalizer,
    uint256 rolesToCheck,
    bool useSameRoles
) public;
```

### testHasAnyRole


```solidity
function testHasAnyRole(address user, uint256 rolesToGrant, uint256 rolesToCheck) public;
```

### testRolesFromOrdinals


```solidity
function testRolesFromOrdinals(uint8[] memory ordinals) public;
```

### testRolesFromOrdinals


```solidity
function testRolesFromOrdinals() public;
```

### testOrdinalsFromRoles


```solidity
function testOrdinalsFromRoles(uint256 roles) public;
```

### testOrdinalsFromRoles


```solidity
function testOrdinalsFromRoles() public;
```

### testOnlyOwnerModifier


```solidity
function testOnlyOwnerModifier(address nonOwner, bool callerIsOwner) public;
```

### testOnlyRolesModifier


```solidity
function testOnlyRolesModifier(address user, uint256 rolesToGrant, uint256 rolesToCheck) public;
```

### testOnlyOwnerOrRolesModifier


```solidity
function testOnlyOwnerOrRolesModifier(address user, bool callerIsOwner, uint256 rolesToGrant, uint256 rolesToCheck)
    public;
```

### testOnlyRolesOrOwnerModifier


```solidity
function testOnlyRolesOrOwnerModifier(address user, bool callerIsOwner, uint256 rolesToGrant, uint256 rolesToCheck)
    public;
```

### testOnlyOwnerOrRolesModifier


```solidity
function testOnlyOwnerOrRolesModifier() public;
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

### RolesUpdated

```solidity
event RolesUpdated(address indexed user, uint256 indexed roles);
```

