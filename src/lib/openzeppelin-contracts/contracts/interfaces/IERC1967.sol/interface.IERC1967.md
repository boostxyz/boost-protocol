# IERC1967
*ERC-1967: Proxy Storage Slots. This interface contains the events defined in the ERC.*


## Events
### Upgraded
*Emitted when the implementation is upgraded.*


```solidity
event Upgraded(address indexed implementation);
```

### AdminChanged
*Emitted when the admin account has changed.*


```solidity
event AdminChanged(address previousAdmin, address newAdmin);
```

### BeaconUpgraded
*Emitted when the beacon is changed.*


```solidity
event BeaconUpgraded(address indexed beacon);
```

