# ERC721MintAction
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/00a29d18bb9e82e36d30703c29f8dfdef1d915df/src/actions/ERC721MintAction.sol)

**Inherits:**
[Action](/src/actions/Action.sol/abstract.Action.md), [Validator](/src/validators/Validator.sol/abstract.Validator.md)

A primitive action to mint and/or validate that an ERC721 token has been minted

*The action is expected to be prepared with the data payload for the minting of the token*

*This a minimal generic implementation that should be extended if additional functionality or customizations are required*

*It is expected that the target contract has an externally accessible mint function whose selector*


## State Variables
### target
The target ERC721 contract

*This is the contract against which the mint action should be executed*


```solidity
address public target;
```


### selector
The selector for the mint function

*This is expected to be the actual selector (e.g. `bytes4(keccak256("myMintFunction(address,uint256)"))`)*


```solidity
bytes4 public selector;
```


### value
The native token value to send with the mint function

*This value is expected to be the value required for the mint function on the target contract*


```solidity
uint256 public value;
```


### validated
The set of validated tokens

*This is intended to prevent multiple validations against the same token ID*


```solidity
mapping(uint256 => bool) public validated;
```


## Functions
### constructor

Construct the ERC721 Mint Action

*Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the [initialize](/src/actions/ERC721MintAction.sol/contract.ERC721MintAction.md#initialize) function.*


```solidity
constructor();
```

### initialize

Initialize the contract with the owner and the required mint data

*The data is expected to be ABI encoded bytes compressed using {LibZip-cdCompress}*


```solidity
function initialize(bytes calldata data_) external override initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the mint action `(address target, bytes4 selector, uint256 value)`|


### execute

Execute the action (not yet implemented)


```solidity
function execute(bytes calldata) external payable override returns (bool success, bytes memory returnData);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes`||

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`success`|`bool`|The success status of the call|
|`returnData`|`bytes`|The return data from the call|


### prepare

Prepare the action for execution and return the expected payload

*Note that the mint value is NOT included in the prepared payload but must be sent with the call*


```solidity
function prepare(bytes calldata data_) public view override returns (bytes memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The ABI-encoded payload for the action `(address recipient)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes`|The encoded payload to be sent with the call|


### validate

Validate that the action has been completed successfully


```solidity
function validate(bytes calldata data_) external virtual override(Action, Validator) returns (bool success);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the action `(address holder, uint256 tokenId)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`success`|`bool`|True if the action has been validated for the user|


### supportsInterface

Check if the contract supports the given interface


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(Action, Validator) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`interfaceId`|`bytes4`|The interface identifier|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the contract supports the interface|


