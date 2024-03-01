# VmSafe

## Functions
### load


```solidity
function load(address target, bytes32 slot) external view returns (bytes32 data);
```

### sign


```solidity
function sign(uint256 privateKey, bytes32 digest) external pure returns (uint8 v, bytes32 r, bytes32 s);
```

### addr


```solidity
function addr(uint256 privateKey) external pure returns (address keyAddr);
```

### getNonce


```solidity
function getNonce(address account) external view returns (uint64 nonce);
```

### ffi


```solidity
function ffi(string[] calldata commandInput) external returns (bytes memory result);
```

### setEnv


```solidity
function setEnv(string calldata name, string calldata value) external;
```

### envBool


```solidity
function envBool(string calldata name) external view returns (bool value);
```

### envUint


```solidity
function envUint(string calldata name) external view returns (uint256 value);
```

### envInt


```solidity
function envInt(string calldata name) external view returns (int256 value);
```

### envAddress


```solidity
function envAddress(string calldata name) external view returns (address value);
```

### envBytes32


```solidity
function envBytes32(string calldata name) external view returns (bytes32 value);
```

### envString


```solidity
function envString(string calldata name) external view returns (string memory value);
```

### envBytes


```solidity
function envBytes(string calldata name) external view returns (bytes memory value);
```

### envBool


```solidity
function envBool(string calldata name, string calldata delim) external view returns (bool[] memory value);
```

### envUint


```solidity
function envUint(string calldata name, string calldata delim) external view returns (uint256[] memory value);
```

### envInt


```solidity
function envInt(string calldata name, string calldata delim) external view returns (int256[] memory value);
```

### envAddress


```solidity
function envAddress(string calldata name, string calldata delim) external view returns (address[] memory value);
```

### envBytes32


```solidity
function envBytes32(string calldata name, string calldata delim) external view returns (bytes32[] memory value);
```

### envString


```solidity
function envString(string calldata name, string calldata delim) external view returns (string[] memory value);
```

### envBytes


```solidity
function envBytes(string calldata name, string calldata delim) external view returns (bytes[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, bool defaultValue) external returns (bool value);
```

### envOr


```solidity
function envOr(string calldata name, uint256 defaultValue) external returns (uint256 value);
```

### envOr


```solidity
function envOr(string calldata name, int256 defaultValue) external returns (int256 value);
```

### envOr


```solidity
function envOr(string calldata name, address defaultValue) external returns (address value);
```

### envOr


```solidity
function envOr(string calldata name, bytes32 defaultValue) external returns (bytes32 value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata defaultValue) external returns (string memory value);
```

### envOr


```solidity
function envOr(string calldata name, bytes calldata defaultValue) external returns (bytes memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, bool[] calldata defaultValue)
    external
    returns (bool[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, uint256[] calldata defaultValue)
    external
    returns (uint256[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, int256[] calldata defaultValue)
    external
    returns (int256[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, address[] calldata defaultValue)
    external
    returns (address[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, bytes32[] calldata defaultValue)
    external
    returns (bytes32[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, string[] calldata defaultValue)
    external
    returns (string[] memory value);
```

### envOr


```solidity
function envOr(string calldata name, string calldata delim, bytes[] calldata defaultValue)
    external
    returns (bytes[] memory value);
```

### record


```solidity
function record() external;
```

### accesses


```solidity
function accesses(address target) external returns (bytes32[] memory readSlots, bytes32[] memory writeSlots);
```

### getCode


```solidity
function getCode(string calldata artifactPath) external view returns (bytes memory creationBytecode);
```

### getDeployedCode


```solidity
function getDeployedCode(string calldata artifactPath) external view returns (bytes memory runtimeBytecode);
```

### label


```solidity
function label(address account, string calldata newLabel) external;
```

### broadcast


```solidity
function broadcast() external;
```

### broadcast


```solidity
function broadcast(address signer) external;
```

### broadcast


```solidity
function broadcast(uint256 privateKey) external;
```

### startBroadcast


```solidity
function startBroadcast() external;
```

### startBroadcast


```solidity
function startBroadcast(address signer) external;
```

### startBroadcast


```solidity
function startBroadcast(uint256 privateKey) external;
```

### stopBroadcast


```solidity
function stopBroadcast() external;
```

### readFile


```solidity
function readFile(string calldata path) external view returns (string memory data);
```

### readFileBinary


```solidity
function readFileBinary(string calldata path) external view returns (bytes memory data);
```

### projectRoot


```solidity
function projectRoot() external view returns (string memory path);
```

### fsMetadata


```solidity
function fsMetadata(string calldata fileOrDir) external returns (FsMetadata memory metadata);
```

### readLine


```solidity
function readLine(string calldata path) external view returns (string memory line);
```

### writeFile


```solidity
function writeFile(string calldata path, string calldata data) external;
```

### writeFileBinary


```solidity
function writeFileBinary(string calldata path, bytes calldata data) external;
```

### writeLine


```solidity
function writeLine(string calldata path, string calldata data) external;
```

### closeFile


```solidity
function closeFile(string calldata path) external;
```

### removeFile


```solidity
function removeFile(string calldata path) external;
```

### toString


```solidity
function toString(address value) external pure returns (string memory stringifiedValue);
```

### toString


```solidity
function toString(bytes calldata value) external pure returns (string memory stringifiedValue);
```

### toString


```solidity
function toString(bytes32 value) external pure returns (string memory stringifiedValue);
```

### toString


```solidity
function toString(bool value) external pure returns (string memory stringifiedValue);
```

### toString


```solidity
function toString(uint256 value) external pure returns (string memory stringifiedValue);
```

### toString


```solidity
function toString(int256 value) external pure returns (string memory stringifiedValue);
```

### parseBytes


```solidity
function parseBytes(string calldata stringifiedValue) external pure returns (bytes memory parsedValue);
```

### parseAddress


```solidity
function parseAddress(string calldata stringifiedValue) external pure returns (address parsedValue);
```

### parseUint


```solidity
function parseUint(string calldata stringifiedValue) external pure returns (uint256 parsedValue);
```

### parseInt


```solidity
function parseInt(string calldata stringifiedValue) external pure returns (int256 parsedValue);
```

### parseBytes32


```solidity
function parseBytes32(string calldata stringifiedValue) external pure returns (bytes32 parsedValue);
```

### parseBool


```solidity
function parseBool(string calldata stringifiedValue) external pure returns (bool parsedValue);
```

### recordLogs


```solidity
function recordLogs() external;
```

### getRecordedLogs


```solidity
function getRecordedLogs() external returns (Log[] memory logs);
```

### deriveKey


```solidity
function deriveKey(string calldata mnemonic, uint32 index) external pure returns (uint256 privateKey);
```

### deriveKey


```solidity
function deriveKey(string calldata mnemonic, string calldata derivationPath, uint32 index)
    external
    pure
    returns (uint256 privateKey);
```

### rememberKey


```solidity
function rememberKey(uint256 privateKey) external returns (address keyAddr);
```

### parseJson


```solidity
function parseJson(string calldata json, string calldata key) external pure returns (bytes memory abiEncodedData);
```

### parseJson


```solidity
function parseJson(string calldata json) external pure returns (bytes memory abiEncodedData);
```

### parseJsonUint


```solidity
function parseJsonUint(string calldata, string calldata) external returns (uint256);
```

### parseJsonUintArray


```solidity
function parseJsonUintArray(string calldata, string calldata) external returns (uint256[] memory);
```

### parseJsonInt


```solidity
function parseJsonInt(string calldata, string calldata) external returns (int256);
```

### parseJsonIntArray


```solidity
function parseJsonIntArray(string calldata, string calldata) external returns (int256[] memory);
```

### parseJsonBool


```solidity
function parseJsonBool(string calldata, string calldata) external returns (bool);
```

### parseJsonBoolArray


```solidity
function parseJsonBoolArray(string calldata, string calldata) external returns (bool[] memory);
```

### parseJsonAddress


```solidity
function parseJsonAddress(string calldata, string calldata) external returns (address);
```

### parseJsonAddressArray


```solidity
function parseJsonAddressArray(string calldata, string calldata) external returns (address[] memory);
```

### parseJsonString


```solidity
function parseJsonString(string calldata, string calldata) external returns (string memory);
```

### parseJsonStringArray


```solidity
function parseJsonStringArray(string calldata, string calldata) external returns (string[] memory);
```

### parseJsonBytes


```solidity
function parseJsonBytes(string calldata, string calldata) external returns (bytes memory);
```

### parseJsonBytesArray


```solidity
function parseJsonBytesArray(string calldata, string calldata) external returns (bytes[] memory);
```

### parseJsonBytes32


```solidity
function parseJsonBytes32(string calldata, string calldata) external returns (bytes32);
```

### parseJsonBytes32Array


```solidity
function parseJsonBytes32Array(string calldata, string calldata) external returns (bytes32[] memory);
```

### serializeBool


```solidity
function serializeBool(string calldata objectKey, string calldata valueKey, bool value)
    external
    returns (string memory json);
```

### serializeUint


```solidity
function serializeUint(string calldata objectKey, string calldata valueKey, uint256 value)
    external
    returns (string memory json);
```

### serializeInt


```solidity
function serializeInt(string calldata objectKey, string calldata valueKey, int256 value)
    external
    returns (string memory json);
```

### serializeAddress


```solidity
function serializeAddress(string calldata objectKey, string calldata valueKey, address value)
    external
    returns (string memory json);
```

### serializeBytes32


```solidity
function serializeBytes32(string calldata objectKey, string calldata valueKey, bytes32 value)
    external
    returns (string memory json);
```

### serializeString


```solidity
function serializeString(string calldata objectKey, string calldata valueKey, string calldata value)
    external
    returns (string memory json);
```

### serializeBytes


```solidity
function serializeBytes(string calldata objectKey, string calldata valueKey, bytes calldata value)
    external
    returns (string memory json);
```

### serializeBool


```solidity
function serializeBool(string calldata objectKey, string calldata valueKey, bool[] calldata values)
    external
    returns (string memory json);
```

### serializeUint


```solidity
function serializeUint(string calldata objectKey, string calldata valueKey, uint256[] calldata values)
    external
    returns (string memory json);
```

### serializeInt


```solidity
function serializeInt(string calldata objectKey, string calldata valueKey, int256[] calldata values)
    external
    returns (string memory json);
```

### serializeAddress


```solidity
function serializeAddress(string calldata objectKey, string calldata valueKey, address[] calldata values)
    external
    returns (string memory json);
```

### serializeBytes32


```solidity
function serializeBytes32(string calldata objectKey, string calldata valueKey, bytes32[] calldata values)
    external
    returns (string memory json);
```

### serializeString


```solidity
function serializeString(string calldata objectKey, string calldata valueKey, string[] calldata values)
    external
    returns (string memory json);
```

### serializeBytes


```solidity
function serializeBytes(string calldata objectKey, string calldata valueKey, bytes[] calldata values)
    external
    returns (string memory json);
```

### writeJson


```solidity
function writeJson(string calldata json, string calldata path) external;
```

### writeJson


```solidity
function writeJson(string calldata json, string calldata path, string calldata valueKey) external;
```

### rpcUrl


```solidity
function rpcUrl(string calldata rpcAlias) external view returns (string memory json);
```

### rpcUrls


```solidity
function rpcUrls() external view returns (string[2][] memory urls);
```

### rpcUrlStructs


```solidity
function rpcUrlStructs() external view returns (Rpc[] memory urls);
```

### assume


```solidity
function assume(bool condition) external pure;
```

### pauseGasMetering


```solidity
function pauseGasMetering() external;
```

### resumeGasMetering


```solidity
function resumeGasMetering() external;
```

## Structs
### Log

```solidity
struct Log {
    bytes32[] topics;
    bytes data;
    address emitter;
}
```

### Rpc

```solidity
struct Rpc {
    string key;
    string url;
}
```

### FsMetadata

```solidity
struct FsMetadata {
    bool isDir;
    bool isSymlink;
    uint256 length;
    bool readOnly;
    uint256 modified;
    uint256 accessed;
    uint256 created;
}
```

