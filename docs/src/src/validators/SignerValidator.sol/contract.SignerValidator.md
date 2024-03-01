# SignerValidator
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/validators/SignerValidator.sol)

**Inherits:**
[Validator](/src/validators/Validator.sol/abstract.Validator.md)

A simple implementation of a Validator that verifies a given signature and checks the recovered address against a set of authorized signers


## State Variables
### signers
*The set of authorized signers*


```solidity
mapping(address => bool) public signers;
```


### _used
*The set of used hashes (for replay protection)*


```solidity
mapping(bytes32 => bool) private _used;
```


## Functions
### constructor

Construct a new SignerValidator

*Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the [initialize](/src/validators/SignerValidator.sol/contract.SignerValidator.md#initialize) function.*


```solidity
constructor();
```

### initialize

Initialize the contract with the list of authorized signers

*The first address in the list will be the initial owner of the contract*


```solidity
function initialize(bytes calldata data_) external virtual override initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed list of authorized signers|


### validate

Validate that the action has been completed successfully

*The data payload is expected to be a tuple of (address signer, bytes32 hash, bytes signature)*

*The signature is expected to be a valid ECDSA or EIP-1271 signature of a unique hash by an authorized signer*


```solidity
function validate(bytes calldata data_) external override returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the validation check|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the action has been validated based on the data payload|


### setAuthorized

Set the authorized status of a signer


```solidity
function setAuthorized(address[] calldata signers_, bool[] calldata authorized_) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`signers_`|`address[]`|The list of signers to update|
|`authorized_`|`bool[]`|The authorized status of each signer|


