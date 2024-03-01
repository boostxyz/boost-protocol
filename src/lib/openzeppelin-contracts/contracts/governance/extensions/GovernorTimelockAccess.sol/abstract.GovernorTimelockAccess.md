# GovernorTimelockAccess
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*This module connects a {Governor} instance to an {AccessManager} instance, allowing the governor to make calls
that are delay-restricted by the manager using the normal {queue} workflow. An optional base delay is applied to
operations that are not delayed externally by the manager. Execution of a proposal will be delayed as much as
necessary to meet the required delays of all of its operations.
This extension allows the governor to hold and use its own assets and permissions, unlike {GovernorTimelockControl}
and {GovernorTimelockCompound}, where the timelock is a separate contract that must be the one to hold assets and
permissions. Operations that are delay-restricted by the manager, however, will be executed through the
{AccessManager-execute} function.
==== Security Considerations
Some operations may be cancelable in the `AccessManager` by the admin or a set of guardians, depending on the
restricted function being invoked. Since proposals are atomic, the cancellation by a guardian of a single operation
in a proposal will cause all of the proposal to become unable to execute. Consider proposing cancellable operations
separately.
By default, function calls will be routed through the associated `AccessManager` whenever it claims the target
function to be restricted by it. However, admins may configure the manager to make that claim for functions that a
governor would want to call directly (e.g., token transfers) in an attempt to deny it access to those functions. To
mitigate this attack vector, the governor is able to ignore the restrictions claimed by the `AccessManager` using
{setAccessManagerIgnored}. While permanent denial of service is mitigated, temporary DoS may still be technically
possible. All of the governor's own functions (e.g., {setBaseDelaySeconds}) ignore the `AccessManager` by default.
NOTE: `AccessManager` does not support scheduling more than one operation with the same target and calldata at
the same time. See {AccessManager-schedule} for a workaround.*


## State Variables
### _ignoreToggle

```solidity
mapping(address target => mapping(bytes4 selector => bool)) private _ignoreToggle;
```


### _executionPlan

```solidity
mapping(uint256 proposalId => ExecutionPlan) private _executionPlan;
```


### _baseDelay

```solidity
uint32 private _baseDelay;
```


### _manager

```solidity
IAccessManager private immutable _manager;
```


## Functions
### constructor

*Initialize the governor with an {AccessManager} and initial base delay.*


```solidity
constructor(address manager, uint32 initialBaseDelay);
```

### accessManager

*Returns the {AccessManager} instance associated to this governor.*


```solidity
function accessManager() public view virtual returns (IAccessManager);
```

### baseDelaySeconds

*Base delay that will be applied to all function calls. Some may be further delayed by their associated
`AccessManager` authority; in this case the final delay will be the maximum of the base delay and the one
demanded by the authority.
NOTE: Execution delays are processed by the `AccessManager` contracts, and according to that contract are
expressed in seconds. Therefore, the base delay is also in seconds, regardless of the governor's clock mode.*


```solidity
function baseDelaySeconds() public view virtual returns (uint32);
```

### setBaseDelaySeconds

*Change the value of [baseDelaySeconds](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md#basedelayseconds). This operation can only be invoked through a governance proposal.*


```solidity
function setBaseDelaySeconds(uint32 newBaseDelay) public virtual onlyGovernance;
```

### _setBaseDelaySeconds

*Change the value of [baseDelaySeconds](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md#basedelayseconds). Internal function without access control.*


```solidity
function _setBaseDelaySeconds(uint32 newBaseDelay) internal virtual;
```

### isAccessManagerIgnored

*Check if restrictions from the associated {AccessManager} are ignored for a target function. Returns true
when the target function will be invoked directly regardless of `AccessManager` settings for the function.
See {setAccessManagerIgnored} and Security Considerations above.*


```solidity
function isAccessManagerIgnored(address target, bytes4 selector) public view virtual returns (bool);
```

### setAccessManagerIgnored

*Configure whether restrictions from the associated {AccessManager} are ignored for a target function.
See Security Considerations above.*


```solidity
function setAccessManagerIgnored(address target, bytes4[] calldata selectors, bool ignored)
    public
    virtual
    onlyGovernance;
```

### _setAccessManagerIgnored

*Internal version of [setAccessManagerIgnored](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md#setaccessmanagerignored) without access restriction.*


```solidity
function _setAccessManagerIgnored(address target, bytes4 selector, bool ignored) internal virtual;
```

### proposalExecutionPlan

*Public accessor to check the execution plan, including the number of seconds that the proposal will be
delayed since queuing, an array indicating which of the proposal actions will be executed indirectly through
the associated {AccessManager}, and another indicating which will be scheduled in {queue}. Note that
those that must be scheduled are cancellable by `AccessManager` guardians.*


```solidity
function proposalExecutionPlan(uint256 proposalId)
    public
    view
    returns (uint32 delay, bool[] memory indirect, bool[] memory withDelay);
```

### proposalNeedsQueuing

*See [IGovernor-proposalNeedsQueuing](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockCompound.sol/abstract.GovernorTimelockCompound.md#proposalneedsqueuing).*


```solidity
function proposalNeedsQueuing(uint256 proposalId) public view virtual override returns (bool);
```

### propose

*See [IGovernor-propose](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#propose)*


```solidity
function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
    public
    virtual
    override
    returns (uint256);
```

### _queueOperations

*Mechanism to queue a proposal, potentially scheduling some of its operations in the AccessManager.
NOTE: The execution delay is chosen based on the delay information retrieved in [propose](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md#propose). This value may be
off if the delay was updated since proposal creation. In this case, the proposal needs to be recreated.*


```solidity
function _queueOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory,
    bytes[] memory calldatas,
    bytes32
) internal virtual override returns (uint48);
```

### _executeOperations

*Mechanism to execute a proposal, potentially going through [AccessManager-execute](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorStorage.sol/abstract.GovernorStorage.md#execute) for delayed operations.*


```solidity
function _executeOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32
) internal virtual override;
```

### _cancel

*See [IGovernor-_cancel](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockCompound.sol/abstract.GovernorTimelockCompound.md#_cancel)*


```solidity
function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    virtual
    override
    returns (uint256);
```

### _getManagerData

*Returns whether the operation at an index is delayed by the manager, and its scheduling nonce once queued.*


```solidity
function _getManagerData(ExecutionPlan storage plan, uint256 index)
    private
    view
    returns (bool controlled, bool withDelay, uint32 nonce);
```

### _setManagerData

*Marks an operation at an index as permissioned by the manager, potentially delayed, and
when delayed sets its scheduling nonce.*


```solidity
function _setManagerData(ExecutionPlan storage plan, uint256 index, bool withDelay, uint32 nonce) private;
```

### _getManagerDataIndices

*Returns bucket and subindex for reading manager data from the packed array mapping.*


```solidity
function _getManagerDataIndices(uint256 index) private pure returns (uint256 bucket, uint256 subindex);
```

## Events
### BaseDelaySet

```solidity
event BaseDelaySet(uint32 oldBaseDelaySeconds, uint32 newBaseDelaySeconds);
```

### AccessManagerIgnoredSet

```solidity
event AccessManagerIgnoredSet(address target, bytes4 selector, bool ignored);
```

## Errors
### GovernorUnmetDelay

```solidity
error GovernorUnmetDelay(uint256 proposalId, uint256 neededTimestamp);
```

### GovernorMismatchedNonce

```solidity
error GovernorMismatchedNonce(uint256 proposalId, uint256 expectedNonce, uint256 actualNonce);
```

### GovernorLockedIgnore

```solidity
error GovernorLockedIgnore();
```

## Structs
### ExecutionPlan

```solidity
struct ExecutionPlan {
    uint16 length;
    uint32 delay;
    mapping(uint256 operationBucket => uint32[8]) managerData;
}
```

