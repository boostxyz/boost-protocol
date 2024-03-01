# Target

## State Variables
### datahash

```solidity
bytes32 public datahash;
```


### data

```solidity
bytes public data;
```


## Functions
### setData


```solidity
function setData(bytes memory data_) public payable returns (bytes memory);
```

### revertWithTargetError


```solidity
function revertWithTargetError(bytes memory data_) public payable;
```

## Errors
### TargetError

```solidity
error TargetError(bytes data);
```

