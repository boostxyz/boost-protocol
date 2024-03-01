# Receiver
**Author:**
Solady (https://github.com/Vectorized/solady/blob/main/src/accounts/Receiver.sol)

Receiver mixin for ETH and safe-transferred ERC721 and ERC1155 tokens.

*Note:
- Handles all ERC721 and ERC1155 token safety callbacks.
- Collapses function table gas overhead and code size.
- Utilizes fallback so unknown calldata will pass on.*


## Functions
### receive

*For receiving ETH.*


```solidity
receive() external payable virtual;
```

### fallback

*Fallback function with the `receiverFallback` modifier.*


```solidity
fallback() external payable virtual receiverFallback;
```

### receiverFallback

*Modifier for the fallback function to handle token callbacks.*


```solidity
modifier receiverFallback() virtual;
```

