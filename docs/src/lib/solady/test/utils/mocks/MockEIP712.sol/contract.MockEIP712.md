# MockEIP712
**Inherits:**
[EIP712](/lib/solady/src/utils/EIP712.sol/abstract.EIP712.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### _domainNameAndVersion


```solidity
function _domainNameAndVersion() internal pure override returns (string memory name, string memory version);
```

### hashTypedData


```solidity
function hashTypedData(bytes32 structHash) external view returns (bytes32);
```

### DOMAIN_SEPARATOR


```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32);
```

