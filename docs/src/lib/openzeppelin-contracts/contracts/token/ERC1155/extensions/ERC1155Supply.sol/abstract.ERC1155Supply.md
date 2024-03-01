# ERC1155Supply
**Inherits:**
[ERC1155](/lib/solady/src/tokens/ERC1155.sol/abstract.ERC1155.md)

*Extension of ERC-1155 that adds tracking of total supply per id.
Useful for scenarios where Fungible and Non-fungible tokens have to be
clearly identified. Note: While a totalSupply of 1 might mean the
corresponding is an NFT, there is no guarantees that no other token with the
same id are not going to be minted.
NOTE: This contract implies a global limit of 2**256 - 1 to the number of tokens
that can be minted.
CAUTION: This extension should not be added in an upgrade to an already deployed contract.*


## State Variables
### _totalSupply

```solidity
mapping(uint256 id => uint256) private _totalSupply;
```


### _totalSupplyAll

```solidity
uint256 private _totalSupplyAll;
```


## Functions
### totalSupply

*Total value of tokens in with a given id.*


```solidity
function totalSupply(uint256 id) public view virtual returns (uint256);
```

### totalSupply

*Total value of tokens.*


```solidity
function totalSupply() public view virtual returns (uint256);
```

### exists

*Indicates whether any token exist with a given id, or not.*


```solidity
function exists(uint256 id) public view virtual returns (bool);
```

### _update

*See [ERC1155-_update](/lib/openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155Pausable.sol/abstract.ERC1155Pausable.md#_update).*


```solidity
function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal virtual override;
```

