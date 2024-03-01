# BoostLib
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/f2d086cc13d3f2fcf119a54e6ed3b32a354cf098/src/shared/BoostLib.sol)


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

