# IAuthority
*Standard interface for permissioning originally defined in Dappsys.*


## Functions
### canCall

*Returns true if the caller can invoke on a target the function identified by a function selector.*


```solidity
function canCall(address caller, address target, bytes4 selector) external view returns (bool allowed);
```

