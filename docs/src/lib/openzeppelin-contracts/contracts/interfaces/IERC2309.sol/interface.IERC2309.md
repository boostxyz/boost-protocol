# IERC2309
*ERC-2309: ERC-721 Consecutive Transfer Extension.*


## Events
### ConsecutiveTransfer
*Emitted when the tokens from `fromTokenId` to `toTokenId` are transferred from `fromAddress` to `toAddress`.*


```solidity
event ConsecutiveTransfer(
    uint256 indexed fromTokenId, uint256 toTokenId, address indexed fromAddress, address indexed toAddress
);
```

