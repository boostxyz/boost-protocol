# ERC721ReceiverMock
**Inherits:**
[IERC721Receiver](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol/interface.IERC721Receiver.md)


## State Variables
### _retval

```solidity
bytes4 private immutable _retval;
```


### _error

```solidity
RevertType private immutable _error;
```


## Functions
### constructor


```solidity
constructor(bytes4 retval, RevertType error);
```

### onERC721Received


```solidity
function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4);
```

## Events
### Received

```solidity
event Received(address operator, address from, uint256 tokenId, bytes data, uint256 gas);
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

