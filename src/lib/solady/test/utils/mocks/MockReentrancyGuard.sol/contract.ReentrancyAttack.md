# ReentrancyAttack
*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### callSender

*Call the msg.sender with the given data to perform a reentrancy attack.*


```solidity
function callSender(bytes4 data) external;
```

## Errors
### ReentrancyAttackFailed
*Reverts on a failed reentrancy attack.*


```solidity
error ReentrancyAttackFailed();
```

