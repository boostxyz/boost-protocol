# ERC4626VaultOffsetMock
**Inherits:**
[ERC4626OffsetMock](/lib/openzeppelin-contracts/contracts/mocks/token/ERC4626OffsetMock.sol/abstract.ERC4626OffsetMock.md)


## Functions
### constructor


```solidity
constructor(ERC20 underlying_, uint8 offset_)
    ERC20("My Token Vault", "MTKNV")
    ERC4626(underlying_)
    ERC4626OffsetMock(offset_);
```

