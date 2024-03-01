# SampleFather
**Inherits:**
[Initializable](/lib/solady/src/utils/Initializable.sol/abstract.Initializable.md), [SampleGramps](/lib/openzeppelin-contracts/contracts/mocks/MultipleInheritanceInitializableMocks.sol/contract.SampleGramps.md)

Sample base initializable contract that defines a field father and extends from gramps


## State Variables
### father

```solidity
uint256 public father;
```


## Functions
### initialize


```solidity
function initialize(string memory _gramps, uint256 _father) public initializer;
```

### __SampleFather_init


```solidity
function __SampleFather_init(string memory _gramps, uint256 _father) internal onlyInitializing;
```

### __SampleFather_init_unchained


```solidity
function __SampleFather_init_unchained(uint256 _father) internal onlyInitializing;
```

