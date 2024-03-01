# ReceiverTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### erc721

```solidity
MockERC721 immutable erc721 = new MockERC721();
```


### erc1155

```solidity
MockERC1155 immutable erc1155 = new MockERC1155();
```


### receiver

```solidity
MockReceiver immutable receiver = new MockReceiver();
```


### alice

```solidity
address immutable alice = address(bytes20("milady"));
```


## Functions
### setUp


```solidity
function setUp() public;
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

