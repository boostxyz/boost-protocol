# ICompoundTimelock
https://github.com/compound-finance/compound-protocol/blob/master/contracts/Timelock.sol[Compound timelock] interface


## Functions
### receive


```solidity
receive() external payable;
```

### GRACE_PERIOD


```solidity
function GRACE_PERIOD() external view returns (uint256);
```

### MINIMUM_DELAY


```solidity
function MINIMUM_DELAY() external view returns (uint256);
```

### MAXIMUM_DELAY


```solidity
function MAXIMUM_DELAY() external view returns (uint256);
```

### admin


```solidity
function admin() external view returns (address);
```

### pendingAdmin


```solidity
function pendingAdmin() external view returns (address);
```

### delay


```solidity
function delay() external view returns (uint256);
```

### queuedTransactions


```solidity
function queuedTransactions(bytes32) external view returns (bool);
```

### setDelay


```solidity
function setDelay(uint256) external;
```

### acceptAdmin


```solidity
function acceptAdmin() external;
```

### setPendingAdmin


```solidity
function setPendingAdmin(address) external;
```

### queueTransaction


```solidity
function queueTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
    external
    returns (bytes32);
```

### cancelTransaction


```solidity
function cancelTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
    external;
```

### executeTransaction


```solidity
function executeTransaction(address target, uint256 value, string memory signature, bytes memory data, uint256 eta)
    external
    payable
    returns (bytes memory);
```

## Events
### NewAdmin

```solidity
event NewAdmin(address indexed newAdmin);
```

### NewPendingAdmin

```solidity
event NewPendingAdmin(address indexed newPendingAdmin);
```

### NewDelay

```solidity
event NewDelay(uint256 indexed newDelay);
```

### CancelTransaction

```solidity
event CancelTransaction(
    bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
);
```

### ExecuteTransaction

```solidity
event ExecuteTransaction(
    bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
);
```

### QueueTransaction

```solidity
event QueueTransaction(
    bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta
);
```

