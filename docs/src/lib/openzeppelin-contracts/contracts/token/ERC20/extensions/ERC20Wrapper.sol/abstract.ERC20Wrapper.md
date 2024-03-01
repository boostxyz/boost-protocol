# ERC20Wrapper
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)

*Extension of the ERC-20 token contract to support token wrapping.
Users can deposit and withdraw "underlying tokens" and receive a matching number of "wrapped tokens". This is useful
in conjunction with other modules. For example, combining this wrapping mechanism with {ERC20Votes} will allow the
wrapping of an existing "basic" ERC-20 into a governance token.
WARNING: Any mechanism in which the underlying token changes the {balanceOf} of an account without an explicit transfer
may desynchronize this contract's supply and its underlying balance. Please exercise caution when wrapping tokens that
may undercollateralize the wrapper (i.e. wrapper's total supply is higher than its underlying balance). See {_recover}
for recovering value accrued to the wrapper.*


## State Variables
### _underlying

```solidity
IERC20 private immutable _underlying;
```


## Functions
### constructor


```solidity
constructor(IERC20 underlyingToken);
```

### decimals

*See [ERC20-decimals](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC4626.sol/abstract.ERC4626.md#decimals).*


```solidity
function decimals() public view virtual override returns (uint8);
```

### underlying

*Returns the address of the underlying ERC-20 token that is being wrapped.*


```solidity
function underlying() public view returns (IERC20);
```

### depositFor

*Allow a user to deposit underlying tokens and mint the corresponding number of wrapped tokens.*


```solidity
function depositFor(address account, uint256 value) public virtual returns (bool);
```

### withdrawTo

*Allow a user to burn a number of wrapped tokens and withdraw the corresponding number of underlying tokens.*


```solidity
function withdrawTo(address account, uint256 value) public virtual returns (bool);
```

### _recover

*Mint wrapped token to cover any underlyingTokens that would have been transferred by mistake or acquired from
rebasing mechanisms. Internal function that can be exposed with access control if desired.*


```solidity
function _recover(address account) internal virtual returns (uint256);
```

## Errors
### ERC20InvalidUnderlying
*The underlying token couldn't be wrapped.*


```solidity
error ERC20InvalidUnderlying(address token);
```

