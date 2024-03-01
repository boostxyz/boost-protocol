# BitMaps
*Library for managing uint256 to bool mapping in a compact and efficient way, provided the keys are sequential.
Largely inspired by Uniswap's https://github.com/Uniswap/merkle-distributor/blob/master/contracts/MerkleDistributor.sol[merkle-distributor].
BitMaps pack 256 booleans across each bit of a single 256-bit slot of `uint256` type.
Hence booleans corresponding to 256 _sequential_ indices would only consume a single slot,
unlike the regular `bool` which would consume an entire slot for a single value.
This results in gas savings in two ways:
- Setting a zero value to non-zero only once every 256 times
- Accessing the same warm slot for every 256 _sequential_ indices*


## Functions
### get

*Returns whether the bit at `index` is set.*


```solidity
function get(BitMap storage bitmap, uint256 index) internal view returns (bool);
```

### setTo

*Sets the bit at `index` to the boolean `value`.*


```solidity
function setTo(BitMap storage bitmap, uint256 index, bool value) internal;
```

### set

*Sets the bit at `index`.*


```solidity
function set(BitMap storage bitmap, uint256 index) internal;
```

### unset

*Unsets the bit at `index`.*


```solidity
function unset(BitMap storage bitmap, uint256 index) internal;
```

## Structs
### BitMap

```solidity
struct BitMap {
    mapping(uint256 bucket => uint256) _data;
}
```

