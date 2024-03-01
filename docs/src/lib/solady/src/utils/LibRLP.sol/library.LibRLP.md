# LibRLP
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibRLP.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/LibRLP.sol)

Library for computing contract addresses from their deployer and nonce.


## Functions
### computeAddress

*Returns the address where a contract will be stored if deployed via
`deployer` with `nonce` using the `CREATE` opcode.
For the specification of the Recursive Length Prefix (RLP)
encoding scheme, please refer to p. 19 of the Ethereum Yellow Paper
(https://ethereum.github.io/yellowpaper/paper.pdf)
and the Ethereum Wiki (https://eth.wiki/fundamentals/rlp).
Based on the EIP-161 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md)
specification, all contract accounts on the Ethereum mainnet are initiated with
`nonce = 1`. Thus, the first contract address created by another contract
is calculated with a non-zero nonce.
The theoretical allowed limit, based on EIP-2681
(https://eips.ethereum.org/EIPS/eip-2681), for an account nonce is 2**64-2.
Caution! This function will NOT check that the nonce is within the theoretical range.
This is for performance, as exceeding the range is extremely impractical.
It is the user's responsibility to ensure that the nonce is valid
(e.g. no dirty bits after packing / unpacking).
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function computeAddress(address deployer, uint256 nonce) internal pure returns (address deployed);
```

