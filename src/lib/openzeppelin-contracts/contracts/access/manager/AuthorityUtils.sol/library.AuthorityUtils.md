# AuthorityUtils

## Functions
### canCallWithDelay

*Since `AccessManager` implements an extended IAuthority interface, invoking `canCall` with backwards compatibility
for the preexisting `IAuthority` interface requires special care to avoid reverting on insufficient return data.
This helper function takes care of invoking `canCall` in a backwards compatible way without reverting.*


```solidity
function canCallWithDelay(address authority, address caller, address target, bytes4 selector)
    internal
    view
    returns (bool immediate, uint32 delay);
```

