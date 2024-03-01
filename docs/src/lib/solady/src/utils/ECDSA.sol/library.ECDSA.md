# ECDSA
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/ECDSA.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/ECDSA.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol)

Gas optimized ECDSA wrapper.

*Note:
- The recovery functions use the ecrecover precompile (0x1).
- As of Solady version 0.0.68, the `recover` variants will revert upon recovery failure.
This is for more safety by default.
Use the `tryRecover` variants if you need to get the zero address back
upon recovery failure instead.
- As of Solady version 0.0.134, all `bytes signature` variants accept both
regular 65-byte `(r, s, v)` and EIP-2098 `(r, vs)` short form signatures.
See: https://eips.ethereum.org/EIPS/eip-2098
This is for calldata efficiency on smart accounts prevalent on L2s.
WARNING! Do NOT use signatures as unique identifiers:
- Use a nonce in the digest to prevent replay attacks on the same contract.
- Use EIP-712 for the digest to prevent replay attacks across different chains and contracts.
EIP-712 also enables readable signing of typed data for better user safety.
This implementation does NOT check if a signature is non-malleable.*


## Functions
### recover

*Recovers the signer's address from a message digest `hash`, and the `signature`.*


```solidity
function recover(bytes32 hash, bytes memory signature) internal view returns (address result);
```

### recoverCalldata

*Recovers the signer's address from a message digest `hash`, and the `signature`.*


```solidity
function recoverCalldata(bytes32 hash, bytes calldata signature) internal view returns (address result);
```

### recover

*Recovers the signer's address from a message digest `hash`,
and the EIP-2098 short form signature defined by `r` and `vs`.*


```solidity
function recover(bytes32 hash, bytes32 r, bytes32 vs) internal view returns (address result);
```

### recover

*Recovers the signer's address from a message digest `hash`,
and the signature defined by `v`, `r`, `s`.*


```solidity
function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal view returns (address result);
```

### tryRecover

*Recovers the signer's address from a message digest `hash`, and the `signature`.*


```solidity
function tryRecover(bytes32 hash, bytes memory signature) internal view returns (address result);
```

### tryRecoverCalldata

*Recovers the signer's address from a message digest `hash`, and the `signature`.*


```solidity
function tryRecoverCalldata(bytes32 hash, bytes calldata signature) internal view returns (address result);
```

### tryRecover

*Recovers the signer's address from a message digest `hash`,
and the EIP-2098 short form signature defined by `r` and `vs`.*


```solidity
function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) internal view returns (address result);
```

### tryRecover

*Recovers the signer's address from a message digest `hash`,
and the signature defined by `v`, `r`, `s`.*


```solidity
function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal view returns (address result);
```

### toEthSignedMessageHash

*Returns an Ethereum Signed Message, created from a `hash`.
This produces a hash corresponding to the one signed with the
[`eth_sign`](https://eth.wiki/json-rpc/API#eth_sign)
JSON-RPC method as part of EIP-191.*


```solidity
function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32 result);
```

### toEthSignedMessageHash

*Returns an Ethereum Signed Message, created from `s`.
This produces a hash corresponding to the one signed with the
[`eth_sign`](https://eth.wiki/json-rpc/API#eth_sign)
JSON-RPC method as part of EIP-191.
Note: Supports lengths of `s` up to 999999 bytes.*


```solidity
function toEthSignedMessageHash(bytes memory s) internal pure returns (bytes32 result);
```

### emptySignature

*Returns an empty calldata bytes.*


```solidity
function emptySignature() internal pure returns (bytes calldata signature);
```

## Errors
### InvalidSignature
*The signature is invalid.*


```solidity
error InvalidSignature();
```

