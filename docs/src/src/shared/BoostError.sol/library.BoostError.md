# BoostError
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/shared/BoostError.sol)

Standardized errors for the Boost protocol

*Some of these errors are introduced by third-party libraries, rather than Boost contracts directly, and are copied here for clarity and ease of testing.*


## Errors
### InsufficientFunds
Thrown when there are insufficient funds for an operation


```solidity
error InsufficientFunds(address asset, uint256 available, uint256 required);
```

### InvalidInitialization
Thrown when an invalid initialization is attempted


```solidity
error InvalidInitialization();
```

### LengthMismatch
Thrown when the length of two arrays are not equal


```solidity
error LengthMismatch();
```

### NotImplemented
Thrown when a method is not implemented


```solidity
error NotImplemented();
```

### Replayed
Thrown when a previously used signature is replayed


```solidity
error Replayed(address signer, bytes32 hash, bytes signature);
```

### TransferFailed
Thrown when a transfer fails for an unknown reason


```solidity
error TransferFailed(address asset, address to, uint256 amount);
```

### Unauthorized
Thrown when the requested action is unauthorized


```solidity
error Unauthorized();
```

