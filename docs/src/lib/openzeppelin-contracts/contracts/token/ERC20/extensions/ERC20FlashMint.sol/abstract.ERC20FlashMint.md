# ERC20FlashMint
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [IERC3156FlashLender](/lib/openzeppelin-contracts/contracts/interfaces/IERC3156FlashLender.sol/interface.IERC3156FlashLender.md)

*Implementation of the ERC-3156 Flash loans extension, as defined in
https://eips.ethereum.org/EIPS/eip-3156[ERC-3156].
Adds the [flashLoan](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20FlashMint.sol/abstract.ERC20FlashMint.md#flashloan) method, which provides flash loan support at the token
level. By default there is no fee, but this can be changed by overriding {flashFee}.
NOTE: When this extension is used along with the {ERC20Capped} or {ERC20Votes} extensions,
{maxFlashLoan} will not correctly reflect the maximum that can be flash minted. We recommend
overriding {maxFlashLoan} so that it correctly reflects the supply cap.*


## State Variables
### RETURN_VALUE

```solidity
bytes32 private constant RETURN_VALUE = keccak256("ERC3156FlashBorrower.onFlashLoan");
```


## Functions
### maxFlashLoan

*Returns the maximum amount of tokens available for loan.*


```solidity
function maxFlashLoan(address token) public view virtual returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`address`|The address of the token that is requested.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of token that can be loaned. NOTE: This function does not consider any form of supply cap, so in case it's used in a token with a cap like {ERC20Capped}, make sure to override this function to integrate the cap instead of `type(uint256).max`.|


### flashFee

*Returns the fee applied when doing flash loans. This function calls
the [_flashFee](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20FlashMint.sol/abstract.ERC20FlashMint.md#_flashfee) function which returns the fee applied when doing flash
loans.*


```solidity
function flashFee(address token, uint256 value) public view virtual returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`address`|The token to be flash loaned.|
|`value`|`uint256`|The amount of tokens to be loaned.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The fees applied to the corresponding flash loan.|


### _flashFee

*Returns the fee applied when doing flash loans. By default this
implementation has 0 fees. This function can be overloaded to make
the flash loan mechanism deflationary.*


```solidity
function _flashFee(address token, uint256 value) internal view virtual returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`token`|`address`|The token to be flash loaned.|
|`value`|`uint256`|The amount of tokens to be loaned.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The fees applied to the corresponding flash loan.|


### _flashFeeReceiver

*Returns the receiver address of the flash fee. By default this
implementation returns the address(0) which means the fee amount will be burnt.
This function can be overloaded to change the fee receiver.*


```solidity
function _flashFeeReceiver() internal view virtual returns (address);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`address`|The address for which the flash fee will be sent to.|


### flashLoan

*Performs a flash loan. New tokens are minted and sent to the
`receiver`, who is required to implement the {IERC3156FlashBorrower}
interface. By the end of the flash loan, the receiver is expected to own
value + fee tokens and have them approved back to the token contract itself so
they can be burned.*


```solidity
function flashLoan(IERC3156FlashBorrower receiver, address token, uint256 value, bytes calldata data)
    public
    virtual
    returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`receiver`|`IERC3156FlashBorrower`|The receiver of the flash loan. Should implement the [IERC3156FlashBorrower-onFlashLoan](/lib/openzeppelin-contracts/contracts/interfaces/IERC3156FlashBorrower.sol/interface.IERC3156FlashBorrower.md#onflashloan) interface.|
|`token`|`address`|The token to be flash loaned. Only `address(this)` is supported.|
|`value`|`uint256`|The amount of tokens to be loaned.|
|`data`|`bytes`|An arbitrary datafield that is passed to the receiver.|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|`true` if the flash loan was successful.|


## Errors
### ERC3156UnsupportedToken
*The loan token is not valid.*


```solidity
error ERC3156UnsupportedToken(address token);
```

### ERC3156ExceededMaxLoan
*The requested loan exceeds the max loan value for `token`.*


```solidity
error ERC3156ExceededMaxLoan(uint256 maxLoan);
```

### ERC3156InvalidReceiver
*The receiver of a flashloan is not a valid {onFlashLoan} implementer.*


```solidity
error ERC3156InvalidReceiver(address receiver);
```

