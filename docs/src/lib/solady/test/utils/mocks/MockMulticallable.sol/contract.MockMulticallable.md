# MockMulticallable
**Inherits:**
[Multicallable](/lib/solady/src/utils/Multicallable.sol/abstract.Multicallable.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### paid

```solidity
uint256 public paid;
```


## Functions
### revertsWithString


```solidity
function revertsWithString(string memory e) external pure;
```

### revertsWithCustomError


```solidity
function revertsWithCustomError() external pure;
```

### revertsWithNothing


```solidity
function revertsWithNothing() external pure;
```

### returnsTuple


```solidity
function returnsTuple(uint256 a, uint256 b) external pure returns (Tuple memory tuple);
```

### returnsString


```solidity
function returnsString(string calldata s) external pure returns (string memory);
```

### pay


```solidity
function pay() external payable;
```

### returnsSender


```solidity
function returnsSender() external view returns (address);
```

### multicallOriginal


```solidity
function multicallOriginal(bytes[] calldata data) public payable returns (bytes[] memory results);
```

## Errors
### CustomError

```solidity
error CustomError();
```

## Structs
### Tuple

```solidity
struct Tuple {
    uint256 a;
    uint256 b;
}
```

