# DummyImplementation

## State Variables
### value

```solidity
uint256 public value;
```


### text

```solidity
string public text;
```


### values

```solidity
uint256[] public values;
```


## Functions
### initializeNonPayable


```solidity
function initializeNonPayable() public;
```

### initializePayable


```solidity
function initializePayable() public payable;
```

### initializeNonPayableWithValue


```solidity
function initializeNonPayableWithValue(uint256 _value) public;
```

### initializePayableWithValue


```solidity
function initializePayableWithValue(uint256 _value) public payable;
```

### initialize


```solidity
function initialize(uint256 _value, string memory _text, uint256[] memory _values) public;
```

### get


```solidity
function get() public pure returns (bool);
```

### version


```solidity
function version() public pure virtual returns (string memory);
```

### reverts


```solidity
function reverts() public pure;
```

### unsafeOverrideAdmin


```solidity
function unsafeOverrideAdmin(address newAdmin) public;
```

