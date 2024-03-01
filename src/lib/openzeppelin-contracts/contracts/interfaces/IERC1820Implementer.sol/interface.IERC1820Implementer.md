# IERC1820Implementer
*Interface for an ERC-1820 implementer, as defined in the
https://eips.ethereum.org/EIPS/eip-1820#interface-implementation-erc1820implementerinterface[ERC].
Used by contracts that will be registered as implementers in the
{IERC1820Registry}.*


## Functions
### canImplementInterfaceForAddress

*Returns a special value (`ERC1820_ACCEPT_MAGIC`) if this contract
implements `interfaceHash` for `account`.
See {IERC1820Registry-setInterfaceImplementer}.*


```solidity
function canImplementInterfaceForAddress(bytes32 interfaceHash, address account) external view returns (bytes32);
```

