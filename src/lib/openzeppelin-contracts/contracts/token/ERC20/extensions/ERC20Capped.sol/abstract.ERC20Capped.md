# ERC20Capped
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)

*Extension of {ERC20} that adds a cap to the supply of tokens.*


## State Variables
### _cap

```solidity
uint256 private immutable _cap;
```


## Functions
### constructor

*Sets the value of the `cap`. This value is immutable, it can only be
set once during construction.*


```solidity
constructor(uint256 cap_);
```

### cap

*Returns the cap on the token's total supply.*


```solidity
function cap() public view virtual returns (uint256);
```

### _update

*See [ERC20-_update](/lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol/abstract.ERC721.md#_update).*


```solidity
function _update(address from, address to, uint256 value) internal virtual override;
```

## Errors
### ERC20ExceededCap
*Total supply cap has been exceeded.*


```solidity
error ERC20ExceededCap(uint256 increasedSupply, uint256 cap);
```

### ERC20InvalidCap
*The supplied cap is not a valid cap.*


```solidity
error ERC20InvalidCap(uint256 cap);
```

