# ERC3156FlashBorrowerMock
**Inherits:**
[IERC3156FlashBorrower](/lib/openzeppelin-contracts/contracts/interfaces/IERC3156FlashBorrower.sol/interface.IERC3156FlashBorrower.md)

*WARNING: this IERC3156FlashBorrower mock implementation is for testing purposes ONLY.
Writing a secure flash lock borrower is not an easy task, and should be done with the utmost care.
This is not an example of how it should be done, and no pattern present in this mock should be considered secure.
Following best practices, always have your contract properly audited before using them to manipulate important funds on
live networks.*


## State Variables
### _RETURN_VALUE

```solidity
bytes32 internal constant _RETURN_VALUE = keccak256("ERC3156FlashBorrower.onFlashLoan");
```


### _enableApprove

```solidity
bool immutable _enableApprove;
```


### _enableReturn

```solidity
bool immutable _enableReturn;
```


## Functions
### constructor


```solidity
constructor(bool enableReturn, bool enableApprove);
```

### onFlashLoan


```solidity
function onFlashLoan(address, address token, uint256 amount, uint256 fee, bytes calldata data)
    public
    returns (bytes32);
```

## Events
### BalanceOf

```solidity
event BalanceOf(address token, address account, uint256 value);
```

### TotalSupply

```solidity
event TotalSupply(address token, uint256 value);
```

