# SampleChild
**Inherits:**
[Initializable](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md), [SampleMother](/lib/openzeppelin-contracts/contracts/mocks/MultipleInheritanceInitializableMocks.sol/contract.SampleMother.md), [SampleFather](/lib/openzeppelin-contracts/contracts/mocks/MultipleInheritanceInitializableMocks.sol/contract.SampleFather.md)

Child extends from mother, father (gramps)


## State Variables
### child

```solidity
uint256 public child;
```


## Functions
### initialize


```solidity
function initialize(uint256 _mother, string memory _gramps, uint256 _father, uint256 _child) public initializer;
```

### __SampleChild_init


```solidity
function __SampleChild_init(uint256 _mother, string memory _gramps, uint256 _father, uint256 _child)
    internal
    onlyInitializing;
```

### __SampleChild_init_unchained


```solidity
function __SampleChild_init_unchained(uint256 _child) internal onlyInitializing;
```

