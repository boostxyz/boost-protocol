# ERC1967Factory
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/ERC1967Factory.sol), jtriley-eth (https://github.com/jtriley-eth/minimum-viable-proxy)

Factory for deploying and managing ERC1967 proxy contracts.


## State Variables
### _UNAUTHORIZED_ERROR_SELECTOR
*`bytes4(keccak256(bytes("Unauthorized()")))`.*


```solidity
uint256 internal constant _UNAUTHORIZED_ERROR_SELECTOR = 0x82b42900;
```


### _DEPLOYMENT_FAILED_ERROR_SELECTOR
*`bytes4(keccak256(bytes("DeploymentFailed()")))`.*


```solidity
uint256 internal constant _DEPLOYMENT_FAILED_ERROR_SELECTOR = 0x30116425;
```


### _UPGRADE_FAILED_ERROR_SELECTOR
*`bytes4(keccak256(bytes("UpgradeFailed()")))`.*


```solidity
uint256 internal constant _UPGRADE_FAILED_ERROR_SELECTOR = 0x55299b49;
```


### _SALT_DOES_NOT_START_WITH_CALLER_ERROR_SELECTOR
*`bytes4(keccak256(bytes("SaltDoesNotStartWithCaller()")))`.*


```solidity
uint256 internal constant _SALT_DOES_NOT_START_WITH_CALLER_ERROR_SELECTOR = 0x2f634836;
```


### _ADMIN_CHANGED_EVENT_SIGNATURE
*`keccak256(bytes("AdminChanged(address,address)"))`.*


```solidity
uint256 internal constant _ADMIN_CHANGED_EVENT_SIGNATURE =
    0x7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f;
```


### _UPGRADED_EVENT_SIGNATURE
*`keccak256(bytes("Upgraded(address,address)"))`.*


```solidity
uint256 internal constant _UPGRADED_EVENT_SIGNATURE = 0x5d611f318680d00598bb735d61bacf0c514c6b50e1e5ad30040a4df2b12791c7;
```


### _DEPLOYED_EVENT_SIGNATURE
*`keccak256(bytes("Deployed(address,address,address)"))`.*


```solidity
uint256 internal constant _DEPLOYED_EVENT_SIGNATURE = 0xc95935a66d15e0da5e412aca0ad27ae891d20b2fb91cf3994b6a3bf2b8178082;
```


### _IMPLEMENTATION_SLOT
*The ERC-1967 storage slot for the implementation in the proxy.
`uint256(keccak256("eip1967.proxy.implementation")) - 1`.*


```solidity
uint256 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### adminOf

*Returns the admin of the proxy.*


```solidity
function adminOf(address proxy) public view returns (address admin);
```

### changeAdmin

*Sets the admin of the proxy.
The caller of this function must be the admin of the proxy on this factory.*


```solidity
function changeAdmin(address proxy, address admin) public;
```

### upgrade

*Upgrades the proxy to point to `implementation`.
The caller of this function must be the admin of the proxy on this factory.*


```solidity
function upgrade(address proxy, address implementation) public payable;
```

### upgradeAndCall

*Upgrades the proxy to point to `implementation`.
Then, calls the proxy with abi encoded `data`.
The caller of this function must be the admin of the proxy on this factory.*


```solidity
function upgradeAndCall(address proxy, address implementation, bytes calldata data) public payable;
```

### deploy

*Deploys a proxy for `implementation`, with `admin`,
and returns its address.
The value passed into this function will be forwarded to the proxy.*


```solidity
function deploy(address implementation, address admin) public payable returns (address proxy);
```

### deployAndCall

*Deploys a proxy for `implementation`, with `admin`,
and returns its address.
The value passed into this function will be forwarded to the proxy.
Then, calls the proxy with abi encoded `data`.*


```solidity
function deployAndCall(address implementation, address admin, bytes calldata data)
    public
    payable
    returns (address proxy);
```

### deployDeterministic

*Deploys a proxy for `implementation`, with `admin`, `salt`,
and returns its deterministic address.
The value passed into this function will be forwarded to the proxy.*


```solidity
function deployDeterministic(address implementation, address admin, bytes32 salt)
    public
    payable
    returns (address proxy);
```

### deployDeterministicAndCall

*Deploys a proxy for `implementation`, with `admin`, `salt`,
and returns its deterministic address.
The value passed into this function will be forwarded to the proxy.
Then, calls the proxy with abi encoded `data`.*


```solidity
function deployDeterministicAndCall(address implementation, address admin, bytes32 salt, bytes calldata data)
    public
    payable
    returns (address proxy);
```

### _deploy

*Deploys the proxy, with optionality to deploy deterministically with a `salt`.*


```solidity
function _deploy(address implementation, address admin, bytes32 salt, bool useSalt, bytes calldata data)
    internal
    returns (address proxy);
```

### predictDeterministicAddress

*Returns the address of the proxy deployed with `salt`.*


```solidity
function predictDeterministicAddress(bytes32 salt) public view returns (address predicted);
```

### initCodeHash

*Returns the initialization code hash of the proxy.
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHash() public view returns (bytes32 result);
```

### _initCode

*Returns a pointer to the initialization code of a proxy created via this factory.*


```solidity
function _initCode() internal view returns (bytes32 m);
```

### _emptyData

-------------------------------------------------------------------------------------+
CREATION (9 bytes)                                                                   |
-------------------------------------------------------------------------------------|
Opcode     | Mnemonic        | Stack               | Memory                          |
-------------------------------------------------------------------------------------|
60 runSize | PUSH1 runSize   | r                   |                                 |
3d         | RETURNDATASIZE  | 0 r                 |                                 |
81         | DUP2            | r 0 r               |                                 |
60 offset  | PUSH1 offset    | o r 0 r             |                                 |
3d         | RETURNDATASIZE  | 0 o r 0 r           |                                 |
39         | CODECOPY        | 0 r                 | [0..runSize): runtime code      |
f3         | RETURN          |                     | [0..runSize): runtime code      |
-------------------------------------------------------------------------------------|
RUNTIME (127 bytes)                                                                  |
-------------------------------------------------------------------------------------|
Opcode      | Mnemonic       | Stack               | Memory                          |
-------------------------------------------------------------------------------------|
|
::: keep some values in stack :::::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d          | RETURNDATASIZE | 0                   |                                 |
3d          | RETURNDATASIZE | 0 0                 |                                 |
|
::: check if caller is factory ::::::::::::::::::::::::::::::::::::::::::::::::::::: |
33          | CALLER         | c 0 0               |                                 |
73 factory  | PUSH20 factory | f c 0 0             |                                 |
14          | EQ             | isf 0 0             |                                 |
60 0x57     | PUSH1 0x57     | dest isf 0 0        |                                 |
57          | JUMPI          | 0 0                 |                                 |
|
::: copy calldata to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::::: |
36          | CALLDATASIZE   | cds 0 0             |                                 |
3d          | RETURNDATASIZE | 0 cds 0 0           |                                 |
3d          | RETURNDATASIZE | 0 0 cds 0 0         |                                 |
37          | CALLDATACOPY   | 0 0                 | [0..calldatasize): calldata     |
|
::: delegatecall to implementation ::::::::::::::::::::::::::::::::::::::::::::::::: |
36          | CALLDATASIZE   | cds 0 0             | [0..calldatasize): calldata     |
3d          | RETURNDATASIZE | 0 cds 0 0           | [0..calldatasize): calldata     |
7f slot     | PUSH32 slot    | s 0 cds 0 0         | [0..calldatasize): calldata     |
54          | SLOAD          | i 0 cds 0 0         | [0..calldatasize): calldata     |
5a          | GAS            | g i 0 cds 0 0       | [0..calldatasize): calldata     |
f4          | DELEGATECALL   | succ                | [0..calldatasize): calldata     |
|
::: copy returndata to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d          | RETURNDATASIZE | rds succ            | [0..calldatasize): calldata     |
60 0x00     | PUSH1 0x00     | 0 rds succ          | [0..calldatasize): calldata     |
80          | DUP1           | 0 0 rds succ        | [0..calldatasize): calldata     |
3e          | RETURNDATACOPY | succ                | [0..returndatasize): returndata |
|
::: branch on delegatecall status :::::::::::::::::::::::::::::::::::::::::::::::::: |
60 0x52     | PUSH1 0x52     | dest succ           | [0..returndatasize): returndata |
57          | JUMPI          |                     | [0..returndatasize): returndata |
|
::: delegatecall failed, revert :::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d          | RETURNDATASIZE | rds                 | [0..returndatasize): returndata |
60 0x00     | PUSH1 0x00     | 0 rds               | [0..returndatasize): returndata |
fd          | REVERT         |                     | [0..returndatasize): returndata |
|
::: delegatecall succeeded, return ::::::::::::::::::::::::::::::::::::::::::::::::: |
5b          | JUMPDEST       |                     | [0..returndatasize): returndata |
3d          | RETURNDATASIZE | rds                 | [0..returndatasize): returndata |
60 0x00     | PUSH1 0x00     | 0 rds               | [0..returndatasize): returndata |
f3          | RETURN         |                     | [0..returndatasize): returndata |
|
::: set new implementation (caller is factory) ::::::::::::::::::::::::::::::::::::: |
5b          | JUMPDEST       | 0 0                 |                                 |
3d          | RETURNDATASIZE | 0 0 0               |                                 |
35          | CALLDATALOAD   | impl 0 0            |                                 |
60 0x20     | PUSH1 0x20     | w impl 0 0          |                                 |
35          | CALLDATALOAD   | slot impl 0 0       |                                 |
55          | SSTORE         | 0 0                 |                                 |
|
::: no extra calldata, return :::::::::::::::::::::::::::::::::::::::::::::::::::::: |
60 0x40     | PUSH1 0x40     | 2w 0 0              |                                 |
80          | DUP1           | 2w 2w 0 0           |                                 |
36          | CALLDATASIZE   | cds 2w 2w 0 0       |                                 |
11          | GT             | gt 2w 0 0           |                                 |
15          | ISZERO         | lte 2w 0 0          |                                 |
60 0x52     | PUSH1 0x52     | dest lte 2w 0 0     |                                 |
57          | JUMPI          | 2w 0 0              |                                 |
|
::: copy extra calldata to memory :::::::::::::::::::::::::::::::::::::::::::::::::: |
36          | CALLDATASIZE   | cds 2w 0 0          |                                 |
03          | SUB            | t 0 0               |                                 |
80          | DUP1           | t t 0 0             |                                 |
60 0x40     | PUSH1 0x40     | 2w t t 0 0          |                                 |
3d          | RETURNDATASIZE | 0 2w t t 0 0        |                                 |
37          | CALLDATACOPY   | t 0 0               | [0..t): extra calldata          |
|
::: delegatecall to implementation ::::::::::::::::::::::::::::::::::::::::::::::::: |
3d          | RETURNDATASIZE | 0 t 0 0             | [0..t): extra calldata          |
3d          | RETURNDATASIZE | 0 0 t 0 0           | [0..t): extra calldata          |
35          | CALLDATALOAD   | i 0 t 0 0           | [0..t): extra calldata          |
5a          | GAS            | g i 0 t 0 0         | [0..t): extra calldata          |
f4          | DELEGATECALL   | succ                | [0..t): extra calldata          |
|
::: copy returndata to memory :::::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d          | RETURNDATASIZE | rds succ            | [0..t): extra calldata          |
60 0x00     | PUSH1 0x00     | 0 rds succ          | [0..t): extra calldata          |
80          | DUP1           | 0 0 rds succ        | [0..t): extra calldata          |
3e          | RETURNDATACOPY | succ                | [0..returndatasize): returndata |
|
::: branch on delegatecall status :::::::::::::::::::::::::::::::::::::::::::::::::: |
60 0x52     | PUSH1 0x52     | dest succ           | [0..returndatasize): returndata |
57          | JUMPI          |                     | [0..returndatasize): returndata |
|
::: delegatecall failed, revert :::::::::::::::::::::::::::::::::::::::::::::::::::: |
3d          | RETURNDATASIZE | rds                 | [0..returndatasize): returndata |
60 0x00     | PUSH1 0x00     | 0 rds               | [0..returndatasize): returndata |
fd          | REVERT         |                     | [0..returndatasize): returndata |
-------------------------------------------------------------------------------------+

*Helper function to return an empty bytes calldata.*


```solidity
function _emptyData() internal pure returns (bytes calldata data);
```

## Events
### AdminChanged
*The admin of a proxy contract has been changed.*


```solidity
event AdminChanged(address indexed proxy, address indexed admin);
```

### Upgraded
*The implementation for a proxy has been upgraded.*


```solidity
event Upgraded(address indexed proxy, address indexed implementation);
```

### Deployed
*A proxy has been deployed.*


```solidity
event Deployed(address indexed proxy, address indexed implementation, address indexed admin);
```

## Errors
### Unauthorized
*The caller is not authorized to call the function.*


```solidity
error Unauthorized();
```

### DeploymentFailed
*The proxy deployment failed.*


```solidity
error DeploymentFailed();
```

### UpgradeFailed
*The upgrade failed.*


```solidity
error UpgradeFailed();
```

### SaltDoesNotStartWithCaller
*The salt does not start with the caller.*


```solidity
error SaltDoesNotStartWithCaller();
```

