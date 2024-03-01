# CREATE3Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## Functions
### testDeployERC20


```solidity
function testDeployERC20() public;
```

### testDeployedUpperBitsSafeForPlainSolidity


```solidity
function testDeployedUpperBitsSafeForPlainSolidity() public;
```

### testDoubleDeploySameBytecodeReverts


```solidity
function testDoubleDeploySameBytecodeReverts() public;
```

### testDoubleDeployDifferentBytecodeReverts


```solidity
function testDoubleDeployDifferentBytecodeReverts() public;
```

### testDeployERC20


```solidity
function testDeployERC20(bytes32 salt, string calldata name, string calldata symbol, uint8 decimals) public;
```

### testDoubleDeploySameBytecodeReverts


```solidity
function testDoubleDeploySameBytecodeReverts(bytes32 salt, bytes calldata bytecode) public;
```

### testDoubleDeployDifferentBytecodeReverts


```solidity
function testDoubleDeployDifferentBytecodeReverts(bytes32 salt, bytes memory bytecode1, bytes memory bytecode2)
    public;
```

### deploy


```solidity
function deploy(bytes32 salt, bytes calldata creationCode, uint256 value) external returns (address);
```

### _creationCode


```solidity
function _creationCode(bytes memory bytecode) internal pure returns (bytes memory result);
```

