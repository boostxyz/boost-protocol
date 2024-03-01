# ERC165
**Inherits:**
[IERC165](/lib/forge-std/src/interfaces/IERC165.sol/interface.IERC165.md)

*Implementation of the {IERC165} interface.
Contracts that want to implement ERC-165 should inherit from this contract and override {supportsInterface} to check
for the additional interface id that will be supported. For example:
```solidity
function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
}
```*


## Functions
### supportsInterface

*See [IERC165-supportsInterface](/lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol/interface.IERC165.md#supportsinterface).*


```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool);
```

