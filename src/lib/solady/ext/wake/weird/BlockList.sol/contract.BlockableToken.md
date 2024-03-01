# BlockableToken
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)


## State Variables
### owner

```solidity
address owner;
```


### blocked

```solidity
mapping(address => bool) blocked;
```


## Functions
### auth


```solidity
modifier auth();
```

### block


```solidity
function block(address usr) public auth;
```

### allow


```solidity
function allow(address usr) public auth;
```

### constructor


```solidity
constructor(uint256 _totalSupply) public ERC20(_totalSupply);
```

### transferFrom


```solidity
function transferFrom(address src, address dst, uint256 wad) public override returns (bool);
```

