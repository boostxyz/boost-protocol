# ERC1217SignatureChecker

## State Variables
### MAGICVALUE

```solidity
bytes4 internal constant MAGICVALUE = 0x1626ba7e;
```


## Functions
### isValidSignature


```solidity
function isValidSignature(bytes32 _hash, bytes memory _signature) public view returns (bytes4);
```

