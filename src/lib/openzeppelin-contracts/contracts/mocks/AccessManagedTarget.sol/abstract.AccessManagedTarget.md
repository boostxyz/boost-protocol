# AccessManagedTarget
**Inherits:**
[AccessManaged](/lib/openzeppelin-contracts/contracts/access/manager/AccessManaged.sol/abstract.AccessManaged.md)


## Functions
### fnRestricted


```solidity
function fnRestricted() public restricted;
```

### fnUnrestricted


```solidity
function fnUnrestricted() public;
```

### setIsConsumingScheduledOp


```solidity
function setIsConsumingScheduledOp(bool isConsuming, bytes32 slot) external;
```

### fallback


```solidity
fallback() external;
```

## Events
### CalledRestricted

```solidity
event CalledRestricted(address caller);
```

### CalledUnrestricted

```solidity
event CalledUnrestricted(address caller);
```

### CalledFallback

```solidity
event CalledFallback(address caller);
```

