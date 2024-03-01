# ERC20Permit
**Inherits:**
[ERC20](/lib/solady/ext/wake/weird/Bytes32Metadata.sol/contract.ERC20.md), [IERC20Permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol/interface.IERC20Permit.md), [EIP712](/lib/solady/src/utils/EIP712.sol/abstract.EIP712.md), [Nonces](/lib/openzeppelin-contracts/contracts/utils/Nonces.sol/abstract.Nonces.md)

*Implementation of the ERC-20 Permit extension allowing approvals to be made via signatures, as defined in
https://eips.ethereum.org/EIPS/eip-2612[ERC-2612].
Adds the [permit](/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol/abstract.ERC20Permit.md#permit) method, which can be used to change an account's ERC-20 allowance (see {IERC20-allowance}) by
presenting a message signed by the account. By not relying on `{IERC20-approve}`, the token holder account doesn't
need to send a transaction, and thus is not required to hold Ether at all.*


## State Variables
### PERMIT_TYPEHASH

```solidity
bytes32 private constant PERMIT_TYPEHASH =
    keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
```


## Functions
### constructor

*Initializes the {EIP712} domain separator using the `name` parameter, and setting `version` to `"1"`.
It's a good idea to use the same `name` that is defined as the ERC-20 token name.*


```solidity
constructor(string memory name) EIP712(name, "1");
```

### permit

*Sets `value` as the allowance of `spender` over ``owner``'s tokens,
given ``owner``'s signed approval.
IMPORTANT: The same issues {IERC20-approve} has related to transaction
ordering also apply here.
Emits an {Approval} event.
Requirements:
- `spender` cannot be the zero address.
- `deadline` must be a timestamp in the future.
- `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
over the EIP712-formatted function arguments.
- the signature must use ``owner``'s current nonce (see {nonces}).
For more information on the signature format, see the
https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
section].
CAUTION: See Security Considerations above.*


```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
    public
    virtual;
```

### nonces

*Returns the current nonce for `owner`. This value must be
included whenever a signature is generated for {permit}.
Every successful call to {permit} increases ``owner``'s nonce by one. This
prevents a signature from being used multiple times.*


```solidity
function nonces(address owner) public view virtual override(IERC20Permit, Nonces) returns (uint256);
```

### DOMAIN_SEPARATOR

*Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.*


```solidity
function DOMAIN_SEPARATOR() external view virtual returns (bytes32);
```

## Errors
### ERC2612ExpiredSignature
*Permit deadline has expired.*


```solidity
error ERC2612ExpiredSignature(uint256 deadline);
```

### ERC2612InvalidSigner
*Mismatched signature.*


```solidity
error ERC2612InvalidSigner(address signer, address owner);
```

