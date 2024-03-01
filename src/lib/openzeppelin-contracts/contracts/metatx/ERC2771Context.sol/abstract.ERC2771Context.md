# ERC2771Context
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md)

*Context variant with ERC-2771 support.
WARNING: Avoid using this pattern in contracts that rely in a specific calldata length as they'll
be affected by any forwarder whose `msg.data` is suffixed with the `from` address according to the ERC-2771
specification adding the address size in bytes (20) to the calldata size. An example of an unexpected
behavior could be an unintended fallback (or another function) invocation while trying to invoke the `receive`
function only accessible if `msg.data.length == 0`.
WARNING: The usage of `delegatecall` in this contract is dangerous and may result in context corruption.
Any forwarded request to this contract triggering a `delegatecall` to itself will result in an invalid [_msgSender](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Context.sol/abstract.ERC2771Context.md#_msgsender)
recovery.*


## State Variables
### _trustedForwarder

```solidity
address private immutable _trustedForwarder;
```


## Functions
### constructor

*Initializes the contract with a trusted forwarder, which will be able to
invoke functions on this contract on behalf of other accounts.
NOTE: The trusted forwarder can be replaced by overriding [trustedForwarder](/lib/openzeppelin-contracts/contracts/metatx/ERC2771Context.sol/abstract.ERC2771Context.md#trustedforwarder).*


```solidity
constructor(address trustedForwarder_);
```

### trustedForwarder

*Returns the address of the trusted forwarder.*


```solidity
function trustedForwarder() public view virtual returns (address);
```

### isTrustedForwarder

*Indicates whether any particular address is the trusted forwarder.*


```solidity
function isTrustedForwarder(address forwarder) public view virtual returns (bool);
```

### _msgSender

*Override for `msg.sender`. Defaults to the original `msg.sender` whenever
a call is not performed by the trusted forwarder or the calldata length is less than
20 bytes (an address length).*


```solidity
function _msgSender() internal view virtual override returns (address);
```

### _msgData

*Override for `msg.data`. Defaults to the original `msg.data` whenever
a call is not performed by the trusted forwarder or the calldata length is less than
20 bytes (an address length).*


```solidity
function _msgData() internal view virtual override returns (bytes calldata);
```

### _contextSuffixLength

*ERC-2771 specifies the context as being a single address (20 bytes).*


```solidity
function _contextSuffixLength() internal view virtual override returns (uint256);
```

