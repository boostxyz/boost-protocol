# ERC1363ReceiverMock
**Inherits:**
[IERC1363Receiver](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Receiver.sol/interface.IERC1363Receiver.md)


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

### onTransferReceived


```solidity
function onTransferReceived(address operator, address from, uint256 value, bytes calldata data)
    external
    override
    returns (bytes4);
```

## Events
### Received

```solidity
event Received(address operator, address from, uint256 value, bytes data);
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

