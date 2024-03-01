# AccessManagerHarness
**Inherits:**
[AccessManager](/lib/openzeppelin-contracts/contracts/access/manager/AccessManager.sol/contract.AccessManager.md)


## State Variables
### _minSetback

```solidity
uint32 private _minSetback;
```


## Functions
### constructor


```solidity
constructor(address initialAdmin) AccessManager(initialAdmin);
```

### minSetback


```solidity
function minSetback() public view override returns (uint32);
```

### canCall_immediate


```solidity
function canCall_immediate(address caller, address target, bytes4 selector) external view returns (bool result);
```

### canCall_delay


```solidity
function canCall_delay(address caller, address target, bytes4 selector) external view returns (uint32 result);
```

### canCallExtended


```solidity
function canCallExtended(address caller, address target, bytes calldata data) external view returns (bool, uint32);
```

### canCallExtended_immediate


```solidity
function canCallExtended_immediate(address caller, address target, bytes calldata data)
    external
    view
    returns (bool result);
```

### canCallExtended_delay


```solidity
function canCallExtended_delay(address caller, address target, bytes calldata data)
    external
    view
    returns (uint32 result);
```

### getAdminRestrictions_restricted


```solidity
function getAdminRestrictions_restricted(bytes calldata data) external view returns (bool result);
```

### getAdminRestrictions_roleAdminId


```solidity
function getAdminRestrictions_roleAdminId(bytes calldata data) external view returns (uint64 result);
```

### getAdminRestrictions_executionDelay


```solidity
function getAdminRestrictions_executionDelay(bytes calldata data) external view returns (uint32 result);
```

### hasRole_isMember


```solidity
function hasRole_isMember(uint64 roleId, address account) external view returns (bool result);
```

### hasRole_executionDelay


```solidity
function hasRole_executionDelay(uint64 roleId, address account) external view returns (uint32 result);
```

### getAccess_since


```solidity
function getAccess_since(uint64 roleId, address account) external view returns (uint48 result);
```

### getAccess_currentDelay


```solidity
function getAccess_currentDelay(uint64 roleId, address account) external view returns (uint32 result);
```

### getAccess_pendingDelay


```solidity
function getAccess_pendingDelay(uint64 roleId, address account) external view returns (uint32 result);
```

### getAccess_effect


```solidity
function getAccess_effect(uint64 roleId, address account) external view returns (uint48 result);
```

### getTargetAdminDelay_after


```solidity
function getTargetAdminDelay_after(address target) public view virtual returns (uint32 result);
```

### getTargetAdminDelay_effect


```solidity
function getTargetAdminDelay_effect(address target) public view virtual returns (uint48 result);
```

### getRoleGrantDelay_after


```solidity
function getRoleGrantDelay_after(uint64 roleId) public view virtual returns (uint32 result);
```

### getRoleGrantDelay_effect


```solidity
function getRoleGrantDelay_effect(uint64 roleId) public view virtual returns (uint48 result);
```

### hashExecutionId


```solidity
function hashExecutionId(address target, bytes4 selector) external pure returns (bytes32);
```

### executionId


```solidity
function executionId() external view returns (bytes32);
```

### getSelector


```solidity
function getSelector(bytes calldata data) external pure returns (bytes4);
```

### getFirstArgumentAsAddress


```solidity
function getFirstArgumentAsAddress(bytes calldata data) external pure returns (address);
```

### getFirstArgumentAsUint64


```solidity
function getFirstArgumentAsUint64(bytes calldata data) external pure returns (uint64);
```

### _checkAuthorized


```solidity
function _checkAuthorized() internal override;
```

