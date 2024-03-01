# ReentrancyGuard
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/ReentrancyGuard.sol)

Reentrancy guard mixin.


## State Variables
### _REENTRANCY_GUARD_SLOT
*Equivalent to: `uint72(bytes9(keccak256("_REENTRANCY_GUARD_SLOT")))`.
9 bytes is large enough to avoid collisions with lower slots,
but not too large to result in excessive bytecode bloat.*


```solidity
uint256 private constant _REENTRANCY_GUARD_SLOT = 0x929eee149b4bd21268;
```


## Functions
### nonReentrant

*Guards a function from reentrancy.*


```solidity
modifier nonReentrant() virtual;
```

### nonReadReentrant

*Guards a view function from read-only reentrancy.*


```solidity
modifier nonReadReentrant() virtual;
```

## Errors
### Reentrancy
*Unauthorized reentrant call.*


```solidity
error Reentrancy();
```

