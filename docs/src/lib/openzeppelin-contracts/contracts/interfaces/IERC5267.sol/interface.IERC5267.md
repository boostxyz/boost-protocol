# IERC5267

## Functions
### eip712Domain

*returns the fields and values that describe the domain separator used by this contract for EIP-712
signature.*


```solidity
function eip712Domain()
    external
    view
    returns (
        bytes1 fields,
        string memory name,
        string memory version,
        uint256 chainId,
        address verifyingContract,
        bytes32 salt,
        uint256[] memory extensions
    );
```

## Events
### EIP712DomainChanged
*MAY be emitted to signal that the domain could have changed.*


```solidity
event EIP712DomainChanged();
```

