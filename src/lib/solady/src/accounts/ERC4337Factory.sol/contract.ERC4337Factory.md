# ERC4337Factory
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/accounts/ERC4337Factory.sol)

Simple ERC4337 account factory implementation.

*Note:
- Unlike the ERC1967Factory, this factory does NOT store any admin info on the factory itself.
The deployed ERC4337 accounts are minimal ERC1967 proxies to an ERC4337 implementation.
The proxy bytecode does NOT contain any upgrading logic.
- This factory does NOT contain any logic for upgrading the ERC4337 accounts.
Upgrading must be done via UUPS logic on the accounts themselves.
- The ERC4337 standard expects the factory to use deterministic deployment.
As such, this factory does not include any non-deterministic deployment methods.*


## State Variables
### implementation
*Address of the ERC4337 implementation.*


```solidity
address public immutable implementation;
```


## Functions
### constructor


```solidity
constructor(address erc4337) payable;
```

### createAccount

*Deploys an ERC4337 account with `salt` and returns its deterministic address.
If the account is already deployed, it will simply return its address.
Any `msg.value` will simply be forwarded to the account, regardless.*


```solidity
function createAccount(address owner, bytes32 salt) public payable virtual returns (address);
```

### getAddress

*Returns the deterministic address of the account created via `createAccount`.*


```solidity
function getAddress(bytes32 salt) public view virtual returns (address);
```

### initCodeHash

*Returns the initialization code hash of the ERC4337 account (a minimal ERC1967 proxy).
Used for mining vanity addresses with create2crunch.*


```solidity
function initCodeHash() public view virtual returns (bytes32);
```

