# ERC2771Forwarder
**Inherits:**
[EIP712](/lib/solady/src/utils/EIP712.sol/abstract.EIP712.md), [Nonces](/lib/openzeppelin-contracts/contracts/utils/Nonces.sol/abstract.Nonces.md)

*A forwarder compatible with ERC-2771 contracts. See {ERC2771Context}.
This forwarder operates on forward requests that include:
`from`: An address to operate on behalf of. It is required to be equal to the request signer.
`to`: The address that should be called.
`value`: The amount of native token to attach with the requested call.
`gas`: The amount of gas limit that will be forwarded with the requested call.
`nonce`: A unique transaction ordering identifier to avoid replayability and request invalidation.
`deadline`: A timestamp after which the request is not executable anymore.
`data`: Encoded `msg.data` to send with the requested call.
Relayers are able to submit batches if they are processing a high volume of requests. With high
throughput, relayers may run into limitations of the chain such as limits on the number of
transactions in the mempool. In these cases the recommendation is to distribute the load among
multiple accounts.
NOTE: Batching requests includes an optional refund for unused `msg.value` that is achieved by
performing a call with empty calldata. While this is within the bounds of ERC-2771 compliance,
if the refund receiver happens to consider the forwarder a trusted forwarder, it MUST properly
handle `msg.data.length == 0`. `ERC2771Context` in OpenZeppelin Contracts versions prior to 4.9.3
do not handle this properly.
==== Security Considerations
If a relayer submits a forward request, it should be willing to pay up to 100% of the gas amount
specified in the request. This contract does not implement any kind of retribution for this gas,
and it is assumed that there is an out of band incentive for relayers to pay for execution on
behalf of signers. Often, the relayer is operated by a project that will consider it a user
acquisition cost.
By offering to pay for gas, relayers are at risk of having that gas used by an attacker toward
some other purpose that is not aligned with the expected out of band incentives. If you operate a
relayer, consider whitelisting target contracts and function selectors. When relaying ERC-721 or
ERC-1155 transfers specifically, consider rejecting the use of the `data` field, since it can be
used to execute arbitrary code.*


## State Variables
### _FORWARD_REQUEST_TYPEHASH

```solidity
bytes32 internal constant _FORWARD_REQUEST_TYPEHASH = keccak256(
    "ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,uint48 deadline,bytes data)"
);
```


## Functions
### constructor

*See [EIP712-constructor](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#constructor).*


```solidity
constructor(string memory name) EIP712(name, "1");
```

### verify

*Returns `true` if a request is valid for a provided `signature` at the current block timestamp.
A transaction is considered valid when the target trusts this forwarder, the request hasn't expired
(deadline is not met), and the signer matches the `from` parameter of the signed request.
NOTE: A request may return false here but it won't cause [executeBatch](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Forwarder.sol/contract.ERC2771Forwarder.md#executebatch) to revert if a refund
receiver is provided.*


```solidity
function verify(ForwardRequestData calldata request) public view virtual returns (bool);
```

### execute

*Executes a `request` on behalf of `signature`'s signer using the ERC-2771 protocol. The gas
provided to the requested call may not be exactly the amount requested, but the call will not run
out of gas. Will revert if the request is invalid or the call reverts, in this case the nonce is not consumed.
Requirements:
- The request value should be equal to the provided `msg.value`.
- The request should be valid according to [verify](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Forwarder.sol/contract.ERC2771Forwarder.md#verify).*


```solidity
function execute(ForwardRequestData calldata request) public payable virtual;
```

### executeBatch

*Batch version of [execute](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Forwarder.sol/contract.ERC2771Forwarder.md#execute) with optional refunding and atomic execution.
In case a batch contains at least one invalid request (see {verify}), the
request will be skipped and the `refundReceiver` parameter will receive back the
unused requested value at the end of the execution. This is done to prevent reverting
the entire batch when a request is invalid or has already been submitted.
If the `refundReceiver` is the `address(0)`, this function will revert when at least
one of the requests was not valid instead of skipping it. This could be useful if
a batch is required to get executed atomically (at least at the top-level). For example,
refunding (and thus atomicity) can be opt-out if the relayer is using a service that avoids
including reverted transactions.
Requirements:
- The sum of the requests' values should be equal to the provided `msg.value`.
- All of the requests should be valid (see {verify}) when `refundReceiver` is the zero address.
NOTE: Setting a zero `refundReceiver` guarantees an all-or-nothing requests execution only for
the first-level forwarded calls. In case a forwarded request calls to a contract with another
subcall, the second-level call may revert without the top-level call reverting.*


```solidity
function executeBatch(ForwardRequestData[] calldata requests, address payable refundReceiver) public payable virtual;
```

### _validate

*Validates if the provided request can be executed at current block timestamp with
the given `request.signature` on behalf of `request.signer`.*


```solidity
function _validate(ForwardRequestData calldata request)
    internal
    view
    virtual
    returns (bool isTrustedForwarder, bool active, bool signerMatch, address signer);
```

### _recoverForwardRequestSigner

*Returns a tuple with the recovered the signer of an EIP712 forward request message hash
and a boolean indicating if the signature is valid.
NOTE: The signature is considered valid if {ECDSA-tryRecover} indicates no recover error for it.*


```solidity
function _recoverForwardRequestSigner(ForwardRequestData calldata request)
    internal
    view
    virtual
    returns (bool, address);
```

### _execute

*Validates and executes a signed request returning the request call `success` value.
Internal function without msg.value validation.
Requirements:
- The caller must have provided enough gas to forward with the call.
- The request must be valid (see [verify](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Forwarder.sol/contract.ERC2771Forwarder.md#verify)) if the `requireValidRequest` is true.
Emits an {ExecutedForwardRequest} event.
IMPORTANT: Using this function doesn't check that all the `msg.value` was sent, potentially
leaving value stuck in the contract.*


```solidity
function _execute(ForwardRequestData calldata request, bool requireValidRequest)
    internal
    virtual
    returns (bool success);
```

### _isTrustedByTarget

*Returns whether the target trusts this forwarder.
This function performs a static call to the target contract calling the
{ERC2771Context-isTrustedForwarder} function.*


```solidity
function _isTrustedByTarget(address target) private view returns (bool);
```

### _checkForwardedGas

*Checks if the requested gas was correctly forwarded to the callee.
As a consequence of https://eips.ethereum.org/EIPS/eip-150[EIP-150]:
- At most `gasleft() - floor(gasleft() / 64)` is forwarded to the callee.
- At least `floor(gasleft() / 64)` is kept in the caller.
It reverts consuming all the available gas if the forwarded gas is not the requested gas.
IMPORTANT: The `gasLeft` parameter should be measured exactly at the end of the forwarded call.
Any gas consumed in between will make room for bypassing this check.*


```solidity
function _checkForwardedGas(uint256 gasLeft, ForwardRequestData calldata request) private pure;
```

## Events
### ExecutedForwardRequest
*Emitted when a `ForwardRequest` is executed.
NOTE: An unsuccessful forward request could be due to an invalid signature, an expired deadline,
or simply a revert in the requested call. The contract guarantees that the relayer is not able to force
the requested call to run out of gas.*


```solidity
event ExecutedForwardRequest(address indexed signer, uint256 nonce, bool success);
```

## Errors
### ERC2771ForwarderInvalidSigner
*The request `from` doesn't match with the recovered `signer`.*


```solidity
error ERC2771ForwarderInvalidSigner(address signer, address from);
```

### ERC2771ForwarderMismatchedValue
*The `requestedValue` doesn't match with the available `msgValue`.*


```solidity
error ERC2771ForwarderMismatchedValue(uint256 requestedValue, uint256 msgValue);
```

### ERC2771ForwarderExpiredRequest
*The request `deadline` has expired.*


```solidity
error ERC2771ForwarderExpiredRequest(uint48 deadline);
```

### ERC2771UntrustfulTarget
*The request target doesn't trust the `forwarder`.*


```solidity
error ERC2771UntrustfulTarget(address target, address forwarder);
```

## Structs
### ForwardRequestData

```solidity
struct ForwardRequestData {
    address from;
    address to;
    uint256 value;
    uint256 gas;
    uint48 deadline;
    bytes data;
    bytes signature;
}
```

