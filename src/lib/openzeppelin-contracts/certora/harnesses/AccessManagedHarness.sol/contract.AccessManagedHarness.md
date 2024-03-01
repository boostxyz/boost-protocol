# AccessManagedHarness
**Inherits:**
[AccessManaged](/lib/openzeppelin-contracts/contracts/access/manager/AccessManaged.sol/abstract.AccessManaged.md)


## State Variables
### SOME_FUNCTION_CALLDATA

```solidity
bytes internal SOME_FUNCTION_CALLDATA = abi.encodeCall(this.someFunction, ());
```


## Functions
### constructor


```solidity
constructor(address initialAuthority) AccessManaged(initialAuthority);
```

### someFunction


```solidity
function someFunction() public restricted;
```

### authority_canCall_immediate


```solidity
function authority_canCall_immediate(address caller) public view returns (bool result);
```

### authority_canCall_delay


```solidity
function authority_canCall_delay(address caller) public view returns (uint32 result);
```

### authority_getSchedule


```solidity
function authority_getSchedule(address caller) public view returns (uint48);
```

