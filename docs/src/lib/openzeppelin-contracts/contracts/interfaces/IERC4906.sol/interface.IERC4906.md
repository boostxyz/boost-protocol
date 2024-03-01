# IERC4906
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md), [IERC721](/lib/forge-std/src/interfaces/IERC721.sol/interface.IERC721.md)


## Events
### MetadataUpdate
*This event emits when the metadata of a token is changed.
So that the third-party platforms such as NFT market could
timely update the images and related attributes of the NFT.*


```solidity
event MetadataUpdate(uint256 _tokenId);
```

### BatchMetadataUpdate
*This event emits when the metadata of a range of tokens is changed.
So that the third-party platforms such as NFT market could
timely update the images and related attributes of the NFTs.*


```solidity
event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);
```

