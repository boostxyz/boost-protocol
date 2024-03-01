# CallReceiverMockTrustingForwarder
**Inherits:**
[CallReceiverMock](/lib/openzeppelin-contracts/contracts/mocks/CallReceiverMock.sol/contract.CallReceiverMock.md)


## State Variables
### _trustedForwarder

```solidity
address private _trustedForwarder;
```


## Functions
### constructor


```solidity
constructor(address trustedForwarder_);
```

### isTrustedForwarder


```solidity
function isTrustedForwarder(address forwarder) public view virtual returns (bool);
```

