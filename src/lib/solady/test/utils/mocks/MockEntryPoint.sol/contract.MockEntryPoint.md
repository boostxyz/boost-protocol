# MockEntryPoint
*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### balanceOf

```solidity
mapping(address => uint256) public balanceOf;
```


## Functions
### depositTo


```solidity
function depositTo(address to) public payable;
```

### withdrawTo


```solidity
function withdrawTo(address to, uint256 amount) public payable;
```

### validateUserOp


```solidity
function validateUserOp(
    address account,
    ERC4337.UserOperation memory userOp,
    bytes32 userOpHash,
    uint256 missingAccountFunds
) public payable returns (uint256 validationData);
```

### receive


```solidity
receive() external payable;
```

