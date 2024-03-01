# Create2
*Helper to make usage of the `CREATE2` EVM opcode easier and safer.
`CREATE2` can be used to compute in advance the address where a smart
contract will be deployed, which allows for interesting new mechanisms known
as 'counterfactual interactions'.
See the https://eips.ethereum.org/EIPS/eip-1014#motivation[EIP] for more
information.*


## Functions
### deploy

*Deploys a contract using `CREATE2`. The address where the contract
will be deployed can be known in advance via [computeAddress](/lib/openzeppelin-contracts/contracts/utils/Create2.sol/library.Create2.md#computeaddress).
The bytecode for a contract can be obtained from Solidity with
`type(contractName).creationCode`.
Requirements:
- `bytecode` must not be empty.
- `salt` must have not been used for `bytecode` already.
- the factory must have a balance of at least `amount`.
- if `amount` is non-zero, `bytecode` must have a `payable` constructor.*


```solidity
function deploy(uint256 amount, bytes32 salt, bytes memory bytecode) internal returns (address addr);
```

### computeAddress

*Returns the address where a contract will be stored if deployed via [deploy](/lib/openzeppelin-contracts/contracts/utils/Create2.sol/library.Create2.md#deploy). Any change in the
`bytecodeHash` or `salt` will result in a new destination address.*


```solidity
function computeAddress(bytes32 salt, bytes32 bytecodeHash) internal view returns (address);
```

### computeAddress

*Returns the address where a contract will be stored if deployed via [deploy](/lib/openzeppelin-contracts/contracts/utils/Create2.sol/library.Create2.md#deploy) from a contract located at
`deployer`. If `deployer` is this contract's address, returns the same value as {computeAddress}.*


```solidity
function computeAddress(bytes32 salt, bytes32 bytecodeHash, address deployer) internal pure returns (address addr);
```

## Errors
### Create2InsufficientBalance
*Not enough balance for performing a CREATE2 deploy.*


```solidity
error Create2InsufficientBalance(uint256 balance, uint256 needed);
```

### Create2EmptyBytecode
*There's no code to deploy.*


```solidity
error Create2EmptyBytecode();
```

### Create2FailedDeployment
*The deployment failed.*


```solidity
error Create2FailedDeployment();
```

