# ERC20Incentive
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/f2d086cc13d3f2fcf119a54e6ed3b32a354cf098/src/incentives/ERC20Incentive.sol)

**Inherits:**
[Incentive](/src/incentives/Incentive.sol/abstract.Incentive.md)

A simple ERC20 incentive implementation that allows claiming of tokens


## State Variables
### asset
The address of the ERC20-like token


```solidity
address public asset;
```


### strategy
The strategy for the incentive (MINT or POOL)


```solidity
Strategy public strategy;
```


### reward
The reward amount issued for each claim


```solidity
uint256 public reward;
```


### maxClaims
The maximum number of claims that can be made (one per address)


```solidity
uint256 public maxClaims;
```


### claims
The number of claims that have been made


```solidity
uint256 public claims;
```


### claimed
A mapping of address to claim status


```solidity
mapping(address => bool) public claimed;
```


## Functions
### constructor

Construct a new ERC20Incentive

*Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the [initialize](/src/incentives/ERC20Incentive.sol/contract.ERC20Incentive.md#initialize) function.*


```solidity
constructor();
```

### initialize

Initialize the contract with the incentive parameters


```solidity
function initialize(bytes calldata data_) external override initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed incentive parameters `(address asset, Strategy strategy, uint256 reward, uint256 maxClaims)`|


### claim

Claim the incentive


```solidity
function claim(bytes calldata data_) external override onlyOwner returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the incentive claim `(address recipient, bytes data)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the incentive was successfully claimed|


### isClaimable

Check if an incentive is claimable

*For the POOL strategy, the `bytes data` portion of the payload ignored*

*The recipient must not have already claimed the incentive*


```solidity
function isClaimable(bytes calldata data_) public view override returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The data payload for the claim check `(address recipient, bytes data)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the incentive is claimable based on the data payload|


### _isClaimable

Check if an incentive is claimable for a specific recipient


```solidity
function _isClaimable(address recipient_) internal view returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`recipient_`|`address`|The address of the recipient|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the incentive is claimable for the recipient|


### _unpackDisbursementData

Unpack the data payload for a disbursement operation


```solidity
function _unpackDisbursementData(bytes calldata data_) internal pure returns (address recipient, bytes memory data);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data needed for disbursement `(address recipient, bytes data)`|


## Enums
### Strategy
The strategy for the incentive

*The strategy determines how the incentive is disbursed:
- POOL: Transfer tokens from the budget to the recipient
- MINT: Mint tokens to the recipient directly (not yet implemented)*


```solidity
enum Strategy {
    POOL,
    MINT
}
```

