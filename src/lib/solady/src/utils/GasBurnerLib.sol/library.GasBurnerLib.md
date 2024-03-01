# GasBurnerLib
**Author:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/GasBurnerLib.sol)

Library for burning gas without reverting.


## Functions
### burn

*Burns approximately `x` amount of gas.
Intended for Contract Secured Revenue (CSR).
Recommendation: pass in an admin-controlled dynamic value instead of a hardcoded one.
This is so that you can adjust your contract as needed depending on market conditions,
and to give you and your users a leeway in case the L2 chain change the rules.*


```solidity
function burn(uint256 x) internal pure;
```

