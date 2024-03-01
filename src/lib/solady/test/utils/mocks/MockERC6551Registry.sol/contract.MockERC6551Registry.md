# MockERC6551Registry
*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### createAccount


```solidity
function createAccount(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId)
    external
    returns (address);
```

### account


```solidity
function account(address implementation, bytes32 salt, uint256 chainId, address tokenContract, uint256 tokenId)
    external
    view
    returns (address);
```

