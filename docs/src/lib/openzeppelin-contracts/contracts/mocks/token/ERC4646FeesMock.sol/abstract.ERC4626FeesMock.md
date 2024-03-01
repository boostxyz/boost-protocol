# ERC4626FeesMock
**Inherits:**
[ERC4626Fees](/lib/openzeppelin-contracts/contracts/mocks/docs/ERC4626Fees.sol/abstract.ERC4626Fees.md)


## State Variables
### _entryFeeBasisPointValue

```solidity
uint256 private immutable _entryFeeBasisPointValue;
```


### _entryFeeRecipientValue

```solidity
address private immutable _entryFeeRecipientValue;
```


### _exitFeeBasisPointValue

```solidity
uint256 private immutable _exitFeeBasisPointValue;
```


### _exitFeeRecipientValue

```solidity
address private immutable _exitFeeRecipientValue;
```


## Functions
### constructor


```solidity
constructor(
    uint256 entryFeeBasisPoints,
    address entryFeeRecipient,
    uint256 exitFeeBasisPoints,
    address exitFeeRecipient
);
```

### _entryFeeBasisPoints


```solidity
function _entryFeeBasisPoints() internal view virtual override returns (uint256);
```

### _entryFeeRecipient


```solidity
function _entryFeeRecipient() internal view virtual override returns (address);
```

### _exitFeeBasisPoints


```solidity
function _exitFeeBasisPoints() internal view virtual override returns (uint256);
```

### _exitFeeRecipient


```solidity
function _exitFeeRecipient() internal view virtual override returns (address);
```

