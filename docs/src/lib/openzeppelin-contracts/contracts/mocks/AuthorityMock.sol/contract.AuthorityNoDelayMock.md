# AuthorityNoDelayMock
**Inherits:**
[IAuthority](/lib/openzeppelin-contracts/contracts/access/manager/IAuthority.sol/interface.IAuthority.md)


## State Variables
### _immediate

```solidity
bool _immediate;
```


## Functions
### canCall


```solidity
function canCall(address, address, bytes4) external view returns (bool immediate);
```

### _setImmediate


```solidity
function _setImmediate(bool immediate) external;
```

