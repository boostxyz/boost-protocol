# SafeERC20
*Wrappers around ERC-20 operations that throw on failure (when the token
contract returns false). Tokens that return no value (and instead revert or
throw on failure) are also supported, non-reverting calls are assumed to be
successful.
To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
which allows you to call the safe operations as `token.safeTransfer(...)`, etc.*


## Functions
### safeTransfer

*Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
non-reverting calls are assumed to be successful.*


```solidity
function safeTransfer(IERC20 token, address to, uint256 value) internal;
```

### safeTransferFrom

*Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.*


```solidity
function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal;
```

### safeIncreaseAllowance

*Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
non-reverting calls are assumed to be successful.*


```solidity
function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal;
```

### safeDecreaseAllowance

*Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
value, non-reverting calls are assumed to be successful.*


```solidity
function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal;
```

### forceApprove

*Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
to be set to zero before setting it to a non-zero value, such as USDT.*


```solidity
function forceApprove(IERC20 token, address spender, uint256 value) internal;
```

### transferAndCallRelaxed

*Performs an {ERC1363} transferAndCall, with a fallback to the simple {ERC20} transfer if the target has no
code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
targeting contracts.
Reverts if the returned value is other than `true`.*


```solidity
function transferAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal;
```

### transferFromAndCallRelaxed

*Performs an {ERC1363} transferFromAndCall, with a fallback to the simple {ERC20} transferFrom if the target
has no code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
targeting contracts.
Reverts if the returned value is other than `true`.*


```solidity
function transferFromAndCallRelaxed(IERC1363 token, address from, address to, uint256 value, bytes memory data)
    internal;
```

### approveAndCallRelaxed

*Performs an {ERC1363} approveAndCall, with a fallback to the simple {ERC20} approve if the target has no
code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
targeting contracts.
NOTE: When the recipient address (`to`) has no code (i.e. is an EOA), this function behaves as {forceApprove}.
Opposedly, when the recipient address (`to`) has code, this function only attempts to call {ERC1363-approveAndCall}
once without retrying, and relies on the returned value to be true.
Reverts if the returned value is other than `true`.*


```solidity
function approveAndCallRelaxed(IERC1363 token, address to, uint256 value, bytes memory data) internal;
```

### _callOptionalReturn

*Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
on the return value: the return value is optional (but if data is returned, it must not be false).*


```solidity
function _callOptionalReturn(IERC20 token, bytes memory data) private;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The token targeted by the call.|
|`data`|`bytes`|The call data (encoded using abi.encode or one of its variants).|


### _callOptionalReturnBool

*Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
on the return value: the return value is optional (but if data is returned, it must not be false).*


```solidity
function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`IERC20`|The token targeted by the call.|
|`data`|`bytes`|The call data (encoded using abi.encode or one of its variants). This is a variant of [_callOptionalReturn](/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol/library.SafeERC20.md#_calloptionalreturn) that silents catches all reverts and returns a bool instead.|


## Errors
### SafeERC20FailedOperation
*An operation with an ERC-20 token failed.*


```solidity
error SafeERC20FailedOperation(address token);
```

### SafeERC20FailedDecreaseAllowance
*Indicates a failed `decreaseAllowance` request.*


```solidity
error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);
```

