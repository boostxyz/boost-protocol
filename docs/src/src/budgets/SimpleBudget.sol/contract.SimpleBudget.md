# SimpleBudget
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/budgets/SimpleBudget.sol)

**Inherits:**
[Budget](/src/budgets/Budget.sol/abstract.Budget.md)

A minimal budget implementation that simply holds and distributes assets.


## State Variables
### _distributed
*The total amount of each asset distributed from the budget*


```solidity
mapping(address => uint256) private _distributed;
```


## Functions
### constructor

Construct a new SimpleBudget

*Because this contract is a base implementation, it should not be initialized through the constructor. Instead, it should be cloned and initialized using the [initialize](/src/budgets/SimpleBudget.sol/contract.SimpleBudget.md#initialize) function.*


```solidity
constructor();
```

### initialize

Initialize the clone with the given arbitrary data

*The data is expected to be ABI encoded bytes compressed using {LibZip-cdCompress}*


```solidity
function initialize(bytes calldata data_) external virtual override initializer;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed init data for the budget `(address owner)`|


### allocate

Allocates assets to the budget

*The caller must have already approved the contract to transfer the asset*

*If the asset transfer fails, the allocation will revert*


```solidity
function allocate(bytes calldata data_) external payable virtual override returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data for the allocation `(address asset, uint256 amount)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the allocation was successful|


### reclaim

Reclaims assets from the budget

*If the amount is zero, the entire balance of the asset will be transferred to the receiver*

*If the asset transfer fails, the reclamation will revert*


```solidity
function reclaim(bytes calldata data_) external virtual override onlyOwner returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data for the reclamation `(address asset, uint256 amount, address receiver)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the reclamation was successful|


### disburse

Disburses assets from the budget to a single recipient

*If the asset transfer fails, the disbursement will revert*


```solidity
function disburse(address recipient_, bytes calldata data_) public virtual override onlyOwner returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`recipient_`|`address`|The address of the recipient|
|`data_`|`bytes`|The compressed data for the disbursement `(address asset, uint256 amount)`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the disbursement was successful|


### disburseBatch

Disburses assets from the budget to multiple recipients


```solidity
function disburseBatch(address[] calldata recipients_, bytes[] calldata data_)
    external
    virtual
    override
    returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`recipients_`|`address[]`|The addresses of the recipients|
|`data_`|`bytes[]`|The compressed data for the disbursements `(address assets, uint256 amounts)[]`|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if all disbursements were successful|


### total

Get the total amount of assets allocated to the budget, including any that have been distributed

*This is simply the sum of the current balance and the distributed amount*


```solidity
function total(address asset_) external view virtual override returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset_`|`address`|The address of the asset|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The total amount of assets|


### available

Get the amount of assets available for distribution from the budget

*This is simply the current balance held by the budget*

*If the zero address is passed, this function will return the native balance*


```solidity
function available(address asset_) public view virtual override returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset_`|`address`|The address of the asset (or the zero address for native assets)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of assets available|


### distributed

Get the amount of assets that have been distributed from the budget


```solidity
function distributed(address asset_) external view virtual override returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset_`|`address`|The address of the asset|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of assets distributed|


### reconcile

Reconcile the budget to ensure the known state matches the actual state

*This is a no-op as there is no local balance to reconcile*


```solidity
function reconcile(bytes calldata) external virtual override returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bytes`||

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of assets reconciled|


### _transfer

Transfer assets to the recipient

*This function is used to transfer assets from the budget to the recipient*


```solidity
function _transfer(address asset_, address to_, uint256 amount_) internal virtual;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset_`|`address`|The address of the asset|
|`to_`|`address`|The address of the recipient|
|`amount_`|`uint256`|The amount of the asset to transfer|


