# SignatureCheckerMock

## Functions
### isValidSignatureNow


```solidity
function isValidSignatureNow(address signer, bytes32 hash, bytes memory signature) external view returns (bool);
```

### isValidSignatureNowCalldata


```solidity
function isValidSignatureNowCalldata(address signer, bytes32 hash, bytes calldata signature)
    external
    view
    returns (bool);
```

### isValidSignatureNow


```solidity
function isValidSignatureNow(address signer, bytes32 hash, bytes32 r, bytes32 vs) external view returns (bool);
```

### isValidSignatureNow


```solidity
function isValidSignatureNow(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    external
    view
    returns (bool);
```

### isValidERC1271SignatureNow


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, bytes memory signature)
    external
    view
    returns (bool);
```

### isValidERC1271SignatureNowCalldata


```solidity
function isValidERC1271SignatureNowCalldata(address signer, bytes32 hash, bytes calldata signature)
    external
    view
    returns (bool);
```

### isValidERC1271SignatureNow


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, bytes32 r, bytes32 vs) external view returns (bool);
```

### isValidERC1271SignatureNow


```solidity
function isValidERC1271SignatureNow(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    external
    view
    returns (bool);
```

