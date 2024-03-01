# MerkleProofLib
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/MerkleProofLib.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/MerkleProofLib.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol)

Gas optimized verification of proof of inclusion for a leaf in a Merkle tree.


## Functions
### verify

*Returns whether `leaf` exists in the Merkle tree with `root`, given `proof`.*


```solidity
function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool isValid);
```

### verifyCalldata

*Returns whether `leaf` exists in the Merkle tree with `root`, given `proof`.*


```solidity
function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) internal pure returns (bool isValid);
```

### verifyMultiProof

*Returns whether all `leaves` exist in the Merkle tree with `root`,
given `proof` and `flags`.
Note:
- Breaking the invariant `flags.length == (leaves.length - 1) + proof.length`
will always return false.
- The sum of the lengths of `proof` and `leaves` must never overflow.
- Any non-zero word in the `flags` array is treated as true.
- The memory offset of `proof` must be non-zero
(i.e. `proof` is not pointing to the scratch space).*


```solidity
function verifyMultiProof(bytes32[] memory proof, bytes32 root, bytes32[] memory leaves, bool[] memory flags)
    internal
    pure
    returns (bool isValid);
```

### verifyMultiProofCalldata

*Returns whether all `leaves` exist in the Merkle tree with `root`,
given `proof` and `flags`.
Note:
- Breaking the invariant `flags.length == (leaves.length - 1) + proof.length`
will always return false.
- Any non-zero word in the `flags` array is treated as true.
- The calldata offset of `proof` must be non-zero
(i.e. `proof` is from a regular Solidity function with a 4-byte selector).*


```solidity
function verifyMultiProofCalldata(
    bytes32[] calldata proof,
    bytes32 root,
    bytes32[] calldata leaves,
    bool[] calldata flags
) internal pure returns (bool isValid);
```

### emptyProof

*Returns an empty calldata bytes32 array.*


```solidity
function emptyProof() internal pure returns (bytes32[] calldata proof);
```

### emptyLeaves

*Returns an empty calldata bytes32 array.*


```solidity
function emptyLeaves() internal pure returns (bytes32[] calldata leaves);
```

### emptyFlags

*Returns an empty calldata bool array.*


```solidity
function emptyFlags() internal pure returns (bool[] calldata flags);
```

