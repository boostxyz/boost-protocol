# MockCd
*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### dataHash

```solidity
bytes32 public dataHash;
```


### numbersHash

```solidity
bytes32 public numbersHash;
```


### lastCallvalue

```solidity
uint256 public lastCallvalue;
```


### lastCaller

```solidity
address public lastCaller;
```


## Functions
### storeDataHash


```solidity
function storeDataHash(bytes calldata data, bool success) external payable returns (bytes32 result);
```

### storeNumbersHash


```solidity
function storeNumbersHash(uint256[] calldata numbers, bool success) external payable returns (bytes32 result);
```

### receive


```solidity
receive() external payable;
```

### fallback


```solidity
fallback() external payable;
```

## Errors
### Hash

```solidity
error Hash(bytes32 h);
```

