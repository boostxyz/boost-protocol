# ERC4626StdTest
**Inherits:**
[ERC4626Test](/lib/solady/test/ERC4626.t.sol/contract.ERC4626Test.md)


## State Variables
### _underlying

```solidity
ERC20 private _underlying = new ERC20Mock();
```


## Functions
### setUp


```solidity
function setUp() public override;
```

### testFuzzDecimalsOverflow

*Check the case where calculated `decimals` value overflows the `uint8` type.*


```solidity
function testFuzzDecimalsOverflow(uint8 offset) public;
```

