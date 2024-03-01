# MockOwnableRoles
**Inherits:**
[OwnableRoles](/lib/solady/src/auth/OwnableRoles.sol/abstract.OwnableRoles.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### flag

```solidity
bool public flag;
```


## Functions
### constructor


```solidity
constructor() payable;
```

### initializeOwnerDirect


```solidity
function initializeOwnerDirect(address newOwner) public payable;
```

### setOwnerDirect


```solidity
function setOwnerDirect(address newOwner) public payable;
```

### setRolesDirect


```solidity
function setRolesDirect(address user, uint256 roles) public payable;
```

### grantRolesDirect


```solidity
function grantRolesDirect(address user, uint256 roles) public payable;
```

### removeRolesDirect


```solidity
function removeRolesDirect(address user, uint256 roles) public payable;
```

### grantRoles


```solidity
function grantRoles(address user, uint256 roles) public payable virtual override;
```

### revokeRoles


```solidity
function revokeRoles(address user, uint256 roles) public payable virtual override;
```

### completeOwnershipHandover


```solidity
function completeOwnershipHandover(address pendingOwner) public payable virtual override;
```

### transferOwnership


```solidity
function transferOwnership(address newOwner) public payable virtual override;
```

### rolesOf


```solidity
function rolesOf(address user) public view virtual override returns (uint256 result);
```

### ownershipHandoverExpiresAt


```solidity
function ownershipHandoverExpiresAt(address pendingOwner) public view virtual override returns (uint256 result);
```

### ownershipHandoverValidFor


```solidity
function ownershipHandoverValidFor() public view returns (uint64 result);
```

### updateFlagWithOnlyOwner


```solidity
function updateFlagWithOnlyOwner() public payable onlyOwner;
```

### updateFlagWithOnlyRoles


```solidity
function updateFlagWithOnlyRoles(uint256 roles) public payable onlyRoles(roles);
```

### updateFlagWithOnlyOwnerOrRoles


```solidity
function updateFlagWithOnlyOwnerOrRoles(uint256 roles) public payable onlyOwnerOrRoles(roles);
```

### updateFlagWithOnlyRolesOrOwner


```solidity
function updateFlagWithOnlyRolesOrOwner(uint256 roles) public payable onlyRolesOrOwner(roles);
```

### rolesFromOrdinals


```solidity
function rolesFromOrdinals(uint8[] memory ordinals) public pure returns (uint256 roles);
```

### ordinalsFromRoles


```solidity
function ordinalsFromRoles(uint256 roles) public pure returns (uint8[] memory ordinals);
```

### _brutalizedAddress


```solidity
function _brutalizedAddress(address value) private view returns (address result);
```

### _checkedBool


```solidity
function _checkedBool(bool value) private pure returns (bool result);
```

