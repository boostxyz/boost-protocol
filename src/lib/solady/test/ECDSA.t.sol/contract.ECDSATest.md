# ECDSATest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### TEST_MESSAGE

```solidity
bytes32 constant TEST_MESSAGE = 0x7dbaf558b0a1a5dc7a67202117ab143c1d8605a983e4a743bc06fcc03162dc0d;
```


### WRONG_MESSAGE

```solidity
bytes32 constant WRONG_MESSAGE = 0x2d0828dd7c97cff316356da3c16c68ba2316886a0e05ebafb8291939310d51a3;
```


### SIGNER

```solidity
address constant SIGNER = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
```


### V0_SIGNER

```solidity
address constant V0_SIGNER = 0x2cc1166f6212628A0deEf2B33BEFB2187D35b86c;
```


### V1_SIGNER

```solidity
address constant V1_SIGNER = 0x1E318623aB09Fe6de3C9b8672098464Aeda9100E;
```


## Functions
### testTryRecoverWithInvalidShortSignatureReturnsZero


```solidity
function testTryRecoverWithInvalidShortSignatureReturnsZero() public;
```

### testTryRecoverWithInvalidLongSignatureReturnsZero


```solidity
function testTryRecoverWithInvalidLongSignatureReturnsZero() public;
```

### testTryRecoverWithValidSignature


```solidity
function testTryRecoverWithValidSignature() public;
```

### testTryRecoverWithWrongSigner


```solidity
function testTryRecoverWithWrongSigner() public;
```

### testTryRecoverWithInvalidSignature


```solidity
function testTryRecoverWithInvalidSignature() public;
```

### testTryRecoverWithV0SignatureWithVersion00ReturnsZero


```solidity
function testTryRecoverWithV0SignatureWithVersion00ReturnsZero() public;
```

### testTryRecoverWithV0SignatureWithVersion27


```solidity
function testTryRecoverWithV0SignatureWithVersion27() public;
```

### testTryRecoverWithV0SignatureWithWrongVersionReturnsZero


```solidity
function testTryRecoverWithV0SignatureWithWrongVersionReturnsZero() public;
```

### testTryRecoverWithV0SignatureWithShortEIP2098Format


```solidity
function testTryRecoverWithV0SignatureWithShortEIP2098Format() public;
```

### testTryRecoverWithV0SignatureWithShortEIP2098FormatAsCalldata


```solidity
function testTryRecoverWithV0SignatureWithShortEIP2098FormatAsCalldata() public;
```

### testTryRecoverWithV1SignatureWithVersion01ReturnsZero


```solidity
function testTryRecoverWithV1SignatureWithVersion01ReturnsZero() public;
```

### testTryRecoverWithV1SignatureWithVersion28


```solidity
function testTryRecoverWithV1SignatureWithVersion28() public;
```

### testTryRecoverWithV1SignatureWithWrongVersionReturnsZero


```solidity
function testTryRecoverWithV1SignatureWithWrongVersionReturnsZero() public;
```

### testTryRecoverWithV1SignatureWithShortEIP2098Format


```solidity
function testTryRecoverWithV1SignatureWithShortEIP2098Format() public;
```

### testTryRecoverWithV1SignatureWithShortEIP2098FormatAsCalldata


```solidity
function testTryRecoverWithV1SignatureWithShortEIP2098FormatAsCalldata() public;
```

### testRecoverWithInvalidShortSignatureReturnsZero


```solidity
function testRecoverWithInvalidShortSignatureReturnsZero() public;
```

### testRecoverWithInvalidLongSignatureReverts


```solidity
function testRecoverWithInvalidLongSignatureReverts() public;
```

### testRecoverWithValidSignature


```solidity
function testRecoverWithValidSignature() public;
```

### testRecoverWithWrongSigner


```solidity
function testRecoverWithWrongSigner() public;
```

### testRecoverWithInvalidSignatureReverts


```solidity
function testRecoverWithInvalidSignatureReverts() public;
```

### testRecoverWithV0SignatureWithVersion00Reverts


```solidity
function testRecoverWithV0SignatureWithVersion00Reverts() public;
```

### testRecoverWithV0SignatureWithVersion27


```solidity
function testRecoverWithV0SignatureWithVersion27() public;
```

### testRecoverWithV0SignatureWithWrongVersionReverts


```solidity
function testRecoverWithV0SignatureWithWrongVersionReverts() public;
```

### testRecoverWithV0SignatureWithShortEIP2098Format


```solidity
function testRecoverWithV0SignatureWithShortEIP2098Format() public;
```

### testRecoverWithV0SignatureWithShortEIP2098FormatAsCalldata


```solidity
function testRecoverWithV0SignatureWithShortEIP2098FormatAsCalldata() public;
```

### testRecoverWithV1SignatureWithVersion01Reverts


```solidity
function testRecoverWithV1SignatureWithVersion01Reverts() public;
```

### testRecoverWithV1SignatureWithVersion28


```solidity
function testRecoverWithV1SignatureWithVersion28() public;
```

### testRecoverWithV1SignatureWithWrongVersionReverts


```solidity
function testRecoverWithV1SignatureWithWrongVersionReverts() public;
```

### testRecoverWithV1SignatureWithShortEIP2098Format


```solidity
function testRecoverWithV1SignatureWithShortEIP2098Format() public;
```

### testRecoverWithV1SignatureWithShortEIP2098FormatAsCalldata


```solidity
function testRecoverWithV1SignatureWithShortEIP2098FormatAsCalldata() public;
```

### _checkSignature


```solidity
function _checkSignature(address signer, bytes32 digest, uint8 v, bytes32 r, bytes32 s, bool expected) internal;
```

### _checkSignature


```solidity
function _checkSignature(_CheckSignatureTestTemps memory t) internal;
```

### testRecoverAndTryRecover


```solidity
function testRecoverAndTryRecover(bytes32 digest) public;
```

### testBytes32ToEthSignedMessageHash


```solidity
function testBytes32ToEthSignedMessageHash() public;
```

### testBytesToEthSignedMessageHashShort


```solidity
function testBytesToEthSignedMessageHashShort() public;
```

### testBytesToEthSignedMessageHashEmpty


```solidity
function testBytesToEthSignedMessageHashEmpty() public;
```

### testBytesToEthSignedMessageHashLong


```solidity
function testBytesToEthSignedMessageHashLong() public;
```

### testBytesToEthSignedMessageHash


```solidity
function testBytesToEthSignedMessageHash() public;
```

### testBytesToEthSignedMessageHashExceedsMaxLengthReverts


```solidity
function testBytesToEthSignedMessageHashExceedsMaxLengthReverts() public;
```

### _testBytesToEthSignedMessageHash


```solidity
function _testBytesToEthSignedMessageHash(uint256 n) internal brutalizeMemory;
```

### tryRecover


```solidity
function tryRecover(bytes32 hash, bytes calldata signature) external returns (address result);
```

### tryRecover


```solidity
function tryRecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view returns (address);
```

### tryRecover


```solidity
function tryRecover(bytes32 hash, bytes32 r, bytes32 vs) external view returns (address);
```

### tryRecoverBrutalized


```solidity
function tryRecoverBrutalized(bytes32 hash, bytes calldata signature)
    external
    brutalizeMemory
    returns (address result);
```

### tryRecoverBrutalized


```solidity
function tryRecoverBrutalized(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    external
    view
    brutalizeMemory
    returns (address);
```

### tryRecoverBrutalized


```solidity
function tryRecoverBrutalized(bytes32 hash, bytes32 r, bytes32 vs) external view brutalizeMemory returns (address);
```

### recover


```solidity
function recover(bytes32 hash, bytes calldata signature) external returns (address result);
```

### recover


```solidity
function recover(bytes32 hash, bytes32 r, bytes32 vs) external view returns (address);
```

### recover


```solidity
function recover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) external view returns (address);
```

### recoverBrutalized


```solidity
function recoverBrutalized(bytes32 hash, bytes calldata signature) external brutalizeMemory returns (address result);
```

### recoverBrutalized


```solidity
function recoverBrutalized(bytes32 hash, bytes32 r, bytes32 vs) external view brutalizeMemory returns (address);
```

### recoverBrutalized


```solidity
function recoverBrutalized(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    external
    view
    brutalizeMemory
    returns (address);
```

### testEmptyCalldataHelpers


```solidity
function testEmptyCalldataHelpers() public;
```

## Structs
### _CheckSignatureTestTemps

```solidity
struct _CheckSignatureTestTemps {
    bytes argsSignature;
    bytes encodedCalldataArgs;
    address signer;
    bool expected;
    bool[2] success;
    bytes[2] result;
    bytes4 s;
    address recovered;
}
```

