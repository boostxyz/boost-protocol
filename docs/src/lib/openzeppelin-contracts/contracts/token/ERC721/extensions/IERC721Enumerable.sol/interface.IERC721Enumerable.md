# IERC721Enumerable
**Inherits:**
[IERC721](/lib/forge-std/src/interfaces/IERC721.sol/interface.IERC721.md)

*See https://eips.ethereum.org/EIPS/eip-721*


## Functions
### totalSupply

*Returns the total amount of tokens stored by the contract.*


```solidity
function totalSupply() external view returns (uint256);
```

### tokenOfOwnerByIndex

*Returns a token ID owned by `owner` at a given `index` of its token list.
Use along with {balanceOf} to enumerate all of ``owner``'s tokens.*


```solidity
function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
```

### tokenByIndex

*Returns a token ID at a given `index` of all the tokens stored by the contract.
Use along with [totalSupply](/lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Enumerable.sol/interface.IERC721Enumerable.md#totalsupply) to enumerate all tokens.*


```solidity
function tokenByIndex(uint256 index) external view returns (uint256);
```

