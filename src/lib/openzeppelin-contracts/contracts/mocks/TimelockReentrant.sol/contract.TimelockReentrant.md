# TimelockReentrant

## State Variables
### _reenterTarget

```solidity
address private _reenterTarget;
```


### _reenterData

```solidity
bytes private _reenterData;
```


### _reentered

```solidity
bool _reentered;
```


## Functions
### disableReentrancy


```solidity
function disableReentrancy() external;
```

### enableRentrancy


```solidity
function enableRentrancy(address target, bytes calldata data) external;
```

### reenter


```solidity
function reenter() external;
```

