# ERC4337Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### _PARENT_TYPEHASH

```solidity
bytes32 internal constant _PARENT_TYPEHASH = 0xd61db970ec8a2edc5f9fd31d876abe01b785909acb16dcd4baaf3b434b4c439b;
```


### _DOMAIN_SEP_B

```solidity
bytes32 internal constant _DOMAIN_SEP_B = 0xa1a044077d7677adbbfa892ded5390979b33993e0e2a457e3f974bbcda53821b;
```


### _ENTRY_POINT

```solidity
address internal constant _ENTRY_POINT = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;
```


### erc4337

```solidity
address erc4337;
```


### account

```solidity
MockERC4337 account;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### testDisableInitializerForImplementation


```solidity
function testDisableInitializerForImplementation() public;
```

### testInitializer


```solidity
function testInitializer() public;
```

### testExecute


```solidity
function testExecute() public;
```

### testExecuteBatch


```solidity
function testExecuteBatch() public;
```

### testExecuteBatch


```solidity
function testExecuteBatch(uint256 r) public;
```

### testDelegateExecute


```solidity
function testDelegateExecute() public;
```

### testDelegateExecute


```solidity
function testDelegateExecute(uint256 r) public;
```

### testDelegateExecuteRevertsIfOwnerSlotValueChanged


```solidity
function testDelegateExecuteRevertsIfOwnerSlotValueChanged() public;
```

### testDepositFunctions


```solidity
function testDepositFunctions() public;
```

### testCdFallback


```solidity
function testCdFallback() public;
```

### testCdFallback2


```solidity
function testCdFallback2() public;
```

### testValidateUserOp


```solidity
function testValidateUserOp() public;
```

### testIsValidSignature


```solidity
function testIsValidSignature() public;
```

### testIsValidSignaturePersonalSign


```solidity
function testIsValidSignaturePersonalSign() public;
```

### testIsValidSignatureWrapped


```solidity
function testIsValidSignatureWrapped() public;
```

### _toERC1271Hash


```solidity
function _toERC1271Hash(bytes32 child) internal view returns (bytes32);
```

### _toChildHash


```solidity
function _toChildHash(bytes32 child) internal pure returns (bytes32);
```

### _toERC1271HashPersonalSign


```solidity
function _toERC1271HashPersonalSign(bytes32 childHash) internal view returns (bytes32);
```

### testETHReceived


```solidity
function testETHReceived() public;
```

### testOnERC721Received


```solidity
function testOnERC721Received() public;
```

### testOnERC1155Received


```solidity
function testOnERC1155Received() public;
```

### testOnERC1155BatchReceived


```solidity
function testOnERC1155BatchReceived() public;
```

### testDirectStorage


```solidity
function testDirectStorage() public;
```

### testOwnerRecovery


```solidity
function testOwnerRecovery() public;
```

### _randomBytes


```solidity
function _randomBytes(uint256 seed) internal pure returns (bytes memory result);
```

## Events
### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    bytes32 userOpHash;
    bytes32 hash;
    address signer;
    uint256 privateKey;
    uint8 v;
    bytes32 r;
    bytes32 s;
    uint256 missingAccountFunds;
}
```

