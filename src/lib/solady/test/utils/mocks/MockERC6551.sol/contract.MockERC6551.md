# MockERC6551
**Inherits:**
[ERC6551](/lib/solady/src/accounts/ERC6551.sol/abstract.ERC6551.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### _brutalized


```solidity
function _brutalized(address a) private pure returns (address result);
```

### executeBatch


```solidity
function executeBatch(uint256 filler, Call[] calldata calls, uint8 operation)
    public
    payable
    virtual
    returns (bytes[] memory results);
```

### _domainNameAndVersion


```solidity
function _domainNameAndVersion() internal pure override returns (string memory, string memory);
```

### hashTypedData


```solidity
function hashTypedData(bytes32 structHash) external view returns (bytes32);
```

### DOMAIN_SEPARATOR


```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32);
```

### mockId


```solidity
function mockId() public pure virtual returns (string memory);
```

