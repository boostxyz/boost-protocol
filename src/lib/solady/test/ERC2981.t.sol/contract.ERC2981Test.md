# ERC2981Test
**Inherits:**
[SoladyTest](/lib/solady/test/utils/SoladyTest.sol/contract.SoladyTest.md)


## State Variables
### token

```solidity
MockERC2981 token;
```


## Functions
### setUp


```solidity
function setUp() public;
```

### _testTemps


```solidity
function _testTemps() internal returns (_TestTemps memory t);
```

### testRoyaltyOverflowCheckDifferential


```solidity
function testRoyaltyOverflowCheckDifferential(uint256 x, uint256 y) public;
```

### testSetAndGetRoyaltyInfo


```solidity
function testSetAndGetRoyaltyInfo(uint256) public;
```

### _getInvalidFeeNumerator


```solidity
function _getInvalidFeeNumerator(_TestTemps memory t) internal returns (uint96 r);
```

### _checkReverts


```solidity
function _checkReverts(_TestTemps memory t) internal;
```

### _checkRoyaltyInfoIsZero


```solidity
function _checkRoyaltyInfoIsZero(_TestTemps memory t) internal;
```

### _checkRoyaltyInfoIsDefault


```solidity
function _checkRoyaltyInfoIsDefault(_TestTemps memory t, uint256 i) internal;
```

### _checkRoyaltyInfo


```solidity
function _checkRoyaltyInfo(_TestTemps memory t, uint256 i) internal;
```

### _checkRoyaltyInfo


```solidity
function _checkRoyaltyInfo(_TestTemps memory t, uint256 i, address expectedReceiver, uint256 expectedAmount) internal;
```

## Structs
### _TestTemps

```solidity
struct _TestTemps {
    uint256 feeDenominator;
    address[2] receivers;
    uint256[2] tokenIds;
    uint256[2] salePrices;
    uint256[2] royaltyFractions;
    address defaultReceiver;
    uint256 defaultRoyaltyFraction;
}
```

