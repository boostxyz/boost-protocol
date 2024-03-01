# SupportsInterfaceWithLookupMock
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md)

https://eips.ethereum.org/EIPS/eip-214#specification
From the specification:
> Any attempts to make state-changing operations inside an execution instance with STATIC set to true will instead
throw an exception.
> These operations include [...], LOG0, LOG1, LOG2, [...]
therefore, because this contract is staticcall'd we need to not emit events (which is how solidity-coverage works)
solidity-coverage ignores the /mocks folder, so we duplicate its implementation here to avoid instrumenting it


## State Variables
### INTERFACE_ID_ERC165

```solidity
bytes4 public constant INTERFACE_ID_ERC165 = 0x01ffc9a7;
```


### _supportedInterfaces
*A mapping of interface id to whether or not it's supported.*


```solidity
mapping(bytes4 interfaceId => bool) private _supportedInterfaces;
```


## Functions
### constructor

*A contract implementing SupportsInterfaceWithLookup
implement ERC-165 itself.*


```solidity
constructor();
```

### supportsInterface

*Implement supportsInterface(bytes4) using a lookup table.*


```solidity
function supportsInterface(bytes4 interfaceId) public view override returns (bool);
```

### _registerInterface

*Private method for registering an interface.*


```solidity
function _registerInterface(bytes4 interfaceId) internal;
```

