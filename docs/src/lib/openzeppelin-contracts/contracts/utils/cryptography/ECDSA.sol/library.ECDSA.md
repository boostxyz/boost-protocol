# ECDSA
*Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
These functions can be used to verify that a message was signed by the holder
of the private keys of a given address.*


## Functions
### tryRecover

*Returns the address that signed a hashed message (`hash`) with `signature` or an error. This will not
return address(0) without also returning an error description. Errors are documented using an enum (error type)
and a bytes32 providing additional information about the error.
If no error is returned, then the address can be used for verification purposes.
The `ecrecover` EVM precompile allows for malleable (non-unique) signatures:
this function rejects them by requiring the `s` value to be in the lower
half order, and the `v` value to be either 27 or 28.
IMPORTANT: `hash` _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling [MessageHashUtils-toEthSignedMessageHash](/lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol/library.MessageHashUtils.md#toethsignedmessagehash) on it.
Documentation for signature generation:
- with https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#sign[Web3.js]
- with https://docs.ethers.io/v5/api/signer/#Signer-signMessage[ethers]*


```solidity
function tryRecover(bytes32 hash, bytes memory signature) internal pure returns (address, RecoverError, bytes32);
```

### recover

*Returns the address that signed a hashed message (`hash`) with
`signature`. This address can then be used for verification purposes.
The `ecrecover` EVM precompile allows for malleable (non-unique) signatures:
this function rejects them by requiring the `s` value to be in the lower
half order, and the `v` value to be either 27 or 28.
IMPORTANT: `hash` _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling [MessageHashUtils-toEthSignedMessageHash](/lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol/library.MessageHashUtils.md#toethsignedmessagehash) on it.*


```solidity
function recover(bytes32 hash, bytes memory signature) internal pure returns (address);
```

### tryRecover

*Overload of {ECDSA-tryRecover} that receives the `r` and `vs` short-signature fields separately.
See https://eips.ethereum.org/EIPS/eip-2098[ERC-2098 short signatures]*


```solidity
function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address, RecoverError, bytes32);
```

### recover

*Overload of [ECDSA-recover](/lib/openzeppelin-contracts/certora/harnesses/ERC20WrapperHarness.sol/contract.ERC20WrapperHarness.md#recover) that receives the `r and `vs` short-signature fields separately.*


```solidity
function recover(bytes32 hash, bytes32 r, bytes32 vs) internal pure returns (address);
```

### tryRecover

*Overload of {ECDSA-tryRecover} that receives the `v`,
`r` and `s` signature fields separately.*


```solidity
function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    internal
    pure
    returns (address, RecoverError, bytes32);
```

### recover

*Overload of [ECDSA-recover](/lib/openzeppelin-contracts/certora/harnesses/ERC20WrapperHarness.sol/contract.ERC20WrapperHarness.md#recover) that receives the `v`,
`r` and `s` signature fields separately.*


```solidity
function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) internal pure returns (address);
```

### _throwError

*Optionally reverts with the corresponding custom error according to the `error` argument provided.*


```solidity
function _throwError(RecoverError error, bytes32 errorArg) private pure;
```

## Errors
### ECDSAInvalidSignature
*The signature derives the `address(0)`.*


```solidity
error ECDSAInvalidSignature();
```

### ECDSAInvalidSignatureLength
*The signature has an invalid length.*


```solidity
error ECDSAInvalidSignatureLength(uint256 length);
```

### ECDSAInvalidSignatureS
*The signature has an S value that is in the upper half order.*


```solidity
error ECDSAInvalidSignatureS(bytes32 s);
```

## Enums
### RecoverError

```solidity
enum RecoverError {
    NoError,
    InvalidSignature,
    InvalidSignatureLength,
    InvalidSignatureS
}
```

