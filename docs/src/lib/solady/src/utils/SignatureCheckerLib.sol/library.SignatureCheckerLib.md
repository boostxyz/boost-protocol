# SignatureCheckerLib
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/SignatureCheckerLib.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/SignatureChecker.sol)

Signature verification helper that supports both ECDSA signatures from EOAs
and ERC1271 signatures from smart contract wallets like Argent and Gnosis safe.

*Note:
- The signature checking functions use the ecrecover precompile (0x1).
- The `bytes memory signature` variants use the identity precompile (0x4)
to copy memory internally.
- Unlike ECDSA signatures, contract signatures are revocable.
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
### isValidSignatureNow

*Returns whether `signature` is valid for `signer` and `hash`.
If `signer` is a smart contract, the signature is validated with ERC1271.
Otherwise, the signature is validated with `ECDSA.recover`.*


```solidity
function isValidSignatureNow(address signer, bytes32 hash, bytes memory signature)
    internal
    view
    returns (bool isValid);
```

### isValidSignatureNowCalldata

*Returns whether `signature` is valid for `signer` and `hash`.
If `signer` is a smart contract, the signature is validated with ERC1271.
Otherwise, the signature is validated with `ECDSA.recover`.*


```solidity
function isValidSignatureNowCalldata(address signer, bytes32 hash, bytes calldata signature)
    internal
    view
    returns (bool isValid);
```

### isValidSignatureNow

*Returns whether the signature (`r`, `vs`) is valid for `signer` and `hash`.
If `signer` is a smart contract, the signature is validated with ERC1271.
Otherwise, the signature is validated with `ECDSA.recover`.*


```solidity
function isValidSignatureNow(address signer, bytes32 hash, bytes32 r, bytes32 vs)
    internal
    view
    returns (bool isValid);
```

### isValidSignatureNow

*Returns whether the signature (`v`, `r`, `s`) is valid for `signer` and `hash`.
If `signer` is a smart contract, the signature is validated with ERC1271.
Otherwise, the signature is validated with `ECDSA.recover`.*


```solidity
function isValidSignatureNow(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    internal
    view
    returns (bool isValid);
```

### isValidERC1271SignatureNow

*Returns whether `signature` is valid for `hash` for an ERC1271 `signer` contract.*


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, bytes memory signature)
    internal
    view
    returns (bool isValid);
```

### isValidERC1271SignatureNowCalldata

*Returns whether `signature` is valid for `hash` for an ERC1271 `signer` contract.*


```solidity
function isValidERC1271SignatureNowCalldata(address signer, bytes32 hash, bytes calldata signature)
    internal
    view
    returns (bool isValid);
```

### isValidERC1271SignatureNow

*Returns whether the signature (`r`, `vs`) is valid for `hash`
for an ERC1271 `signer` contract.*


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, bytes32 r, bytes32 vs)
    internal
    view
    returns (bool isValid);
```

### isValidERC1271SignatureNow

*Returns whether the signature (`v`, `r`, `s`) is valid for `hash`
for an ERC1271 `signer` contract.*


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    internal
    view
    returns (bool isValid);
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

