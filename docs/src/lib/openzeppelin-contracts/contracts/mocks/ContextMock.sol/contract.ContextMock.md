# ContextMock
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md)


## Functions
### msgSender


```solidity
function msgSender() public;
```

### msgData


```solidity
function msgData(uint256 integerValue, string memory stringValue) public;
```

### msgDataShort


```solidity
function msgDataShort() public;
```

## Events
### Sender

```solidity
event Sender(address sender);
```

### Data

```solidity
event Data(bytes data, uint256 integerValue, string stringValue);
```

### DataShort

```solidity
event DataShort(bytes data);
```

