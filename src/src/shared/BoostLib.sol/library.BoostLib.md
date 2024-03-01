# BoostLib
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/00a29d18bb9e82e36d30703c29f8dfdef1d915df/src/shared/BoostLib.sol)


## Functions
### initialize


```solidity
function initialize(Boost storage $, bytes calldata data_) internal;
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

