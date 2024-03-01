# BoostLib
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/b3bb379d4e452f4f3050788b523e1f452cdc30c6/src/utils/BoostLib.sol)


## Functions
### initialize


```solidity
function initialize(Boost storage boost_, bytes calldata data_) internal;
```

## Structs
### Boost

```solidity
struct Boost {
    Action action;
    AllowList allowList;
    Budget budget;
    Incentive[] incentives;
    Validator validator;
    uint256 protocolFee;
    uint256 referralFee;
    uint256 maxParticipants;
}
```

### BaseWithArgs

```solidity
struct BaseWithArgs {
    address base;
    bytes parameters;
}
```

