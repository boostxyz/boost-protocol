# MockOwnable
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md)

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

### completeOwnershipHandover


```solidity
function completeOwnershipHandover(address pendingOwner) public payable virtual override;
```

### transferOwnership


```solidity
function transferOwnership(address newOwner) public payable virtual override;
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

### _brutalizedAddress


```solidity
function _brutalizedAddress(address value) private view returns (address result);
```

