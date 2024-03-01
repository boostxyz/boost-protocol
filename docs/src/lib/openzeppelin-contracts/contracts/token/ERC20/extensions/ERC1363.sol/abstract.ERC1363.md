# ERC1363
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [ERC165](/lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol/abstract.ERC165.md), [IERC1363](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363.sol/interface.IERC1363.md)

*Extension of {ERC20} tokens that adds support for code execution after transfers and approvals
on recipient contracts. Calls after transfers are enabled through the {ERC1363-transferAndCall} and
{ERC1363-transferFromAndCall} methods while calls after approvals can be made with {ERC1363-approveAndCall}*


## Functions
### supportsInterface

Query if a contract implements an interface

*Interface identification is specified in ERC-165. This function
uses less than 30,000 gas.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`interfaceId`|`bytes4`||

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|`true` if the contract implements `interfaceID` and `interfaceID` is not 0xffffffff, `false` otherwise|


### transferAndCall

*Moves a `value` amount of tokens from the caller's account to `to`
and then calls [IERC1363Receiver-onTransferReceived](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Receiver.sol/interface.IERC1363Receiver.md#ontransferreceived) on `to`.
Requirements:
- The target has code (i.e. is a contract).
- The target `to` must implement the {IERC1363Receiver} interface.
- The target must return the {IERC1363Receiver-onTransferReceived} selector to accept the transfer.
- The internal {transfer} must succeed (returned `true`).*


```solidity
function transferAndCall(address to, uint256 value) public returns (bool);
```

### transferAndCall

*Variant of [transferAndCall](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC1363.sol/abstract.ERC1363.md#transferandcall) that accepts an additional `data` parameter with
no specified format.*


```solidity
function transferAndCall(address to, uint256 value, bytes memory data) public virtual returns (bool);
```

### transferFromAndCall

*Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
and then calls [IERC1363Receiver-onTransferReceived](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Receiver.sol/interface.IERC1363Receiver.md#ontransferreceived) on `to`.
Requirements:
- The target has code (i.e. is a contract).
- The target `to` must implement the {IERC1363Receiver} interface.
- The target must return the {IERC1363Receiver-onTransferReceived} selector to accept the transfer.
- The internal {transferFrom} must succeed (returned `true`).*


```solidity
function transferFromAndCall(address from, address to, uint256 value) public returns (bool);
```

### transferFromAndCall

*Variant of [transferFromAndCall](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC1363.sol/abstract.ERC1363.md#transferfromandcall) that accepts an additional `data` parameter with
no specified format.*


```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes memory data)
    public
    virtual
    returns (bool);
```

### approveAndCall

*Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens and then calls [IERC1363Spender-onApprovalReceived](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Spender.sol/interface.IERC1363Spender.md#onapprovalreceived) on `spender`.
Requirements:
- The target has code (i.e. is a contract).
- The target `spender` must implement the {IERC1363Spender} interface.
- The target must return the {IERC1363Spender-onApprovalReceived} selector to accept the approval.
- The internal {approve} must succeed (returned `true`).*


```solidity
function approveAndCall(address spender, uint256 value) public returns (bool);
```

### approveAndCall

*Variant of [approveAndCall](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC1363.sol/abstract.ERC1363.md#approveandcall) that accepts an additional `data` parameter with
no specified format.*


```solidity
function approveAndCall(address spender, uint256 value, bytes memory data) public virtual returns (bool);
```

### _checkOnTransferReceived

*Performs a call to [IERC1363Receiver-onTransferReceived](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Receiver.sol/interface.IERC1363Receiver.md#ontransferreceived) on a target address.
Requirements:
- The target has code (i.e. is a contract).
- The target `to` must implement the {IERC1363Receiver} interface.
- The target must return the {IERC1363Receiver-onTransferReceived} selector to accept the transfer.*


```solidity
function _checkOnTransferReceived(address from, address to, uint256 value, bytes memory data) private;
```

### _checkOnApprovalReceived

*Performs a call to [IERC1363Spender-onApprovalReceived](/lib/openzeppelin-contracts/contracts/interfaces/IERC1363Spender.sol/interface.IERC1363Spender.md#onapprovalreceived) on a target address.
Requirements:
- The target has code (i.e. is a contract).
- The target `spender` must implement the {IERC1363Spender} interface.
- The target must return the {IERC1363Spender-onApprovalReceived} selector to accept the approval.*


```solidity
function _checkOnApprovalReceived(address spender, uint256 value, bytes memory data) private;
```

## Errors
### ERC1363InvalidReceiver
*Indicates a failure with the token `receiver`. Used in transfers.*


```solidity
error ERC1363InvalidReceiver(address receiver);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`address`|Address to which tokens are being transferred.|

### ERC1363InvalidSpender
*Indicates a failure with the token `spender`. Used in approvals.*


```solidity
error ERC1363InvalidSpender(address spender);
```

**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`spender`|`address`|Address that may be allowed to operate on tokens without being their owner.|

### ERC1363TransferFailed
*Indicates a failure within the {transfer} part of a transferAndCall operation.*


```solidity
error ERC1363TransferFailed(address to, uint256 value);
```

### ERC1363TransferFromFailed
*Indicates a failure within the {transferFrom} part of a transferFromAndCall operation.*


```solidity
error ERC1363TransferFromFailed(address from, address to, uint256 value);
```

### ERC1363ApproveFailed
*Indicates a failure within the {approve} part of a approveAndCall operation.*


```solidity
error ERC1363ApproveFailed(address spender, uint256 value);
```

