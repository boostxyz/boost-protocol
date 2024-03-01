# GovernorTimelockCompound
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*Extension of {Governor} that binds the execution process to a Compound Timelock. This adds a delay, enforced by
the external timelock to all successful proposal (in addition to the voting duration). The {Governor} needs to be
the admin of the timelock for any operation to be performed. A public, unrestricted,
{GovernorTimelockCompound-__acceptAdmin} is available to accept ownership of the timelock.
Using this model means the proposal will be operated by the {TimelockController} and not by the {Governor}. Thus,
the assets and permissions must be attached to the {TimelockController}. Any asset sent to the {Governor} will be
inaccessible from a proposal, unless executed via {Governor-relay}.*


## State Variables
### _timelock

```solidity
ICompoundTimelock private _timelock;
```


## Functions
### constructor

*Set the timelock.*


```solidity
constructor(ICompoundTimelock timelockAddress);
```

### state

*Overridden version of the [Governor-state](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol/abstract.GovernorTimelockControl.md#state) function with added support for the `Expired` state.*


```solidity
function state(uint256 proposalId) public view virtual override returns (ProposalState);
```

### timelock

*Public accessor to check the address of the timelock*


```solidity
function timelock() public view virtual returns (address);
```

### proposalNeedsQueuing

*See [IGovernor-proposalNeedsQueuing](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol/abstract.GovernorTimelockControl.md#proposalneedsqueuing).*


```solidity
function proposalNeedsQueuing(uint256) public view virtual override returns (bool);
```

### _queueOperations

*Function to queue a proposal to the timelock.*


```solidity
function _queueOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32
) internal virtual override returns (uint48);
```

### _executeOperations

*Overridden version of the [Governor-_executeOperations](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol/abstract.GovernorTimelockControl.md#_executeoperations) function that run the already queued proposal
through the timelock.*


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

*Overridden version of the [Governor-_cancel](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockControl.sol/abstract.GovernorTimelockControl.md#_cancel) function to cancel the timelocked proposal if it has already
been queued.*


```solidity
function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    virtual
    override
    returns (uint256);
```

### _executor

*Address through which the governor executes action. In this case, the timelock.*


```solidity
function _executor() internal view virtual override returns (address);
```

### __acceptAdmin

*Accept admin right over the timelock.*


```solidity
function __acceptAdmin() public;
```

### updateTimelock

*Public endpoint to update the underlying timelock instance. Restricted to the timelock itself, so updates
must be proposed, scheduled, and executed through governance proposals.
For security reasons, the timelock must be handed over to another admin before setting up a new one. The two
operations (hand over the timelock) and do the update can be batched in a single proposal.
Note that if the timelock admin has been handed over in a previous operation, we refuse updates made through the
timelock if admin of the timelock has already been accepted and the operation is executed outside the scope of
governance.
CAUTION: It is not recommended to change the timelock while there are other queued governance proposals.*


```solidity
function updateTimelock(ICompoundTimelock newTimelock) external virtual onlyGovernance;
```

### _updateTimelock


```solidity
function _updateTimelock(ICompoundTimelock newTimelock) private;
```

## Events
### TimelockChange
*Emitted when the timelock controller used for proposal execution is modified.*


```solidity
event TimelockChange(address oldTimelock, address newTimelock);
```

