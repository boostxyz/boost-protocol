# ERC1155ReceiverMock
**Inherits:**
[ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md), [IERC1155Receiver](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol/interface.IERC1155Receiver.md)


## State Variables
### _recRetval

```solidity
bytes4 private immutable _recRetval;
```


### _batRetval

```solidity
bytes4 private immutable _batRetval;
```


### _error

```solidity
RevertType private immutable _error;
```


## Functions
### constructor


```solidity
constructor(bytes4 recRetval, bytes4 batRetval, RevertType error);
```

### onERC1155Received


```solidity
function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes calldata data)
    external
    returns (bytes4);
```

### onERC1155BatchReceived


```solidity
function onERC1155BatchReceived(
    address operator,
    address from,
    uint256[] calldata ids,
    uint256[] calldata values,
    bytes calldata data
) external returns (bytes4);
```

## Events
### Received

```solidity
event Received(address operator, address from, uint256 id, uint256 value, bytes data, uint256 gas);
```

### BatchReceived

```solidity
event BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data, uint256 gas);
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

