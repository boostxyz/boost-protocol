# MyContract
**Inherits:**
[Ownable](/lib/solady/src/auth/Ownable.sol/abstract.Ownable.md)


## Functions
### constructor


```solidity
constructor(address initialOwner) Ownable(initialOwner);
```

### normalThing


```solidity
function normalThing() public;
```

### specialThing


```solidity
function specialThing() public onlyOwner;
```

