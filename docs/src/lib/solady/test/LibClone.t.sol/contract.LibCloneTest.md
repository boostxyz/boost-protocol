# LibCloneTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md), [Clone](/lib/solady/src/utils/Clone.sol/abstract.Clone.md)


## State Variables
### value

```solidity
uint256 public value;
```


### saltIsUsed

```solidity
mapping(bytes32 => bool) saltIsUsed;
```


### _ERC1967_IMPLEMENTATION_SLOT

```solidity
bytes32 internal constant _ERC1967_IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### setValue


```solidity
function setValue(uint256 value_) public;
```

### revertWithError


```solidity
function revertWithError() public view;
```

### getCalldataHash


```solidity
function getCalldataHash() public pure returns (bytes32 result);
```

### _canReceiveETHCorrectly


```solidity
function _canReceiveETHCorrectly(address clone, uint256 deposit) internal;
```

### _shouldBehaveLikeClone


```solidity
function _shouldBehaveLikeClone(address clone, uint256 value_) internal;
```

### testDeployERC1967


```solidity
function testDeployERC1967(uint256 value_) public;
```

### testDeployERC1967I


```solidity
function testDeployERC1967I(uint256 value_) public;
```

### testDeployERC1967


```solidity
function testDeployERC1967() public;
```

### testDeployERC1967I


```solidity
function testDeployERC1967I() public;
```

### testDeployERC1967ISpecialPath


```solidity
function testDeployERC1967ISpecialPath(address impl, bytes1 data) public;
```

### testDeployERC1967ISpecialPath


```solidity
function testDeployERC1967ISpecialPath() public;
```

### testDeployERC1967CodeHashAndLength


```solidity
function testDeployERC1967CodeHashAndLength(address impl) public;
```

### testDeployERC1967ICodeHashAndLength


```solidity
function testDeployERC1967ICodeHashAndLength(address impl) public;
```

### testClone


```solidity
function testClone(uint256 value_) public;
```

### testClone


```solidity
function testClone() public;
```

### testCloneDeterministic


```solidity
function testCloneDeterministic(uint256 value_, bytes32 salt) public;
```

### cloneDeterministic


```solidity
function cloneDeterministic(address implementation, bytes32 salt) external returns (address);
```

### cloneDeterministic


```solidity
function cloneDeterministic(address implementation, bytes calldata data, bytes32 salt) external returns (address);
```

### testCloneDeterministicRevertsIfAddressAlreadyUsed


```solidity
function testCloneDeterministicRevertsIfAddressAlreadyUsed() public;
```

### testCloneDeterministic


```solidity
function testCloneDeterministic() public;
```

### testDeployDeterministicERC1967


```solidity
function testDeployDeterministicERC1967(uint256 value_, bytes32 salt) public;
```

### deployDeterministicERC1967


```solidity
function deployDeterministicERC1967(address implementation, bytes32 salt) external returns (address);
```

### testDeployDeterministicERC1967


```solidity
function testDeployDeterministicERC1967() public;
```

### testDeployDeterministicERC1967I


```solidity
function testDeployDeterministicERC1967I(uint256 value_, bytes32 salt) public;
```

### deployDeterministicERC1967I


```solidity
function deployDeterministicERC1967I(address implementation, bytes32 salt) external returns (address);
```

### testDeployDeterministicERC1967I


```solidity
function testDeployDeterministicERC1967I() public;
```

### testCreateDeterministicERC1967


```solidity
function testCreateDeterministicERC1967(uint256 value_, bytes32 salt) public;
```

### testCreateDeterministicERC1967I


```solidity
function testCreateDeterministicERC1967I(uint256 value_, bytes32 salt) public;
```

### getArgBytes


```solidity
function getArgBytes(uint256 argOffset, uint256 length) public pure returns (bytes memory);
```

### getArgAddress


```solidity
function getArgAddress(uint256 argOffset) public pure returns (address);
```

### getArgUint256


```solidity
function getArgUint256(uint256 argOffset) public pure returns (uint256);
```

### getArgUint256Array


```solidity
function getArgUint256Array(uint256 argOffset, uint256 length) public pure returns (uint256[] memory);
```

### getArgUint64


```solidity
function getArgUint64(uint256 argOffset) public pure returns (uint64);
```

### getArgUint8


```solidity
function getArgUint8(uint256 argOffset) public pure returns (uint8);
```

### testCloneWithImmutableArgs


```solidity
function testCloneWithImmutableArgs(
    uint256 value_,
    address argAddress,
    uint256 argUint256,
    uint256[] memory argUint256Array,
    uint64 argUint64,
    uint8 argUint8
) public;
```

### testCloneWithImmutableArgs


```solidity
function testCloneWithImmutableArgs() public;
```

### testCloneDeteministicWithImmutableArgs


```solidity
function testCloneDeteministicWithImmutableArgs(
    address argAddress,
    uint256 argUint256,
    uint256[] memory argUint256Array,
    bytes memory argBytes,
    uint64 argUint64,
    uint8 argUint8,
    uint256 deposit
) public;
```

### testCloneDeteministicWithImmutableArgs


```solidity
function testCloneDeteministicWithImmutableArgs() public;
```

### testStartsWith


```solidity
function testStartsWith(uint256) public;
```

### checkStartsWith


```solidity
function checkStartsWith(bytes32 salt, address by) public view;
```

### _brutalized


```solidity
function _brutalized(address a) internal view returns (address result);
```

### testCloneWithImmutableArgsRevertsIfDataTooBig


```solidity
function testCloneWithImmutableArgsRevertsIfDataTooBig() public;
```

### testInitialDeposit


```solidity
function testInitialDeposit() public;
```

### argBytesHash


```solidity
function argBytesHash() public pure returns (bytes32);
```

### _dummyData


```solidity
function _dummyData(uint256 n) internal pure returns (bytes memory result);
```

### testInitCode


```solidity
function testInitCode(address implementation, uint256 r, uint256 c) public;
```

### _testInitCode


```solidity
function _testInitCode(address implementation) internal;
```

### _testInitCode_PUSH0


```solidity
function _testInitCode_PUSH0(address implementation) internal;
```

### _testInitCode


```solidity
function _testInitCode(address implementation, uint256 n) internal;
```

### _testInitCodeERC1967


```solidity
function _testInitCodeERC1967(address implementation) internal;
```

### _testInitCodeERC1967I


```solidity
function _testInitCodeERC1967I(address implementation) internal;
```

## Events
### ReceiveETH

```solidity
event ReceiveETH(uint256 amount);
```

## Errors
### CustomError

```solidity
error CustomError(uint256 currentValue);
```

