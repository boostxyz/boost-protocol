# MockERC2981
**Inherits:**
[ERC2981](/lib/solady/src/tokens/ERC2981.sol/abstract.ERC2981.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### feeDenominator


```solidity
function feeDenominator() external pure returns (uint256);
```

### setDefaultRoyalty


```solidity
function setDefaultRoyalty(address receiver, uint96 feeNumerator) external;
```

### deleteDefaultRoyalty


```solidity
function deleteDefaultRoyalty() external;
```

### setTokenRoyalty


```solidity
function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) external;
```

### resetTokenRoyalty


```solidity
function resetTokenRoyalty(uint256 tokenId) external;
```

### _brutalized


```solidity
function _brutalized(uint96 x) internal view returns (uint96 result);
```

### _brutalized


```solidity
function _brutalized(address a) internal view returns (address result);
```

