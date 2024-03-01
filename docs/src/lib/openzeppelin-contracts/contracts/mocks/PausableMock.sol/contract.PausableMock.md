# PausableMock
**Inherits:**
[Pausable](/lib/openzeppelin-contracts/contracts/utils/Pausable.sol/abstract.Pausable.md)


## State Variables
### drasticMeasureTaken

```solidity
bool public drasticMeasureTaken;
```


### count

```solidity
uint256 public count;
```


## Functions
### constructor


```solidity
constructor();
```

### normalProcess


```solidity
function normalProcess() external whenNotPaused;
```

### drasticMeasure


```solidity
function drasticMeasure() external whenPaused;
```

### pause


```solidity
function pause() external;
```

### unpause


```solidity
function unpause() external;
```

