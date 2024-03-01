# ReentrancyGuardTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### target

```solidity
MockReentrancyGuard immutable target = new MockReentrancyGuard();
```


### reentrancyAttack

```solidity
ReentrancyAttack immutable reentrancyAttack = new ReentrancyAttack();
```


## Functions
### expectBeforeAfterReentrancyGuardUnlocked


```solidity
modifier expectBeforeAfterReentrancyGuardUnlocked();
```

### testRevertGuardLocked


```solidity
function testRevertGuardLocked() external expectBeforeAfterReentrancyGuardUnlocked;
```

### testRevertReadGuardLocked


```solidity
function testRevertReadGuardLocked() external expectBeforeAfterReentrancyGuardUnlocked;
```

### testRevertRemoteCallback


```solidity
function testRevertRemoteCallback() external expectBeforeAfterReentrancyGuardUnlocked;
```

### testRecursiveDirectUnguardedCall


```solidity
function testRecursiveDirectUnguardedCall() external expectBeforeAfterReentrancyGuardUnlocked;
```

### testRevertRecursiveDirectGuardedCall


```solidity
function testRevertRecursiveDirectGuardedCall() external expectBeforeAfterReentrancyGuardUnlocked;
```

### testRecursiveIndirectUnguardedCall


```solidity
function testRecursiveIndirectUnguardedCall() external expectBeforeAfterReentrancyGuardUnlocked;
```

### testRevertRecursiveIndirectGuardedCall


```solidity
function testRevertRecursiveIndirectGuardedCall() external expectBeforeAfterReentrancyGuardUnlocked;
```

