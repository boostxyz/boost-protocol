# IERC1363Spender
*Interface for any contract that wants to support `approveAndCall`
from ERC-1363 token contracts.*


## Functions
### onApprovalReceived

*Whenever an ERC-1363 token `owner` approves this contract via `approveAndCall`
to spend their tokens, this function is called.
NOTE: To accept the approval, this must return
`bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`
(i.e. 0x7b04a2d0, or its own function selector).*


```solidity
function onApprovalReceived(address owner, uint256 value, bytes calldata data) external returns (bytes4);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`owner`|`address`|The address which called `approveAndCall` function and previously owned the tokens.|
|`value`|`uint256`|The amount of tokens to be spent.|
|`data`|`bytes`|Additional data with no specified format.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes4`|`bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))` if approval is allowed unless throwing.|


