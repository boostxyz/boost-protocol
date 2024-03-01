# TransferFeeToken
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)


## State Variables
### fee

```solidity
uint256 immutable fee;
```


## Functions
### constructor


```solidity
constructor(uint256 _totalSupply, uint256 _fee) public ERC20(_totalSupply);
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public override returns (bool);
```

