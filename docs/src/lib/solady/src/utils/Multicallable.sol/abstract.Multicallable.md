# Multicallable
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/Multicallable.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/Multicallable.sol)
WARNING:
This implementation is NOT to be used with ERC2771 out-of-the-box.
https://blog.openzeppelin.com/arbitrary-address-spoofing-vulnerability-erc2771context-multicall-public-disclosure
This also applies to potentially other ERCs / patterns appending to the back of calldata.
We do NOT have a check for ERC2771, as we do not inherit from OpenZeppelin's context.
Moreover, it is infeasible and inefficient for us to add checks and mitigations
for all possible ERC / patterns appending to the back of calldata.
We would highly recommend using an alternative pattern such as
https://github.com/Vectorized/multicaller
which is more flexible, futureproof, and safer by default.

Contract that enables a single call to call multiple methods on itself.


## Functions
### multicall

*Apply `DELEGATECALL` with the current contract to each calldata in `data`,
and store the `abi.encode` formatted results of each `DELEGATECALL` into `results`.
If any of the `DELEGATECALL`s reverts, the entire context is reverted,
and the error is bubbled up.
This function is deliberately made non-payable to guard against double-spending.
(See: https://www.paradigm.xyz/2021/08/two-rights-might-make-a-wrong)
For efficiency, this function will directly return the results, terminating the context.
If called internally, it must be called at the end of a function
that returns `(bytes[] memory)`.*


```solidity
function multicall(bytes[] calldata data) public virtual returns (bytes[] memory);
```

