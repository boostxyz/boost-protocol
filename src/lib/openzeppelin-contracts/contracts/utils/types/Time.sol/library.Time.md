# Time
*This library provides helpers for manipulating time-related objects.
It uses the following types:
- `uint48` for timepoints
- `uint32` for durations
While the library doesn't provide specific types for timepoints and duration, it does provide:
- a `Delay` type to represent duration that can be programmed to change value automatically at a given point
- additional helper functions*


## Functions
### timestamp

*Get the block timestamp as a Timepoint.*


```solidity
function timestamp() internal view returns (uint48);
```

### blockNumber

*Get the block number as a Timepoint.*


```solidity
function blockNumber() internal view returns (uint48);
```

### toDelay

*Wrap a duration into a Delay to add the one-step "update in the future" feature*


```solidity
function toDelay(uint32 duration) internal pure returns (Delay);
```

### _getFullAt

*Get the value at a given timepoint plus the pending value and effect timepoint if there is a scheduled
change after this timepoint. If the effect timepoint is 0, then the pending value should not be considered.*


```solidity
function _getFullAt(Delay self, uint48 timepoint) private pure returns (uint32, uint32, uint48);
```

### getFull

*Get the current value plus the pending value and effect timepoint if there is a scheduled change. If the
effect timepoint is 0, then the pending value should not be considered.*


```solidity
function getFull(Delay self) internal view returns (uint32, uint32, uint48);
```

### get

*Get the current value.*


```solidity
function get(Delay self) internal view returns (uint32);
```

### withUpdate

*Update a Delay object so that it takes a new duration after a timepoint that is automatically computed to
enforce the old delay at the moment of the update. Returns the updated Delay object and the timestamp when the
new delay becomes effective.*


```solidity
function withUpdate(Delay self, uint32 newValue, uint32 minSetback)
    internal
    view
    returns (Delay updatedDelay, uint48 effect);
```

### unpack

*Split a delay into its components: valueBefore, valueAfter and effect (transition timepoint).*


```solidity
function unpack(Delay self) internal pure returns (uint32 valueBefore, uint32 valueAfter, uint48 effect);
```

### pack

*pack the components into a Delay object.*


```solidity
function pack(uint32 valueBefore, uint32 valueAfter, uint48 effect) internal pure returns (Delay);
```

