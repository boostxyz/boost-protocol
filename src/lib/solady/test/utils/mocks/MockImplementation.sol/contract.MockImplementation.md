# MockImplementation
*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### _values

```solidity
mapping(uint256 => uint256) internal _values;
```


## Functions
### fails


```solidity
function fails() external pure;
```

### succeeds


```solidity
function succeeds(uint256 a) external pure returns (uint256);
```

### setValue


```solidity
function setValue(uint256 key, uint256 value) external payable;
```

### getValue


```solidity
function getValue(uint256 key) external view returns (uint256);
```

## Errors
### Fail

```solidity
error Fail();
```

