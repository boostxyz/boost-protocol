# LibClone
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibClone.sol), Minimal proxy by 0age (https://github.com/0age), Clones with immutable args by wighawag, zefram.eth, Saw-mon & Natalie
(https://github.com/Saw-mon-and-Natalie/clones-with-immutable-args), Minimal ERC1967 proxy by jtriley-eth (https://github.com/jtriley-eth/minimum-viable-proxy)

Minimal proxy library.

*Minimal proxy:
Although the sw0nt pattern saves 5 gas over the erc-1167 pattern during runtime,
it is not supported out-of-the-box on Etherscan. Hence, we choose to use the 0age pattern,
which saves 4 gas over the erc-1167 pattern during runtime, and has the smallest bytecode.*

*Minimal proxy (PUSH0 variant):
This is a new minimal proxy that uses the PUSH0 opcode introduced during Shanghai.
It is optimized first for minimal runtime gas, then for minimal bytecode.
The PUSH0 clone functions are intentionally postfixed with a jarring "_PUSH0" as
many EVM chains may not support the PUSH0 opcode in the early months after Shanghai.
Please use with caution.*

*Clones with immutable args (CWIA):
The implementation of CWIA here implements a `receive()` method that emits the
`ReceiveETH(uint256)` event. This skips the `DELEGATECALL` when there is no calldata,
enabling us to accept hard gas-capped `sends` & `transfers` for maximum backwards
composability. The minimal proxy implementation does not offer this feature.*

*Minimal ERC1967 proxy:
An minimal ERC1967 proxy, intended to be upgraded with UUPS.
This is NOT the same as ERC1967Factory's transparent proxy, which includes admin logic.*

*ERC1967I proxy:
An variant of the minimal ERC1967 proxy, with a special code path that activates
if `calldatasize() == 1`. This code path skips the delegatecall and directly returns the
`implementation` address. The returned implementation is guaranteed to be valid if the
keccak256 of the proxy's code is equal to `ERC1967I_CODE_HASH`.*


## State Variables
### ERC1967_CODE_HASH
*The keccak256 of the deployed code for the ERC1967 proxy.*


```solidity
bytes32 internal constant ERC1967_CODE_HASH = 0xaaa52c8cc8a0e3fd27ce756cc6b4e70c51423e9b597b11f32d3e49f8b1fc890d;
```


### ERC1967I_CODE_HASH
*The keccak256 of the deployed code for the ERC1967I proxy.*


```solidity
bytes32 internal constant ERC1967I_CODE_HASH = 0xce700223c0d4cea4583409accfc45adac4a093b3519998a9cbbe1504dadba6f7;
```


## Functions
### clone

*Deploys a clone of `implementation`.*


```solidity
function clone(address implementation) internal returns (address instance);
```

### clone

*Deploys a clone of `implementation`.
Deposits `value` ETH during deployment.*


```solidity
function clone(uint256 value, address implementation) internal returns (address instance);
```

### cloneDeterministic

*Deploys a deterministic clone of `implementation` with `salt`.*


```solidity
function cloneDeterministic(address implementation, bytes32 salt) internal returns (address instance);
```

### cloneDeterministic

*Deploys a deterministic clone of `implementation` with `salt`.
Deposits `value` ETH during deployment.*


```solidity
function cloneDeterministic(uint256 value, address implementation, bytes32 salt) internal returns (address instance);
```

### initCode

*Returns the initialization code of the clone of `implementation`.*


```solidity
function initCode(address implementation) internal pure returns (bytes memory result);
```

### initCodeHash

*Returns the initialization code hash of the clone of `implementation`.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHash(address implementation) internal pure returns (bytes32 hash);
```

### predictDeterministicAddress

*Returns the address of the deterministic clone of `implementation`,
with `salt` by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddress(address implementation, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### clone_PUSH0

*Deploys a PUSH0 clone of `implementation`.*


```solidity
function clone_PUSH0(address implementation) internal returns (address instance);
```

### clone_PUSH0

*Deploys a PUSH0 clone of `implementation`.
Deposits `value` ETH during deployment.*


```solidity
function clone_PUSH0(uint256 value, address implementation) internal returns (address instance);
```

### cloneDeterministic_PUSH0

*Deploys a deterministic PUSH0 clone of `implementation` with `salt`.*


```solidity
function cloneDeterministic_PUSH0(address implementation, bytes32 salt) internal returns (address instance);
```

### cloneDeterministic_PUSH0

*Deploys a deterministic PUSH0 clone of `implementation` with `salt`.
Deposits `value` ETH during deployment.*


```solidity
function cloneDeterministic_PUSH0(uint256 value, address implementation, bytes32 salt)
    internal
    returns (address instance);
```

### initCode_PUSH0

*Returns the initialization code of the PUSH0 clone of `implementation`.*


```solidity
function initCode_PUSH0(address implementation) internal pure returns (bytes memory result);
```

### initCodeHash_PUSH0

*Returns the initialization code hash of the PUSH0 clone of `implementation`.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHash_PUSH0(address implementation) internal pure returns (bytes32 hash);
```

### predictDeterministicAddress_PUSH0

*Returns the address of the deterministic PUSH0 clone of `implementation`,
with `salt` by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddress_PUSH0(address implementation, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### clone

*Deploys a clone of `implementation` with immutable arguments encoded in `data`.*


```solidity
function clone(address implementation, bytes memory data) internal returns (address instance);
```

### clone

*Deploys a clone of `implementation` with immutable arguments encoded in `data`.
Deposits `value` ETH during deployment.*


```solidity
function clone(uint256 value, address implementation, bytes memory data) internal returns (address instance);
```

### cloneDeterministic

---------------------------------------------------------------------------------------------------+
CREATION (10 bytes)                                                                                |
---------------------------------------------------------------------------------------------------|
Opcode     | Mnemonic          | Stack     | Memory                                                |
---------------------------------------------------------------------------------------------------|
61 runSize | PUSH2 runSize     | r         |                                                       |
3d         | RETURNDATASIZE    | 0 r       |                                                       |
81         | DUP2              | r 0 r     |                                                       |
60 offset  | PUSH1 offset      | o r 0 r   |                                                       |
3d         | RETURNDATASIZE    | 0 o r 0 r |                                                       |
39         | CODECOPY          | 0 r       | [0..runSize): runtime code                            |
f3         | RETURN            |           | [0..runSize): runtime code                            |
---------------------------------------------------------------------------------------------------|
RUNTIME (98 bytes + extraLength)                                                                   |
---------------------------------------------------------------------------------------------------|
Opcode   | Mnemonic       | Stack                    | Memory                                      |
---------------------------------------------------------------------------------------------------|
|
::: if no calldata, emit event & return w/o `DELEGATECALL` ::::::::::::::::::::::::::::::::::::::: |
36       | CALLDATASIZE   | cds                      |                                             |
60 0x2c  | PUSH1 0x2c     | 0x2c cds                 |                                             |
57       | JUMPI          |                          |                                             |
34       | CALLVALUE      | cv                       |                                             |
3d       | RETURNDATASIZE | 0 cv                     |                                             |
52       | MSTORE         |                          | [0..0x20): callvalue                        |
7f sig   | PUSH32 0x9e..  | sig                      | [0..0x20): callvalue                        |
59       | MSIZE          | 0x20 sig                 | [0..0x20): callvalue                        |
3d       | RETURNDATASIZE | 0 0x20 sig               | [0..0x20): callvalue                        |
a1       | LOG1           |                          | [0..0x20): callvalue                        |
00       | STOP           |                          | [0..0x20): callvalue                        |
5b       | JUMPDEST       |                          |                                             |
|
::: copy calldata to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
36       | CALLDATASIZE   | cds                      |                                             |
3d       | RETURNDATASIZE | 0 cds                    |                                             |
3d       | RETURNDATASIZE | 0 0 cds                  |                                             |
37       | CALLDATACOPY   |                          | [0..cds): calldata                          |
|
::: keep some values in stack :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d       | RETURNDATASIZE | 0                        | [0..cds): calldata                          |
3d       | RETURNDATASIZE | 0 0                      | [0..cds): calldata                          |
3d       | RETURNDATASIZE | 0 0 0                    | [0..cds): calldata                          |
3d       | RETURNDATASIZE | 0 0 0 0                  | [0..cds): calldata                          |
61 extra | PUSH2 extra    | e 0 0 0 0                | [0..cds): calldata                          |
|
::: copy extra data to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
80       | DUP1           | e e 0 0 0 0              | [0..cds): calldata                          |
60 0x62  | PUSH1 0x62     | 0x62 e e 0 0 0 0         | [0..cds): calldata                          |
36       | CALLDATASIZE   | cds 0x62 e e 0 0 0 0     | [0..cds): calldata                          |
39       | CODECOPY       | e 0 0 0 0                | [0..cds): calldata, [cds..cds+e): extraData |
|
::: delegate call to the implementation contract ::::::::::::::::::::::::::::::::::::::::::::::::: |
36       | CALLDATASIZE   | cds e 0 0 0 0            | [0..cds): calldata, [cds..cds+e): extraData |
01       | ADD            | cds+e 0 0 0 0            | [0..cds): calldata, [cds..cds+e): extraData |
3d       | RETURNDATASIZE | 0 cds+e 0 0 0 0          | [0..cds): calldata, [cds..cds+e): extraData |
73 addr  | PUSH20 addr    | addr 0 cds+e 0 0 0 0     | [0..cds): calldata, [cds..cds+e): extraData |
5a       | GAS            | gas addr 0 cds+e 0 0 0 0 | [0..cds): calldata, [cds..cds+e): extraData |
f4       | DELEGATECALL   | success 0 0              | [0..cds): calldata, [cds..cds+e): extraData |
|
::: copy return data to memory ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d       | RETURNDATASIZE | rds success 0 0          | [0..cds): calldata, [cds..cds+e): extraData |
3d       | RETURNDATASIZE | rds rds success 0 0      | [0..cds): calldata, [cds..cds+e): extraData |
93       | SWAP4          | 0 rds success 0 rds      | [0..cds): calldata, [cds..cds+e): extraData |
80       | DUP1           | 0 0 rds success 0 rds    | [0..cds): calldata, [cds..cds+e): extraData |
3e       | RETURNDATACOPY | success 0 rds            | [0..rds): returndata                        |
|
60 0x60  | PUSH1 0x60     | 0x60 success 0 rds       | [0..rds): returndata                        |
57       | JUMPI          | 0 rds                    | [0..rds): returndata                        |
|
::: revert ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
fd       | REVERT         |                          | [0..rds): returndata                        |
|
::: return ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
5b       | JUMPDEST       | 0 rds                    | [0..rds): returndata                        |
f3       | RETURN         |                          | [0..rds): returndata                        |
---------------------------------------------------------------------------------------------------+

*Deploys a deterministic clone of `implementation`
with immutable arguments encoded in `data` and `salt`.*


```solidity
function cloneDeterministic(address implementation, bytes memory data, bytes32 salt)
    internal
    returns (address instance);
```

### cloneDeterministic

*Deploys a deterministic clone of `implementation`
with immutable arguments encoded in `data` and `salt`.*


```solidity
function cloneDeterministic(uint256 value, address implementation, bytes memory data, bytes32 salt)
    internal
    returns (address instance);
```

### initCode

*Returns the initialization code hash of the clone of `implementation`
using immutable arguments encoded in `data`.*


```solidity
function initCode(address implementation, bytes memory data) internal pure returns (bytes memory result);
```

### initCodeHash

*Returns the initialization code hash of the clone of `implementation`
using immutable arguments encoded in `data`.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHash(address implementation, bytes memory data) internal pure returns (bytes32 hash);
```

### predictDeterministicAddress

*Returns the address of the deterministic clone of
`implementation` using immutable arguments encoded in `data`, with `salt`, by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddress(address implementation, bytes memory data, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### deployERC1967

*Deploys a minimal ERC1967 proxy with `implementation`.*


```solidity
function deployERC1967(address implementation) internal returns (address instance);
```

### deployERC1967

*Deploys a minimal ERC1967 proxy with `implementation`.
Deposits `value` ETH during deployment.*


```solidity
function deployERC1967(uint256 value, address implementation) internal returns (address instance);
```

### deployDeterministicERC1967

*Deploys a deterministic minimal ERC1967 proxy with `implementation` and `salt`.*


```solidity
function deployDeterministicERC1967(address implementation, bytes32 salt) internal returns (address instance);
```

### deployDeterministicERC1967

*Deploys a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
Deposits `value` ETH during deployment.*


```solidity
function deployDeterministicERC1967(uint256 value, address implementation, bytes32 salt)
    internal
    returns (address instance);
```

### createDeterministicERC1967

*Creates a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
Note: This method is intended for use in ERC4337 factories,
which are expected to NOT revert if the proxy is already deployed.*


```solidity
function createDeterministicERC1967(address implementation, bytes32 salt)
    internal
    returns (bool alreadyDeployed, address instance);
```

### createDeterministicERC1967

*Creates a deterministic minimal ERC1967 proxy with `implementation` and `salt`.
Deposits `value` ETH during deployment.
Note: This method is intended for use in ERC4337 factories,
which are expected to NOT revert if the proxy is already deployed.*


```solidity
function createDeterministicERC1967(uint256 value, address implementation, bytes32 salt)
    internal
    returns (bool alreadyDeployed, address instance);
```

### initCodeERC1967

*Returns the initialization code of the minimal ERC1967 proxy of `implementation`.*


```solidity
function initCodeERC1967(address implementation) internal pure returns (bytes memory result);
```

### initCodeHashERC1967

*Returns the initialization code hash of the minimal ERC1967 proxy of `implementation`.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHashERC1967(address implementation) internal pure returns (bytes32 hash);
```

### predictDeterministicAddressERC1967

*Returns the address of the deterministic ERC1967 proxy of `implementation`,
with `salt` by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddressERC1967(address implementation, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### deployERC1967I

*Deploys a minimal ERC1967I proxy with `implementation`.*


```solidity
function deployERC1967I(address implementation) internal returns (address instance);
```

### deployERC1967I

*Deploys a ERC1967I proxy with `implementation`.
Deposits `value` ETH during deployment.*


```solidity
function deployERC1967I(uint256 value, address implementation) internal returns (address instance);
```

### deployDeterministicERC1967I

*Deploys a deterministic ERC1967I proxy with `implementation` and `salt`.*


```solidity
function deployDeterministicERC1967I(address implementation, bytes32 salt) internal returns (address instance);
```

### deployDeterministicERC1967I

*Deploys a deterministic ERC1967I proxy with `implementation` and `salt`.
Deposits `value` ETH during deployment.*


```solidity
function deployDeterministicERC1967I(uint256 value, address implementation, bytes32 salt)
    internal
    returns (address instance);
```

### createDeterministicERC1967I

*Creates a deterministic ERC1967I proxy with `implementation` and `salt`.
Note: This method is intended for use in ERC4337 factories,
which are expected to NOT revert if the proxy is already deployed.*


```solidity
function createDeterministicERC1967I(address implementation, bytes32 salt)
    internal
    returns (bool alreadyDeployed, address instance);
```

### createDeterministicERC1967I

*Creates a deterministic ERC1967I proxy with `implementation` and `salt`.
Deposits `value` ETH during deployment.
Note: This method is intended for use in ERC4337 factories,
which are expected to NOT revert if the proxy is already deployed.*


```solidity
function createDeterministicERC1967I(uint256 value, address implementation, bytes32 salt)
    internal
    returns (bool alreadyDeployed, address instance);
```

### initCodeERC1967I

*Returns the initialization code of the minimal ERC1967 proxy of `implementation`.*


```solidity
function initCodeERC1967I(address implementation) internal pure returns (bytes memory result);
```

### initCodeHashERC1967I

*Returns the initialization code hash of the minimal ERC1967 proxy of `implementation`.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHashERC1967I(address implementation) internal pure returns (bytes32 hash);
```

### predictDeterministicAddressERC1967I

*Returns the address of the deterministic ERC1967I proxy of `implementation`,
with `salt` by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddressERC1967I(address implementation, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### predictDeterministicAddress

*Returns the address when a contract with initialization code hash,
`hash`, is deployed with `salt`, by `deployer`.
Note: The returned result has dirty upper 96 bits. Please clean if used in assembly.*


```solidity
function predictDeterministicAddress(bytes32 hash, bytes32 salt, address deployer)
    internal
    pure
    returns (address predicted);
```

### checkStartsWith

*Requires that `salt` starts with either the zero address or `by`.*


```solidity
function checkStartsWith(bytes32 salt, address by) internal pure;
```

## Errors
### DeploymentFailed
*Unable to deploy the clone.*


```solidity
error DeploymentFailed();
```

### SaltDoesNotStartWith
*The salt must start with either the zero address or `by`.*


```solidity
error SaltDoesNotStartWith();
```

### ETHTransferFailed
*The ETH transfer has failed.*


```solidity
error ETHTransferFailed();
```

