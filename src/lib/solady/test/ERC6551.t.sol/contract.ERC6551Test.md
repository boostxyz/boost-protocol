# ERC6551Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### _registry

```solidity
MockERC6551Registry internal _registry;
```


### _erc6551

```solidity
address internal _erc6551;
```


### _erc721

```solidity
address internal _erc721;
```


### _proxy

```solidity
address internal _proxy;
```


### _PARENT_TYPEHASH

```solidity
bytes32 internal constant _PARENT_TYPEHASH = 0xd61db970ec8a2edc5f9fd31d876abe01b785909acb16dcd4baaf3b434b4c439b;
```


### _DOMAIN_SEP_B

```solidity
bytes32 internal constant _DOMAIN_SEP_B = 0xa1a044077d7677adbbfa892ded5390979b33993e0e2a457e3f974bbcda53821b;
```


### _ERC1967_IMPLEMENTATION_SLOT

```solidity
bytes32 internal constant _ERC1967_IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _testTempsMint


```solidity
function _testTempsMint(address owner) internal returns (uint256 tokenId);
```

### _testTemps


```solidity
function _testTemps() internal returns (_TestTemps memory t);
```

### testDeployERC6551Proxy


```solidity
function testDeployERC6551Proxy() public;
```

### testInitializeERC6551ProxyImplementation


```solidity
function testInitializeERC6551ProxyImplementation() public;
```

### testDeployERC6551


```solidity
function testDeployERC6551(uint256) public;
```

### testOnERC721ReceivedCycles


```solidity
function testOnERC721ReceivedCycles() public;
```

### testOnERC721ReceivedCyclesWithDifferentChainIds


```solidity
function testOnERC721ReceivedCyclesWithDifferentChainIds(uint256) public;
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

### testUpgrade


```solidity
function testUpgrade() public;
```

### testSupportsInterface


```solidity
function testSupportsInterface() public;
```

### testCdFallback


```solidity
function testCdFallback() public;
```

### testIsValidSignature


```solidity
function testIsValidSignature() public;
```

### _toERC1271Hash


```solidity
function _toERC1271Hash(address account, bytes32 child) internal view returns (bytes32);
```

### _toChildHash


```solidity
function _toChildHash(bytes32 child) internal pure returns (bytes32);
```

### _randomBytes


```solidity
function _randomBytes(uint256 seed) internal pure returns (bytes memory result);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    address owner;
    uint256 chainId;
    uint256 tokenId;
    bytes32 salt;
    MockERC6551 account;
    address signer;
    uint256 privateKey;
    uint8 v;
    bytes32 r;
    bytes32 s;
}
```

