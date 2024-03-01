# AuthorityDelayMock

## State Variables
### _immediate

```solidity
bool _immediate;
```


### _delay

```solidity
uint32 _delay;
```


## Functions
### canCall


```solidity
function canCall(address, address, bytes4) external view returns (bool immediate, uint32 delay);
```

### _setImmediate


```solidity
function _setImmediate(bool immediate) external;
```

### _setDelay


```solidity
function _setDelay(uint32 delay) external;
```

