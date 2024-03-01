# MerkleProofLibTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testVerifyProofForHeightOneTree


```solidity
function testVerifyProofForHeightOneTree(bool hasProof, bool nonEmptyProof, bool nonEmptyRoot, bool nonEmptyLeaf)
    public;
```

### testVerifyProof


```solidity
function testVerifyProof(bytes32[] memory data, uint256 randomness) public brutalizeMemory;
```

### testVerifyProofBasicCaseIsValid


```solidity
function testVerifyProofBasicCaseIsValid() public;
```

### testVerifyProofBasicCaseIsInvalid


```solidity
function testVerifyProofBasicCaseIsInvalid() public;
```

### testVerifyMultiProofMalicious


```solidity
function testVerifyMultiProofMalicious() public;
```

### testVerifyProofBasicCase


```solidity
function testVerifyProofBasicCase(bool damageProof, bool damageRoot, bool damageLeaf, bytes32 randomness) public;
```

### testVerifyMultiProofForSingleLeaf


```solidity
function testVerifyMultiProofForSingleLeaf(bytes32[] memory data, uint256 randomness) public brutalizeMemory;
```

### testVerifyMultiProofForHeightOneTree


```solidity
function testVerifyMultiProofForHeightOneTree(
    bool hasProof,
    bool nonEmptyProof,
    bool nonEmptyRoot,
    bool hasLeaf,
    bool nonEmptyLeaf,
    bool[] memory flags
) public;
```

### testVerifyMultiProofForHeightTwoTree


```solidity
function testVerifyMultiProofForHeightTwoTree(
    bool allLeaves,
    bool damageRoot,
    bool damageLeaves,
    bool damageProof,
    bool damageFlags,
    bytes32 randomness
) public;
```

### testVerifyMultiProofIsValid


```solidity
function testVerifyMultiProofIsValid() public;
```

### testVerifyMultiProofIsInvalid


```solidity
function testVerifyMultiProofIsInvalid() public;
```

### testVerifyMultiProof


```solidity
function testVerifyMultiProof(
    bool damageRoot,
    bool damageLeaves,
    bool damageProof,
    bool damageFlags,
    bytes32 randomness
) public brutalizeMemory;
```

### verify


```solidity
function verify(bytes32[] calldata proof, bytes32 root, bytes32 leaf) external returns (bool result);
```

### verifyMultiProof


```solidity
function verifyMultiProof(bytes32[] calldata proof, bytes32 root, bytes32[] calldata leaves, bool[] calldata flags)
    external
    returns (bool result);
```

### _getRoot


```solidity
function _getRoot(bytes32[] memory data) private pure returns (bytes32);
```

### _getProof


```solidity
function _getProof(bytes32[] memory data, uint256 nodeIndex) private pure returns (bytes32[] memory);
```

### _hashLevel


```solidity
function _hashLevel(bytes32[] memory data) private pure returns (bytes32[] memory);
```

### _hashPair


```solidity
function _hashPair(bytes32 left, bytes32 right) private pure returns (bytes32 result);
```

### testEmptyCalldataHelpers


```solidity
function testEmptyCalldataHelpers() public;
```

