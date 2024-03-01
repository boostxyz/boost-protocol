# CREATE3
**Authors:**
Solady (https://github.com/vectorized/solmady/blob/main/src/utils/CREATE3.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/CREATE3.sol), Modified from 0xSequence (https://github.com/0xSequence/create3/blob/master/contracts/Create3.sol)

Deploy to deterministic addresses without an initcode factor.


## State Variables
### _PROXY_BYTECODE
-------------------------------------------------------------------+
Opcode      | Mnemonic         | Stack        | Memory             |
-------------------------------------------------------------------|
36          | CALLDATASIZE     | cds          |                    |
3d          | RETURNDATASIZE   | 0 cds        |                    |
3d          | RETURNDATASIZE   | 0 0 cds      |                    |
37          | CALLDATACOPY     |              | [0..cds): calldata |
36          | CALLDATASIZE     | cds          | [0..cds): calldata |
3d          | RETURNDATASIZE   | 0 cds        | [0..cds): calldata |
34          | CALLVALUE        | value 0 cds  | [0..cds): calldata |
f0          | CREATE           | newContract  | [0..cds): calldata |
-------------------------------------------------------------------|
Opcode      | Mnemonic         | Stack        | Memory             |
-------------------------------------------------------------------|
67 bytecode | PUSH8 bytecode   | bytecode     |                    |
3d          | RETURNDATASIZE   | 0 bytecode   |                    |
52          | MSTORE           |              | [0..8): bytecode   |
60 0x08     | PUSH1 0x08       | 0x08         | [0..8): bytecode   |
60 0x18     | PUSH1 0x18       | 0x18 0x08    | [0..8): bytecode   |
f3          | RETURN           |              | [0..8): bytecode   |
-------------------------------------------------------------------+

*The proxy bytecode.*


```solidity
uint256 private constant _PROXY_BYTECODE = 0x67363d3d37363d34f03d5260086018f3;
```


### _PROXY_BYTECODE_HASH
*Hash of the `_PROXY_BYTECODE`.
Equivalent to `keccak256(abi.encodePacked(hex"67363d3d37363d34f03d5260086018f3"))`.*


```solidity
bytes32 private constant _PROXY_BYTECODE_HASH = 0x21c35dbe1b344a2488cf3321d6ce542f8e9f305544ff09e4993a62319a497c1f;
```


## Functions
### deploy

*Deploys `creationCode` deterministically with a `salt`.
The deployed contract is funded with `value` (in wei) ETH.
Returns the deterministic address of the deployed contract,
which solely depends on `salt`.*


```solidity
function deploy(bytes32 salt, bytes memory creationCode, uint256 value) internal returns (address deployed);
```

### getDeployed

*Returns the deterministic address for `salt` with `deployer`.*


```solidity
function getDeployed(bytes32 salt, address deployer) internal pure returns (address deployed);
```

### getDeployed

*Returns the deterministic address for `salt`.*


```solidity
function getDeployed(bytes32 salt) internal view returns (address deployed);
```

## Errors
### DeploymentFailed
*Unable to deploy the contract.*


```solidity
error DeploymentFailed();
```

### InitializationFailed
*Unable to initialize the contract.*


```solidity
error InitializationFailed();
```

