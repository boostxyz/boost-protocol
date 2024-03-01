# IGovernor
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md), [IERC6372](/lib/openzeppelin-contracts/contracts/interfaces/IERC6372.sol/interface.IERC6372.md)

*Interface of the {Governor} core.*


## Functions
### name

module:core

*Name of the governor instance (used in building the EIP-712 domain separator).*


```solidity
function name() external view returns (string memory);
```

### version

module:core

*Version of the governor instance (used in building the EIP-712 domain separator). Default: "1"*


```solidity
function version() external view returns (string memory);
```

### COUNTING_MODE

module:voting

*A description of the possible `support` values for [castVote](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#castvote) and the way these votes are counted, meant to
be consumed by UIs to show correct vote options and interpret the results. The string is a URL-encoded sequence of
key-value pairs that each describe one aspect, for example `support=bravo&quorum=for,abstain`.
There are 2 standard keys: `support` and `quorum`.
- `support=bravo` refers to the vote options 0 = Against, 1 = For, 2 = Abstain, as in `GovernorBravo`.
- `quorum=bravo` means that only For votes are counted towards quorum.
- `quorum=for,abstain` means that both For and Abstain votes are counted towards quorum.
If a counting module makes use of encoded `params`, it should  include this under a `params` key with a unique
name that describes the behavior. For example:
- `params=fractional` might refer to a scheme where votes are divided fractionally between for/against/abstain.
- `params=erc721` might refer to a scheme where specific NFTs are delegated to vote.
NOTE: The string can be decoded by the standard
https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams[`URLSearchParams`]
JavaScript class.*


```solidity
function COUNTING_MODE() external view returns (string memory);
```

### hashProposal

module:core

*Hashing function used to (re)build the proposal id from the proposal details..*


```solidity
function hashProposal(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) external pure returns (uint256);
```

### state

module:core

*Current state of a proposal, following Compound's convention*


```solidity
function state(uint256 proposalId) external view returns (ProposalState);
```

### proposalThreshold

module:core

*The number of votes required in order for a voter to become a proposer.*


```solidity
function proposalThreshold() external view returns (uint256);
```

### proposalSnapshot

module:core

*Timepoint used to retrieve user's votes and quorum. If using block number (as per Compound's Comp), the
snapshot is performed at the end of this block. Hence, voting for this proposal starts at the beginning of the
following block.*


```solidity
function proposalSnapshot(uint256 proposalId) external view returns (uint256);
```

### proposalDeadline

module:core

*Timepoint at which votes close. If using block number, votes close at the end of this block, so it is
possible to cast a vote during this block.*


```solidity
function proposalDeadline(uint256 proposalId) external view returns (uint256);
```

### proposalProposer

module:core

*The account that created a proposal.*


```solidity
function proposalProposer(uint256 proposalId) external view returns (address);
```

### proposalEta

module:core

*The time when a queued proposal becomes executable ("ETA"). Unlike [proposalSnapshot](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalsnapshot) and
{proposalDeadline}, this doesn't use the governor clock, and instead relies on the executor's clock which may be
different. In most cases this will be a timestamp.*


```solidity
function proposalEta(uint256 proposalId) external view returns (uint256);
```

### proposalNeedsQueuing

module:core

*Whether a proposal needs to be queued before execution.*


```solidity
function proposalNeedsQueuing(uint256 proposalId) external view returns (bool);
```

### votingDelay

module:user-config

*Delay, between the proposal is created and the vote starts. The unit this duration is expressed in depends
on the clock (see ERC-6372) this contract uses.
This can be increased to leave time for users to buy voting power, or delegate it, before the voting of a
proposal starts.
NOTE: While this interface returns a uint256, timepoints are stored as uint48 following the ERC-6372 clock type.
Consequently this value must fit in a uint48 (when added to the current clock). See [IERC6372-clock](/lib/openzeppelin-contracts/contracts/interfaces/IERC6372.sol/interface.IERC6372.md#clock).*


```solidity
function votingDelay() external view returns (uint256);
```

### votingPeriod

module:user-config

*Delay between the vote start and vote end. The unit this duration is expressed in depends on the clock
(see ERC-6372) this contract uses.
NOTE: The [votingDelay](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votingdelay) can delay the start of the vote. This must be considered when setting the voting
duration compared to the voting delay.
NOTE: This value is stored when the proposal is submitted so that possible changes to the value do not affect
proposals that have already been submitted. The type used to save it is a uint32. Consequently, while this
interface returns a uint256, the value it returns should fit in a uint32.*


```solidity
function votingPeriod() external view returns (uint256);
```

### quorum

module:user-config

*Minimum number of cast voted required for a proposal to be successful.
NOTE: The `timepoint` parameter corresponds to the snapshot used for counting vote. This allows to scale the
quorum depending on values such as the totalSupply of a token at this timepoint (see {ERC20Votes}).*


```solidity
function quorum(uint256 timepoint) external view returns (uint256);
```

### getVotes

module:reputation

*Voting power of an `account` at a specific `timepoint`.
Note: this can be implemented in a number of ways, for example by reading the delegated balance from one (or
multiple), {ERC20Votes} tokens.*


```solidity
function getVotes(address account, uint256 timepoint) external view returns (uint256);
```

### getVotesWithParams

module:reputation

*Voting power of an `account` at a specific `timepoint` given additional encoded parameters.*


```solidity
function getVotesWithParams(address account, uint256 timepoint, bytes memory params) external view returns (uint256);
```

### hasVoted

module:voting

*Returns whether `account` has cast a vote on `proposalId`.*


```solidity
function hasVoted(uint256 proposalId, address account) external view returns (bool);
```

### propose

*Create a new proposal. Vote start after a delay specified by {IGovernor-votingDelay} and lasts for a
duration specified by {IGovernor-votingPeriod}.
Emits a {ProposalCreated} event.
NOTE: The state of the Governor and `targets` may change between the proposal creation and its execution.
This may be the result of third party actions on the targeted contracts, or other governor proposals.
For example, the balance of this contract could be updated or its access control permissions may be modified,
possibly compromising the proposal's ability to execute successfully (e.g. the governor doesn't have enough
value to cover a proposal with multiple transfers).*


```solidity
function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
    external
    returns (uint256 proposalId);
```

### queue

*Queue a proposal. Some governors require this step to be performed before execution can happen. If queuing
is not necessary, this function may revert.
Queuing a proposal requires the quorum to be reached, the vote to be successful, and the deadline to be reached.
Emits a [ProposalQueued](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalqueued) event.*


```solidity
function queue(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    external
    returns (uint256 proposalId);
```

### execute

*Execute a successful proposal. This requires the quorum to be reached, the vote to be successful, and the
deadline to be reached. Depending on the governor it might also be required that the proposal was queued and
that some delay passed.
Emits a [ProposalExecuted](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalexecuted) event.
NOTE: Some modules can modify the requirements for execution, for example by adding an additional timelock.*


```solidity
function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    external
    payable
    returns (uint256 proposalId);
```

### cancel

*Cancel a proposal. A proposal is cancellable by the proposer, but only while it is Pending state, i.e.
before the vote starts.
Emits a [ProposalCanceled](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalcanceled) event.*


```solidity
function cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    external
    returns (uint256 proposalId);
```

### castVote

*Cast a vote
Emits a [VoteCast](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votecast) event.*


```solidity
function castVote(uint256 proposalId, uint8 support) external returns (uint256 balance);
```

### castVoteWithReason

*Cast a vote with a reason
Emits a [VoteCast](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votecast) event.*


```solidity
function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason)
    external
    returns (uint256 balance);
```

### castVoteWithReasonAndParams

*Cast a vote with a reason and additional encoded parameters
Emits a [VoteCast](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votecast) or {VoteCastWithParams} event depending on the length of params.*


```solidity
function castVoteWithReasonAndParams(uint256 proposalId, uint8 support, string calldata reason, bytes memory params)
    external
    returns (uint256 balance);
```

### castVoteBySig

*Cast a vote using the voter's signature, including ERC-1271 signature support.
Emits a [VoteCast](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votecast) event.*


```solidity
function castVoteBySig(uint256 proposalId, uint8 support, address voter, bytes memory signature)
    external
    returns (uint256 balance);
```

### castVoteWithReasonAndParamsBySig

*Cast a vote with a reason and additional encoded parameters using the voter's signature,
including ERC-1271 signature support.
Emits a [VoteCast](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#votecast) or {VoteCastWithParams} event depending on the length of params.*


```solidity
function castVoteWithReasonAndParamsBySig(
    uint256 proposalId,
    uint8 support,
    address voter,
    string calldata reason,
    bytes memory params,
    bytes memory signature
) external returns (uint256 balance);
```

## Events
### ProposalCreated
*Emitted when a proposal is created.*


```solidity
event ProposalCreated(
    uint256 proposalId,
    address proposer,
    address[] targets,
    uint256[] values,
    string[] signatures,
    bytes[] calldatas,
    uint256 voteStart,
    uint256 voteEnd,
    string description
);
```

### ProposalQueued
*Emitted when a proposal is queued.*


```solidity
event ProposalQueued(uint256 proposalId, uint256 etaSeconds);
```

### ProposalExecuted
*Emitted when a proposal is executed.*


```solidity
event ProposalExecuted(uint256 proposalId);
```

### ProposalCanceled
*Emitted when a proposal is canceled.*


```solidity
event ProposalCanceled(uint256 proposalId);
```

### VoteCast
*Emitted when a vote is cast without params.
Note: `support` values should be seen as buckets. Their interpretation depends on the voting module used.*


```solidity
event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason);
```

### VoteCastWithParams
*Emitted when a vote is cast with params.
Note: `support` values should be seen as buckets. Their interpretation depends on the voting module used.
`params` are additional encoded parameters. Their interpepretation also depends on the voting module used.*


```solidity
event VoteCastWithParams(
    address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason, bytes params
);
```

## Errors
### GovernorInvalidProposalLength
*Empty proposal or a mismatch between the parameters length for a proposal call.*


```solidity
error GovernorInvalidProposalLength(uint256 targets, uint256 calldatas, uint256 values);
```

### GovernorAlreadyCastVote
*The vote was already cast.*


```solidity
error GovernorAlreadyCastVote(address voter);
```

### GovernorDisabledDeposit
*Token deposits are disabled in this contract.*


```solidity
error GovernorDisabledDeposit();
```

### GovernorOnlyProposer
*The `account` is not a proposer.*


```solidity
error GovernorOnlyProposer(address account);
```

### GovernorOnlyExecutor
*The `account` is not the governance executor.*


```solidity
error GovernorOnlyExecutor(address account);
```

### GovernorNonexistentProposal
*The `proposalId` doesn't exist.*


```solidity
error GovernorNonexistentProposal(uint256 proposalId);
```

### GovernorUnexpectedProposalState
*The current state of a proposal is not the required for performing an operation.
The `expectedStates` is a bitmap with the bits enabled for each ProposalState enum position
counting from right to left.
NOTE: If `expectedState` is `bytes32(0)`, the proposal is expected to not be in any state (i.e. not exist).
This is the case when a proposal that is expected to be unset is already initiated (the proposal is duplicated).
See [Governor-_encodeStateBitmap](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#_encodestatebitmap).*


```solidity
error GovernorUnexpectedProposalState(uint256 proposalId, ProposalState current, bytes32 expectedStates);
```

### GovernorInvalidVotingPeriod
*The voting period set is not a valid period.*


```solidity
error GovernorInvalidVotingPeriod(uint256 votingPeriod);
```

### GovernorInsufficientProposerVotes
*The `proposer` does not have the required votes to create a proposal.*


```solidity
error GovernorInsufficientProposerVotes(address proposer, uint256 votes, uint256 threshold);
```

### GovernorRestrictedProposer
*The `proposer` is not allowed to create a proposal.*


```solidity
error GovernorRestrictedProposer(address proposer);
```

### GovernorInvalidVoteType
*The vote type used is not valid for the corresponding counting module.*


```solidity
error GovernorInvalidVoteType();
```

### GovernorQueueNotImplemented
*Queue operation is not implemented for this governor. Execute should be called directly.*


```solidity
error GovernorQueueNotImplemented();
```

### GovernorNotQueuedProposal
*The proposal hasn't been queued yet.*


```solidity
error GovernorNotQueuedProposal(uint256 proposalId);
```

### GovernorAlreadyQueuedProposal
*The proposal has already been queued.*


```solidity
error GovernorAlreadyQueuedProposal(uint256 proposalId);
```

### GovernorInvalidSignature
*The provided signature is not valid for the expected `voter`.
If the `voter` is a contract, the signature is not valid using [IERC1271-isValidSignature](/lib/openzeppelin-contracts/contracts/interfaces/IERC1271.sol/interface.IERC1271.md#isvalidsignature).*


```solidity
error GovernorInvalidSignature(address voter);
```

## Enums
### ProposalState

```solidity
enum ProposalState {
    Pending,
    Active,
    Canceled,
    Defeated,
    Succeeded,
    Queued,
    Expired,
    Executed
}
```

