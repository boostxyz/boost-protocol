# ReentrancyMock
**Inherits:**
[ReentrancyGuard](/lib/solady/src/utils/ReentrancyGuard.sol/abstract.ReentrancyGuard.md)


## State Variables
### counter

```solidity
uint256 public counter;
```


## Functions
### constructor


```solidity
constructor();
```

### callback


```solidity
function callback() external nonReentrant;
```

### countLocalRecursive


```solidity
function countLocalRecursive(uint256 n) public nonReentrant;
```

### countThisRecursive


```solidity
function countThisRecursive(uint256 n) public nonReentrant;
```

### countAndCall


```solidity
function countAndCall(ReentrancyAttack attacker) public nonReentrant;
```

### _count


```solidity
function _count() private;
```

### guardedCheckEntered


```solidity
function guardedCheckEntered() public nonReentrant;
```

### unguardedCheckNotEntered


```solidity
function unguardedCheckNotEntered() public view;
```

