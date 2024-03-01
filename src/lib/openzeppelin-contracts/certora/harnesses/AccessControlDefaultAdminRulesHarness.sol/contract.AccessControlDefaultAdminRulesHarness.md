# AccessControlDefaultAdminRulesHarness
**Inherits:**
[AccessControlDefaultAdminRules](/lib/openzeppelin-contracts/contracts/access/extensions/AccessControlDefaultAdminRules.sol/abstract.AccessControlDefaultAdminRules.md)


## State Variables
### _delayIncreaseWait

```solidity
uint48 private _delayIncreaseWait;
```


## Functions
### constructor


```solidity
constructor(uint48 initialDelay, address initialDefaultAdmin, uint48 delayIncreaseWait)
    AccessControlDefaultAdminRules(initialDelay, initialDefaultAdmin);
```

### pendingDefaultAdmin_


```solidity
function pendingDefaultAdmin_() external view returns (address);
```

### pendingDefaultAdminSchedule_


```solidity
function pendingDefaultAdminSchedule_() external view returns (uint48);
```

### pendingDelay_


```solidity
function pendingDelay_() external view returns (uint48);
```

### pendingDelaySchedule_


```solidity
function pendingDelaySchedule_() external view returns (uint48);
```

### delayChangeWait_


```solidity
function delayChangeWait_(uint48 newDelay) external view returns (uint48);
```

### defaultAdminDelayIncreaseWait


```solidity
function defaultAdminDelayIncreaseWait() public view override returns (uint48);
```

