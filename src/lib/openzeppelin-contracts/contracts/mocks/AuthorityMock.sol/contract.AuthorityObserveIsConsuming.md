# AuthorityObserveIsConsuming

## Functions
### canCall


```solidity
function canCall(address, address, bytes4) external pure returns (bool immediate, uint32 delay);
```

### consumeScheduledOp


```solidity
function consumeScheduledOp(address caller, bytes memory data) public;
```

## Events
### ConsumeScheduledOpCalled

```solidity
event ConsumeScheduledOpCalled(address caller, bytes data, bytes4 isConsuming);
```

