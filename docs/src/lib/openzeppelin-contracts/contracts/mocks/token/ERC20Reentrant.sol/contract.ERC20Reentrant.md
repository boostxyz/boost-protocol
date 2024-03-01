# ERC20Reentrant
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md)


## State Variables
### _reenterType

```solidity
Type private _reenterType;
```


### _reenterTarget

```solidity
address private _reenterTarget;
```


### _reenterData

```solidity
bytes private _reenterData;
```


## Functions
### scheduleReenter


```solidity
function scheduleReenter(Type when, address target, bytes calldata data) external;
```

### functionCall


```solidity
function functionCall(address target, bytes memory data) public returns (bytes memory);
```

### _update


```solidity
function _update(address from, address to, uint256 amount) internal override;
```

## Enums
### Type

```solidity
enum Type {
    No,
    Before,
    After
}
```

