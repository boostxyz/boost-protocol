# ERC1155HooksTest
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md), [ERC1155TokenReceiver](/lib/solady/test/utils/mocks/MockERC1271Wallet.sol/abstract.ERC1155TokenReceiver.md)


## State Variables
### expectedBeforeCounter

```solidity
uint256 public expectedBeforeCounter;
```


### expectedAfterCounter

```solidity
uint256 public expectedAfterCounter;
```


## Functions
### _checkCounters


```solidity
function _checkCounters() internal view;
```

### onERC1155Received


```solidity
function onERC1155Received(address, address, uint256, uint256, bytes calldata)
    external
    virtual
    override
    returns (bytes4);
```

### onERC1155BatchReceived


```solidity
function onERC1155BatchReceived(address, address, uint256[] calldata, uint256[] calldata, bytes calldata)
    external
    virtual
    override
    returns (bytes4);
```

### _testHooks


```solidity
function _testHooks(MockERC1155WithHooks token) internal;
```

### testERC1155Hooks


```solidity
function testERC1155Hooks() public;
```

