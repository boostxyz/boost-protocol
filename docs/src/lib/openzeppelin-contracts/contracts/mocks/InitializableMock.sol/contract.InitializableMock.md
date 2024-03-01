# InitializableMock
**Inherits:**
[Initializable](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md)

*This contract is a mock to test initializable functionality*


## State Variables
### initializerRan

```solidity
bool public initializerRan;
```


### onlyInitializingRan

```solidity
bool public onlyInitializingRan;
```


### x

```solidity
uint256 public x;
```


## Functions
### isInitializing


```solidity
function isInitializing() public view returns (bool);
```

### initialize


```solidity
function initialize() public initializer;
```

### initializeOnlyInitializing


```solidity
function initializeOnlyInitializing() public onlyInitializing;
```

### initializerNested


```solidity
function initializerNested() public initializer;
```

### onlyInitializingNested


```solidity
function onlyInitializingNested() public initializer;
```

### initializeWithX


```solidity
function initializeWithX(uint256 _x) public payable initializer;
```

### nonInitializable


```solidity
function nonInitializable(uint256 _x) public payable;
```

### fail


```solidity
function fail() public pure;
```

