# LibBitmap
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/utils/LibBitmap.sol), Modified from Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/LibBitmap.sol), Modified from Solidity-Bits (https://github.com/estarriolvetch/solidity-bits/blob/main/contracts/BitMaps.sol)

Library for storage of packed unsigned booleans.


## State Variables
### NOT_FOUND
*The constant returned when a bitmap scan does not find a result.*


```solidity
uint256 internal constant NOT_FOUND = type(uint256).max;
```


## Functions
### get

*Returns the boolean value of the bit at `index` in `bitmap`.*


```solidity
function get(Bitmap storage bitmap, uint256 index) internal view returns (bool isSet);
```

### set

*Updates the bit at `index` in `bitmap` to true.*


```solidity
function set(Bitmap storage bitmap, uint256 index) internal;
```

### unset

*Updates the bit at `index` in `bitmap` to false.*


```solidity
function unset(Bitmap storage bitmap, uint256 index) internal;
```

### toggle

*Flips the bit at `index` in `bitmap`.
Returns the boolean result of the flipped bit.*


```solidity
function toggle(Bitmap storage bitmap, uint256 index) internal returns (bool newIsSet);
```

### setTo

*Updates the bit at `index` in `bitmap` to `shouldSet`.*


```solidity
function setTo(Bitmap storage bitmap, uint256 index, bool shouldSet) internal;
```

### setBatch

*Consecutively sets `amount` of bits starting from the bit at `start`.*


```solidity
function setBatch(Bitmap storage bitmap, uint256 start, uint256 amount) internal;
```

### unsetBatch

*Consecutively unsets `amount` of bits starting from the bit at `start`.*


```solidity
function unsetBatch(Bitmap storage bitmap, uint256 start, uint256 amount) internal;
```

### popCount

*Returns number of set bits within a range by
scanning `amount` of bits starting from the bit at `start`.*


```solidity
function popCount(Bitmap storage bitmap, uint256 start, uint256 amount) internal view returns (uint256 count);
```

### findLastSet

*Returns the index of the most significant set bit before the bit at `before`.
If no set bit is found, returns `NOT_FOUND`.*


```solidity
function findLastSet(Bitmap storage bitmap, uint256 before) internal view returns (uint256 setBitIndex);
```

## Structs
### Bitmap
*A bitmap in storage.*


```solidity
struct Bitmap {
    mapping(uint256 => uint256) map;
}
```

