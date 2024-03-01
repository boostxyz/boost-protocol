# IERC3156FlashLender
*Interface of the ERC-3156 FlashLender, as defined in
https://eips.ethereum.org/EIPS/eip-3156[ERC-3156].*


## Functions
### maxFlashLoan

*The amount of currency available to be lended.*


```solidity
function maxFlashLoan(address token) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`address`|The loan currency.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of `token` that can be borrowed.|


### flashFee

*The fee to be charged for a given loan.*


```solidity
function flashFee(address token, uint256 amount) external view returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`address`|The loan currency.|
|`amount`|`uint256`|The amount of tokens lent.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of `token` to be charged for the loan, on top of the returned principal.|


### flashLoan

*Initiate a flash loan.*


```solidity
function flashLoan(IERC3156FlashBorrower receiver, address token, uint256 amount, bytes calldata data)
    external
    returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`IERC3156FlashBorrower`|The receiver of the tokens in the loan, and the receiver of the callback.|
|`token`|`address`|The loan currency.|
|`amount`|`uint256`|The amount of tokens lent.|
|`data`|`bytes`|Arbitrary data structure, intended to contain user-defined parameters.|


