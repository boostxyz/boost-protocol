# BoostCore
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/357ec05564a0bb8b723d586652aabcd486962f72/src/core/BoostCore.sol)

**Inherits:**
Ownable

The core contract for the Boost protocol

*This contract is currently `Ownable` for simplicity, but this will be replaced with a decentralized governance mechanism prior to GA*


## State Variables
### boosts
The list of boosts


```solidity
BoostLib.Boost[] public boosts;
```


## Functions
### constructor

Constructor to initialize the owner


```solidity
constructor();
```

### createBoost

Create a new Boost

*The data is expected to:
- be packed using `abi.encode()` and compressed using [Solady's LibZip calldata compression](https://github.com/Vectorized/solady/blob/main/src/utils/LibZip.sol)
- contain the following parameters:
- `BaseWithArgs` for the action
- `BaseWithArgs` for the allowList
- `BaseWithArgs` for the budget which is expected to be one of the following:
- The address of a base implementation to be cloned (e.g. the result of `BudgetFactory.getImplementationAddress("SimpleBudget")`), along with the parameters for its constructor;
- The address of a previously deployed Budget contract with no parameter data (any parameter data will be ignored but will still add to the calldata size);
- `BaseWithArgs[]` for the incentives
- `BaseWithArgs` for the validator
- `uint256` for the protocolFee
- `uint256` for the referralFee
- `uint256` for the maxParticipants*


```solidity
function createBoost(bytes calldata data_) external onlyOwner;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`data_`|`bytes`|The compressed data for the Boost (action, allowList, budget, incentives, validator, protocolFee, referralFee, maxParticipants)|


