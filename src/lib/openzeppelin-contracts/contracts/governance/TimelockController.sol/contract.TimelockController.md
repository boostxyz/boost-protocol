# TimelockController
**Inherits:**
[AccessControl](/lib/openzeppelin-contracts/contracts/access/AccessControl.sol/abstract.AccessControl.md), [ERC721Holder](/lib/openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol/abstract.ERC721Holder.md), [ERC1155Holder](/lib/openzeppelin-contracts/contracts/token/ERC1155/utils/ERC1155Holder.sol/abstract.ERC1155Holder.md)

*Contract module which acts as a timelocked controller. When set as the
owner of an `Ownable` smart contract, it enforces a timelock on all
`onlyOwner` maintenance operations. This gives time for users of the
controlled contract to exit before a potentially dangerous maintenance
operation is applied.
By default, this contract is self administered, meaning administration tasks
have to go through the timelock process. The proposer (resp executor) role
is in charge of proposing (resp executing) operations. A common use case is
to position this [TimelockController](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#timelockcontroller) as the owner of a smart contract, with
a multisig or a DAO as the sole proposer.*


## State Variables
### PROPOSER_ROLE

```solidity
bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
```


### EXECUTOR_ROLE

```solidity
bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
```


### CANCELLER_ROLE

```solidity
bytes32 public constant CANCELLER_ROLE = keccak256("CANCELLER_ROLE");
```


### _DONE_TIMESTAMP

```solidity
uint256 internal constant _DONE_TIMESTAMP = uint256(1);
```


### _timestamps

```solidity
mapping(bytes32 id => uint256) private _timestamps;
```


### _minDelay

```solidity
uint256 private _minDelay;
```


## Functions
### constructor

*Initializes the contract with the following parameters:
- `minDelay`: initial minimum delay in seconds for operations
- `proposers`: accounts to be granted proposer and canceller roles
- `executors`: accounts to be granted executor role
- `admin`: optional account to be granted admin role; disable with zero address
IMPORTANT: The optional admin can aid with initial configuration of roles after deployment
without being subject to delay, but this role should be subsequently renounced in favor of
administration through timelocked proposals. Previous versions of this contract would assign
this admin to the deployer automatically and should be renounced as well.*


```solidity
constructor(uint256 minDelay, address[] memory proposers, address[] memory executors, address admin);
```

### onlyRoleOrOpenRole

*Modifier to make a function callable only by a certain role. In
addition to checking the sender's role, `address(0)` 's role is also
considered. Granting a role to `address(0)` is equivalent to enabling
this role for everyone.*


```solidity
modifier onlyRoleOrOpenRole(bytes32 role);
```

### receive

*Contract might receive/hold ETH as part of the maintenance process.*


```solidity
receive() external payable;
```

### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/lib/forge-std/src/mocks/MockERC721.sol/contract.MockERC721.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC1155Holder)
    returns (bool);
```

### isOperation

*Returns whether an id corresponds to a registered operation. This
includes both Waiting, Ready, and Done operations.*


```solidity
function isOperation(bytes32 id) public view returns (bool);
```

### isOperationPending

*Returns whether an operation is pending or not. Note that a "pending" operation may also be "ready".*


```solidity
function isOperationPending(bytes32 id) public view returns (bool);
```

### isOperationReady

*Returns whether an operation is ready for execution. Note that a "ready" operation is also "pending".*


```solidity
function isOperationReady(bytes32 id) public view returns (bool);
```

### isOperationDone

*Returns whether an operation is done or not.*


```solidity
function isOperationDone(bytes32 id) public view returns (bool);
```

### getTimestamp

*Returns the timestamp at which an operation becomes ready (0 for
unset operations, 1 for done operations).*


```solidity
function getTimestamp(bytes32 id) public view virtual returns (uint256);
```

### getOperationState

*Returns operation state.*


```solidity
function getOperationState(bytes32 id) public view virtual returns (OperationState);
```

### getMinDelay

*Returns the minimum delay in seconds for an operation to become valid.
This value can be changed by executing an operation that calls `updateDelay`.*


```solidity
function getMinDelay() public view virtual returns (uint256);
```

### hashOperation

*Returns the identifier of an operation containing a single
transaction.*


```solidity
function hashOperation(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt)
    public
    pure
    virtual
    returns (bytes32);
```

### hashOperationBatch

*Returns the identifier of an operation containing a batch of
transactions.*


```solidity
function hashOperationBatch(
    address[] calldata targets,
    uint256[] calldata values,
    bytes[] calldata payloads,
    bytes32 predecessor,
    bytes32 salt
) public pure virtual returns (bytes32);
```

### schedule

*Schedule an operation containing a single transaction.
Emits [CallSalt](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#callsalt) if salt is nonzero, and {CallScheduled}.
Requirements:
- the caller must have the 'proposer' role.*


```solidity
function schedule(address target, uint256 value, bytes calldata data, bytes32 predecessor, bytes32 salt, uint256 delay)
    public
    virtual
    onlyRole(PROPOSER_ROLE);
```

### scheduleBatch

*Schedule an operation containing a batch of transactions.
Emits [CallSalt](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#callsalt) if salt is nonzero, and one {CallScheduled} event per transaction in the batch.
Requirements:
- the caller must have the 'proposer' role.*


```solidity
function scheduleBatch(
    address[] calldata targets,
    uint256[] calldata values,
    bytes[] calldata payloads,
    bytes32 predecessor,
    bytes32 salt,
    uint256 delay
) public virtual onlyRole(PROPOSER_ROLE);
```

### _schedule

*Schedule an operation that is to become valid after a given delay.*


```solidity
function _schedule(bytes32 id, uint256 delay) private;
```

### cancel

*Cancel an operation.
Requirements:
- the caller must have the 'canceller' role.*


```solidity
function cancel(bytes32 id) public virtual onlyRole(CANCELLER_ROLE);
```

### execute

*Execute an (ready) operation containing a single transaction.
Emits a [CallExecuted](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#callexecuted) event.
Requirements:
- the caller must have the 'executor' role.*


```solidity
function execute(address target, uint256 value, bytes calldata payload, bytes32 predecessor, bytes32 salt)
    public
    payable
    virtual
    onlyRoleOrOpenRole(EXECUTOR_ROLE);
```

### executeBatch

*Execute an (ready) operation containing a batch of transactions.
Emits one [CallExecuted](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#callexecuted) event per transaction in the batch.
Requirements:
- the caller must have the 'executor' role.*


```solidity
function executeBatch(
    address[] calldata targets,
    uint256[] calldata values,
    bytes[] calldata payloads,
    bytes32 predecessor,
    bytes32 salt
) public payable virtual onlyRoleOrOpenRole(EXECUTOR_ROLE);
```

### _execute

*Execute an operation's call.*


```solidity
function _execute(address target, uint256 value, bytes calldata data) internal virtual;
```

### _beforeCall

*Checks before execution of an operation's calls.*


```solidity
function _beforeCall(bytes32 id, bytes32 predecessor) private view;
```

### _afterCall

*Checks after execution of an operation's calls.*


```solidity
function _afterCall(bytes32 id) private;
```

### updateDelay

*Changes the minimum timelock duration for future operations.
Emits a [MinDelayChange](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#mindelaychange) event.
Requirements:
- the caller must be the timelock itself. This can only be achieved by scheduling and later executing
an operation where the timelock is the target and the data is the ABI-encoded call to this function.*


```solidity
function updateDelay(uint256 newDelay) external virtual;
```

### _encodeStateBitmap

*Encodes a `OperationState` into a `bytes32` representation where each bit enabled corresponds to
the underlying position in the `OperationState` enum. For example:
0x000...1000
^^^^^^----- ...
^---- Done
^--- Ready
^-- Waiting
^- Unset*


```solidity
function _encodeStateBitmap(OperationState operationState) internal pure returns (bytes32);
```

## Events
### CallScheduled
*Emitted when a call is scheduled as part of operation `id`.*


```solidity
event CallScheduled(
    bytes32 indexed id,
    uint256 indexed index,
    address target,
    uint256 value,
    bytes data,
    bytes32 predecessor,
    uint256 delay
);
```

### CallExecuted
*Emitted when a call is performed as part of operation `id`.*


```solidity
event CallExecuted(bytes32 indexed id, uint256 indexed index, address target, uint256 value, bytes data);
```

### CallSalt
*Emitted when new proposal is scheduled with non-zero salt.*


```solidity
event CallSalt(bytes32 indexed id, bytes32 salt);
```

### Cancelled
*Emitted when operation `id` is cancelled.*


```solidity
event Cancelled(bytes32 indexed id);
```

### MinDelayChange
*Emitted when the minimum delay for future operations is modified.*


```solidity
event MinDelayChange(uint256 oldDuration, uint256 newDuration);
```

## Errors
### TimelockInvalidOperationLength
*Mismatch between the parameters length for an operation call.*


```solidity
error TimelockInvalidOperationLength(uint256 targets, uint256 payloads, uint256 values);
```

### TimelockInsufficientDelay
*The schedule operation doesn't meet the minimum delay.*


```solidity
error TimelockInsufficientDelay(uint256 delay, uint256 minDelay);
```

### TimelockUnexpectedOperationState
*The current state of an operation is not as required.
The `expectedStates` is a bitmap with the bits enabled for each OperationState enum position
counting from right to left.
See [_encodeStateBitmap](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#_encodestatebitmap).*


```solidity
error TimelockUnexpectedOperationState(bytes32 operationId, bytes32 expectedStates);
```

### TimelockUnexecutedPredecessor
*The predecessor to an operation not yet done.*


```solidity
error TimelockUnexecutedPredecessor(bytes32 predecessorId);
```

### TimelockUnauthorizedCaller
*The caller account is not authorized.*


```solidity
error TimelockUnauthorizedCaller(address caller);
```

## Enums
### OperationState

```solidity
enum OperationState {
    Unset,
    Waiting,
    Ready,
    Done
}
```

