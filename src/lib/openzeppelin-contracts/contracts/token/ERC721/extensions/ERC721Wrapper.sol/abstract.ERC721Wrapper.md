# ERC721Wrapper
**Inherits:**
[ERC721](/lib/solady/src/tokens/ERC721.sol/abstract.ERC721.md), [IERC721Receiver](/lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol/interface.IERC721Receiver.md)

*Extension of the ERC-721 token contract to support token wrapping.
Users can deposit and withdraw an "underlying token" and receive a "wrapped token" with a matching tokenId. This is
useful in conjunction with other modules. For example, combining this wrapping mechanism with {ERC721Votes} will allow
the wrapping of an existing "basic" ERC-721 into a governance token.*


## State Variables
### _underlying

```solidity
IERC721 private immutable _underlying;
```


## Functions
### constructor


```solidity
constructor(IERC721 underlyingToken);
```

### depositFor

*Allow a user to deposit underlying tokens and mint the corresponding tokenIds.*


```solidity
function depositFor(address account, uint256[] memory tokenIds) public virtual returns (bool);
```

### withdrawTo

*Allow a user to burn wrapped tokens and withdraw the corresponding tokenIds of the underlying tokens.*


```solidity
function withdrawTo(address account, uint256[] memory tokenIds) public virtual returns (bool);
```

### onERC721Received

*Overrides [IERC721Receiver-onERC721Received](/lib/openzeppelin-contracts/contracts/governance/Governor.sol/abstract.Governor.md#onerc721received) to allow minting on direct ERC-721 transfers to
this contract.
In case there's data attached, it validates that the operator is this contract, so only trusted data
is accepted from {depositFor}.
WARNING: Doesn't work with unsafe transfers (eg. {IERC721-transferFrom}). Use {ERC721Wrapper-_recover}
for recovering in that scenario.*


```solidity
function onERC721Received(address, address from, uint256 tokenId, bytes memory) public virtual returns (bytes4);
```

### _recover

*Mint a wrapped token to cover any underlyingToken that would have been transferred by mistake. Internal
function that can be exposed with access control if desired.*


```solidity
function _recover(address account, uint256 tokenId) internal virtual returns (uint256);
```

### underlying

*Returns the underlying token.*


```solidity
function underlying() public view virtual returns (IERC721);
```

## Errors
### ERC721UnsupportedToken
*The received ERC-721 token couldn't be wrapped.*


```solidity
error ERC721UnsupportedToken(address token);
```

