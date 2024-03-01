# ERC1363SpenderMock
**Inherits:**
[IERC1363Spender](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Spender.sol/interface.IERC1363Spender.md)


## State Variables
### _retval

```solidity
bytes4 private _retval;
```


### _error

```solidity
RevertType private _error;
```


## Functions
### constructor


```solidity
constructor();
```

### setUp


```solidity
function setUp(bytes4 retval, RevertType error) public;
```

### onApprovalReceived


```solidity
function onApprovalReceived(address owner, uint256 value, bytes calldata data) external override returns (bytes4);
```

## Events
### Approved

```solidity
event Approved(address owner, uint256 value, bytes data);
```

## Errors
### CustomError

```solidity
error CustomError(bytes4);
```

## Enums
### RevertType

```solidity
enum RevertType {
    None,
    RevertWithoutMessage,
    RevertWithMessage,
    RevertWithCustomError,
    Panic
}
```

