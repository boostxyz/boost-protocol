# Governor
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md), [EIP712](/lib/solady/src/utils/EIP712.sol/abstract.EIP712.md), [Nonces](/lib/openzeppelin-contracts/contracts/utils/Nonces.sol/abstract.Nonces.md), [IGovernor](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md), [IERC721Receiver](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol/interface.IERC721Receiver.md), [IERC1155Receiver](/lib/openzeppelin-contracts/contracts/token/ERC1155/IERC1155Receiver.sol/interface.IERC1155Receiver.md)

*Core of the governance system, designed to be extended through various modules.
This contract is abstract and requires several functions to be implemented in various modules:
- A counting module must implement [quorum](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#quorum), {_quorumReached}, {_voteSucceeded} and {_countVote}
- A voting module must implement {_getVotes}
- Additionally, {votingPeriod} must also be implemented*


## State Variables
### BALLOT_TYPEHASH

```solidity
bytes32 public constant BALLOT_TYPEHASH =
    keccak256("Ballot(uint256 proposalId,uint8 support,address voter,uint256 nonce)");
```


### EXTENDED_BALLOT_TYPEHASH

```solidity
bytes32 public constant EXTENDED_BALLOT_TYPEHASH =
    keccak256("ExtendedBallot(uint256 proposalId,uint8 support,address voter,uint256 nonce,string reason,bytes params)");
```


### ALL_PROPOSAL_STATES_BITMAP

```solidity
bytes32 private constant ALL_PROPOSAL_STATES_BITMAP = bytes32((2 ** (uint8(type(ProposalState).max) + 1)) - 1);
```


### _name

```solidity
string private _name;
```


### _proposals

```solidity
mapping(uint256 proposalId => ProposalCore) private _proposals;
```


### _governanceCall

```solidity
DoubleEndedQueue.Bytes32Deque private _governanceCall;
```


## Functions
### onlyGovernance

*Restricts a function so it can only be executed through governance proposals. For example, governance
parameter setters in {GovernorSettings} are protected using this modifier.
The governance executing address may be different from the Governor's own address, for example it could be a
timelock. This can be customized by modules by overriding {_executor}. The executor is only able to invoke these
functions during the execution of the governor's {execute} function, and not under any other circumstances. Thus,
for example, additional timelock proposers are not able to change governance parameters without going through the
governance protocol (since v4.6).*


```solidity
modifier onlyGovernance();
```

### constructor

*Sets the value for [name](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#name) and {version}*


```solidity
constructor(string memory name_) EIP712(name_, version());
```

### receive

*Function to receive ETH that will be handled by the governor (disabled if executor is a third party contract)*


```solidity
receive() external payable virtual;
```

### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/governance/TimelockController.sol/contract.TimelockController.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool);
```

### name

*See [IGovernor-name](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#name).*


```solidity
function name() public view virtual returns (string memory);
```

### version

*See [IGovernor-version](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#version).*


```solidity
function version() public view virtual returns (string memory);
```

### hashProposal

*See [IGovernor-hashProposal](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#hashproposal).
The proposal id is produced by hashing the ABI encoded `targets` array, the `values` array, the `calldatas` array
and the descriptionHash (bytes32 which itself is the keccak256 hash of the description string). This proposal id
can be produced from the proposal data which is part of the {ProposalCreated} event. It can even be computed in
advance, before the proposal is submitted.
Note that the chainId and the governor address are not part of the proposal id computation. Consequently, the
same proposal (with same operation and same description) will have the same id if submitted on multiple governors
across multiple networks. This also means that in order to execute the same operation twice (on the same
governor) the proposer will have to change the description in order to avoid proposal id conflicts.*


```solidity
function hashProposal(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public pure virtual returns (uint256);
```

### state

*See [IGovernor-state](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockCompound.sol/abstract.GovernorTimelockCompound.md#state).*


```solidity
function state(uint256 proposalId) public view virtual returns (ProposalState);
```

### proposalThreshold

*See [IGovernor-proposalThreshold](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorSettings.sol/abstract.GovernorSettings.md#proposalthreshold).*


```solidity
function proposalThreshold() public view virtual returns (uint256);
```

### proposalSnapshot

*See [IGovernor-proposalSnapshot](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalsnapshot).*


```solidity
function proposalSnapshot(uint256 proposalId) public view virtual returns (uint256);
```

### proposalDeadline

*See [IGovernor-proposalDeadline](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorPreventLateQuorum.sol/abstract.GovernorPreventLateQuorum.md#proposaldeadline).*


```solidity
function proposalDeadline(uint256 proposalId) public view virtual returns (uint256);
```

### proposalProposer

*See [IGovernor-proposalProposer](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalproposer).*


```solidity
function proposalProposer(uint256 proposalId) public view virtual returns (address);
```

### proposalEta

*See [IGovernor-proposalEta](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposaleta).*


```solidity
function proposalEta(uint256 proposalId) public view virtual returns (uint256);
```

### proposalNeedsQueuing

*See [IGovernor-proposalNeedsQueuing](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md#proposalneedsqueuing).*


```solidity
function proposalNeedsQueuing(uint256) public view virtual returns (bool);
```

### _checkGovernance

*Reverts if the `msg.sender` is not the executor. In case the executor is not this contract
itself, the function reverts if `msg.data` is not whitelisted as a result of an [execute](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#execute)
operation. See {onlyGovernance}.*


```solidity
function _checkGovernance() internal virtual;
```

### _quorumReached

*Amount of votes already cast passes the threshold limit.*


```solidity
function _quorumReached(uint256 proposalId) internal view virtual returns (bool);
```

### _voteSucceeded

*Is the proposal successful or not.*


```solidity
function _voteSucceeded(uint256 proposalId) internal view virtual returns (bool);
```

### _getVotes

*Get the voting weight of `account` at a specific `timepoint`, for a vote as described by `params`.*


```solidity
function _getVotes(address account, uint256 timepoint, bytes memory params) internal view virtual returns (uint256);
```

### _countVote

*Register a vote for `proposalId` by `account` with a given `support`, voting `weight` and voting `params`.
Note: Support is generic and can represent various things depending on the voting system used.*


```solidity
function _countVote(uint256 proposalId, address account, uint8 support, uint256 weight, bytes memory params)
    internal
    virtual;
```

### _defaultParams

*Default additional encoded parameters used by castVote methods that don't include them
Note: Should be overridden by specific implementations to use an appropriate value, the
meaning of the additional params, in the context of that implementation*


```solidity
function _defaultParams() internal view virtual returns (bytes memory);
```

### propose

*See [IGovernor-propose](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorTimelockAccess.sol/abstract.GovernorTimelockAccess.md#propose). This function has opt-in frontrunning protection, described in {_isValidDescriptionForProposer}.*


```solidity
function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
    public
    virtual
    returns (uint256);
```

### _propose

*Internal propose mechanism. Can be overridden to add more logic on proposal creation.
Emits a [IGovernor-ProposalCreated](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalcreated) event.*


```solidity
function _propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description,
    address proposer
) internal virtual returns (uint256 proposalId);
```

### queue

*See [IGovernor-queue](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorStorage.sol/abstract.GovernorStorage.md#queue).*


```solidity
function queue(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    public
    virtual
    returns (uint256);
```

### _queueOperations

*Internal queuing mechanism. Can be overridden (without a super call) to modify the way queuing is
performed (for example adding a vault/timelock).
This is empty by default, and must be overridden to implement queuing.
This function returns a timestamp that describes the expected ETA for execution. If the returned value is 0
(which is the default value), the core will consider queueing did not succeed, and the public [queue](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#queue) function
will revert.
NOTE: Calling this function directly will NOT check the current state of the proposal, or emit the
`ProposalQueued` event. Queuing a proposal should be done using {queue}.*


```solidity
function _queueOperations(uint256, address[] memory, uint256[] memory, bytes[] memory, bytes32)
    internal
    virtual
    returns (uint48);
```

### execute

*See [IGovernor-execute](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorStorage.sol/abstract.GovernorStorage.md#execute).*


```solidity
function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    public
    payable
    virtual
    returns (uint256);
```

### _executeOperations

*Internal execution mechanism. Can be overridden (without a super call) to modify the way execution is
performed (for example adding a vault/timelock).
NOTE: Calling this function directly will NOT check the current state of the proposal, set the executed flag to
true or emit the `ProposalExecuted` event. Executing a proposal should be done using [execute](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#execute) or {_execute}.*


```solidity
function _executeOperations(
    uint256,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32
) internal virtual;
```

### cancel

*See [IGovernor-cancel](/lib/openzeppelin-contracts/contracts/governance/extensions/GovernorStorage.sol/abstract.GovernorStorage.md#cancel).*


```solidity
function cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    public
    virtual
    returns (uint256);
```

### _cancel

*Internal cancel mechanism with minimal restrictions. A proposal can be cancelled in any state other than
Canceled, Expired, or Executed. Once cancelled a proposal can't be re-submitted.
Emits a [IGovernor-ProposalCanceled](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#proposalcanceled) event.*


```solidity
function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
    internal
    virtual
    returns (uint256);
```

### getVotes

*See [IGovernor-getVotes](/lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol/abstract.Votes.md#getvotes).*


```solidity
function getVotes(address account, uint256 timepoint) public view virtual returns (uint256);
```

### getVotesWithParams

*See [IGovernor-getVotesWithParams](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#getvoteswithparams).*


```solidity
function getVotesWithParams(address account, uint256 timepoint, bytes memory params)
    public
    view
    virtual
    returns (uint256);
```

### castVote

*See [IGovernor-castVote](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#castvote).*


```solidity
function castVote(uint256 proposalId, uint8 support) public virtual returns (uint256);
```

### castVoteWithReason

*See [IGovernor-castVoteWithReason](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#castvotewithreason).*


```solidity
function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason)
    public
    virtual
    returns (uint256);
```

### castVoteWithReasonAndParams

*See [IGovernor-castVoteWithReasonAndParams](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#castvotewithreasonandparams).*


```solidity
function castVoteWithReasonAndParams(uint256 proposalId, uint8 support, string calldata reason, bytes memory params)
    public
    virtual
    returns (uint256);
```

### castVoteBySig

*See [IGovernor-castVoteBySig](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#castvotebysig).*


```solidity
function castVoteBySig(uint256 proposalId, uint8 support, address voter, bytes memory signature)
    public
    virtual
    returns (uint256);
```

### castVoteWithReasonAndParamsBySig

*See [IGovernor-castVoteWithReasonAndParamsBySig](/lib/openzeppelin-contracts/contracts/governance/IGovernor.sol/interface.IGovernor.md#castvotewithreasonandparamsbysig).*


```solidity
function castVoteWithReasonAndParamsBySig(
    uint256 proposalId,
    uint8 support,
    address voter,
    string calldata reason,
    bytes memory params,
    bytes memory signature
) public virtual returns (uint256);
```

### _castVote

*Internal vote casting mechanism: Check that the vote is pending, that it has not been cast yet, retrieve
voting weight using [IGovernor-getVotes](/lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol/abstract.Votes.md#getvotes) and call the {_countVote} internal function. Uses the _defaultParams().
Emits a {IGovernor-VoteCast} event.*


```solidity
function _castVote(uint256 proposalId, address account, uint8 support, string memory reason)
    internal
    virtual
    returns (uint256);
```

### _castVote

*Internal vote casting mechanism: Check that the vote is pending, that it has not been cast yet, retrieve
voting weight using [IGovernor-getVotes](/lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol/abstract.Votes.md#getvotes) and call the {_countVote} internal function.
Emits a {IGovernor-VoteCast} event.*


```solidity
function _castVote(uint256 proposalId, address account, uint8 support, string memory reason, bytes memory params)
    internal
    virtual
    returns (uint256);
```

### relay

*Relays a transaction or function call to an arbitrary target. In cases where the governance executor
is some contract other than the governor itself, like when using a timelock, this function can be invoked
in a governance proposal to recover tokens or Ether that was sent to the governor contract by mistake.
Note that if the executor is simply the governor itself, use of `relay` is redundant.*


```solidity
function relay(address target, uint256 value, bytes calldata data) external payable virtual onlyGovernance;
```

### _executor

*Address through which the governor executes action. Will be overloaded by module that execute actions
through another contract such as a timelock.*


```solidity
function _executor() internal view virtual returns (address);
```

### onERC721Received

*See [IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/lib/forge-std/test/mocks/MockERC721.t.sol/contract.ERC721Recipient.md#onerc721received).
Receiving tokens is disabled if the governance executor is other than the governor itself (eg. when using with a timelock).*


```solidity
function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4);
```

### onERC1155Received

*See {IERC1155Receiver-onERC1155Received}.
Receiving tokens is disabled if the governance executor is other than the governor itself (eg. when using with a timelock).*


```solidity
function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4);
```

### onERC1155BatchReceived

*See {IERC1155Receiver-onERC1155BatchReceived}.
Receiving tokens is disabled if the governance executor is other than the governor itself (eg. when using with a timelock).*


```solidity
function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory)
    public
    virtual
    returns (bytes4);
```

### _encodeStateBitmap

*Encodes a `ProposalState` into a `bytes32` representation where each bit enabled corresponds to
the underlying position in the `ProposalState` enum. For example:
0x000...10000
^^^^^^------ ...
^----- Succeeded
^---- Defeated
^--- Canceled
^-- Active
^- Pending*


```solidity
function _encodeStateBitmap(ProposalState proposalState) internal pure returns (bytes32);
```

### _validateStateBitmap

*Check that the current state of a proposal matches the requirements described by the `allowedStates` bitmap.
This bitmap should be built using `_encodeStateBitmap`.
If requirements are not met, reverts with a {GovernorUnexpectedProposalState} error.*


```solidity
function _validateStateBitmap(uint256 proposalId, bytes32 allowedStates) private view returns (ProposalState);
```

### _isValidDescriptionForProposer


```solidity
function _isValidDescriptionForProposer(address proposer, string memory description)
    internal
    view
    virtual
    returns (bool);
```

### _tryHexToUint

*Try to parse a character from a string as a hex value. Returns `(true, value)` if the char is in
`[0-9a-fA-F]` and `(false, 0)` otherwise. Value is guaranteed to be in the range `0 <= value < 16`*


```solidity
function _tryHexToUint(bytes1 char) private pure returns (bool, uint8);
```

### clock

*Clock used for flagging checkpoints. Can be overridden to implement timestamp based checkpoints (and voting).*


```solidity
function clock() public view virtual returns (uint48);
```

### CLOCK_MODE

*Description of the clock*


```solidity
function CLOCK_MODE() public view virtual returns (string memory);
```

### votingDelay

module:user-config

*Delay, between the proposal is created and the vote starts. The unit this duration is expressed in depends
on the clock (see ERC-6372) this contract uses.
This can be increased to leave time for users to buy voting power, or delegate it, before the voting of a
proposal starts.
NOTE: While this interface returns a uint256, timepoints are stored as uint48 following the ERC-6372 clock type.
Consequently this value must fit in a uint48 (when added to the current clock). See {IERC6372-clock}.*


```solidity
function votingDelay() public view virtual returns (uint256);
```

### votingPeriod

module:user-config

*Delay between the vote start and vote end. The unit this duration is expressed in depends on the clock
(see ERC-6372) this contract uses.
NOTE: The {votingDelay} can delay the start of the vote. This must be considered when setting the voting
duration compared to the voting delay.
NOTE: This value is stored when the proposal is submitted so that possible changes to the value do not affect
proposals that have already been submitted. The type used to save it is a uint32. Consequently, while this
interface returns a uint256, the value it returns should fit in a uint32.*


```solidity
function votingPeriod() public view virtual returns (uint256);
```

### quorum

module:user-config

*Minimum number of cast voted required for a proposal to be successful.
NOTE: The `timepoint` parameter corresponds to the snapshot used for counting vote. This allows to scale the
quorum depending on values such as the totalSupply of a token at this timepoint (see {ERC20Votes}).*


```solidity
function quorum(uint256 timepoint) public view virtual returns (uint256);
```

## Structs
### ProposalCore

```solidity
struct ProposalCore {
    address proposer;
    uint48 voteStart;
    uint32 voteDuration;
    bool executed;
    bool canceled;
    uint48 etaSeconds;
}
```

