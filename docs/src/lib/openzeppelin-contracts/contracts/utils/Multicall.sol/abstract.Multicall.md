# Multicall
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md)

*Provides a function to batch together multiple calls in a single external call.
Consider any assumption about calldata validation performed by the sender may be violated if it's not especially
careful about sending transactions invoking [multicall](/lib/openzeppelin-contracts/contracts/utils/Multicall.sol/abstract.Multicall.md#multicall). For example, a relay address that filters function
selectors won't filter calls nested within a {multicall} operation.
NOTE: Since 5.0.1 and 4.9.4, this contract identifies non-canonical contexts (i.e. `msg.sender` is not {_msgSender}).
If a non-canonical context is identified, the following self `delegatecall` appends the last bytes of `msg.data`
to the subcall. This makes it safe to use with {ERC2771Context}. Contexts that don't affect the resolution of
{_msgSender} are not propagated to subcalls.*


## Functions
### multicall

*Receives and executes a batch of function calls on this contract.*


```solidity
function multicall(bytes[] calldata data) external virtual returns (bytes[] memory results);
```

