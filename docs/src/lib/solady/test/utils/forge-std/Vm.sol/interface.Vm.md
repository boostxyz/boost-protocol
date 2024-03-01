# Vm
**Inherits:**
[VmSafe](/lib/forge-std/src/Vm.sol/interface.VmSafe.md)


## Functions
### warp


```solidity
function warp(uint256 newTimestamp) external;
```

### roll


```solidity
function roll(uint256 newHeight) external;
```

### fee


```solidity
function fee(uint256 newBasefee) external;
```

### difficulty


```solidity
function difficulty(uint256 newDifficulty) external;
```

### chainId


```solidity
function chainId(uint256 newChainId) external;
```

### store


```solidity
function store(address target, bytes32 slot, bytes32 value) external;
```

### setNonce


```solidity
function setNonce(address account, uint64 newNonce) external;
```

### prank


```solidity
function prank(address msgSender) external;
```

### startPrank


```solidity
function startPrank(address msgSender) external;
```

### prank


```solidity
function prank(address msgSender, address txOrigin) external;
```

### startPrank


```solidity
function startPrank(address msgSender, address txOrigin) external;
```

### stopPrank


```solidity
function stopPrank() external;
```

### deal


```solidity
function deal(address account, uint256 newBalance) external;
```

### etch


```solidity
function etch(address target, bytes calldata newRuntimeBytecode) external;
```

### expectRevert


```solidity
function expectRevert(bytes calldata revertData) external;
```

### expectRevert


```solidity
function expectRevert(bytes4 revertData) external;
```

### expectRevert


```solidity
function expectRevert() external;
```

### expectEmit


```solidity
function expectEmit() external;
```

### expectEmit


```solidity
function expectEmit(address) external;
```

### expectEmit


```solidity
function expectEmit(bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData) external;
```

### expectEmit


```solidity
function expectEmit(bool checkTopic1, bool checkTopic2, bool checkTopic3, bool checkData, address emitter) external;
```

### mockCall


```solidity
function mockCall(address callee, bytes calldata data, bytes calldata returnData) external;
```

### mockCall


```solidity
function mockCall(address callee, uint256 msgValue, bytes calldata data, bytes calldata returnData) external;
```

### clearMockedCalls


```solidity
function clearMockedCalls() external;
```

### expectCall


```solidity
function expectCall(address callee, bytes calldata data) external;
```

### expectCall


```solidity
function expectCall(address callee, uint256 msgValue, bytes calldata data) external;
```

### expectCall


```solidity
function expectCall(address callee, uint256 msgValue, uint64 gas, bytes calldata data) external;
```

### expectCallMinGas


```solidity
function expectCallMinGas(address callee, uint256 msgValue, uint64 minGas, bytes calldata data) external;
```

### coinbase


```solidity
function coinbase(address newCoinbase) external;
```

### snapshot


```solidity
function snapshot() external returns (uint256 snapshotId);
```

### revertTo


```solidity
function revertTo(uint256 snapshotId) external returns (bool success);
```

### createFork


```solidity
function createFork(string calldata urlOrAlias, uint256 blockNumber) external returns (uint256 forkId);
```

### createFork


```solidity
function createFork(string calldata urlOrAlias) external returns (uint256 forkId);
```

### createFork


```solidity
function createFork(string calldata urlOrAlias, bytes32 txHash) external returns (uint256 forkId);
```

### createSelectFork


```solidity
function createSelectFork(string calldata urlOrAlias, uint256 blockNumber) external returns (uint256 forkId);
```

### createSelectFork


```solidity
function createSelectFork(string calldata urlOrAlias, bytes32 txHash) external returns (uint256 forkId);
```

### createSelectFork


```solidity
function createSelectFork(string calldata urlOrAlias) external returns (uint256 forkId);
```

### selectFork


```solidity
function selectFork(uint256 forkId) external;
```

### activeFork

Returns the identifier of the currently active fork. Reverts if no fork is currently active.


```solidity
function activeFork() external view returns (uint256 forkId);
```

### rollFork


```solidity
function rollFork(uint256 blockNumber) external;
```

### rollFork


```solidity
function rollFork(bytes32 txHash) external;
```

### rollFork


```solidity
function rollFork(uint256 forkId, uint256 blockNumber) external;
```

### rollFork


```solidity
function rollFork(uint256 forkId, bytes32 txHash) external;
```

### makePersistent


```solidity
function makePersistent(address account) external;
```

### makePersistent


```solidity
function makePersistent(address account0, address account1) external;
```

### makePersistent


```solidity
function makePersistent(address account0, address account1, address account2) external;
```

### makePersistent


```solidity
function makePersistent(address[] calldata accounts) external;
```

### revokePersistent


```solidity
function revokePersistent(address account) external;
```

### revokePersistent


```solidity
function revokePersistent(address[] calldata accounts) external;
```

### isPersistent


```solidity
function isPersistent(address account) external view returns (bool persistent);
```

### allowCheatcodes


```solidity
function allowCheatcodes(address account) external;
```

### transact


```solidity
function transact(bytes32 txHash) external;
```

### transact


```solidity
function transact(uint256 forkId, bytes32 txHash) external;
```

