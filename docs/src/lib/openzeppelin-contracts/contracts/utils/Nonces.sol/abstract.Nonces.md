# Nonces
*Provides tracking nonces for addresses. Nonces will only increment.*


## State Variables
### _nonces

```solidity
mapping(address account => uint256) private _nonces;
```


## Functions
### nonces

*Returns the next unused nonce for an address.*


```solidity
function nonces(address owner) public view virtual returns (uint256);
```

### _useNonce

*Consumes a nonce.
Returns the current value and increments nonce.*


```solidity
function _useNonce(address owner) internal virtual returns (uint256);
```

### _useCheckedNonce

*Same as [_useNonce](/lib/openzeppelin-contracts/contracts/utils/Nonces.sol/abstract.Nonces.md#_usenonce) but checking that `nonce` is the next valid for `owner`.*


```solidity
function _useCheckedNonce(address owner, uint256 nonce) internal virtual;
```

## Errors
### InvalidAccountNonce
*The nonce used for an `account` is not the expected current nonce.*


```solidity
error InvalidAccountNonce(address account, uint256 currentNonce);
```

