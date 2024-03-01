# MockERC721Test
**Inherits:**
[StdCheats](/lib/forge-std/src/StdCheats.sol/abstract.StdCheats.md), [Test](/lib/forge-std/src/Test.sol/abstract.Test.md)


## State Variables
### token

```solidity
Token_ERC721 token;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### invariantMetadata


```solidity
function invariantMetadata() public;
```

### testMint


```solidity
function testMint() public;
```

### testBurn


```solidity
function testBurn() public;
```

### testApprove


```solidity
function testApprove() public;
```

### testApproveBurn


```solidity
function testApproveBurn() public;
```

### testApproveAll


```solidity
function testApproveAll() public;
```

### testTransferFrom


```solidity
function testTransferFrom() public;
```

### testTransferFromSelf


```solidity
function testTransferFromSelf() public;
```

### testTransferFromApproveAll


```solidity
function testTransferFromApproveAll() public;
```

### testSafeTransferFromToEOA


```solidity
function testSafeTransferFromToEOA() public;
```

### testSafeTransferFromToERC721Recipient


```solidity
function testSafeTransferFromToERC721Recipient() public;
```

### testSafeTransferFromToERC721RecipientWithData


```solidity
function testSafeTransferFromToERC721RecipientWithData() public;
```

### testSafeMintToEOA


```solidity
function testSafeMintToEOA() public;
```

### testSafeMintToERC721Recipient


```solidity
function testSafeMintToERC721Recipient() public;
```

### testSafeMintToERC721RecipientWithData


```solidity
function testSafeMintToERC721RecipientWithData() public;
```

### testFailMintToZero


```solidity
function testFailMintToZero() public;
```

### testFailDoubleMint


```solidity
function testFailDoubleMint() public;
```

### testFailBurnUnMinted


```solidity
function testFailBurnUnMinted() public;
```

### testFailDoubleBurn


```solidity
function testFailDoubleBurn() public;
```

### testFailApproveUnMinted


```solidity
function testFailApproveUnMinted() public;
```

### testFailApproveUnAuthorized


```solidity
function testFailApproveUnAuthorized() public;
```

### testFailTransferFromUnOwned


```solidity
function testFailTransferFromUnOwned() public;
```

### testFailTransferFromWrongFrom


```solidity
function testFailTransferFromWrongFrom() public;
```

### testFailTransferFromToZero


```solidity
function testFailTransferFromToZero() public;
```

### testFailTransferFromNotOwner


```solidity
function testFailTransferFromNotOwner() public;
```

### testFailSafeTransferFromToNonERC721Recipient


```solidity
function testFailSafeTransferFromToNonERC721Recipient() public;
```

### testFailSafeTransferFromToNonERC721RecipientWithData


```solidity
function testFailSafeTransferFromToNonERC721RecipientWithData() public;
```

### testFailSafeTransferFromToRevertingERC721Recipient


```solidity
function testFailSafeTransferFromToRevertingERC721Recipient() public;
```

### testFailSafeTransferFromToRevertingERC721RecipientWithData


```solidity
function testFailSafeTransferFromToRevertingERC721RecipientWithData() public;
```

### testFailSafeTransferFromToERC721RecipientWithWrongReturnData


```solidity
function testFailSafeTransferFromToERC721RecipientWithWrongReturnData() public;
```

### testFailSafeTransferFromToERC721RecipientWithWrongReturnDataWithData


```solidity
function testFailSafeTransferFromToERC721RecipientWithWrongReturnDataWithData() public;
```

### testFailSafeMintToNonERC721Recipient


```solidity
function testFailSafeMintToNonERC721Recipient() public;
```

### testFailSafeMintToNonERC721RecipientWithData


```solidity
function testFailSafeMintToNonERC721RecipientWithData() public;
```

### testFailSafeMintToRevertingERC721Recipient


```solidity
function testFailSafeMintToRevertingERC721Recipient() public;
```

### testFailSafeMintToRevertingERC721RecipientWithData


```solidity
function testFailSafeMintToRevertingERC721RecipientWithData() public;
```

### testFailSafeMintToERC721RecipientWithWrongReturnData


```solidity
function testFailSafeMintToERC721RecipientWithWrongReturnData() public;
```

### testFailSafeMintToERC721RecipientWithWrongReturnDataWithData


```solidity
function testFailSafeMintToERC721RecipientWithWrongReturnDataWithData() public;
```

### testFailBalanceOfZeroAddress


```solidity
function testFailBalanceOfZeroAddress() public view;
```

### testFailOwnerOfUnminted


```solidity
function testFailOwnerOfUnminted() public view;
```

### testMetadata


```solidity
function testMetadata(string memory name, string memory symbol) public;
```

### testMint


```solidity
function testMint(address to, uint256 id) public;
```

### testBurn


```solidity
function testBurn(address to, uint256 id) public;
```

### testApprove


```solidity
function testApprove(address to, uint256 id) public;
```

### testApproveBurn


```solidity
function testApproveBurn(address to, uint256 id) public;
```

### testApproveAll


```solidity
function testApproveAll(address to, bool approved) public;
```

### testTransferFrom


```solidity
function testTransferFrom(uint256 id, address to) public;
```

### testTransferFromSelf


```solidity
function testTransferFromSelf(uint256 id, address to) public;
```

### testTransferFromApproveAll


```solidity
function testTransferFromApproveAll(uint256 id, address to) public;
```

### testSafeTransferFromToEOA


```solidity
function testSafeTransferFromToEOA(uint256 id, address to) public;
```

### testSafeTransferFromToERC721Recipient


```solidity
function testSafeTransferFromToERC721Recipient(uint256 id) public;
```

### testSafeTransferFromToERC721RecipientWithData


```solidity
function testSafeTransferFromToERC721RecipientWithData(uint256 id, bytes calldata data) public;
```

### testSafeMintToEOA


```solidity
function testSafeMintToEOA(uint256 id, address to) public;
```

### testSafeMintToERC721Recipient


```solidity
function testSafeMintToERC721Recipient(uint256 id) public;
```

### testSafeMintToERC721RecipientWithData


```solidity
function testSafeMintToERC721RecipientWithData(uint256 id, bytes calldata data) public;
```

### testFailMintToZero


```solidity
function testFailMintToZero(uint256 id) public;
```

### testFailDoubleMint


```solidity
function testFailDoubleMint(uint256 id, address to) public;
```

### testFailBurnUnMinted


```solidity
function testFailBurnUnMinted(uint256 id) public;
```

### testFailDoubleBurn


```solidity
function testFailDoubleBurn(uint256 id, address to) public;
```

### testFailApproveUnMinted


```solidity
function testFailApproveUnMinted(uint256 id, address to) public;
```

### testFailApproveUnAuthorized


```solidity
function testFailApproveUnAuthorized(address owner, uint256 id, address to) public;
```

### testFailTransferFromUnOwned


```solidity
function testFailTransferFromUnOwned(address from, address to, uint256 id) public;
```

### testFailTransferFromWrongFrom


```solidity
function testFailTransferFromWrongFrom(address owner, address from, address to, uint256 id) public;
```

### testFailTransferFromToZero


```solidity
function testFailTransferFromToZero(uint256 id) public;
```

### testFailTransferFromNotOwner


```solidity
function testFailTransferFromNotOwner(address from, address to, uint256 id) public;
```

### testFailSafeTransferFromToNonERC721Recipient


```solidity
function testFailSafeTransferFromToNonERC721Recipient(uint256 id) public;
```

### testFailSafeTransferFromToNonERC721RecipientWithData


```solidity
function testFailSafeTransferFromToNonERC721RecipientWithData(uint256 id, bytes calldata data) public;
```

### testFailSafeTransferFromToRevertingERC721Recipient


```solidity
function testFailSafeTransferFromToRevertingERC721Recipient(uint256 id) public;
```

### testFailSafeTransferFromToRevertingERC721RecipientWithData


```solidity
function testFailSafeTransferFromToRevertingERC721RecipientWithData(uint256 id, bytes calldata data) public;
```

### testFailSafeTransferFromToERC721RecipientWithWrongReturnData


```solidity
function testFailSafeTransferFromToERC721RecipientWithWrongReturnData(uint256 id) public;
```

### testFailSafeTransferFromToERC721RecipientWithWrongReturnDataWithData


```solidity
function testFailSafeTransferFromToERC721RecipientWithWrongReturnDataWithData(uint256 id, bytes calldata data) public;
```

### testFailSafeMintToNonERC721Recipient


```solidity
function testFailSafeMintToNonERC721Recipient(uint256 id) public;
```

### testFailSafeMintToNonERC721RecipientWithData


```solidity
function testFailSafeMintToNonERC721RecipientWithData(uint256 id, bytes calldata data) public;
```

### testFailSafeMintToRevertingERC721Recipient


```solidity
function testFailSafeMintToRevertingERC721Recipient(uint256 id) public;
```

### testFailSafeMintToRevertingERC721RecipientWithData


```solidity
function testFailSafeMintToRevertingERC721RecipientWithData(uint256 id, bytes calldata data) public;
```

### testFailSafeMintToERC721RecipientWithWrongReturnData


```solidity
function testFailSafeMintToERC721RecipientWithWrongReturnData(uint256 id) public;
```

### testFailSafeMintToERC721RecipientWithWrongReturnDataWithData


```solidity
function testFailSafeMintToERC721RecipientWithWrongReturnDataWithData(uint256 id, bytes calldata data) public;
```

### testFailOwnerOfUnminted


```solidity
function testFailOwnerOfUnminted(uint256 id) public view;
```

