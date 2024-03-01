# IERC1155Errors
*Standard ERC-1155 Errors
Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-1155 tokens.*


## Errors
### ERC1155InsufficientBalance
*Indicates an error related to the current `balance` of a `sender`. Used in transfers.*


```solidity
error ERC1155InsufficientBalance(address sender, uint256 balance, uint256 needed, uint256 tokenId);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`sender`|`address`|Address whose tokens are being transferred.|
|`balance`|`uint256`|Current balance for the interacting account.|
|`needed`|`uint256`|Minimum amount required to perform a transfer.|
|`tokenId`|`uint256`|Identifier number of a token.|

### ERC1155InvalidSender
*Indicates a failure with the token `sender`. Used in transfers.*


```solidity
error ERC1155InvalidSender(address sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`sender`|`address`|Address whose tokens are being transferred.|

### ERC1155InvalidReceiver
*Indicates a failure with the token `receiver`. Used in transfers.*


```solidity
error ERC1155InvalidReceiver(address receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|Address to which tokens are being transferred.|

### ERC1155MissingApprovalForAll
*Indicates a failure with the `operator`’s approval. Used in transfers.*


```solidity
error ERC1155MissingApprovalForAll(address operator, address owner);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`operator`|`address`|Address that may be allowed to operate on tokens without being their owner.|
|`owner`|`address`|Address of the current owner of a token.|

### ERC1155InvalidApprover
*Indicates a failure with the `approver` of a token to be approved. Used in approvals.*


```solidity
error ERC1155InvalidApprover(address approver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`approver`|`address`|Address initiating an approval operation.|

### ERC1155InvalidOperator
*Indicates a failure with the `operator` to be approved. Used in approvals.*


```solidity
error ERC1155InvalidOperator(address operator);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`operator`|`address`|Address that may be allowed to operate on tokens without being their owner.|

### ERC1155InvalidArrayLength
*Indicates an array length mismatch between ids and values in a safeBatchTransferFrom operation.
Used in batch transfers.*


```solidity
error ERC1155InvalidArrayLength(uint256 idsLength, uint256 valuesLength);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`idsLength`|`uint256`|Length of the array of token identifiers|
|`valuesLength`|`uint256`|Length of the array of token amounts|

