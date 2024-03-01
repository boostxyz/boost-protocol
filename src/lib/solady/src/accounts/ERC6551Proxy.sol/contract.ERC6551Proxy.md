# ERC6551Proxy
**Authors:**
Solady (https://github.com/vectorized/solady/blob/main/src/accounts/ERC6551Proxy.sol), ERC6551 team (https://github.com/erc6551/reference/blob/main/src/examples/upgradeable/ERC6551AccountProxy.sol)

Relay proxy for upgradeable ERC6551 accounts.

*Note: This relay proxy is required for upgradeable ERC6551 accounts.
ERC6551 clone -> ERC6551Proxy (relay) -> ERC6551 account implementation.
This relay proxy also allows for correctly revealing the
"Read as Proxy" and "Write as Proxy" tabs on Etherscan.
After using the registry to deploy a ERC6551 clone pointing to this relay proxy,
users must send 0 ETH to the clone before clicking on "Is this a proxy?" on Etherscan.
Verification of this relay proxy on Etherscan is optional.*


## State Variables
### _defaultImplementation
*The default implementation.*


```solidity
uint256 internal immutable _defaultImplementation;
```


### _ERC1967_IMPLEMENTATION_SLOT
*The ERC-1967 storage slot for the implementation in the proxy.
`uint256(keccak256("eip1967.proxy.implementation")) - 1`.*


```solidity
bytes32 internal constant _ERC1967_IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```


## Functions
### constructor


```solidity
constructor(address defaultImplementation) payable;
```

### fallback


```solidity
fallback() external payable virtual;
```

