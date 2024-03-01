# ERC721Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### token

```solidity
MockERC721 token;
```


### _ERC721_MASTER_SLOT_SEED

```solidity
uint256 private constant _ERC721_MASTER_SLOT_SEED = 0x7d8825530a5a2e7a << 192;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _expectMintEvent


```solidity
function _expectMintEvent(address to, uint256 id) internal;
```

### _expectBurnEvent


```solidity
function _expectBurnEvent(address from, uint256 id) internal;
```

### _expectTransferEvent


```solidity
function _expectTransferEvent(address from, address to, uint256 id) internal;
```

### _expectApprovalEvent


```solidity
function _expectApprovalEvent(address owner, address approved, uint256 id) internal;
```

### _expectApprovalForAllEvent


```solidity
function _expectApprovalForAllEvent(address owner, address operator, bool approved) internal;
```

### _aux


```solidity
function _aux(address owner) internal pure returns (uint224 result);
```

### _extraData


```solidity
function _extraData(uint256 id) internal pure returns (uint96 result);
```

### _transferFrom


```solidity
function _transferFrom(address from, address to, uint256 id) internal;
```

### _safeTransferFrom


```solidity
function _safeTransferFrom(address from, address to, uint256 id) internal;
```

### _safeTransferFrom


```solidity
function _safeTransferFrom(address from, address to, uint256 id, bytes memory data) internal;
```

### _approve


```solidity
function _approve(address spender, uint256 id) internal;
```

### _setApprovalForAll


```solidity
function _setApprovalForAll(address operator, bool approved) internal;
```

### _ownerOf


```solidity
function _ownerOf(uint256 id) internal returns (address);
```

### _getApproved


```solidity
function _getApproved(uint256 id) internal returns (address);
```

### _owners


```solidity
function _owners() internal returns (address a, address b);
```

### testSafetyOfCustomStorage


```solidity
function testSafetyOfCustomStorage(uint256 id0, uint256 id1) public;
```

### testAuthorizedEquivalence


```solidity
function testAuthorizedEquivalence(address by, bool isOwnerOrOperator, bool isApprovedAccount) public;
```

### testCannotExceedMaxBalance


```solidity
function testCannotExceedMaxBalance() public;
```

### testMint


```solidity
function testMint(uint256 id) public;
```

### testMintAndSetExtraDataUnchecked


```solidity
function testMintAndSetExtraDataUnchecked(uint256 id) public;
```

### testMintAndSetExtraDataUncheckedWithOverwrite


```solidity
function testMintAndSetExtraDataUncheckedWithOverwrite(uint256 id, uint96 random) public;
```

### testBurn


```solidity
function testBurn(uint256 id) public;
```

### testTransferFrom


```solidity
function testTransferFrom() public;
```

### testEverything


```solidity
function testEverything(uint256) public;
```

### testIsApprovedOrOwner


```solidity
function testIsApprovedOrOwner(uint256 id) public;
```

### testExtraData


```solidity
function testExtraData(uint256 id) public;
```

### testExtraData2


```solidity
function testExtraData2(uint256 id0, uint256 id1) public;
```

### testAux


```solidity
function testAux(uint256) public;
```

### testApprove


```solidity
function testApprove(uint256 id) public;
```

### testApproveBurn


```solidity
function testApproveBurn(uint256 id) public;
```

### testApproveAll


```solidity
function testApproveAll(uint256) public;
```

### testTransferFrom


```solidity
function testTransferFrom(uint256 id) public;
```

### testTransferFromSelf


```solidity
function testTransferFromSelf(uint256 id) public;
```

### testTransferFromApproveAll


```solidity
function testTransferFromApproveAll(uint256 id) public;
```

### testSafeTransferFromToEOA


```solidity
function testSafeTransferFromToEOA(uint256 id) public;
```

### testSafeTransferFromToERC721Recipient


```solidity
function testSafeTransferFromToERC721Recipient(uint256 id) public;
```

### testSafeTransferFromToERC721RecipientWithData


```solidity
function testSafeTransferFromToERC721RecipientWithData(uint256 id, bytes memory data) public;
```

### testSafeMintToEOA


```solidity
function testSafeMintToEOA(uint256 id) public;
```

### testSafeMintToERC721Recipient


```solidity
function testSafeMintToERC721Recipient(uint256 id) public;
```

### testSafeMintToERC721RecipientWithData


```solidity
function testSafeMintToERC721RecipientWithData(uint256 id, bytes memory data) public;
```

### testMintToZeroReverts


```solidity
function testMintToZeroReverts(uint256 id) public;
```

### testDoubleMintReverts


```solidity
function testDoubleMintReverts(uint256 id) public;
```

### testBurnNonExistentReverts


```solidity
function testBurnNonExistentReverts(uint256 id) public;
```

### testDoubleBurnReverts


```solidity
function testDoubleBurnReverts(uint256 id) public;
```

### testApproveNonExistentReverts


```solidity
function testApproveNonExistentReverts(uint256 id, address to) public;
```

### testApproveUnauthorizedReverts


```solidity
function testApproveUnauthorizedReverts(uint256 id) public;
```

### testTransferFromNotExistentReverts


```solidity
function testTransferFromNotExistentReverts(address from, address to, uint256 id) public;
```

### testTransferFromWrongFromReverts


```solidity
function testTransferFromWrongFromReverts(address to, uint256 id) public;
```

### testTransferFromToZeroReverts


```solidity
function testTransferFromToZeroReverts(uint256 id) public;
```

### testTransferFromNotOwner


```solidity
function testTransferFromNotOwner(uint256 id) public;
```

### testSafeTransferFromToNonERC721RecipientReverts


```solidity
function testSafeTransferFromToNonERC721RecipientReverts(uint256 id) public;
```

### testSafeTransferFromToNonERC721RecipientWithDataReverts


```solidity
function testSafeTransferFromToNonERC721RecipientWithDataReverts(uint256 id, bytes memory data) public;
```

### testSafeTransferFromToRevertingERC721RecipientReverts


```solidity
function testSafeTransferFromToRevertingERC721RecipientReverts(uint256 id) public;
```

### testSafeTransferFromToRevertingERC721RecipientWithDataReverts


```solidity
function testSafeTransferFromToRevertingERC721RecipientWithDataReverts(uint256 id, bytes memory data) public;
```

### testSafeTransferFromToERC721RecipientWithWrongReturnDataReverts


```solidity
function testSafeTransferFromToERC721RecipientWithWrongReturnDataReverts(uint256 id) public;
```

### testSafeTransferFromToERC721RecipientWithWrongReturnDataWithDataReverts


```solidity
function testSafeTransferFromToERC721RecipientWithWrongReturnDataWithDataReverts(uint256 id, bytes memory data)
    public;
```

### testSafeMintToNonERC721RecipientReverts


```solidity
function testSafeMintToNonERC721RecipientReverts(uint256 id) public;
```

### testSafeMintToNonERC721RecipientWithDataReverts


```solidity
function testSafeMintToNonERC721RecipientWithDataReverts(uint256 id, bytes memory data) public;
```

### testSafeMintToRevertingERC721RecipientReverts


```solidity
function testSafeMintToRevertingERC721RecipientReverts(uint256 id) public;
```

### testSafeMintToRevertingERC721RecipientWithDataReverts


```solidity
function testSafeMintToRevertingERC721RecipientWithDataReverts(uint256 id, bytes memory data) public;
```

### testSafeMintToERC721RecipientWithWrongReturnData


```solidity
function testSafeMintToERC721RecipientWithWrongReturnData(uint256 id) public;
```

### testSafeMintToERC721RecipientWithWrongReturnDataWithData


```solidity
function testSafeMintToERC721RecipientWithWrongReturnDataWithData(uint256 id, bytes memory data) public;
```

### testOwnerOfNonExistent


```solidity
function testOwnerOfNonExistent(uint256 id) public;
```

## Events
### Transfer

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed id);
```

### Approval

```solidity
event Approval(address indexed owner, address indexed approved, uint256 indexed id);
```

### ApprovalForAll

```solidity
event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
```

