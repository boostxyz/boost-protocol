# ERC2981
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/tokens/ERC2981.sol), Modified from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/common/ERC2981.sol)

Simple ERC2981 NFT Royalty Standard implementation.


## State Variables
### _ERC2981_MASTER_SLOT_SEED
*The default royalty info is given by:
```
let packed := sload(_ERC2981_MASTER_SLOT_SEED)
let receiver := shr(96, packed)
let royaltyFraction := xor(packed, shl(96, receiver))
```
The per token royalty info is given by.
```
mstore(0x00, tokenId)
mstore(0x20, _ERC2981_MASTER_SLOT_SEED)
let packed := sload(keccak256(0x00, 0x40))
let receiver := shr(96, packed)
let royaltyFraction := xor(packed, shl(96, receiver))
```*


```solidity
uint256 private constant _ERC2981_MASTER_SLOT_SEED = 0xaa4ec00224afccfdb7;
```


## Functions
### constructor

*Checks that `_feeDenominator` is non-zero.*


```solidity
constructor();
```

### _feeDenominator

*Returns the denominator for the royalty amount.
Defaults to 10000, which represents fees in basis points.
Override this function to return a custom amount if needed.*


```solidity
function _feeDenominator() internal pure virtual returns (uint96);
```

### supportsInterface

*Returns true if this contract implements the interface defined by `interfaceId`.
See: https://eips.ethereum.org/EIPS/eip-165
This function call must use less than 30000 gas.*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool result);
```

### royaltyInfo

*Returns the `receiver` and `royaltyAmount` for `tokenId` sold at `salePrice`.*


```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice)
    public
    view
    virtual
    returns (address receiver, uint256 royaltyAmount);
```

### _setDefaultRoyalty

*Sets the default royalty `receiver` and `feeNumerator`.
Requirements:
- `receiver` must not be the zero address.
- `feeNumerator` must not be greater than the fee denominator.*


```solidity
function _setDefaultRoyalty(address receiver, uint96 feeNumerator) internal virtual;
```

### _deleteDefaultRoyalty

*Sets the default royalty `receiver` and `feeNumerator` to zero.*


```solidity
function _deleteDefaultRoyalty() internal virtual;
```

### _setTokenRoyalty

*Sets the royalty `receiver` and `feeNumerator` for `tokenId`.
Requirements:
- `receiver` must not be the zero address.
- `feeNumerator` must not be greater than the fee denominator.*


```solidity
function _setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) internal virtual;
```

### _resetTokenRoyalty

*Sets the royalty `receiver` and `feeNumerator` for `tokenId` to zero.*


```solidity
function _resetTokenRoyalty(uint256 tokenId) internal virtual;
```

## Errors
### RoyaltyOverflow
*The royalty fee numerator exceeds the fee denominator.*


```solidity
error RoyaltyOverflow();
```

### RoyaltyReceiverIsZeroAddress
*The royalty receiver cannot be the zero address.*


```solidity
error RoyaltyReceiverIsZeroAddress();
```

