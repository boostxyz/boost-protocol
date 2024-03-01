# Budget
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/budgets/Budget.sol)

**Inherits:**
Ownable, [Cloneable](/src/Cloneable.sol/abstract.Cloneable.md), Receiver

Abstract contract for a generic Budget within the Boost protocol

*Budget classes are expected to implement the allocation, reclamation, and disbursement of assets.*

*The calldata is expected to be ABI-encoded and compressed using [Solady's LibZip calldata compression](https://github.com/Vectorized/solady/blob/main/src/utils/LibZip.sol).*

*Note that Budgets *DO NOT* support ERC-721, ERC-1155, DN-404, or other non-fungible assets at this time.*


## Functions
### constructor

Initialize the budget and set the owner

*The owner is set to the contract deployer*


```solidity
constructor();
```

### allocate

Allocate assets to the budget


```solidity
function allocate(bytes calldata data_) external payable virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data for the allocation (amount, token address, token ID, etc.)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the allocation was successful|


### reclaim

Reclaim assets from the budget


```solidity
function reclaim(bytes calldata data_) external virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data for the reclamation (amount, token address, token ID, etc.)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the reclamation was successful|


### disburse

Disburse assets from the budget to a single recipient


```solidity
function disburse(address recipient_, bytes calldata data_) external virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`recipient_`|`address`|The address of the recipient|
|`data_`|`bytes`|The compressed data for the disbursement (amount, token address, token ID, etc.)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the disbursement was successful|


### disburseBatch

Disburse assets from the budget to multiple recipients


```solidity
function disburseBatch(address[] calldata recipients_, bytes[] calldata data_) external virtual returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`recipients_`|`address[]`|The addresses of the recipients|
|`data_`|`bytes[]`|The compressed data for the disbursements (amount, token address, token ID, etc.)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if all disbursements were successful|


### total

Get the total amount of assets allocated to the budget, including any that have been distributed


```solidity
function total(address asset_) external view virtual returns (uint256);
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


```solidity
function available(address asset_) external view virtual returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`asset_`|`address`|The address of the asset|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of assets available|


### distributed

Get the amount of assets that have been distributed from the budget


```solidity
function distributed(address asset_) external view virtual returns (uint256);
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


```solidity
function reconcile(bytes calldata data_) external virtual returns (uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data for the reconciliation (amount, token address, token ID, etc.)|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The amount of assets reconciled|


### supportsInterface

Check if the contract supports the given interface


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override(Cloneable) returns (bool);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`interfaceId`|`bytes4`|The interface identifier|

**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`bool`|True if the contract supports the interface|


### receive

*For receiving ETH.*


```solidity
receive() external payable virtual override;
```

### fallback

*Fallback function with the `receiverFallback` modifier.*


```solidity
fallback() external payable virtual override;
```

## Events
### Distributed
Emitted when assets are distributed from the budget


```solidity
event Distributed(address indexed asset, address to, uint256 amount);
```

## Errors
### InvalidAllocation
Thrown when the allocation is invalid


```solidity
error InvalidAllocation(address asset, uint256 amount);
```

### InsufficientFunds
Thrown when there are insufficient funds for an operation


```solidity
error InsufficientFunds(address asset, uint256 available, uint256 required);
```

### LengthMismatch
Thrown when the length of two arrays are not equal


```solidity
error LengthMismatch();
```

### TransferFailed
Thrown when a transfer fails for an unknown reason


```solidity
error TransferFailed(address asset, address to, uint256 amount);
```

