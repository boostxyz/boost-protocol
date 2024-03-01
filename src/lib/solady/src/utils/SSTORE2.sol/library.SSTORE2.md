# SSTORE2
**Authors:**
Solady (https://github.com/vectorized/solmady/blob/main/src/utils/SSTORE2.sol), Saw-mon-and-Natalie (https://github.com/Saw-mon-and-Natalie), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/SSTORE2.sol), Modified from 0xSequence (https://github.com/0xSequence/sstore2/blob/master/contracts/SSTORE2.sol)

Read and write to persistent storage at a fraction of the cost.


## State Variables
### DATA_OFFSET
*We skip the first byte as it's a STOP opcode,
which ensures the contract can't be called.*


```solidity
uint256 internal constant DATA_OFFSET = 1;
```


## Functions
### write

*Writes `data` into the bytecode of a storage contract and returns its address.*


```solidity
function write(bytes memory data) internal returns (address pointer);
```

### writeDeterministic

*Prefix the bytecode with a STOP opcode to ensure it cannot be called.
Also PUSH2 is used since max contract size cap is 24,576 bytes which is less than 2 ** 16.*

*Writes `data` into the bytecode of a storage contract with `salt`
and returns its deterministic address.*


```solidity
function writeDeterministic(bytes memory data, bytes32 salt) internal returns (address pointer);
```

### initCodeHash

*Returns the initialization code hash of the storage contract for `data`.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHash(bytes memory data) internal pure returns (bytes32 hash);
```

### predictDeterministicAddress

*Returns the address of the storage contract for `data`
deployed with `salt` by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddress(bytes memory data, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### read

*Returns all the `data` from the bytecode of the storage contract at `pointer`.*


```solidity
function read(address pointer) internal view returns (bytes memory data);
```

### read

*Returns the `data` from the bytecode of the storage contract at `pointer`,
from the byte at `start`, to the end of the data stored.*


```solidity
function read(address pointer, uint256 start) internal view returns (bytes memory data);
```

### read

*Returns the `data` from the bytecode of the storage contract at `pointer`,
from the byte at `start`, to the byte at `end` (exclusive) of the data stored.*


```solidity
function read(address pointer, uint256 start, uint256 end) internal view returns (bytes memory data);
```

## Errors
### DeploymentFailed
*Unable to deploy the storage contract.*


```solidity
error DeploymentFailed();
```

### InvalidPointer
*The storage contract address is invalid.*


```solidity
error InvalidPointer();
```

### ReadOutOfBounds
*Attempt to read outside of the storage contract's bytecode bounds.*


```solidity
error ReadOutOfBounds();
```

