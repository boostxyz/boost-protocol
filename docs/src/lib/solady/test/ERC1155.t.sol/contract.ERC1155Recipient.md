# ERC1155Recipient
**Inherits:**
[ERC1155TokenReceiver](/lib/solady/test/utils/mocks/MockERC1271Wallet.sol/abstract.ERC1155TokenReceiver.md)


## State Variables
### operator

```solidity
address public operator;
```


### from

```solidity
address public from;
```


### id

```solidity
uint256 public id;
```


### amount

```solidity
uint256 public amount;
```


### mintData

```solidity
bytes public mintData;
```


### batchOperator

```solidity
address public batchOperator;
```


### batchFrom

```solidity
address public batchFrom;
```


### _batchIds

```solidity
uint256[] internal _batchIds;
```


### _batchAmounts

```solidity
uint256[] internal _batchAmounts;
```


### batchData

```solidity
bytes public batchData;
```


## Functions
### onERC1155Received


```solidity
function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _amount, bytes calldata _data)
    public
    override
    returns (bytes4);
```

### batchIds


```solidity
function batchIds() external view returns (uint256[] memory);
```

### batchAmounts


```solidity
function batchAmounts() external view returns (uint256[] memory);
```

### onERC1155BatchReceived


```solidity
function onERC1155BatchReceived(
    address _operator,
    address _from,
    uint256[] calldata _ids,
    uint256[] calldata _amounts,
    bytes calldata _data
) external override returns (bytes4);
```

