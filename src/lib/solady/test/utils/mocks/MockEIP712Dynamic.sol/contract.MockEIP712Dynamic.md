# MockEIP712Dynamic
**Inherits:**
[EIP712](/lib/solady/src/utils/EIP712.sol/abstract.EIP712.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## State Variables
### _name

```solidity
string private _name;
```


### _version

```solidity
string private _version;
```


## Functions
### constructor


```solidity
constructor(string memory name, string memory version);
```

### setDomainNameAndVersion


```solidity
function setDomainNameAndVersion(string memory name, string memory version) public;
```

### _domainNameAndVersion


```solidity
function _domainNameAndVersion() internal view override returns (string memory name, string memory version);
```

### _domainNameAndVersionMayChange


```solidity
function _domainNameAndVersionMayChange() internal pure override returns (bool);
```

### hashTypedData


```solidity
function hashTypedData(bytes32 structHash) external view returns (bytes32);
```

### DOMAIN_SEPARATOR


```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32);
```

