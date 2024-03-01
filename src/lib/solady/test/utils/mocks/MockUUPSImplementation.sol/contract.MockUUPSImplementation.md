# MockUUPSImplementation
**Inherits:**
[UUPSUpgradeable](/lib/solady/src/utils/UUPSUpgradeable.sol/abstract.UUPSUpgradeable.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### value

```solidity
uint256 public value;
```


### owner

```solidity
address owner;
```


## Functions
### initialize


```solidity
function initialize(address owner_) public;
```

### onlyOwner


```solidity
modifier onlyOwner();
```

### _authorizeUpgrade


```solidity
function _authorizeUpgrade(address) internal override onlyOwner;
```

### revertWithError


```solidity
function revertWithError() public view;
```

### setValue


```solidity
function setValue(uint256 val_) public;
```

### upgradeToAndCall


```solidity
function upgradeToAndCall(address newImplementation, bytes calldata data) public payable override;
```

### _brutalized


```solidity
function _brutalized(address a) private pure returns (address result);
```

## Errors
### Unauthorized

```solidity
error Unauthorized();
```

### CustomError

```solidity
error CustomError(address owner_);
```

