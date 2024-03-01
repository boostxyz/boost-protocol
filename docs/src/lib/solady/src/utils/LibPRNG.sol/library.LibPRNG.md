# LibPRNG
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibPRNG.sol)

Library for generating pseudorandom numbers.


## Functions
### seed

*Seeds the `prng` with `state`.*


```solidity
function seed(PRNG memory prng, uint256 state) internal pure;
```

### next

*Returns the next pseudorandom uint256.
All bits of the returned uint256 pass the NIST Statistical Test Suite.*


```solidity
function next(PRNG memory prng) internal pure returns (uint256 result);
```

### uniform

*Returns a pseudorandom uint256, uniformly distributed
between 0 (inclusive) and `upper` (exclusive).
If your modulus is big, this method is recommended
for uniform sampling to avoid modulo bias.
For uniform sampling across all uint256 values,
or for small enough moduli such that the bias is neligible,
use [next](/lib/solady/src/utils/LibPRNG.sol/library.LibPRNG.md#next) instead.*


```solidity
function uniform(PRNG memory prng, uint256 upper) internal pure returns (uint256 result);
```

### shuffle

*Shuffles the array in-place with Fisher-Yates shuffle.*


```solidity
function shuffle(PRNG memory prng, uint256[] memory a) internal pure;
```

### shuffle

*Shuffles the bytes in-place with Fisher-Yates shuffle.*


```solidity
function shuffle(PRNG memory prng, bytes memory a) internal pure;
```

### standardNormalWad

*Returns a sample from the standard normal distribution denominated in `WAD`.*


```solidity
function standardNormalWad(PRNG memory prng) internal pure returns (int256 result);
```

## Structs
### PRNG
*A pseudorandom number state in memory.*


```solidity
struct PRNG {
    uint256 state;
}
```

