# MockERC4337
**Inherits:**
[ERC4337](/lib/solady/src/accounts/ERC4337.sol/abstract.ERC4337.md)

*WARNING! This mock is strictly intended for testing purposes only.
Do NOT copy anything here into production code unless you really know what you are doing.*


## Functions
### withdrawDepositTo


```solidity
function withdrawDepositTo(address to, uint256 amount) public payable virtual override;
```

### _brutalized


```solidity
function _brutalized(address a) private pure returns (address result);
```

### executeBatch


```solidity
function executeBatch(uint256 filler, Call[] calldata calls)
    public
    payable
    virtual
    onlyEntryPointOrOwner
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

