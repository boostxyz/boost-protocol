# MerkleProof
*These functions deal with verification of Merkle Tree proofs.
The tree and the proofs can be generated using our
https://github.com/OpenZeppelin/merkle-tree[JavaScript library].
You will find a quickstart guide in the readme.
WARNING: You should avoid using leaf values that are 64 bytes long prior to
hashing, or use a hash function other than keccak256 for hashing leaves.
This is because the concatenation of a sorted pair of internal nodes in
the Merkle tree could be reinterpreted as a leaf value.
OpenZeppelin's JavaScript library generates Merkle trees that are safe
against this attack out of the box.*


## Functions
### verify

*Returns true if a `leaf` can be proved to be a part of a Merkle tree
defined by `root`. For this, a `proof` must be provided, containing
sibling hashes on the branch from the leaf to the root of the tree. Each
pair of leaves and each pair of pre-images are assumed to be sorted.*


```solidity
function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool);
```

### verifyCalldata

*Calldata version of [verify](/lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol/library.MerkleProof.md#verify)*


```solidity
function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) internal pure returns (bool);
```

### processProof

*Returns the rebuilt hash obtained by traversing a Merkle tree up
from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
hash matches the root of the tree. When processing the proof, the pairs
of leafs & pre-images are assumed to be sorted.*


```solidity
function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32);
```

### processProofCalldata

*Calldata version of [processProof](/lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol/library.MerkleProof.md#processproof)*


```solidity
function processProofCalldata(bytes32[] calldata proof, bytes32 leaf) internal pure returns (bytes32);
```

### multiProofVerify

*Returns true if the `leaves` can be simultaneously proven to be a part of a Merkle tree defined by
`root`, according to `proof` and `proofFlags` as described in [processMultiProof](/lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol/library.MerkleProof.md#processmultiproof).
CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.*


```solidity
function multiProofVerify(bytes32[] memory proof, bool[] memory proofFlags, bytes32 root, bytes32[] memory leaves)
    internal
    pure
    returns (bool);
```

### multiProofVerifyCalldata

*Calldata version of [multiProofVerify](/lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol/library.MerkleProof.md#multiproofverify)
CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.*


```solidity
function multiProofVerifyCalldata(
    bytes32[] calldata proof,
    bool[] calldata proofFlags,
    bytes32 root,
    bytes32[] memory leaves
) internal pure returns (bool);
```

### processMultiProof

*Returns the root of a tree reconstructed from `leaves` and sibling nodes in `proof`. The reconstruction
proceeds by incrementally reconstructing all inner nodes by combining a leaf/inner node with either another
leaf/inner node or a proof sibling node, depending on whether each `proofFlags` item is true or false
respectively.
CAUTION: Not all Merkle trees admit multiproofs. To use multiproofs, it is sufficient to ensure that: 1) the tree
is complete (but not necessarily perfect), 2) the leaves to be proven are in the opposite order they are in the
tree (i.e., as seen from right to left starting at the deepest layer and continuing at the next layer).*


```solidity
function processMultiProof(bytes32[] memory proof, bool[] memory proofFlags, bytes32[] memory leaves)
    internal
    pure
    returns (bytes32 merkleRoot);
```

### processMultiProofCalldata

*Calldata version of [processMultiProof](/lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol/library.MerkleProof.md#processmultiproof).
CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.*


```solidity
function processMultiProofCalldata(bytes32[] calldata proof, bool[] calldata proofFlags, bytes32[] memory leaves)
    internal
    pure
    returns (bytes32 merkleRoot);
```

### _hashPair

*Sorts the pair (a, b) and hashes the result.*


```solidity
function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32);
```

### _efficientHash

*Implementation of keccak256(abi.encode(a, b)) that doesn't allocate or expand memory.*


```solidity
function _efficientHash(bytes32 a, bytes32 b) private pure returns (bytes32 value);
```

## Errors
### MerkleProofInvalidMultiproof
*The multiproof provided is not valid.*


```solidity
error MerkleProofInvalidMultiproof();
```

