# GovernorTimelockControl
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*Extension of {Governor} that binds the execution process to an instance of {TimelockController}. This adds a
delay, enforced by the {TimelockController} to all successful proposal (in addition to the voting duration). The
{Governor} needs the proposer (and ideally the executor and canceller) roles for the {Governor} to work properly.
Using this model means the proposal will be operated by the {TimelockController} and not by the {Governor}. Thus,
the assets and permissions must be attached to the {TimelockController}. Any asset sent to the {Governor} will be
inaccessible from a proposal, unless executed via {Governor-relay}.
WARNING: Setting up the TimelockController to have additional proposers or cancellers besides the governor is very
risky, as it grants them the ability to: 1) execute operations as the timelock, and thus possibly performing
operations or accessing funds that are expected to only be accessible through a vote, and 2) block governance
proposals that have been approved by the voters, effectively executing a Denial of Service attack.*


## State Variables
### _timelock

```solidity
TimelockController private _timelock;
```


### _timelockIds

```solidity
mapping(uint256 proposalId => bytes32) private _timelockIds;
```


## Functions
### constructor

*Set the timelock.*


```solidity
constructor(TimelockController timelockAddress);
```

### state

*Overridden version of the [Governor-state](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#state) function that considers the status reported by the timelock.*


```solidity
function state(uint256 proposalId) public view virtual override returns (ProposalState);
```

### timelock

*Public accessor to check the address of the timelock*


```solidity
function timelock() public view virtual returns (address);
```

### proposalNeedsQueuing

*See [IGovernor-proposalNeedsQueuing](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalneedsqueuing).*


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
    bytes32 descriptionHash
) internal virtual override returns (uint48);
```

### _executeOperations

*Overridden version of the {Governor-_executeOperations} function that runs the already queued proposal
through the timelock.*


```solidity
function _executeOperations(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) internal virtual override;
```

### _cancel

*Overridden version of the {Governor-_cancel} function to cancel the timelocked proposal if it has already
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

### updateTimelock

*Public endpoint to update the underlying timelock instance. Restricted to the timelock itself, so updates
must be proposed, scheduled, and executed through governance proposals.
CAUTION: It is not recommended to change the timelock while there are other queued governance proposals.*


```solidity
function updateTimelock(TimelockController newTimelock) external virtual onlyGovernance;
```

### _updateTimelock


```solidity
function _updateTimelock(TimelockController newTimelock) private;
```

### _timelockSalt

*Computes the {TimelockController} operation salt.
It is computed with the governor address itself to avoid collisions across governor instances using the
same timelock.*


```solidity
function _timelockSalt(bytes32 descriptionHash) private view returns (bytes32);
```

## Events
### TimelockChange
*Emitted when the timelock controller used for proposal execution is modified.*


```solidity
event TimelockChange(address oldTimelock, address newTimelock);
```

