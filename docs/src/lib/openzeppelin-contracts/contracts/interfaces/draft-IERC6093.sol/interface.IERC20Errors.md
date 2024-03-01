# IERC20Errors
*Standard ERC-20 Errors
Interface of the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] custom errors for ERC-20 tokens.*


## Errors
### ERC20InsufficientBalance
*Indicates an error related to the current `balance` of a `sender`. Used in transfers.*


```solidity
error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`sender`|`address`|Address whose tokens are being transferred.|
|`balance`|`uint256`|Current balance for the interacting account.|
|`needed`|`uint256`|Minimum amount required to perform a transfer.|

### ERC20InvalidSender
*Indicates a failure with the token `sender`. Used in transfers.*


```solidity
error ERC20InvalidSender(address sender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`sender`|`address`|Address whose tokens are being transferred.|

### ERC20InvalidReceiver
*Indicates a failure with the token `receiver`. Used in transfers.*


```solidity
error ERC20InvalidReceiver(address receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|Address to which tokens are being transferred.|

### ERC20InsufficientAllowance
*Indicates a failure with the `spender`’s `allowance`. Used in transfers.*


```solidity
error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|Address that may be allowed to operate on tokens without being their owner.|
|`allowance`|`uint256`|Amount of tokens a `spender` is allowed to operate with.|
|`needed`|`uint256`|Minimum amount required to perform a transfer.|

### ERC20InvalidApprover
*Indicates a failure with the `approver` of a token to be approved. Used in approvals.*


```solidity
error ERC20InvalidApprover(address approver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`approver`|`address`|Address initiating an approval operation.|

### ERC20InvalidSpender
*Indicates a failure with the `spender` to be approved. Used in approvals.*


```solidity
error ERC20InvalidSpender(address spender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|Address that may be allowed to operate on tokens without being their owner.|

