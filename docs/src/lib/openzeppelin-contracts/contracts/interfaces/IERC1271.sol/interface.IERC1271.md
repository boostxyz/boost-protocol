# IERC1271
*Interface of the ERC-1271 standard signature validation method for
contracts as defined in https://eips.ethereum.org/EIPS/eip-1271[ERC-1271].*


## Functions
### isValidSignature

*Should return whether the signature provided is valid for the provided data*


```solidity
function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4 magicValue);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`hash`|`bytes32`|     Hash of the data to be signed|
|`signature`|`bytes`|Signature byte array associated with _data|


