# BoostLib
[Git Source](https://github.com/rabbitholegg/boost-protocol/blob/6f67dc154ec78da76411fffa12a71fdb419e4e3c/src/shared/BoostLib.sol)


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

