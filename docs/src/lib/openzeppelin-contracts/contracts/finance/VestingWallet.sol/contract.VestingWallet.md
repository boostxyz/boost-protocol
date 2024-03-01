# VestingWallet
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md)

*A vesting wallet is an ownable contract that can receive native currency and ERC-20 tokens, and release these
assets to the wallet owner, also referred to as "beneficiary", according to a vesting schedule.
Any assets transferred to this contract will follow the vesting schedule as if they were locked from the beginning.
Consequently, if the vesting has already started, any amount of tokens sent to this contract will (at least partly)
be immediately releasable.
By setting the duration to 0, one can configure this contract to behave like an asset timelock that hold tokens for
a beneficiary until a specified time.
NOTE: Since the wallet is {Ownable}, and ownership can be transferred, it is possible to sell unvested tokens.
Preventing this in a smart contract is difficult, considering that: 1) a beneficiary address could be a
counterfactually deployed contract, 2) there is likely to be a migration path for EOAs to become contracts in the
near future.
NOTE: When using this contract with any token whose balance is adjusted automatically (i.e. a rebase token), make
sure to account the supply/balance adjustment in the vesting schedule to ensure the vested amount is as intended.*


## State Variables
### _released

```solidity
uint256 private _released;
```


### _erc20Released

```solidity
mapping(address token => uint256) private _erc20Released;
```


### _start

```solidity
uint64 private immutable _start;
```


### _duration

```solidity
uint64 private immutable _duration;
```


## Functions
### constructor

*Sets the sender as the initial owner, the beneficiary as the pending owner, the start timestamp and the
vesting duration of the vesting wallet.*


```solidity
constructor(address beneficiary, uint64 startTimestamp, uint64 durationSeconds) payable Ownable(beneficiary);
```

### receive

*The contract should be able to receive Eth.*


```solidity
receive() external payable virtual;
```

### start

*Getter for the start timestamp.*


```solidity
function start() public view virtual returns (uint256);
```

### duration

*Getter for the vesting duration.*


```solidity
function duration() public view virtual returns (uint256);
```

### end

*Getter for the end timestamp.*


```solidity
function end() public view virtual returns (uint256);
```

### released

*Amount of eth already released*


```solidity
function released() public view virtual returns (uint256);
```

### released

*Amount of token already released*


```solidity
function released(address token) public view virtual returns (uint256);
```

### releasable

*Getter for the amount of releasable eth.*


```solidity
function releasable() public view virtual returns (uint256);
```

### releasable

*Getter for the amount of releasable `token` tokens. `token` should be the address of an
{IERC20} contract.*


```solidity
function releasable(address token) public view virtual returns (uint256);
```

### release

*Release the native token (ether) that have already vested.
Emits a [EtherReleased](/lib/openzeppelin-contracts/contracts/finance/VestingWallet.sol/contract.VestingWallet.md#etherreleased) event.*


```solidity
function release() public virtual;
```

### release

*Release the tokens that have already vested.
Emits a [ERC20Released](/lib/openzeppelin-contracts/contracts/finance/VestingWallet.sol/contract.VestingWallet.md#erc20released) event.*


```solidity
function release(address token) public virtual;
```

### vestedAmount

*Calculates the amount of ether that has already vested. Default implementation is a linear vesting curve.*


```solidity
function vestedAmount(uint64 timestamp) public view virtual returns (uint256);
```

### vestedAmount

*Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.*


```solidity
function vestedAmount(address token, uint64 timestamp) public view virtual returns (uint256);
```

### _vestingSchedule

*Virtual implementation of the vesting formula. This returns the amount vested, as a function of time, for
an asset given its total historical allocation.*


```solidity
function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view virtual returns (uint256);
```

## Events
### EtherReleased

```solidity
event EtherReleased(uint256 amount);
```

### ERC20Released

```solidity
event ERC20Released(address indexed token, uint256 amount);
```

