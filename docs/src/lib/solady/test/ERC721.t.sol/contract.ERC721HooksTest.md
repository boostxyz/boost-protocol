# ERC721HooksTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md), [ERC721TokenReceiver](/lib/solady/test/ERC721.t.sol/abstract.ERC721TokenReceiver.md)


## State Variables
### expectedBeforeCounter

```solidity
uint256 public expectedBeforeCounter;
```


### expectedAfterCounter

```solidity
uint256 public expectedAfterCounter;
```


### ticker

```solidity
uint256 public ticker;
```


## Functions
### _checkCounters


```solidity
function _checkCounters() internal view;
```

### onERC721Received


```solidity
function onERC721Received(address, address, uint256, bytes calldata) external virtual override returns (bytes4);
```

### _testHooks


```solidity
function _testHooks(MockERC721WithHooks token) internal;
```

### testERC721Hooks


```solidity
function testERC721Hooks() public;
```

