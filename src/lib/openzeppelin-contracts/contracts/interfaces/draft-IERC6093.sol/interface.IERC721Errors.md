# IERC721Errors
*Standard ERC-721 Errors
Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-721 tokens.*


## Errors
### ERC721InvalidOwner
*Indicates that an address can't be an owner. For example, `address(0)` is a forbidden owner in ERC-20.
Used in balance queries.*


```solidity
error ERC721InvalidOwner(address owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|Address of the current owner of a token.|

### ERC721NonexistentToken
*Indicates a `tokenId` whose `owner` is the zero address.*


```solidity
error ERC721NonexistentToken(uint256 tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`tokenId`|`uint256`|Identifier number of a token.|

### ERC721IncorrectOwner
*Indicates an error related to the ownership over a particular token. Used in transfers.*


```solidity
error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`sender`|`address`|Address whose tokens are being transferred.|
|`tokenId`|`uint256`|Identifier number of a token.|
|`owner`|`address`|Address of the current owner of a token.|

### ERC721InvalidSender
*Indicates a failure with the token `sender`. Used in transfers.*


```solidity
error ERC721InvalidSender(address sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`sender`|`address`|Address whose tokens are being transferred.|

### ERC721InvalidReceiver
*Indicates a failure with the token `receiver`. Used in transfers.*


```solidity
error ERC721InvalidReceiver(address receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|Address to which tokens are being transferred.|

### ERC721InsufficientApproval
*Indicates a failure with the `operator`’s approval. Used in transfers.*


```solidity
error ERC721InsufficientApproval(address operator, uint256 tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`operator`|`address`|Address that may be allowed to operate on tokens without being their owner.|
|`tokenId`|`uint256`|Identifier number of a token.|

### ERC721InvalidApprover
*Indicates a failure with the `approver` of a token to be approved. Used in approvals.*


```solidity
error ERC721InvalidApprover(address approver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`approver`|`address`|Address initiating an approval operation.|

### ERC721InvalidOperator
*Indicates a failure with the `operator` to be approved. Used in approvals.*


```solidity
error ERC721InvalidOperator(address operator);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`operator`|`address`|Address that may be allowed to operate on tokens without being their owner.|

