# MerkleProofMock

## Functions
### verify


```solidity
function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) external pure returns (bool);
```

### verifyCalldata


```solidity
function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) external pure returns (bool);
```

### verifyMultiProof


```solidity
function verifyMultiProof(bytes32[] memory proof, bytes32 root, bytes32[] memory leaves, bool[] memory flags)
    external
    pure
    returns (bool);
```

### verifyMultiProofCalldata


```solidity
function verifyMultiProofCalldata(
    bytes32[] calldata proof,
    bytes32 root,
    bytes32[] calldata leaves,
    bool[] calldata flags
) external pure returns (bool);
```

