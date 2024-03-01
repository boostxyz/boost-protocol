# ERC1155Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md), [ERC1155TokenReceiver](/lib/solady/test/utils/mocks/MockERC1271Wallet.sol/abstract.ERC1155TokenReceiver.md)


## State Variables
### token

```solidity
MockERC1155 token;
```


### userMintAmounts

```solidity
mapping(address => mapping(uint256 => uint256)) public userMintAmounts;
```


### userTransferOrBurnAmounts

```solidity
mapping(address => mapping(uint256 => uint256)) public userTransferOrBurnAmounts;
```


## Functions
### _randomBytes


```solidity
function _randomBytes() internal returns (bytes memory b);
```

### _randomArray


```solidity
function _randomArray(uint256 n) internal returns (uint256[] memory a);
```

### _testTemps


```solidity
function _testTemps() internal returns (_TestTemps memory t);
```

### _safeTransferFrom


```solidity
function _safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) internal;
```

### _safeBatchTransferFrom


```solidity
function _safeBatchTransferFrom(
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
) internal;
```

### _setApprovalForAll


```solidity
function _setApprovalForAll(address operator, bool approved) internal;
```

### _expectMintEvent


```solidity
function _expectMintEvent(address to, uint256 id, uint256 amount) internal;
```

### _expectMintEvent


```solidity
function _expectMintEvent(address operator, address to, uint256 id, uint256 amount) internal;
```

### _expectBurnEvent


```solidity
function _expectBurnEvent(address from, uint256 id, uint256 amount) internal;
```

### _expectBurnEvent


```solidity
function _expectBurnEvent(address operator, address from, uint256 id, uint256 amount) internal;
```

### _expectTransferEvent


```solidity
function _expectTransferEvent(address from, address to, uint256 id, uint256 amount) internal;
```

### _expectTransferEvent


```solidity
function _expectTransferEvent(address operator, address from, address to, uint256 id, uint256 amount) internal;
```

### _expectMintEvent


```solidity
function _expectMintEvent(address to, uint256[] memory ids, uint256[] memory amounts) internal;
```

### _expectMintEvent


```solidity
function _expectMintEvent(address operator, address to, uint256[] memory ids, uint256[] memory amounts) internal;
```

### _expectBurnEvent


```solidity
function _expectBurnEvent(address from, uint256[] memory ids, uint256[] memory amounts) internal;
```

### _expectBurnEvent


```solidity
function _expectBurnEvent(address operator, address from, uint256[] memory ids, uint256[] memory amounts) internal;
```

### _expectTransferEvent


```solidity
function _expectTransferEvent(address from, address to, uint256[] memory ids, uint256[] memory amounts) internal;
```

### _expectTransferEvent


```solidity
function _expectTransferEvent(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts
) internal;
```

### _expectApprovalForAllEvent


```solidity
function _expectApprovalForAllEvent(address operator, bool isApproved) internal;
```

### _expectApprovalForAllEvent


```solidity
function _expectApprovalForAllEvent(address owner, address operator, bool isApproved) internal;
```

### setUp


```solidity
function setUp() public;
```

### testDirectSetApprovalForAll


```solidity
function testDirectSetApprovalForAll(address by, address operator, bool approved) public;
```

### testAuthorizedEquivalence


```solidity
function testAuthorizedEquivalence(address by, address from, bool isApprovedAccount) public;
```

### testMintToEOA


```solidity
function testMintToEOA(uint256) public;
```

### testMintToERC1155Recipient


```solidity
function testMintToERC1155Recipient(uint256) public;
```

### testBatchMintToEOA


```solidity
function testBatchMintToEOA(uint256) public;
```

### testBatchMintToERC1155Recipient


```solidity
function testBatchMintToERC1155Recipient(uint256) public;
```

### testBurn


```solidity
function testBurn(uint256) public;
```

### testBatchBurn


```solidity
function testBatchBurn(uint256) public;
```

### testApproveAll


```solidity
function testApproveAll(address to, bool approved) public;
```

### testSafeTransferFromToEOA


```solidity
function testSafeTransferFromToEOA(uint256) public;
```

### testSafeTransferFromToERC1155Recipient


```solidity
function testSafeTransferFromToERC1155Recipient(uint256) public;
```

### testSafeTransferFromSelf


```solidity
function testSafeTransferFromSelf(uint256) public;
```

### testSafeBatchTransfer


```solidity
function testSafeBatchTransfer() public;
```

### testSafeBatchTransferFromToEOA


```solidity
function testSafeBatchTransferFromToEOA(uint256) public;
```

### testSafeBatchTransferFromToERC1155Recipient


```solidity
function testSafeBatchTransferFromToERC1155Recipient(uint256) public;
```

### testBatchBalanceOf


```solidity
function testBatchBalanceOf(uint256) public;
```

### testMintToZeroReverts


```solidity
function testMintToZeroReverts(uint256) public;
```

### testMintToNonERC155RecipientReverts


```solidity
function testMintToNonERC155RecipientReverts(uint256) public;
```

### testMintToRevertingERC155RecipientReverts


```solidity
function testMintToRevertingERC155RecipientReverts(uint256) public;
```

### testMintToWrongReturnDataERC155RecipientReverts


```solidity
function testMintToWrongReturnDataERC155RecipientReverts(uint256) public;
```

### testBurnInsufficientBalanceReverts


```solidity
function testBurnInsufficientBalanceReverts(uint256) public;
```

### testSafeTransferFromInsufficientBalanceReverts


```solidity
function testSafeTransferFromInsufficientBalanceReverts(uint256) public;
```

### testSafeTransferFromSelfInsufficientBalanceReverts


```solidity
function testSafeTransferFromSelfInsufficientBalanceReverts(uint256) public;
```

### testSafeTransferFromToZeroReverts


```solidity
function testSafeTransferFromToZeroReverts(uint256) public;
```

### testSafeTransferFromToNonERC155RecipientReverts


```solidity
function testSafeTransferFromToNonERC155RecipientReverts(uint256) public;
```

### testSafeTransferFromToRevertingERC1155RecipientReverts


```solidity
function testSafeTransferFromToRevertingERC1155RecipientReverts(uint256) public;
```

### testSafeTransferFromToWrongReturnDataERC1155RecipientReverts


```solidity
function testSafeTransferFromToWrongReturnDataERC1155RecipientReverts(uint256) public;
```

### testSafeBatchTransferInsufficientBalanceReverts


```solidity
function testSafeBatchTransferInsufficientBalanceReverts(uint256) public;
```

### testSafeBatchTransferFromToZeroReverts


```solidity
function testSafeBatchTransferFromToZeroReverts(uint256) public;
```

### testSafeBatchTransferFromToNonERC1155RecipientReverts


```solidity
function testSafeBatchTransferFromToNonERC1155RecipientReverts(uint256) public;
```

### testSafeBatchTransferFromToRevertingERC1155RecipientReverts


```solidity
function testSafeBatchTransferFromToRevertingERC1155RecipientReverts(uint256) public;
```

### testSafeBatchTransferFromToWrongReturnDataERC1155RecipientReverts


```solidity
function testSafeBatchTransferFromToWrongReturnDataERC1155RecipientReverts(uint256) public;
```

### testSafeBatchTransferFromWithArrayLengthMismatchReverts


```solidity
function testSafeBatchTransferFromWithArrayLengthMismatchReverts(uint256) public;
```

### testBatchMintToZeroReverts


```solidity
function testBatchMintToZeroReverts(uint256) public;
```

### testBatchMintToNonERC1155RecipientReverts


```solidity
function testBatchMintToNonERC1155RecipientReverts(uint256) public;
```

### testBatchMintToRevertingERC1155RecipientReverts


```solidity
function testBatchMintToRevertingERC1155RecipientReverts(uint256) public;
```

### testBatchMintToWrongReturnDataERC1155RecipientReverts


```solidity
function testBatchMintToWrongReturnDataERC1155RecipientReverts(uint256) public;
```

### testBatchMintWithArrayMismatchReverts


```solidity
function testBatchMintWithArrayMismatchReverts(uint256) public;
```

### testBatchBurnInsufficientBalanceReverts


```solidity
function testBatchBurnInsufficientBalanceReverts(uint256) public;
```

### testBatchBurnWithArrayLengthMismatchReverts


```solidity
function testBatchBurnWithArrayLengthMismatchReverts(uint256) public;
```

### testBalanceOfBatchWithArrayMismatchReverts


```solidity
function testBalanceOfBatchWithArrayMismatchReverts(uint256) public;
```

## Events
### TransferSingle

```solidity
event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 amount);
```

### TransferBatch

```solidity
event TransferBatch(
    address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] amounts
);
```

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool isApproved);
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    address from;
    address to;
    uint256 n;
    uint256[] ids;
    uint256[] mintAmounts;
    uint256[] transferAmounts;
    uint256[] burnAmounts;
    uint256 id;
    uint256 mintAmount;
    uint256 transferAmount;
    uint256 burnAmount;
    bytes mintData;
    bytes burnData;
    bytes transferData;
}
```

