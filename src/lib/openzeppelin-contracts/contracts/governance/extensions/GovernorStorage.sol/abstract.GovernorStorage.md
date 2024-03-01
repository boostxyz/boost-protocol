# GovernorStorage
**Inherits:**
[Governor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md)

*Extension of {Governor} that implements storage of proposal details. This modules also provides primitives for
the enumerability of proposals.
Use cases for this module include:
- UIs that explore the proposal state without relying on event indexing.
- Using only the proposalId as an argument in the {Governor-queue} and {Governor-execute} functions for L2 chains
where storage is cheap compared to calldata.*


## State Variables
### _proposalIds

```solidity
uint256[] private _proposalIds;
```


### _proposalDetails

```solidity
mapping(uint256 proposalId => ProposalDetails) private _proposalDetails;
```


## Functions
### _propose

*Hook into the proposing mechanism*


```solidity
function _propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description,
    address proposer
) internal virtual override returns (uint256);
```

### queue

*Version of [IGovernorTimelock-queue](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#queue) with only `proposalId` as an argument.*


```solidity
function queue(uint256 proposalId) public virtual;
```

### execute

*Version of [IGovernor-execute](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#execute) with only `proposalId` as an argument.*


```solidity
function execute(uint256 proposalId) public payable virtual;
```

### cancel

*ProposalId version of [IGovernor-cancel](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#cancel).*


```solidity
function cancel(uint256 proposalId) public virtual;
```

### proposalCount

*Returns the number of stored proposals.*


```solidity
function proposalCount() public view virtual returns (uint256);
```

### proposalDetails

*Returns the details of a proposalId. Reverts if `proposalId` is not a known proposal.*


```solidity
function proposalDetails(uint256 proposalId)
    public
    view
    virtual
    returns (address[] memory, uint256[] memory, bytes[] memory, bytes32);
```

### proposalDetailsAt

*Returns the details (including the proposalId) of a proposal given its sequential index.*


```solidity
function proposalDetailsAt(uint256 index)
    public
    view
    virtual
    returns (uint256, address[] memory, uint256[] memory, bytes[] memory, bytes32);
```

## Structs
### ProposalDetails

```solidity
struct ProposalDetails {
    address[] targets;
    uint256[] values;
    bytes[] calldatas;
    bytes32 descriptionHash;
}
```

