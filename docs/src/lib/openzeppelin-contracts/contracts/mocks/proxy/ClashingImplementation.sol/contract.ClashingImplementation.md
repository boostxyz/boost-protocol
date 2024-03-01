# ClashingImplementation
*Implementation contract with a payable changeAdmin(address) function made to clash with
TransparentUpgradeableProxy's to test correct functioning of the Transparent Proxy feature.*


## Functions
### upgradeToAndCall


```solidity
function upgradeToAndCall(address, bytes calldata) external payable;
```

### delegatedFunction


```solidity
function delegatedFunction() external pure returns (bool);
```

## Events
### ClashingImplementationCall

```solidity
event ClashingImplementationCall();
```

