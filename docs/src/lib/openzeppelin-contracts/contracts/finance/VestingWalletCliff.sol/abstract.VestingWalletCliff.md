# VestingWalletCliff
**Inherits:**
[VestingWallet](/lib/openzeppelin-contracts/contracts/finance/VestingWallet.sol/contract.VestingWallet.md)

*Extension of {VestingWallet} that adds a cliff to the vesting schedule.*


## State Variables
### _cliff

```solidity
uint64 private immutable _cliff;
```


## Functions
### constructor

*Sets the sender as the initial owner, the beneficiary as the pending owner, the start timestamp, the
vesting duration and the duration of the cliff of the vesting wallet.*


```solidity
constructor(uint64 cliffSeconds);
```

### cliff

*Getter for the cliff timestamp.*


```solidity
function cliff() public view virtual returns (uint256);
```

### _vestingSchedule

*Virtual implementation of the vesting formula. This returns the amount vested, as a function of time, for
an asset given its total historical allocation. Returns 0 if the [cliff](/lib/openzeppelin-contracts/contracts/finance/VestingWalletCliff.sol/abstract.VestingWalletCliff.md#cliff) timestamp is not met.
IMPORTANT: The cliff not only makes the schedule return 0, but it also ignores every possible side
effect from calling the inherited implementation (i.e. `super._vestingSchedule`). Carefully consider
this caveat if the overridden implementation of this function has any (e.g. writing to memory or reverting).*


```solidity
function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view virtual override returns (uint256);
```

## Errors
### InvalidCliffDuration
*The specified cliff duration is larger than the vesting duration.*


```solidity
error InvalidCliffDuration(uint64 cliffSeconds, uint64 durationSeconds);
```

