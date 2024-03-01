# SignatureChecker
*Signature verification helper that can be used instead of `ECDSA.recover` to seamlessly support both ECDSA
signatures from externally owned accounts (EOAs) as well as ERC-1271 signatures from smart contract wallets like
Argent and Safe Wallet (previously Gnosis Safe).*


## Functions
### isValidSignatureNow

*Checks if a signature is valid for a given signer and data hash. If the signer is a smart contract, the
signature is validated against that smart contract using ERC-1271, otherwise it's validated using `ECDSA.recover`.
NOTE: Unlike ECDSA signatures, contract signatures are revocable, and the outcome of this function can thus
change through time. It could return true at block N and false at block N+1 (or the opposite).*


```solidity
function isValidSignatureNow(address signer, bytes32 hash, bytes memory signature) internal view returns (bool);
```

### isValidERC1271SignatureNow

*Checks if a signature is valid for a given signer and data hash. The signature is validated
against the signer smart contract using ERC-1271.
NOTE: Unlike ECDSA signatures, contract signatures are revocable, and the outcome of this function can thus
change through time. It could return true at block N and false at block N+1 (or the opposite).*


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, bytes memory signature)
    internal
    view
    returns (bool);
```

