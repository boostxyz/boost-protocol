# SignatureCheckerLibTest
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


### OTHER

```solidity
address constant OTHER = address(uint160(1));
```


### TEST_SIGNED_MESSAGE_HASH

```solidity
bytes32 constant TEST_SIGNED_MESSAGE_HASH = 0x7d768af957ef8cbf6219a37e743d5546d911dae3e46449d8a5810522db2ef65e;
```


### WRONG_SIGNED_MESSAGE_HASH

```solidity
bytes32 constant WRONG_SIGNED_MESSAGE_HASH = 0x8cd3e659093d21364c6330514aff328218aa29c2693c5b0e96602df075561952;
```


### SIGNATURE

```solidity
bytes constant SIGNATURE =
    hex"8688e590483917863a35ef230c0f839be8418aa4ee765228eddfcea7fe2652815db01c2c84b0ec746e1b74d97475c599b3d3419fa7181b4e01de62c02b721aea1b";
```


### INVALID_SIGNATURE

```solidity
bytes constant INVALID_SIGNATURE =
    hex"7688e590483917863a35ef230c0f839be8418aa4ee765228eddfcea7fe2652815db01c2c84b0ec746e1b74d97475c599b3d3419fa7181b4e01de62c02b721aea1b";
```


### mockERC1271Wallet

```solidity
MockERC1271Wallet mockERC1271Wallet;
```


### mockERC1271Malicious

```solidity
MockERC1271Malicious mockERC1271Malicious;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testSignatureCheckerOnEOAWithMatchingSignerAndSignature


```solidity
function testSignatureCheckerOnEOAWithMatchingSignerAndSignature() public;
```

### testSignatureCheckerOnEOAWithInvalidSigner


```solidity
function testSignatureCheckerOnEOAWithInvalidSigner() public;
```

### testSignatureCheckerOnEOAWithWrongSignedMessageHash


```solidity
function testSignatureCheckerOnEOAWithWrongSignedMessageHash() public;
```

### testSignatureCheckerOnEOAWithInvalidSignature


```solidity
function testSignatureCheckerOnEOAWithInvalidSignature() public;
```

### testSignatureCheckerOnWalletWithMatchingSignerAndSignature


```solidity
function testSignatureCheckerOnWalletWithMatchingSignerAndSignature() public;
```

### testSignatureCheckerOnWalletWithInvalidSigner


```solidity
function testSignatureCheckerOnWalletWithInvalidSigner() public;
```

### testSignatureCheckerOnWalletWithZeroAddressSigner


```solidity
function testSignatureCheckerOnWalletWithZeroAddressSigner() public;
```

### testSignatureCheckerOnWalletWithWrongSignedMessageHash


```solidity
function testSignatureCheckerOnWalletWithWrongSignedMessageHash() public;
```

### testSignatureCheckerOnWalletWithInvalidSignature


```solidity
function testSignatureCheckerOnWalletWithInvalidSignature() public;
```

### testSignatureCheckerOnMaliciousWallet


```solidity
function testSignatureCheckerOnMaliciousWallet() public;
```

### testSignatureChecker


```solidity
function testSignatureChecker(bytes32 digest) public;
```

### _checkSignatureBothModes


```solidity
function _checkSignatureBothModes(address signer, bytes32 hash, bytes memory signature, bool expectedResult) internal;
```

### _checkSignature


```solidity
function _checkSignature(address signer, bytes32 hash, bytes memory signature, bool expectedResult) internal;
```

### _checkSignature


```solidity
function _checkSignature(bool onlyERC1271, address signer, bytes32 hash, bytes memory signature, bool expectedResult)
    internal;
```

### isValidSignatureNow


```solidity
function isValidSignatureNow(address signer, bytes32 hash, bytes calldata signature) external returns (bool result);
```

### isValidERC1271SignatureNow


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, bytes calldata signature)
    external
    returns (bool result);
```

### isValidSignatureNowCalldata


```solidity
function isValidSignatureNowCalldata(address signer, bytes32 hash, bytes calldata signature)
    external
    view
    returns (bool result);
```

### isValidERC1271SignatureNowCalldata


```solidity
function isValidERC1271SignatureNowCalldata(address signer, bytes32 hash, bytes calldata signature)
    external
    view
    returns (bool result);
```

### testEmptyCalldataHelpers


```solidity
function testEmptyCalldataHelpers() public;
```

### testToEthSignedMessageHashDifferential


```solidity
function testToEthSignedMessageHashDifferential(bytes32 hash) public;
```

### testToEthSignedMessageHashDifferential


```solidity
function testToEthSignedMessageHashDifferential(bytes memory s) public;
```

