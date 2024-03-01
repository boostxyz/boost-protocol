# IERC1363Receiver
*Interface for any contract that wants to support `transferAndCall` or `transferFromAndCall`
from ERC-1363 token contracts.*


## Functions
### onTransferReceived

*Whenever ERC-1363 tokens are transferred to this contract via `transferAndCall` or `transferFromAndCall`
by `operator` from `from`, this function is called.
NOTE: To accept the transfer, this must return
`bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`
(i.e. 0x88a7ca5c, or its own function selector).*


```solidity
function onTransferReceived(address operator, address from, uint256 value, bytes calldata data)
    external
    returns (bytes4);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`operator`|`address`|The address which called `transferAndCall` or `transferFromAndCall` function.|
|`from`|`address`|The address which are tokens transferred from.|
|`value`|`uint256`|The amount of tokens transferred.|
|`data`|`bytes`|Additional data with no specified format.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes4`|`bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))` if transfer is allowed unless throwing.|


