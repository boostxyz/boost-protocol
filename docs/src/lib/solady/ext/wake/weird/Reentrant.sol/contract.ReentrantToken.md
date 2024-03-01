# ReentrantToken
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)


## State Variables
### targets

```solidity
mapping(address => Target) public targets;
```


## Functions
### constructor


```solidity
constructor(uint256 _totalSupply) public ERC20(_totalSupply);
```

### setTarget


```solidity
function setTarget(address addr, bytes calldata data) external;
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public override returns (bool res);
```

## Structs
### Target

```solidity
struct Target {
    bytes data;
    address addr;
}
```

