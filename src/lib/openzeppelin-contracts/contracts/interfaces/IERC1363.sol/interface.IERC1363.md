# IERC1363
**Inherits:**
[IERC20](/lib/forge-std/src/interfaces/IERC20.sol/interface.IERC20.md), [IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md)

*Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].
Defines an extension interface for ERC-20 tokens that supports executing code on a recipient contract
after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.*


## Functions
### transferAndCall

*Moves a `value` amount of tokens from the caller's account to `to`
and then calls {IERC1363Receiver-onTransferReceived} on `to`.*


```solidity
function transferAndCall(address to, uint256 value) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`to`|`address`|The address which you want to transfer to.|
|`value`|`uint256`|The amount of tokens to be transferred.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean value indicating whether the operation succeeded unless throwing.|


### transferAndCall

*Moves a `value` amount of tokens from the caller's account to `to`
and then calls {IERC1363Receiver-onTransferReceived} on `to`.*


```solidity
function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`to`|`address`|The address which you want to transfer to.|
|`value`|`uint256`|The amount of tokens to be transferred.|
|`data`|`bytes`|Additional data with no specified format, sent in call to `to`.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean value indicating whether the operation succeeded unless throwing.|


### transferFromAndCall

*Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
and then calls {IERC1363Receiver-onTransferReceived} on `to`.*


```solidity
function transferFromAndCall(address from, address to, uint256 value) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`|The address which you want to send tokens from.|
|`to`|`address`|The address which you want to transfer to.|
|`value`|`uint256`|The amount of tokens to be transferred.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean value indicating whether the operation succeeded unless throwing.|


### transferFromAndCall

*Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
and then calls {IERC1363Receiver-onTransferReceived} on `to`.*


```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`from`|`address`|The address which you want to send tokens from.|
|`to`|`address`|The address which you want to transfer to.|
|`value`|`uint256`|The amount of tokens to be transferred.|
|`data`|`bytes`|Additional data with no specified format, sent in call to `to`.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean value indicating whether the operation succeeded unless throwing.|


### approveAndCall

*Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.*


```solidity
function approveAndCall(address spender, uint256 value) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|The address which will spend the funds.|
|`value`|`uint256`|The amount of tokens to be spent.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean value indicating whether the operation succeeded unless throwing.|


### approveAndCall

*Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.*


```solidity
function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|The address which will spend the funds.|
|`value`|`uint256`|The amount of tokens to be spent.|
|`data`|`bytes`|Additional data with no specified format, sent in call to `spender`.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|A boolean value indicating whether the operation succeeded unless throwing.|


