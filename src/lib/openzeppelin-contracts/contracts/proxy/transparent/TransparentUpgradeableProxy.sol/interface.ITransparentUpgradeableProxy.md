# ITransparentUpgradeableProxy
**Inherits:**
[IERC1967](/lib/openzeppelin-contracts/contracts/interfaces/IERC1967.sol/interface.IERC1967.md)

*Interface for {TransparentUpgradeableProxy}. In order to implement transparency, {TransparentUpgradeableProxy}
does not implement this interface directly, and its upgradeability mechanism is implemented by an internal dispatch
mechanism. The compiler is unaware that these functions are implemented by {TransparentUpgradeableProxy} and will not
include them in the ABI so this interface must be used to interact with it.*


## Functions
### upgradeToAndCall


```solidity
function upgradeToAndCall(address, bytes calldata) external payable;
```

