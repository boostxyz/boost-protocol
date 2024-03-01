# VmSafe
The `VmSafe` interface does not allow manipulation of the EVM state or other actions that may
result in Script simulations differing from on-chain execution. It is recommended to only use
these cheats in scripts.


## Functions
### envAddress

Gets the environment variable `name` and parses it as `address`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envAddress(string calldata name) external view returns (address value);
```

### envAddress

Gets the environment variable `name` and parses it as an array of `address`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envAddress(string calldata name, string calldata delim) external view returns (address[] memory value);
```

### envBool

Gets the environment variable `name` and parses it as `bool`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envBool(string calldata name) external view returns (bool value);
```

### envBool

Gets the environment variable `name` and parses it as an array of `bool`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envBool(string calldata name, string calldata delim) external view returns (bool[] memory value);
```

### envBytes32

Gets the environment variable `name` and parses it as `bytes32`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envBytes32(string calldata name) external view returns (bytes32 value);
```

### envBytes32

Gets the environment variable `name` and parses it as an array of `bytes32`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envBytes32(string calldata name, string calldata delim) external view returns (bytes32[] memory value);
```

### envBytes

Gets the environment variable `name` and parses it as `bytes`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envBytes(string calldata name) external view returns (bytes memory value);
```

### envBytes

Gets the environment variable `name` and parses it as an array of `bytes`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envBytes(string calldata name, string calldata delim) external view returns (bytes[] memory value);
```

### envInt

Gets the environment variable `name` and parses it as `int256`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envInt(string calldata name) external view returns (int256 value);
```

### envInt

Gets the environment variable `name` and parses it as an array of `int256`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envInt(string calldata name, string calldata delim) external view returns (int256[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as `bool`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, bool defaultValue) external view returns (bool value);
```

### envOr

Gets the environment variable `name` and parses it as `uint256`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, uint256 defaultValue) external view returns (uint256 value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `address`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, address[] calldata defaultValue)
    external
    view
    returns (address[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `bytes32`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, bytes32[] calldata defaultValue)
    external
    view
    returns (bytes32[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `string`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, string[] calldata defaultValue)
    external
    view
    returns (string[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `bytes`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, bytes[] calldata defaultValue)
    external
    view
    returns (bytes[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as `int256`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, int256 defaultValue) external view returns (int256 value);
```

### envOr

Gets the environment variable `name` and parses it as `address`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, address defaultValue) external view returns (address value);
```

### envOr

Gets the environment variable `name` and parses it as `bytes32`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, bytes32 defaultValue) external view returns (bytes32 value);
```

### envOr

Gets the environment variable `name` and parses it as `string`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata defaultValue) external view returns (string memory value);
```

### envOr

Gets the environment variable `name` and parses it as `bytes`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, bytes calldata defaultValue) external view returns (bytes memory value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `bool`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, bool[] calldata defaultValue)
    external
    view
    returns (bool[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `uint256`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, uint256[] calldata defaultValue)
    external
    view
    returns (uint256[] memory value);
```

### envOr

Gets the environment variable `name` and parses it as an array of `int256`, delimited by `delim`.
Reverts if the variable could not be parsed.
Returns `defaultValue` if the variable was not found.


```solidity
function envOr(string calldata name, string calldata delim, int256[] calldata defaultValue)
    external
    view
    returns (int256[] memory value);
```

### envString

Gets the environment variable `name` and parses it as `string`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envString(string calldata name) external view returns (string memory value);
```

### envString

Gets the environment variable `name` and parses it as an array of `string`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envString(string calldata name, string calldata delim) external view returns (string[] memory value);
```

### envUint

Gets the environment variable `name` and parses it as `uint256`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envUint(string calldata name) external view returns (uint256 value);
```

### envUint

Gets the environment variable `name` and parses it as an array of `uint256`, delimited by `delim`.
Reverts if the variable was not found or could not be parsed.


```solidity
function envUint(string calldata name, string calldata delim) external view returns (uint256[] memory value);
```

### setEnv

Sets environment variables.


```solidity
function setEnv(string calldata name, string calldata value) external;
```

### accesses

Gets all accessed reads and write slot from a `vm.record` session, for a given address.


```solidity
function accesses(address target) external returns (bytes32[] memory readSlots, bytes32[] memory writeSlots);
```

### addr

Gets the address for a given private key.


```solidity
function addr(uint256 privateKey) external pure returns (address keyAddr);
```

### eth_getLogs

Gets all the logs according to specified filter.


```solidity
function eth_getLogs(uint256 fromBlock, uint256 toBlock, address target, bytes32[] calldata topics)
    external
    returns (EthGetLogs[] memory logs);
```

### getBlockNumber

Gets the current `block.number`.
You should use this instead of `block.number` if you use `vm.roll`, as `block.number` is assumed to be constant across a transaction,
and as a result will get optimized out by the compiler.
See https://github.com/foundry-rs/foundry/issues/6180


```solidity
function getBlockNumber() external view returns (uint256 height);
```

### getBlockTimestamp

Gets the current `block.timestamp`.
You should use this instead of `block.timestamp` if you use `vm.warp`, as `block.timestamp` is assumed to be constant across a transaction,
and as a result will get optimized out by the compiler.
See https://github.com/foundry-rs/foundry/issues/6180


```solidity
function getBlockTimestamp() external view returns (uint256 timestamp);
```

### getMappingKeyAndParentOf

Gets the map key and parent of a mapping at a given slot, for a given address.


```solidity
function getMappingKeyAndParentOf(address target, bytes32 elementSlot)
    external
    returns (bool found, bytes32 key, bytes32 parent);
```

### getMappingLength

Gets the number of elements in the mapping at the given slot, for a given address.


```solidity
function getMappingLength(address target, bytes32 mappingSlot) external returns (uint256 length);
```

### getMappingSlotAt

Gets the elements at index idx of the mapping at the given slot, for a given address. The
index must be less than the length of the mapping (i.e. the number of keys in the mapping).


```solidity
function getMappingSlotAt(address target, bytes32 mappingSlot, uint256 idx) external returns (bytes32 value);
```

### getNonce

Gets the nonce of an account.


```solidity
function getNonce(address account) external view returns (uint64 nonce);
```

### getRecordedLogs

Gets all the recorded logs.


```solidity
function getRecordedLogs() external returns (Log[] memory logs);
```

### load

Loads a storage slot from an address.


```solidity
function load(address target, bytes32 slot) external view returns (bytes32 data);
```

### pauseGasMetering

Pauses gas metering (i.e. gas usage is not counted). Noop if already paused.


```solidity
function pauseGasMetering() external;
```

### record

Records all storage reads and writes.


```solidity
function record() external;
```

### recordLogs

Record all the transaction logs.


```solidity
function recordLogs() external;
```

### resumeGasMetering

Resumes gas metering (i.e. gas usage is counted again). Noop if already on.


```solidity
function resumeGasMetering() external;
```

### rpc

Performs an Ethereum JSON-RPC request to the current fork URL.


```solidity
function rpc(string calldata method, string calldata params) external returns (bytes memory data);
```

### signP256

Signs `digest` with `privateKey` using the secp256r1 curve.


```solidity
function signP256(uint256 privateKey, bytes32 digest) external pure returns (bytes32 r, bytes32 s);
```

### sign

Signs `digest` with `privateKey` using the secp256k1 curve.


```solidity
function sign(uint256 privateKey, bytes32 digest) external pure returns (uint8 v, bytes32 r, bytes32 s);
```

### startMappingRecording

Starts recording all map SSTOREs for later retrieval.


```solidity
function startMappingRecording() external;
```

### startStateDiffRecording

Record all account accesses as part of CREATE, CALL or SELFDESTRUCT opcodes in order,
along with the context of the calls


```solidity
function startStateDiffRecording() external;
```

### stopAndReturnStateDiff

Returns an ordered array of all account accesses from a `vm.startStateDiffRecording` session.


```solidity
function stopAndReturnStateDiff() external returns (AccountAccess[] memory accountAccesses);
```

### stopMappingRecording

Stops recording all map SSTOREs for later retrieval and clears the recorded data.


```solidity
function stopMappingRecording() external;
```

### closeFile

Closes file for reading, resetting the offset and allowing to read it from beginning with readLine.
`path` is relative to the project root.


```solidity
function closeFile(string calldata path) external;
```

### copyFile

Copies the contents of one file to another. This function will **overwrite** the contents of `to`.
On success, the total number of bytes copied is returned and it is equal to the length of the `to` file as reported by `metadata`.
Both `from` and `to` are relative to the project root.


```solidity
function copyFile(string calldata from, string calldata to) external returns (uint64 copied);
```

### createDir

Creates a new, empty directory at the provided path.
This cheatcode will revert in the following situations, but is not limited to just these cases:
- User lacks permissions to modify `path`.
- A parent of the given path doesn't exist and `recursive` is false.
- `path` already exists and `recursive` is false.
`path` is relative to the project root.


```solidity
function createDir(string calldata path, bool recursive) external;
```

### exists

Returns true if the given path points to an existing entity, else returns false.


```solidity
function exists(string calldata path) external returns (bool result);
```

### ffi

Performs a foreign function call via the terminal.


```solidity
function ffi(string[] calldata commandInput) external returns (bytes memory result);
```

### fsMetadata

Given a path, query the file system to get information about a file, directory, etc.


```solidity
function fsMetadata(string calldata path) external view returns (FsMetadata memory metadata);
```

### getCode

Gets the creation bytecode from an artifact file. Takes in the relative path to the json file.


```solidity
function getCode(string calldata artifactPath) external view returns (bytes memory creationBytecode);
```

### getDeployedCode

Gets the deployed bytecode from an artifact file. Takes in the relative path to the json file.


```solidity
function getDeployedCode(string calldata artifactPath) external view returns (bytes memory runtimeBytecode);
```

### isDir

Returns true if the path exists on disk and is pointing at a directory, else returns false.


```solidity
function isDir(string calldata path) external returns (bool result);
```

### isFile

Returns true if the path exists on disk and is pointing at a regular file, else returns false.


```solidity
function isFile(string calldata path) external returns (bool result);
```

### projectRoot

Get the path of the current project root.


```solidity
function projectRoot() external view returns (string memory path);
```

### readDir

Reads the directory at the given path recursively, up to `maxDepth`.
`maxDepth` defaults to 1, meaning only the direct children of the given directory will be returned.
Follows symbolic links if `followLinks` is true.


```solidity
function readDir(string calldata path) external view returns (DirEntry[] memory entries);
```

### readDir

See `readDir(string)`.


```solidity
function readDir(string calldata path, uint64 maxDepth) external view returns (DirEntry[] memory entries);
```

### readDir

See `readDir(string)`.


```solidity
function readDir(string calldata path, uint64 maxDepth, bool followLinks)
    external
    view
    returns (DirEntry[] memory entries);
```

### readFile

Reads the entire content of file to string. `path` is relative to the project root.


```solidity
function readFile(string calldata path) external view returns (string memory data);
```

### readFileBinary

Reads the entire content of file as binary. `path` is relative to the project root.


```solidity
function readFileBinary(string calldata path) external view returns (bytes memory data);
```

### readLine

Reads next line of file to string.


```solidity
function readLine(string calldata path) external view returns (string memory line);
```

### readLink

Reads a symbolic link, returning the path that the link points to.
This cheatcode will revert in the following situations, but is not limited to just these cases:
- `path` is not a symbolic link.
- `path` does not exist.


```solidity
function readLink(string calldata linkPath) external view returns (string memory targetPath);
```

### removeDir

Removes a directory at the provided path.
This cheatcode will revert in the following situations, but is not limited to just these cases:
- `path` doesn't exist.
- `path` isn't a directory.
- User lacks permissions to modify `path`.
- The directory is not empty and `recursive` is false.
`path` is relative to the project root.


```solidity
function removeDir(string calldata path, bool recursive) external;
```

### removeFile

Removes a file from the filesystem.
This cheatcode will revert in the following situations, but is not limited to just these cases:
- `path` points to a directory.
- The file doesn't exist.
- The user lacks permissions to remove the file.
`path` is relative to the project root.


```solidity
function removeFile(string calldata path) external;
```

### tryFfi

Performs a foreign function call via terminal and returns the exit code, stdout, and stderr.


```solidity
function tryFfi(string[] calldata commandInput) external returns (FfiResult memory result);
```

### unixTime

Returns the time since unix epoch in milliseconds.


```solidity
function unixTime() external returns (uint256 milliseconds);
```

### writeFile

Writes data to file, creating a file if it does not exist, and entirely replacing its contents if it does.
`path` is relative to the project root.


```solidity
function writeFile(string calldata path, string calldata data) external;
```

### writeFileBinary

Writes binary data to a file, creating a file if it does not exist, and entirely replacing its contents if it does.
`path` is relative to the project root.


```solidity
function writeFileBinary(string calldata path, bytes calldata data) external;
```

### writeLine

Writes line to file, creating a file if it does not exist.
`path` is relative to the project root.


```solidity
function writeLine(string calldata path, string calldata data) external;
```

### keyExists

Checks if `key` exists in a JSON object.


```solidity
function keyExists(string calldata json, string calldata key) external view returns (bool);
```

### parseJsonAddress

Parses a string of JSON data at `key` and coerces it to `address`.


```solidity
function parseJsonAddress(string calldata json, string calldata key) external pure returns (address);
```

### parseJsonAddressArray

Parses a string of JSON data at `key` and coerces it to `address[]`.


```solidity
function parseJsonAddressArray(string calldata json, string calldata key) external pure returns (address[] memory);
```

### parseJsonBool

Parses a string of JSON data at `key` and coerces it to `bool`.


```solidity
function parseJsonBool(string calldata json, string calldata key) external pure returns (bool);
```

### parseJsonBoolArray

Parses a string of JSON data at `key` and coerces it to `bool[]`.


```solidity
function parseJsonBoolArray(string calldata json, string calldata key) external pure returns (bool[] memory);
```

### parseJsonBytes

Parses a string of JSON data at `key` and coerces it to `bytes`.


```solidity
function parseJsonBytes(string calldata json, string calldata key) external pure returns (bytes memory);
```

### parseJsonBytes32

Parses a string of JSON data at `key` and coerces it to `bytes32`.


```solidity
function parseJsonBytes32(string calldata json, string calldata key) external pure returns (bytes32);
```

### parseJsonBytes32Array

Parses a string of JSON data at `key` and coerces it to `bytes32[]`.


```solidity
function parseJsonBytes32Array(string calldata json, string calldata key) external pure returns (bytes32[] memory);
```

### parseJsonBytesArray

Parses a string of JSON data at `key` and coerces it to `bytes[]`.


```solidity
function parseJsonBytesArray(string calldata json, string calldata key) external pure returns (bytes[] memory);
```

### parseJsonInt

Parses a string of JSON data at `key` and coerces it to `int256`.


```solidity
function parseJsonInt(string calldata json, string calldata key) external pure returns (int256);
```

### parseJsonIntArray

Parses a string of JSON data at `key` and coerces it to `int256[]`.


```solidity
function parseJsonIntArray(string calldata json, string calldata key) external pure returns (int256[] memory);
```

### parseJsonKeys

Returns an array of all the keys in a JSON object.


```solidity
function parseJsonKeys(string calldata json, string calldata key) external pure returns (string[] memory keys);
```

### parseJsonString

Parses a string of JSON data at `key` and coerces it to `string`.


```solidity
function parseJsonString(string calldata json, string calldata key) external pure returns (string memory);
```

### parseJsonStringArray

Parses a string of JSON data at `key` and coerces it to `string[]`.


```solidity
function parseJsonStringArray(string calldata json, string calldata key) external pure returns (string[] memory);
```

### parseJsonUint

Parses a string of JSON data at `key` and coerces it to `uint256`.


```solidity
function parseJsonUint(string calldata json, string calldata key) external pure returns (uint256);
```

### parseJsonUintArray

Parses a string of JSON data at `key` and coerces it to `uint256[]`.


```solidity
function parseJsonUintArray(string calldata json, string calldata key) external pure returns (uint256[] memory);
```

### parseJson

ABI-encodes a JSON object.


```solidity
function parseJson(string calldata json) external pure returns (bytes memory abiEncodedData);
```

### parseJson

ABI-encodes a JSON object at `key`.


```solidity
function parseJson(string calldata json, string calldata key) external pure returns (bytes memory abiEncodedData);
```

### serializeAddress

See `serializeJson`.


```solidity
function serializeAddress(string calldata objectKey, string calldata valueKey, address value)
    external
    returns (string memory json);
```

### serializeAddress

See `serializeJson`.


```solidity
function serializeAddress(string calldata objectKey, string calldata valueKey, address[] calldata values)
    external
    returns (string memory json);
```

### serializeBool

See `serializeJson`.


```solidity
function serializeBool(string calldata objectKey, string calldata valueKey, bool value)
    external
    returns (string memory json);
```

### serializeBool

See `serializeJson`.


```solidity
function serializeBool(string calldata objectKey, string calldata valueKey, bool[] calldata values)
    external
    returns (string memory json);
```

### serializeBytes32

See `serializeJson`.


```solidity
function serializeBytes32(string calldata objectKey, string calldata valueKey, bytes32 value)
    external
    returns (string memory json);
```

### serializeBytes32

See `serializeJson`.


```solidity
function serializeBytes32(string calldata objectKey, string calldata valueKey, bytes32[] calldata values)
    external
    returns (string memory json);
```

### serializeBytes

See `serializeJson`.


```solidity
function serializeBytes(string calldata objectKey, string calldata valueKey, bytes calldata value)
    external
    returns (string memory json);
```

### serializeBytes

See `serializeJson`.


```solidity
function serializeBytes(string calldata objectKey, string calldata valueKey, bytes[] calldata values)
    external
    returns (string memory json);
```

### serializeInt

See `serializeJson`.


```solidity
function serializeInt(string calldata objectKey, string calldata valueKey, int256 value)
    external
    returns (string memory json);
```

### serializeInt

See `serializeJson`.


```solidity
function serializeInt(string calldata objectKey, string calldata valueKey, int256[] calldata values)
    external
    returns (string memory json);
```

### serializeJson

Serializes a key and value to a JSON object stored in-memory that can be later written to a file.
Returns the stringified version of the specific JSON file up to that moment.


```solidity
function serializeJson(string calldata objectKey, string calldata value) external returns (string memory json);
```

### serializeString

See `serializeJson`.


```solidity
function serializeString(string calldata objectKey, string calldata valueKey, string calldata value)
    external
    returns (string memory json);
```

### serializeString

See `serializeJson`.


```solidity
function serializeString(string calldata objectKey, string calldata valueKey, string[] calldata values)
    external
    returns (string memory json);
```

### serializeUint

See `serializeJson`.


```solidity
function serializeUint(string calldata objectKey, string calldata valueKey, uint256 value)
    external
    returns (string memory json);
```

### serializeUint

See `serializeJson`.


```solidity
function serializeUint(string calldata objectKey, string calldata valueKey, uint256[] calldata values)
    external
    returns (string memory json);
```

### writeJson

Write a serialized JSON object to a file. If the file exists, it will be overwritten.


```solidity
function writeJson(string calldata json, string calldata path) external;
```

### writeJson

Write a serialized JSON object to an **existing** JSON file, replacing a value with key = <value_key.>
This is useful to replace a specific value of a JSON file, without having to parse the entire thing.


```solidity
function writeJson(string calldata json, string calldata path, string calldata valueKey) external;
```

### broadcast

Using the address that calls the test contract, has the next call (at this call depth only)
create a transaction that can later be signed and sent onchain.


```solidity
function broadcast() external;
```

### broadcast

Has the next call (at this call depth only) create a transaction with the address provided
as the sender that can later be signed and sent onchain.


```solidity
function broadcast(address signer) external;
```

### broadcast

Has the next call (at this call depth only) create a transaction with the private key
provided as the sender that can later be signed and sent onchain.


```solidity
function broadcast(uint256 privateKey) external;
```

### startBroadcast

Using the address that calls the test contract, has all subsequent calls
(at this call depth only) create transactions that can later be signed and sent onchain.


```solidity
function startBroadcast() external;
```

### startBroadcast

Has all subsequent calls (at this call depth only) create transactions with the address
provided that can later be signed and sent onchain.


```solidity
function startBroadcast(address signer) external;
```

### startBroadcast

Has all subsequent calls (at this call depth only) create transactions with the private key
provided that can later be signed and sent onchain.


```solidity
function startBroadcast(uint256 privateKey) external;
```

### stopBroadcast

Stops collecting onchain transactions.


```solidity
function stopBroadcast() external;
```

### parseAddress

Parses the given `string` into an `address`.


```solidity
function parseAddress(string calldata stringifiedValue) external pure returns (address parsedValue);
```

### parseBool

Parses the given `string` into a `bool`.


```solidity
function parseBool(string calldata stringifiedValue) external pure returns (bool parsedValue);
```

### parseBytes

Parses the given `string` into `bytes`.


```solidity
function parseBytes(string calldata stringifiedValue) external pure returns (bytes memory parsedValue);
```

### parseBytes32

Parses the given `string` into a `bytes32`.


```solidity
function parseBytes32(string calldata stringifiedValue) external pure returns (bytes32 parsedValue);
```

### parseInt

Parses the given `string` into a `int256`.


```solidity
function parseInt(string calldata stringifiedValue) external pure returns (int256 parsedValue);
```

### parseUint

Parses the given `string` into a `uint256`.


```solidity
function parseUint(string calldata stringifiedValue) external pure returns (uint256 parsedValue);
```

### toString

Converts the given value to a `string`.


```solidity
function toString(address value) external pure returns (string memory stringifiedValue);
```

### toString

Converts the given value to a `string`.


```solidity
function toString(bytes calldata value) external pure returns (string memory stringifiedValue);
```

### toString

Converts the given value to a `string`.


```solidity
function toString(bytes32 value) external pure returns (string memory stringifiedValue);
```

### toString

Converts the given value to a `string`.


```solidity
function toString(bool value) external pure returns (string memory stringifiedValue);
```

### toString

Converts the given value to a `string`.


```solidity
function toString(uint256 value) external pure returns (string memory stringifiedValue);
```

### toString

Converts the given value to a `string`.


```solidity
function toString(int256 value) external pure returns (string memory stringifiedValue);
```

### assume

If the condition is false, discard this run's fuzz inputs and generate new ones.


```solidity
function assume(bool condition) external pure;
```

### breakpoint

Writes a breakpoint to jump to in the debugger.


```solidity
function breakpoint(string calldata char) external;
```

### breakpoint

Writes a conditional breakpoint to jump to in the debugger.


```solidity
function breakpoint(string calldata char, bool value) external;
```

### rpcUrl

Returns the RPC url for the given alias.


```solidity
function rpcUrl(string calldata rpcAlias) external view returns (string memory json);
```

### rpcUrlStructs

Returns all rpc urls and their aliases as structs.


```solidity
function rpcUrlStructs() external view returns (Rpc[] memory urls);
```

### rpcUrls

Returns all rpc urls and their aliases `[alias, url][]`.


```solidity
function rpcUrls() external view returns (string[2][] memory urls);
```

### sleep

Suspends execution of the main thread for `duration` milliseconds.


```solidity
function sleep(uint256 duration) external;
```

### computeCreate2Address

Compute the address of a contract created with CREATE2 using the given CREATE2 deployer.


```solidity
function computeCreate2Address(bytes32 salt, bytes32 initCodeHash, address deployer) external pure returns (address);
```

### computeCreate2Address

Compute the address of a contract created with CREATE2 using the default CREATE2 deployer.


```solidity
function computeCreate2Address(bytes32 salt, bytes32 initCodeHash) external pure returns (address);
```

### computeCreateAddress

Compute the address a contract will be deployed at for a given deployer address and nonce.


```solidity
function computeCreateAddress(address deployer, uint256 nonce) external pure returns (address);
```

### createWallet

Derives a private key from the name, labels the account with that name, and returns the wallet.


```solidity
function createWallet(string calldata walletLabel) external returns (Wallet memory wallet);
```

### createWallet

Generates a wallet from the private key and returns the wallet.


```solidity
function createWallet(uint256 privateKey) external returns (Wallet memory wallet);
```

### createWallet

Generates a wallet from the private key, labels the account with that name, and returns the wallet.


```solidity
function createWallet(uint256 privateKey, string calldata walletLabel) external returns (Wallet memory wallet);
```

### deriveKey

Derive a private key from a provided mnenomic string (or mnenomic file path)
at the derivation path `m/44'/60'/0'/0/{index}`.


```solidity
function deriveKey(string calldata mnemonic, uint32 index) external pure returns (uint256 privateKey);
```

### deriveKey

Derive a private key from a provided mnenomic string (or mnenomic file path)
at `{derivationPath}{index}`.


```solidity
function deriveKey(string calldata mnemonic, string calldata derivationPath, uint32 index)
    external
    pure
    returns (uint256 privateKey);
```

### deriveKey

Derive a private key from a provided mnenomic string (or mnenomic file path) in the specified language
at the derivation path `m/44'/60'/0'/0/{index}`.


```solidity
function deriveKey(string calldata mnemonic, uint32 index, string calldata language)
    external
    pure
    returns (uint256 privateKey);
```

### deriveKey

Derive a private key from a provided mnenomic string (or mnenomic file path) in the specified language
at `{derivationPath}{index}`.


```solidity
function deriveKey(string calldata mnemonic, string calldata derivationPath, uint32 index, string calldata language)
    external
    pure
    returns (uint256 privateKey);
```

### getLabel

Gets the label for the specified address.


```solidity
function getLabel(address account) external view returns (string memory currentLabel);
```

### getNonce

Get a `Wallet`'s nonce.


```solidity
function getNonce(Wallet calldata wallet) external returns (uint64 nonce);
```

### label

Labels an address in call traces.


```solidity
function label(address account, string calldata newLabel) external;
```

### rememberKey

Adds a private key to the local forge wallet and returns the address.


```solidity
function rememberKey(uint256 privateKey) external returns (address keyAddr);
```

### sign

Signs data with a `Wallet`.


```solidity
function sign(Wallet calldata wallet, bytes32 digest) external returns (uint8 v, bytes32 r, bytes32 s);
```

### toBase64URL

Encodes a `bytes` value to a base64url string.


```solidity
function toBase64URL(bytes calldata data) external pure returns (string memory);
```

### toBase64URL

Encodes a `string` value to a base64url string.


```solidity
function toBase64URL(string calldata data) external pure returns (string memory);
```

### toBase64

Encodes a `bytes` value to a base64 string.


```solidity
function toBase64(bytes calldata data) external pure returns (string memory);
```

### toBase64

Encodes a `string` value to a base64 string.


```solidity
function toBase64(string calldata data) external pure returns (string memory);
```

## Structs
### Log
An Ethereum log. Returned by `getRecordedLogs`.


```solidity
struct Log {
    bytes32[] topics;
    bytes data;
    address emitter;
}
```

### Rpc
An RPC URL and its alias. Returned by `rpcUrlStructs`.


```solidity
struct Rpc {
    string key;
    string url;
}
```

### EthGetLogs
An RPC log object. Returned by `eth_getLogs`.


```solidity
struct EthGetLogs {
    address emitter;
    bytes32[] topics;
    bytes data;
    bytes32 blockHash;
    uint64 blockNumber;
    bytes32 transactionHash;
    uint64 transactionIndex;
    uint256 logIndex;
    bool removed;
}
```

### DirEntry
A single entry in a directory listing. Returned by `readDir`.


```solidity
struct DirEntry {
    string errorMessage;
    string path;
    uint64 depth;
    bool isDir;
    bool isSymlink;
}
```

### FsMetadata
Metadata information about a file.
This structure is returned from the `fsMetadata` function and represents known
metadata about a file such as its permissions, size, modification
times, etc.


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

### Wallet
A wallet with a public and private key.


```solidity
struct Wallet {
    address addr;
    uint256 publicKeyX;
    uint256 publicKeyY;
    uint256 privateKey;
}
```

### FfiResult
The result of a `tryFfi` call.


```solidity
struct FfiResult {
    int32 exitCode;
    bytes stdout;
    bytes stderr;
}
```

### ChainInfo
Information on the chain and fork.


```solidity
struct ChainInfo {
    uint256 forkId;
    uint256 chainId;
}
```

### AccountAccess
The result of a `stopAndReturnStateDiff` call.


```solidity
struct AccountAccess {
    ChainInfo chainInfo;
    AccountAccessKind kind;
    address account;
    address accessor;
    bool initialized;
    uint256 oldBalance;
    uint256 newBalance;
    bytes deployedCode;
    uint256 value;
    bytes data;
    bool reverted;
    StorageAccess[] storageAccesses;
}
```

### StorageAccess
The storage accessed during an `AccountAccess`.


```solidity
struct StorageAccess {
    address account;
    bytes32 slot;
    bool isWrite;
    bytes32 previousValue;
    bytes32 newValue;
    bool reverted;
}
```

## Enums
### CallerMode
A modification applied to either `msg.sender` or `tx.origin`. Returned by `readCallers`.


```solidity
enum CallerMode {
    None,
    Broadcast,
    RecurrentBroadcast,
    Prank,
    RecurrentPrank
}
```

### AccountAccessKind
The kind of account access that occurred.


```solidity
enum AccountAccessKind {
    Call,
    DelegateCall,
    CallCode,
    StaticCall,
    Create,
    SelfDestruct,
    Resume,
    Balance,
    Extcodesize,
    Extcodehash,
    Extcodecopy
}
```

