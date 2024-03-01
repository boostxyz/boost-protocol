# AccessManaged
**Inherits:**
[Context](/lib/openzeppelin-contracts/contracts/utils/Context.sol/abstract.Context.md), [IAccessManaged](/lib/openzeppelin-contracts/contracts/access/manager/IAccessManaged.sol/interface.IAccessManaged.md)

*This contract module makes available a [restricted](/lib/openzeppelin-contracts/contracts/access/manager/AccessManaged.sol/abstract.AccessManaged.md#restricted) modifier. Functions decorated with this modifier will be
permissioned according to an "authority": a contract like {AccessManager} that follows the {IAuthority} interface,
implementing a policy that allows certain callers to access certain functions.
IMPORTANT: The `restricted` modifier should never be used on `internal` functions, judiciously used in `public`
functions, and ideally only used in `external` functions. See {restricted}.*


## State Variables
### _authority

```solidity
address private _authority;
```


### _consumingSchedule

```solidity
bool private _consumingSchedule;
```


## Functions
### constructor

*Initializes the contract connected to an initial authority.*


```solidity
constructor(address initialAuthority);
```

### restricted

*Restricts access to a function as defined by the connected Authority for this contract and the
caller and selector of the function that entered the contract.
[IMPORTANT]
====
In general, this modifier should only be used on `external` functions. It is okay to use it on `public`
functions that are used as external entry points and are not called internally. Unless you know what you're
doing, it should never be used on `internal` functions. Failure to follow these rules can have critical security
implications! This is because the permissions are determined by the function that entered the contract, i.e. the
function at the bottom of the call stack, and not the function where the modifier is visible in the source code.
====
[WARNING]
====
Avoid adding this modifier to the https://docs.soliditylang.org/en/v0.8.20/contracts.html#receive-ether-function[`receive()`]
function or the https://docs.soliditylang.org/en/v0.8.20/contracts.html#fallback-function[`fallback()`]. These
functions are the only execution paths where a function selector cannot be unambiguously determined from the calldata
since the selector defaults to `0x00000000` in the `receive()` function and similarly in the `fallback()` function
if no calldata is provided. (See [_checkCanCall](/lib/openzeppelin-contracts/contracts/access/manager/AccessManaged.sol/abstract.AccessManaged.md#_checkcancall)).
The `receive()` function will always panic whereas the `fallback()` may panic depending on the calldata length.
====*


```solidity
modifier restricted();
```

### authority

*Returns the current authority.*


```solidity
function authority() public view virtual returns (address);
```

### setAuthority

*Transfers control to a new authority. The caller must be the current authority.*


```solidity
function setAuthority(address newAuthority) public virtual;
```

### isConsumingScheduledOp

*Returns true only in the context of a delayed restricted call, at the moment that the scheduled operation is
being consumed. Prevents denial of service for delayed restricted calls in the case that the contract performs
attacker controlled calls.*


```solidity
function isConsumingScheduledOp() public view returns (bytes4);
```

### _setAuthority

*Transfers control to a new authority. Internal function with no access restriction. Allows bypassing the
permissions set by the current authority.*


```solidity
function _setAuthority(address newAuthority) internal virtual;
```

### _checkCanCall

*Reverts if the caller is not allowed to call the function identified by a selector. Panics if the calldata
is less than 4 bytes long.*


```solidity
function _checkCanCall(address caller, bytes calldata data) internal virtual;
```

