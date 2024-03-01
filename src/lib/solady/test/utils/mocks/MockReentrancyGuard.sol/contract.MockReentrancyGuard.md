# MockReentrancyGuard
**Inherits:**
[ReentrancyGuard](/lib/solady/src/utils/ReentrancyGuard.sol/abstract.ReentrancyGuard.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### _REENTRANCY_GUARD_SLOT
*SEE: `ReentrancyGuard`.*


```solidity
uint256 public constant _REENTRANCY_GUARD_SLOT = 0x929eee149b4bd21268;
```


### enterTimes

```solidity
uint256 public enterTimes;
```


## Functions
### isReentrancyGuardLocked


```solidity
function isReentrancyGuardLocked() public view returns (bool locked);
```

### callUnguardedToGuarded


```solidity
function callUnguardedToGuarded() public;
```

### callUnguardedToUnguarded


```solidity
function callUnguardedToUnguarded() public;
```

### callGuardedToGuarded


```solidity
function callGuardedToGuarded() public nonReentrant;
```

### callGuardedToUnguarded


```solidity
function callGuardedToUnguarded() public nonReentrant;
```

### callGuardedToReadGuarded


```solidity
function callGuardedToReadGuarded() public nonReentrant;
```

### callUnguardedToReadGuarded


```solidity
function callUnguardedToReadGuarded() public;
```

### callbackTargetUnguarded

*Callback target without a reentrancy guard.*


```solidity
function callbackTargetUnguarded() public;
```

### callbackTargetGuarded

*Callback target with a reentrancy guard.*


```solidity
function callbackTargetGuarded() public nonReentrant;
```

### readCallbackTargetGuarded

*Callback target with a non-read reentrancy guard.*


```solidity
function readCallbackTargetGuarded() public nonReadReentrant;
```

### countUnguardedDirectRecursive


```solidity
function countUnguardedDirectRecursive(uint256 recursion) public;
```

### countGuardedDirectRecursive


```solidity
function countGuardedDirectRecursive(uint256 recursion) public nonReentrant;
```

### countUnguardedIndirectRecursive


```solidity
function countUnguardedIndirectRecursive(uint256 recursion) public;
```

### countGuardedIndirectRecursive


```solidity
function countGuardedIndirectRecursive(uint256 recursion) public nonReentrant;
```

### countAndCall


```solidity
function countAndCall(ReentrancyAttack attacker) public nonReentrant;
```

### _recurseDirect


```solidity
function _recurseDirect(bool guarded, uint256 recursion) private;
```

### _recurseIndirect


```solidity
function _recurseIndirect(bool guarded, uint256 recursion) private;
```

