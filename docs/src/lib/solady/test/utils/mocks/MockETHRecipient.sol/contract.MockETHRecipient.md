# MockETHRecipient
*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### gasGriefUponReceiveETH

```solidity
bool public immutable gasGriefUponReceiveETH;
```


### updateCounterUponReceiveETH

```solidity
bool public immutable updateCounterUponReceiveETH;
```


### counter

```solidity
uint256 public counter;
```


### garbage

```solidity
uint256 public garbage;
```


## Functions
### constructor


```solidity
constructor(bool updateCounterUponReceiveETH_, bool gasGriefUponReceiveETH_);
```

### receive


```solidity
receive() external payable;
```

